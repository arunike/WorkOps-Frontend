import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Card, LinearProgress, Typography, Box } from '@mui/material';
import moment from 'moment';
import { sentenceCase } from 'change-case';
import Label from "../../Label";

const AssociatesData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8081/associates');
                if (response.ok) {
                    const result = await response.json();
                    const rows = result.map((item) => ({ ...item, id: item.id || item.ID }));
                    setData(rows);
                }
            } catch (error) {
                console.error('Failed to fetch associates:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'FirstName', headerName: 'First Name', width: 130 },
        { field: 'LastName', headerName: 'Last Name', width: 130 },
        { field: 'Email', headerName: 'Email', width: 220 },
        { field: 'Title', headerName: 'Title', width: 180 },
        { field: 'Department', headerName: 'Department', width: 150 },
        { field: 'Office', headerName: 'Office', width: 120 },
        {
            field: 'EmplStatus',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Label
                    variant="ghost"
                    color={params.value === 'Terminated' ? 'error' : 'success'}
                >
                    {sentenceCase(params.value || '')}
                </Label>
            )
        },
        {
            field: 'StartDate',
            headerName: 'Start Date',
            width: 120,
            valueFormatter: (params) => params.value ? moment(params.value).format('DD-MM-YYYY') : '',
        },
        {
            field: 'DOB',
            headerName: 'Date of Birth',
            width: 120,
            valueFormatter: (params) => params.value ? moment(params.value).format('DD-MM-YYYY') : '',
        },
        { field: 'Salary', headerName: 'Salary', width: 120 },
        { field: 'Password', headerName: 'Password (Hashed)', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => {
                const id = params.row.id;
                return (
                    <Box>
                        {/* Link to existing Details page */}
                        <a href={`/associates/${id}`} style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                            Edit
                        </a>
                        <span
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this user?')) {
                                    try {
                                        await fetch(`http://localhost:8081/associates/${id}`, { method: 'DELETE' });
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

    const [pageSize, setPageSize] = useState(10);

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <a href="/associates/newassociate" style={{ textDecoration: 'none' }}>
                    <Typography variant="button" sx={{ px: 2, py: 1, border: '1px solid grey', borderRadius: 1 }}>
                        Add New Associate
                    </Typography>
                </a>
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 25, 50]}
                components={{ Toolbar: GridToolbar }}
                disableSelectionOnClick
            />
        </Box>
    );
};

export default AssociatesData;
