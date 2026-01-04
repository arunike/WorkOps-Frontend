import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress, Box } from '@mui/material';

const TasksData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8081/tasks');
                if (response.ok) {
                    const result = await response.json();
                    const rows = result.map(item => ({ ...item, id: item.id || item.ID }));
                    setData(rows);
                }
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'requester_id', headerName: 'Requester ID', width: 120 },
        { field: 'task_name', headerName: 'Task Name', width: 200 },
        { field: 'task_value', headerName: 'Value', width: 150 },
        { field: 'reason', headerName: 'Reason', width: 250 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'target_value', headerName: 'Target', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => {
                const id = params.row.id;
                return (
                    <Box>
                        <span
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this task?')) {
                                    try {
                                        await fetch(`http://localhost:8081/tasks/${id}`, { method: 'DELETE' });
                                        setData(data.filter(item => item.id !== id));
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }
                            }}
                        >
                            Delete
                        </span>
                    </Box>
                );
            }
        }
    ];

    if (loading) return <LinearProgress />;

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                components={{ Toolbar: GridToolbar }}
                disableSelectionOnClick
            />
        </Box>
    );
};

export default TasksData;
