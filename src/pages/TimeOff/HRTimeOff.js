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

const federalHolidays = [
    {
        title: "New Year's Day",
        allDay: true,
        start: new Date(2025, 0, 1),
        end: new Date(2025, 0, 1),
        type: "holiday"
    },
    {
        title: "Independence Day",
        allDay: true,
        start: new Date(2025, 6, 4),
        end: new Date(2025, 6, 4),
        type: "holiday"
    },
    {
        title: "Christmas Day",
        allDay: true,
        start: new Date(2025, 11, 25),
        end: new Date(2025, 11, 25),
        type: "holiday"
    },
];

const HRTimeOff = () => {
    const { userData } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [requests, setRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({ start: "", end: "", reason: "" });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:8081/time-off");
            if (response.ok) {
                const data = await response.json();
                const formatted = data.map(req => ({
                    ...req,
                    title: `${req.employee_name} - ${req.reason}`,
                    employee: req.employee_name,
                    start: new Date(req.start_date),
                    end: new Date(req.end_date),
                    type: "request"
                }));
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
                status: "Approved" // CEO/HR requests are auto-approved
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
                setTabValue(0); // Switch to calendar view
            }
        } catch (error) {
            console.error("Failed to submit request", error);
        }
    };

    const events = [...federalHolidays, ...requests.filter(r => r.status === "Approved")];

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
            <Typography variant="h4" sx={{ mb: 5 }}>
                Time Off Management
            </Typography>

            <Card sx={{ mb: 5 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, bgcolor: 'background.neutral' }}>
                    <Tab label="Calendar View" />
                    <Tab label="Requests List" />
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
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Employee</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>{req.employee}</TableCell>
                                            <TableCell>{format(req.start, 'PP')}</TableCell>
                                            <TableCell>{format(req.end, 'PP')}</TableCell>
                                            <TableCell
                                                sx={{
                                                    color: req.status === 'Approved' ? 'green' : req.status === 'Rejected' ? 'red' : 'orange',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {req.status}
                                            </TableCell>
                                            <TableCell>
                                                {req.status === 'Pending' && (
                                                    <>
                                                        <IconButton color="success" onClick={() => handleApprove(req.id)}>
                                                            <CheckIcon />
                                                        </IconButton>
                                                        <IconButton color="error" onClick={() => handleReject(req.id)}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {tabValue === 2 && (
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
