import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Chip,
    Button
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { getApiDomain } from "../../../utils/getApiDomain";

const TimeOffConfig = () => {
    const [titles, setTitles] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [exemptUsers, setExemptUsers] = useState([]);
    const [associates, setAssociates] = useState([]);

    useEffect(() => {
        fetchSetting();
        fetchAssociates();
    }, []);

    const fetchAssociates = async () => {
        try {
            const response = await fetch(`${getApiDomain()}/associates`);
            if (response.ok) {
                const data = await response.json();
                setAssociates(data);
            }
        } catch (error) {
            console.error("Failed to fetch associates", error);
        }
    };

    const [newTitle, setNewTitle] = useState("");

    const handleAddTitle = () => {
        if (newTitle.trim()) {
            const currentTitles = titles ? titles.split(',').map(t => t.trim()).filter(Boolean) : [];
            if (!currentTitles.includes(newTitle.trim())) {
                const updated = [...currentTitles, newTitle.trim()].join(',');
                setTitles(updated);
            }
            setNewTitle("");
        }
    };

    const handleDeleteTitle = (titleToDelete) => {
        const currentTitles = titles.split(',').map(t => t.trim()).filter(Boolean);
        const updated = currentTitles.filter(t => t !== titleToDelete).join(',');
        setTitles(updated);
    };

    const fetchSetting = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${getApiDomain()}/settings/time_off_exempt_titles`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.value) {
                    setTitles(data.value);
                }
            }
        } catch (err) {
            console.error("Failed to fetch time off exempt titles", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${getApiDomain()}/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: "time_off_exempt_titles",
                    value: titles,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update setting");
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    // Calculate exempt users
    useEffect(() => {
        if (associates.length > 0) {
            const exemptTitleList = titles.split(',').map(t => t.trim().toLowerCase());
            exemptTitleList.push('ceo');

            const filtered = associates.filter(assoc =>
                assoc.Title && exemptTitleList.includes(assoc.Title.toLowerCase())
            );
            setExemptUsers(filtered);
        }
    }, [associates, titles]);


    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Time Off Exemption Configuration
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Specify job titles that are exempt from Time Off approval (CEO and Head of People are always exempt). Separate multiple titles with commas.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Settings saved successfully!
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            label="Add Exempt Job Title"
                            variant="outlined"
                            size="small"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleAddTitle} disabled={!newTitle.trim()}>
                            Add
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {titles.split(',').map((title, index) => {
                            const trimmed = title.trim();
                            if (!trimmed) return null;
                            return (
                                <Chip
                                    key={index}
                                    label={trimmed}
                                    onDelete={() => handleDeleteTitle(trimmed)}
                                />
                            );
                        })}
                    </Box>

                    <LoadingButton
                        loading={updating}
                        variant="contained"
                        onClick={handleUpdate}
                        sx={{ mb: 3 }}
                    >
                        Save Configuration
                    </LoadingButton>

                    <Typography variant="subtitle2" gutterBottom>
                        Currently Exempt Users ({exemptUsers.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {exemptUsers.map(user => (
                            <Box key={user.id} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    {user.FirstName} {user.LastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user.Title}
                                </Typography>
                            </Box>
                        ))}
                        {exemptUsers.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                No users found matching these titles.
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TimeOffConfig;
