import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    Chip,
    Alert
} from '@mui/material';
import format from 'date-fns/format';
import { useAuth } from '../../utils/context/AuthContext';
import { api } from '../../utils/api';

const TimeOffApprovals = () => {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchPendingRequests = async () => {
        try {
            if (!currentUser || !currentUser.id) return;

            const isSuperAdmin = ['CEO', 'Head of People'].includes(currentUser.Title);
            const endpoint = isSuperAdmin
                ? '/time-off'
                : `/time-off?approver_id=${currentUser.id}`;

            const data = await api(endpoint);
            const pending = (data || []).filter(req => req.status === 'Pending');
            setRequests(pending);
        } catch (error) {
            console.error("Failed to fetch pending time off requests", error);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, [currentUser]);

    const handleAction = async (id, status) => {
        try {
            await api(`/time-off/${id}/status`, {
                method: 'PUT',
                body: { status },
            });

            setMessage({ type: 'success', text: `Request ${status} successfully` });
            fetchPendingRequests();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        }
    };

    const parseLocal = (dateStr) => {
        if (!dateStr) return new Date();
        const datePart = dateStr.split('T')[0];
        const [y, m, d] = datePart.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }}>
                Time Off Approvals
            </Typography>

            <Card>
                <CardHeader title="Pending Requests" subheader={`${requests.length} pending requests`} />
                <Box sx={{ p: 3 }}>
                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 2 }}>
                            {message.text}
                        </Alert>
                    )}

                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Employee</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.length > 0 ? (
                                    requests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>{req.employee_name || req.associate_id}</TableCell>
                                            <TableCell>{format(parseLocal(req.start_date), 'MM/dd/yyyy')}</TableCell>
                                            <TableCell>{format(parseLocal(req.end_date), 'MM/dd/yyyy')}</TableCell>
                                            <TableCell>{req.reason}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                    onClick={() => handleAction(req.id, 'Approved')}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleAction(req.id, 'Rejected')}
                                                >
                                                    Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No pending requests</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Card>
        </Container>
    );
};

export default TimeOffApprovals;
