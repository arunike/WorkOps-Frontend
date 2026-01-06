import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Typography,
    Chip,
    Box,
    Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../../../utils/api";

const DASHBOARD_WIDGETS = [
    "total employed",
    "average salary",
    "history graph",
    "office graph",
    "department graph",
    "starter timeline",
    "birthday timeline"
];

const PERMISSION_TYPES = [
    { value: "everyone", label: "Everyone" },
    { value: "department", label: "Department" },
    { value: "title", label: "Title" }
];

const DashboardPermissionsConfig = () => {
    const [permissions, setPermissions] = useState([]);
    const [widgetOrder, setWidgetOrder] = useState(DASHBOARD_WIDGETS);
    const [openDialog, setOpenDialog] = useState(false);
    const [newPermission, setNewPermission] = useState({
        menu_item: "",
        permission_type: "",
        permission_value: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [permData, orderData] = await Promise.all([
                api("/menu-permissions"),
                api("/admin/dashboard-order")
            ]);

            if (permData) {
                const dashboardPerms = permData.filter(p => DASHBOARD_WIDGETS.includes(p.menu_item));
                setPermissions(dashboardPerms);
            }

            if (orderData && Array.isArray(orderData) && orderData.length > 0) {
                const merged = [...orderData];
                DASHBOARD_WIDGETS.forEach(w => {
                    if (!merged.includes(w)) merged.push(w);
                });
                const final = merged.filter(w => DASHBOARD_WIDGETS.includes(w));
                setWidgetOrder(final);
            } else {
                setWidgetOrder(DASHBOARD_WIDGETS);
            }

        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const handleAddPermission = async () => {
        try {
            const payload = {
                menu_item: newPermission.menu_item,
                permission_type: newPermission.permission_type,
                permission_value: newPermission.permission_type === "everyone" ? null : newPermission.permission_value
            };

            await api("/menu-permissions", {
                method: "POST",
                body: payload,
            });

            fetchData();
            setOpenDialog(false);
            setNewPermission({ menu_item: "", permission_type: "", permission_value: "" });
        } catch (error) {
            console.error("Failed to create permission", error);
        }
    };

    const handleDeletePermission = async (id) => {
        try {
            await api(`/menu-permissions/${id}`, { method: "DELETE" });
            fetchData();
        } catch (error) {
            console.error("Failed to delete permission", error);
        }
    };

    const groupedPermissions = permissions.reduce((acc, perm) => {
        if (!acc[perm.menu_item]) {
            acc[perm.menu_item] = [];
        }
        acc[perm.menu_item].push(perm);
        return acc;
    }, {});

    return (
        <Card>
            <CardHeader
                title="Dashboard Configuration"
                subheader="Manage visibility rules for dashboard widgets"
            />
            <CardContent>
                <Grid container spacing={3}>
                    {/* Full Width: Permissions */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Visibility Rules</Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                size="small"
                                onClick={() => setOpenDialog(true)}
                            >
                                Add Rule
                            </Button>
                        </Box>

                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Widget</strong></TableCell>
                                        <TableCell><strong>Visible To</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {widgetOrder.map((widget) => {
                                        const perms = groupedPermissions[widget] || [];
                                        return (
                                            <TableRow key={widget}>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                                                        {widget}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                        {perms.length === 0 ? (
                                                            <Chip label="Everyone" size="small" variant="outlined" />
                                                        ) : (
                                                            perms.map((perm) => (
                                                                <Chip
                                                                    key={perm.id}
                                                                    label={
                                                                        perm.permission_type === "everyone"
                                                                            ? "Everyone"
                                                                            : `${perm.permission_type}: ${perm.permission_value}`
                                                                    }
                                                                    onDelete={() => handleDeletePermission(perm.id)}
                                                                    color={perm.permission_type === "everyone" ? "primary" : "default"}
                                                                    size="small"
                                                                />
                                                            ))
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </CardContent>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Dashboard Visibility Rule</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                        <TextField
                            select
                            label="Widget"
                            value={newPermission.menu_item}
                            onChange={(e) => setNewPermission({ ...newPermission, menu_item: e.target.value })}
                            fullWidth
                        >
                            {DASHBOARD_WIDGETS.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Visible To"
                            value={newPermission.permission_type}
                            onChange={(e) => setNewPermission({ ...newPermission, permission_type: e.target.value, permission_value: "" })}
                            fullWidth
                        >
                            {PERMISSION_TYPES.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {newPermission.permission_type && newPermission.permission_type !== "everyone" && (
                            <TextField
                                label={`${newPermission.permission_type === "department" ? "Department" : "Title"} Name`}
                                value={newPermission.permission_value}
                                onChange={(e) => setNewPermission({ ...newPermission, permission_value: e.target.value })}
                                fullWidth
                                placeholder={newPermission.permission_type === "department" ? "e.g., People, Sales, Tech" : "e.g., CEO, Manager"}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleAddPermission}
                        variant="contained"
                        disabled={!newPermission.menu_item || !newPermission.permission_type || (newPermission.permission_type !== "everyone" && !newPermission.permission_value)}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default DashboardPermissionsConfig;
