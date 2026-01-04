import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress, Box } from '@mui/material';
import moment from 'moment';

const ThanksData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8081/thanks');
                if (response.ok) {
                    const result = await response.json();
                    const rows = result.map(item => ({ ...item, id: item.id || item.ID }));
                    setData(rows);
                }
            } catch (error) {
                console.error("Failed to fetch thanks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'from_id', headerName: 'From ID', width: 100 },
        { field: 'to_id', headerName: 'To ID', width: 100 },
        { field: 'message', headerName: 'Message', width: 300 },
        { field: 'category', headerName: 'Category', width: 150 },
        {
            field: 'timestamp',
            headerName: 'Date',
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
                        <span
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this message?')) {
                                    try {
                                        await fetch(`http://localhost:8081/thanks/${id}`, { method: 'DELETE' });
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

export default ThanksData;
