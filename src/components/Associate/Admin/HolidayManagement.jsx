import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    FormControlLabel,
    IconButton,
    Typography,
    Alert,
    MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { api } from '../../../utils/api';
import { useAuth } from '../../../utils/context/AuthContext';

const HolidayManagement = () => {
    const { userData } = useAuth();
    const [holidays, setHolidays] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [openDialog, setOpenDialog] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        year: new Date().getFullYear(),
        is_recurring: false,
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchHolidays();
    }, [selectedYear]);

    const fetchHolidays = async () => {
        try {
            const data = await api(`/holidays?year=${selectedYear}`);
            setHolidays(data || []);
        } catch (error) {
            console.error('Failed to fetch holidays', error);
        }
    };

    const handleOpenDialog = (holiday = null) => {
        if (holiday) {
            setEditingHoliday(holiday);
            const dateObj = new Date(holiday.date);
            setFormData({
                name: holiday.name,
                date: dateObj.toISOString().split('T')[0],
                year: holiday.year,
                is_recurring: holiday.is_recurring,
            });
        } else {
            setEditingHoliday(null);
            setFormData({
                name: '',
                date: '',
                year: selectedYear,
                is_recurring: false,
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingHoliday(null);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                date: new Date(formData.date).toISOString(),
            };

            const url = editingHoliday
                ? `/holidays/${editingHoliday.id}`
                : `/holidays`;

            await api(url, {
                method: editingHoliday ? 'PUT' : 'POST',
                headers: {
                    'X-User-ID': userData?.id?.toString() || '',
                },
                body: payload,
            });

            setMessage({
                type: 'success',
                text: `Holiday ${editingHoliday ? 'updated' : 'created'} successfully!`,
            });
            fetchHolidays();
            handleCloseDialog();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save holiday' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this holiday?')) return;

        try {
            await api(`/holidays/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-User-ID': userData?.id?.toString() || '',
                },
            });

            setMessage({ type: 'success', text: 'Holiday deleted successfully!' });
            fetchHolidays();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete holiday' });
        }
    };

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

    return (
        <Box>
            {message.text && (
                <Alert severity={message.type} onClose={() => setMessage({ type: '', text: '' })} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    select
                    label="Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    size="small"
                    sx={{ width: 150 }}
                >
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </TextField>

                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                    Add Holiday
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Recurring</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {holidays.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography color="text.secondary">No holidays found for {selectedYear}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            holidays.map((holiday) => (
                                <TableRow key={holiday.id}>
                                    <TableCell>{holiday.name}</TableCell>
                                    <TableCell>{new Date(holiday.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{holiday.is_recurring ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpenDialog(holiday)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(holiday.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingHoliday ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Holiday Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Year"
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            fullWidth
                            required
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.is_recurring}
                                    onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                                />
                            }
                            label="Recurring (repeats every year)"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!formData.name || !formData.date}>
                        {editingHoliday ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HolidayManagement;
