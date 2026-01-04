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
    Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
    const [openDialog, setOpenDialog] = useState(false);
    const [newPermission, setNewPermission] = useState({
        menu_item: "", // Reuse menu_item field for widget name
        permission_type: "",
        permission_value: ""
    });

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const response = await fetch("http://localhost:8081/menu-permissions");
            if (response.ok) {
                const data = await response.json();
                // Filter only for dashboard widgets
                const dashboardPerms = data.filter(p => DASHBOARD_WIDGETS.includes(p.menu_item));
                setPermissions(dashboardPerms);
            }
        } catch (error) {
            console.error("Failed to fetch permissions", error);
        }
    };

    const handleAddPermission = async () => {
        try {
            const payload = {
                menu_item: newPermission.menu_item,
                permission_type: newPermission.permission_type,
                permission_value: newPermission.permission_type === "everyone" ? null : newPermission.permission_value
            };

            const response = await fetch("http://localhost:8081/menu-permissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                fetchPermissions();
                setOpenDialog(false);
                setNewPermission({ menu_item: "", permission_type: "", permission_value: "" });
            }
        } catch (error) {
            console.error("Failed to create permission", error);
        }
    };

    const handleDeletePermission = async (id) => {
        try {
            const response = await fetch(`http://localhost:8081/menu-permissions/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchPermissions();
            }
        } catch (error) {
            console.error("Failed to delete permission", error);
        }
    };

    // Group permissions by widget
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
                title="Dashboard Permissions"
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Add Rule
                    </Button>
                }
            />
            <CardContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Widget</strong></TableCell>
                                <TableCell><strong>Visible To</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(groupedPermissions).map(([widget, perms]) => (
                                <TableRow key={widget}>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                                            {widget}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                            {perms.map((perm) => (
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
                                            ))}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {Object.keys(groupedPermissions).length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        No specific rules set. All widgets are visible to everyone by default.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
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
