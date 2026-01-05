import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import {
    Card,
    Container,
    Typography,
    Tab,
    Tabs,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    Grid
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from "../../utils/context/AuthContext";
import PTOBalance from "../../components/TimeOff/PTOBalance";
import { getApiDomain } from '../../utils/getApiDomain';

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const HRTimeOff = () => {
    const { userData, isAdmin } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [requests, setRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({ associate_id: "", start: "", end: "", reason: "" });
    const [holidays, setHolidays] = useState([]);

    useEffect(() => {
        fetchRequests();
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            const domain = getApiDomain();
            const response = await fetch(`${domain}/holidays`);
            if (response.ok) {
                const data = await response.json();
                const formattedHolidays = data.map(holiday => ({
                    title: holiday.name,
                    allDay: true,
                    start: new Date(holiday.date),
                    end: new Date(holiday.date),
                    type: "holiday"
                }));
                setHolidays(formattedHolidays);
            }
        } catch (error) {
            console.error("Failed to fetch holidays", error);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:8081/time-off");
            if (response.ok) {
                const data = await response.json();
                const formatted = data.map(req => {
                    const parseLocal = (iso) => {
                        const datePart = iso.split('T')[0];
                        const [y, m, d] = datePart.split('-').map(Number);
                        return new Date(y, m - 1, d);
                    };
                    const start = parseLocal(req.start_date);
                    const end = parseLocal(req.end_date);
                    // Add 1 day to end date for RBC exclusive rule
                    const calendarEnd = new Date(end);
                    calendarEnd.setDate(calendarEnd.getDate() + 1);

                    return {
                        ...req,
                        title: `${req.employee_name} - ${req.reason}`,
                        employee: req.employee_name,
                        start: start,
                        end: calendarEnd,
                        originalEnd: end,
                        type: "request"
                    };
                });
                setRequests(formatted);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:8081/time-off/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                fetchRequests();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    }

    const handleApprove = (id) => {
        updateStatus(id, "Approved");
    };

    const handleReject = (id) => {
        updateStatus(id, "Rejected");
    };

    const handleRequestSubmit = async () => {
        if (!newRequest.start || !newRequest.end || !userData) return;

        try {
            const payload = {
                associate_id: userData.id,
                start_date: new Date(newRequest.start).toISOString(),
                end_date: new Date(newRequest.end).toISOString(),
                reason: newRequest.reason,
                status: "Approved"
            };

            const response = await fetch("http://localhost:8081/time-off", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setNewRequest({ start: "", end: "", reason: "" });
                fetchRequests();
                setTabValue(0);
            }
        } catch (error) {
            console.error("Failed to submit request", error);
        }
    };

    const events = [...holidays, ...requests.filter(r => r.status === "Approved")];

    const eventStyleGetter = (event) => {
        let backgroundColor = "#3174ad";
        if (event.type === "holiday") backgroundColor = "#e91e63";
        if (event.type === "request") backgroundColor = "#4caf50";

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
                Team Time Off
            </Typography>

            <PTOBalance associateId={userData?.id} />

            <Card sx={{ mb: 5 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, bgcolor: 'background.neutral' }}>
                    <Tab label="Calendar View" />
                    <Tab label="Request Time Off" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <div style={{ height: 500 }}>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                eventPropGetter={eventStyleGetter}
                            />
                        </div>
                    )}

                    {tabValue === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Request Time Off (Auto-Approved)
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    type="date"
                                    value={newRequest.start}
                                    onChange={(e) => setNewRequest({ ...newRequest, start: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="End Date"
                                    type="date"
                                    value={newRequest.end}
                                    onChange={(e) => setNewRequest({ ...newRequest, end: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Reason (Optional)"
                                    multiline
                                    rows={3}
                                    value={newRequest.reason}
                                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={handleRequestSubmit}
                                    disabled={!newRequest.start || !newRequest.end}
                                >
                                    Submit Request
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Card>
        </Container>
    );
};

export default HRTimeOff;
