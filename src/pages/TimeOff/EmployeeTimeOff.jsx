import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Card,
    Container,
    Typography,
    Tab,
    Tabs,
    Box,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import { useAuth } from "../../utils/context/AuthContext";
import PTOBalance from "../../components/TimeOff/PTOBalance";
import { api } from "../../utils/api";

const localizer = momentLocalizer(moment);

const EmployeeTimeOff = () => {
    const { userData } = useAuth();
    const [myRequests, setMyRequests] = useState([]);
    const [ptoData, setPtoData] = useState(null);
    const [newRequest, setNewRequest] = useState({ start: "", end: "", reason: "" });
    const [tabValue, setTabValue] = useState(0);
    const [holidays, setHolidays] = useState([]);

    // Calculate business days between two dates
    const getBusinessDatesCount = (startDate, endDate) => {
        let count = 0;
        const curDate = new Date(startDate.getTime());
        while (curDate <= endDate) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        return count;
    };

    const fetchPTOBalance = async () => {
        try {
            const data = await api(`/associates/${userData.id}/pto-balance`);
            if (data) {
                setPtoData(data);
            }
        } catch (error) {
            console.error('Failed to fetch PTO balance', error);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchRequests();
            fetchPTOBalance();
            fetchHolidays();
        }
    }, [userData]);

    const fetchHolidays = async () => {
        try {
            const currentYear = new Date().getFullYear();
            const data = await api(`/holidays?year=${currentYear}`);
            const formattedHolidays = (data || []).map(holiday => ({
                title: holiday.name,
                allDay: true,
                start: new Date(holiday.date),
                end: new Date(holiday.date),
                type: "holiday"
            }));
            setHolidays(formattedHolidays);
        } catch (error) {
            console.error('Failed to fetch holidays', error);
        }
    };

    const fetchRequests = async () => {
        try {
            const data = await api(`/time-off?associate_id=${userData.id}`);
            const formatted = (data || []).map(req => {
                const parseLocal = (iso) => {
                    const datePart = iso.split('T')[0];
                    const [y, m, d] = datePart.split('-').map(Number);
                    return new Date(y, m - 1, d);
                };
                const start = parseLocal(req.start_date);
                const end = parseLocal(req.end_date);

                const calendarEnd = new Date(end);
                calendarEnd.setDate(calendarEnd.getDate() + 1);

                return {
                    ...req,
                    title: "PTO: " + req.reason,
                    start: start,
                    end: calendarEnd,
                    originalEnd: end,
                    type: "request"
                };
            });
            setMyRequests(formatted);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSubmitRequest = async () => {
        if (!newRequest.start || !newRequest.end || !userData) return;

        const startDate = new Date(newRequest.start);
        const endDate = new Date(newRequest.end);
        const requestedDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        if (ptoData && requestedDays > ptoData.pto_remaining) {
            const proceed = window.confirm(
                `Warning: You are requesting ${requestedDays} days, but only have ${ptoData.pto_remaining.toFixed(1)} days remaining.\n\n` +
                `This request exceeds your available PTO balance.\n\n` +
                `Do you want to submit anyway? (Requires manager approval)`
            );
            if (!proceed) return;
        }

        const payload = {
            associate_id: userData.id,
            start_date: newRequest.start,
            end_date: newRequest.end,
            reason: newRequest.reason,
        };

        try {
            await api("/time-off", {
                method: "POST",
                body: payload,
            });

            setNewRequest({ start: "", end: "", reason: "" });
            fetchRequests();
            fetchPTOBalance();
            setTabValue(0);
        } catch (error) {
            console.error("Failed to submit request", error);
        }
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = "#3174ad";
        if (event.type === "holiday") backgroundColor = "#e91e63";
        if (event.type === "request") {
            backgroundColor = event.status === "Approved" ? "#4caf50" : "#ff9800";
        }

        return {
            style: {
                backgroundColor,
                borderRadius: "0px",
                opacity: 0.8,
                color: "white",
                border: "0px",
                display: "block"
            }
        };
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 3 }}>
                My Time Off
            </Typography>

            <PTOBalance associateId={userData?.id} />

            <Card>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, bgcolor: 'background.neutral' }}>
                    <Tab label="Calendar & Holidays" />
                    <Tab label="Request Time Off" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <div style={{ height: 500 }}>
                            <Calendar
                                localizer={localizer}
                                events={[...holidays, ...myRequests]}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                eventPropGetter={eventStyleGetter}
                            />
                        </div>
                    )}

                    {tabValue === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>Request Time Off</Typography>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                                value={newRequest.start}
                                onChange={(e) => setNewRequest({ ...newRequest, start: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                                value={newRequest.end}
                                onChange={(e) => setNewRequest({ ...newRequest, end: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Reason"
                                sx={{ mb: 2 }}
                                value={newRequest.reason}
                                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                            />
                            <Button variant="contained" size="large" onClick={handleSubmitRequest}>Submit Request</Button>
                        </Box>
                    )}
                </Box>
            </Card>
        </Container>
    );
};

export default EmployeeTimeOff;
