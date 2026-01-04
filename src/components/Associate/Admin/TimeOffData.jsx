import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress, Box } from '@mui/material';
import moment from 'moment';
import { sentenceCase } from 'change-case';
import Label from "../../Label";

const TimeOffData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8081/time-off');
                if (response.ok) {
                    const result = await response.json();
                    const rows = result.map(item => ({ ...item, id: item.id || item.ID }));
                    setData(rows);
                }
            } catch (error) {
                console.error("Failed to fetch time off:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'associate_id', headerName: 'Associate ID', width: 120 },
        {
            field: 'start_date',
            headerName: 'Start Date',
            width: 150,
            valueFormatter: (params) => params.value ? moment(params.value).format('DD-MM-YYYY') : '',
        },
        {
            field: 'end_date',
            headerName: 'End Date',
            width: 150,
            valueFormatter: (params) => params.value ? moment(params.value).format('DD-MM-YYYY') : '',
        },
        { field: 'reason', headerName: 'Reason', width: 300 },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => (
                <Label
                    variant="ghost"
                    color={(params.value === 'rejected' && 'error') || (params.value === 'approved' && 'success') || 'warning'}
                >
                    {sentenceCase(params.value || 'pending')}
                </Label>
            )
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 180,
            valueFormatter: (params) => params.value ? moment(params.value).format('DD-MM-YYYY HH:mm') : '',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => {
                const id = params.row.id;
                return (
                    <Box>
                        {/* Placeholder for Edit */}
                        <span
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this request?')) {
                                    try {
                                        await fetch(`http://localhost:8081/time-off/${id}`, { method: 'DELETE' });
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

export default TimeOffData;
