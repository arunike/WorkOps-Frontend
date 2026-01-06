import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    Card,
    CardHeader,
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    Alert,
    Container,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { useAuth } from '../../utils/context/AuthContext';
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

const TimeEntry = () => {
    const { currentUser } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);

    const fetchEntries = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(`${getApiDomain()}/time-entry?associate_id=${currentUser.id}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEntries(data || []);

                const events = data.map(entry => {
                    const datePart = entry.date.split('T')[0];
                    const [y, m, d] = datePart.split('-').map(Number);
                    const localDate = new Date(y, m - 1, d);

                    const endDate = new Date(localDate);
                    endDate.setDate(endDate.getDate() + 1);

                    return {
                        title: `${entry.hours}h`,
                        start: localDate,
                        end: endDate,
                        allDay: true,
                        resource: entry
                    };
                });
                setCalendarEvents(events);
            }
        } catch (error) {
            console.error("Failed to fetch time entries", error);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${getApiDomain()}/time-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    associate_id: currentUser.id,
                    date: new Date(date),
                    hours: parseFloat(hours),
                    comments: comments
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Time entry submitted successfully!' });
                setHours('');
                setComments('');
                fetchEntries();
            } else {
                setMessage({ type: 'error', text: 'Failed to submit time entry.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const eventStyleGetter = (event) => {
        const hours = event.resource.hours;
        let backgroundColor = "#3174ad";
        if (hours > 8) backgroundColor = "#ff9800";
        if (hours > 10) backgroundColor = "#e91e63";

        return {
            style: {
                backgroundColor,
                borderRadius: "2px",
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
                Time Entry
            </Typography>

            <Card>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, bgcolor: 'background.neutral' }}>
                    <Tab label="Calendar View" />
                    <Tab label="Log Time & History" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <div style={{ height: 600 }}>
                            <Calendar
                                localizer={localizer}
                                events={calendarEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                eventPropGetter={eventStyleGetter}
                                views={['month', 'week', 'day']}
                            />
                        </div>
                    )}

                    {tabValue === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Card variant="outlined">
                                    <CardHeader title="Log Hours" />
                                    <Box sx={{ p: 2 }}>
                                        {message.text && (
                                            <Alert severity={message.type} sx={{ mb: 2 }}>
                                                {message.text}
                                            </Alert>
                                        )}
                                        <form onSubmit={handleSubmit}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        type="date"
                                                        label="Date"
                                                        InputLabelProps={{ shrink: true }}
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        label="Hours Worked"
                                                        value={hours}
                                                        onChange={(e) => setHours(e.target.value)}
                                                        required
                                                        inputProps={{ min: 0, step: 0.1 }}
                                                        helperText="Standard workday is 8 hours."
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        label="Comments"
                                                        value={comments}
                                                        onChange={(e) => setComments(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        fullWidth
                                                        size="large"
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={loading}
                                                    >
                                                        Submit Entry
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Box>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" gutterBottom>Recent Entries</Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Hours</TableCell>
                                                <TableCell>Overtime</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Comments</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {entries && entries.length > 0 ? entries.map((entry) => (
                                                <TableRow key={entry.id}>
                                                    <TableCell>
                                                        {(() => {
                                                            const datePart = entry.date.split('T')[0];
                                                            const [y, m, d] = datePart.split('-').map(Number);
                                                            return new Date(y, m - 1, d).toLocaleDateString();
                                                        })()}
                                                    </TableCell>
                                                    <TableCell>{entry.hours}</TableCell>
                                                    <TableCell sx={{ color: entry.overtime_hours > 0 ? 'warning.main' : 'text.primary', fontWeight: entry.overtime_hours > 0 ? 'bold' : 'normal' }}>
                                                        {entry.overtime_hours > 0 ? `+${entry.overtime_hours}` : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: entry.status === 'Approved' ? 'success.main' :
                                                                    entry.status === 'Rejected' ? 'error.main' : 'warning.main',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {entry.status || 'Approved'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{entry.comments || '-'}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">No entries found</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Card>
        </Container>
    );
};

export default TimeEntry;
