import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Grid,
    Skeleton
} from '@mui/material';
import { getApiDomain } from '../../utils/getApiDomain';

const PTOBalance = ({ associateId }) => {
    const [ptoData, setPtoData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (associateId) {
            fetchPTOBalance();
        }
    }, [associateId]);

    const fetchPTOBalance = async () => {
        try {
            const response = await fetch(`${getApiDomain()}/associates/${associateId}/pto-balance`);
            if (response.ok) {
                const data = await response.json();
                setPtoData(data);
            }
        } catch (error) {
            console.error('Failed to fetch PTO balance', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Skeleton variant="text" width="40%" height={30} />
                    <Skeleton variant="rectangular" height={20} sx={{ mt: 2 }} />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Skeleton variant="rectangular" width="30%" height={60} />
                        <Skeleton variant="rectangular" width="30%" height={60} />
                        <Skeleton variant="rectangular" width="30%" height={60} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (!ptoData) return null;

    const usagePercentage = ptoData.pto_allocated > 0
        ? (ptoData.pto_used / ptoData.pto_allocated) * 100
        : 0;

    const getProgressColor = () => {
        if (usagePercentage < 50) return 'success';
        if (usagePercentage < 80) return 'warning';
        return 'error';
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        PTO Balance ({new Date().getFullYear()})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {ptoData.pto_used.toFixed(1)} / {ptoData.pto_allocated.toFixed(1)} days used
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={Math.min(usagePercentage, 100)}
                    color={getProgressColor()}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="primary.main">
                                {ptoData.pto_allocated.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Allocated
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main">
                                {ptoData.pto_used.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Used
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main">
                                {ptoData.pto_remaining.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Remaining
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {ptoData.accrual_method === 'accrual' && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                        * PTO accrues throughout the year
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default PTOBalance;
