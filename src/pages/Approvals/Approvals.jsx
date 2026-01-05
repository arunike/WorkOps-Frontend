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
import { useAuth } from '../../utils/context/AuthContext';
import { getApiDomain } from '../../utils/getApiDomain';

const Approvals = () => {
    const { currentUser, isAdmin } = useAuth();
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchPendingRequests = async () => {
        try {
            const response = await fetch(`${getApiDomain()}/time-entry?status=Pending`);
            if (response.ok) {
                const data = await response.json();
                setRequests(data || []);
            }
        } catch (error) {
            console.error("Failed to fetch pending requests", error);
        }
    };

    const allowedTitles = ['CEO', 'Head of Product', 'Head of People'];
    const isAllowed = isAdmin || allowedTitles.includes(currentUser?.title);

    useEffect(() => {
        if (isAllowed) {
            fetchPendingRequests();
        }
    }, [currentUser, isAdmin]);

    const handleAction = async (id, status) => {
        try {
            const response = await fetch(`${getApiDomain()}/time-entry/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: `Request ${status} successfully` });
                fetchPendingRequests();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to update request' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        }
    };

    if (!isAllowed) {
        return (
            <Container>
                <Alert severity="warning">You do not have permission to view this page.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }}>
                Overtime Approvals
            </Typography>

            <Card>
                <CardHeader title="Pending Requests" subheader={`${requests ? requests.length : 0} pending requests`} />
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
                                    <TableCell>Employee ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Total Hours</TableCell>
                                    <TableCell>Overtime</TableCell>
                                    <TableCell>Comments</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests && requests.length > 0 ? requests.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.associate_id}</TableCell>
                                        <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{req.hours}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'warning.main' }}>+{req.overtime_hours}</TableCell>
                                        <TableCell>{req.comments}</TableCell>
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
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">No pending requests</TableCell>
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

export default Approvals;
