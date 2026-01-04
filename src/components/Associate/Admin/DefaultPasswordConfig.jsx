import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const DefaultPasswordConfig = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchSetting();
    }, []);

    const fetchSetting = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8081/settings/default_password");
            if (response.ok) {
                const data = await response.json();
                if (data && data.Value) {
                    setPassword(data.Value);
                } else {
                    setPassword("password");
                }
            } else {
                setPassword("password");
            }
        } catch (err) {
            console.error("Failed to fetch default password setting", err);
            setPassword("password");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch("http://localhost:8081/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: "default_password",
                    value: password,
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

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Onboarding Configuration
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Set the default password for newly created associates. If this value represents a security risk, ensure new users change it immediately.
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

                    <TextField
                        label="Default Password"
                        variant="outlined"
                        fullWidth
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText="This password will be assigned to all new associates upon creation."
                        sx={{ mb: 2 }}
                    />

                    <LoadingButton
                        loading={updating}
                        variant="contained"
                        onClick={handleUpdate}
                    >
                        Save Configuration
                    </LoadingButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DefaultPasswordConfig;
