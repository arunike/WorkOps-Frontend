import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import format from 'date-fns/format';
import { getApiDomain } from '../../../utils/getApiDomain';

const OvertimeRequests = () => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch(`${getApiDomain()}/time-entry`);
                if (response.ok) {
                    const data = await response.json();
                    const overtimeData = (data || []).filter(e => e.overtime_hours > 0);
                    setEntries(overtimeData);
                }
            } catch (error) {
                console.error("Failed to fetch overtime requests", error);
            }
        };

        fetchEntries();
    }, []);

    const getStatusColor = (status) => {
        if (status === 'Approved') return 'success';
        if (status === 'Rejected') return 'error';
        return 'warning';
    };

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Overtime Requests
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total Hours</TableCell>
                            <TableCell>Overtime</TableCell>
                            <TableCell>Comments</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{entry.employee_name || `ID: ${entry.associate_id}`}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            const datePart = entry.date.split('T')[0];
                                            const [y, m, d] = datePart.split('-').map(Number);
                                            return new Date(y, m - 1, d).toLocaleDateString();
                                        })()}
                                    </TableCell>
                                    <TableCell>{entry.hours}</TableCell>
                                    <TableCell sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                                        {entry.overtime_hours}
                                    </TableCell>
                                    <TableCell>{entry.comments || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={entry.status || 'Pending'}
                                            color={getStatusColor(entry.status)}
                                            size="small"
                                            variant="soft"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
                                            onClick={async () => {
                                                if (window.confirm('Are you sure you want to delete this overtime request?')) {
                                                    try {
                                                        const response = await fetch(`${getApiDomain()}/time-entry/${entry.id}`, { method: 'DELETE' });
                                                        if (response.ok) {
                                                            setEntries(entries.filter(item => item.id !== entry.id));
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }
                                            }}
                                        >
                                            Delete
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No overtime requests found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default OvertimeRequests;
