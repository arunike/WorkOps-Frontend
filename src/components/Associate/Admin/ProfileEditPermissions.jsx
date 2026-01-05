import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
    Chip,
    Stack
} from '@mui/material';
import { getApiDomain } from '../../../utils/getApiDomain';

const ProfileEditPermissions = () => {
    const [allowedRoles, setAllowedRoles] = useState('CEO,Head of People');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${getApiDomain()}/settings/profile_edit_roles`);
            if (response.ok) {
                const data = await response.json();
                if (data.value) setAllowedRoles(data.value);
            }
        } catch (error) {
            console.error('Failed to fetch profile edit permissions', error);
        }
    };

    const handleSave = async () => {
        try {
            await fetch(`${getApiDomain()}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: 'profile_edit_roles',
                    value: allowedRoles
                }),
            });

            setMessage({ type: 'success', text: 'Profile edit permissions saved successfully' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        }
    };

    const roles = allowedRoles.split(',').map(r => r.trim()).filter(r => r);

    return (
        <Box>
            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Profile Edit Permissions
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Configure which roles can edit restricted profile fields (Name, Title, Department, Salary, etc.)
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Restricted Fields:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        <Chip label="First Name" size="small" />
                        <Chip label="Last Name" size="small" />
                        <Chip label="Title" size="small" />
                        <Chip label="Department" size="small" />
                        <Chip label="Office" size="small" />
                        <Chip label="Employment Status" size="small" />
                        <Chip label="Work Email" size="small" />
                        <Chip label="Salary" size="small" />
                        <Chip label="Date of Birth" size="small" />
                        <Chip label="Start Date" size="small" />
                    </Stack>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Self-Editable Fields (All Users):
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        <Chip label="Profile Picture" size="small" color="success" />
                        <Chip label="Phone Number" size="small" color="success" />
                        <Chip label="Private Email" size="small" color="success" />
                        <Chip label="Gender" size="small" color="success" />
                    </Stack>
                </Box>

                <TextField
                    label="Allowed Roles (comma-separated)"
                    value={allowedRoles}
                    onChange={(e) => setAllowedRoles(e.target.value)}
                    helperText="Enter job titles that can edit restricted fields, separated by commas"
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Current allowed roles:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                        {roles.map((role, index) => (
                            <Chip
                                key={index}
                                label={role}
                                color="primary"
                                size="small"
                            />
                        ))}
                    </Stack>
                </Box>

                <Button variant="contained" onClick={handleSave}>
                    Save Permissions
                </Button>
            </Paper>
        </Box>
    );
};

export default ProfileEditPermissions;
