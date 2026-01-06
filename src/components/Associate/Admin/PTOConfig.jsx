import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Alert,
    Paper
} from '@mui/material';
import { api } from '../../../utils/api';

const PTOConfig = () => {
    const [ptoDaysPerYear, setPtoDaysPerYear] = useState('15');
    const [accrualMethod, setAccrualMethod] = useState('immediate');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const [daysData, methodData] = await Promise.all([
                api('/settings/pto_days_per_year'),
                api('/settings/pto_accrual_method')
            ]);

            if (daysData && daysData.value) setPtoDaysPerYear(daysData.value);
            if (methodData && methodData.value) setAccrualMethod(methodData.value);
        } catch (error) {
            console.error('Failed to fetch PTO settings', error);
        }
    };

    const handleSave = async () => {
        try {
            const updates = [
                {
                    key: 'pto_days_per_year',
                    value: ptoDaysPerYear
                },
                {
                    key: 'pto_accrual_method',
                    value: accrualMethod
                }
            ];

            for (const update of updates) {
                await api('/settings', {
                    method: 'PUT',
                    body: update,
                });
            }

            setMessage({ type: 'success', text: 'PTO settings saved successfully' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        }
    };

    return (
        <Box>
            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    PTO Configuration
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    <TextField
                        label="PTO Days Per Year"
                        type="number"
                        value={ptoDaysPerYear}
                        onChange={(e) => setPtoDaysPerYear(e.target.value)}
                        helperText="Total PTO days granted per year"
                        fullWidth
                    />

                    <TextField
                        label="Accrual Method"
                        select
                        value={accrualMethod}
                        onChange={(e) => setAccrualMethod(e.target.value)}
                        helperText="How PTO is granted to employees"
                        fullWidth
                    >
                        <MenuItem value="immediate">
                            Immediate (Full PTO on Jan 1 or hire date)
                        </MenuItem>
                        <MenuItem value="accrual">
                            Accrual (Earn PTO throughout the year)
                        </MenuItem>
                    </TextField>

                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Immediate:</strong> Employees receive their full PTO allocation on January 1st or their hire date (whichever is later).
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Accrual:</strong> Employees earn PTO proportionally based on days worked in the current year.
                        </Typography>
                    </Box>

                    <Button variant="contained" onClick={handleSave} sx={{ alignSelf: 'flex-start' }}>
                        Save Settings
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PTOConfig;
