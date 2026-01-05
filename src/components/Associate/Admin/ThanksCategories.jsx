import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getApiDomain } from '../../../utils/getApiDomain';

const ThanksCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${getApiDomain()}/thanks-categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data || []);
            }
        } catch (error) {
            console.error('Failed to fetch thanks categories', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async () => {
        if (!newCategory.trim()) return;

        try {
            const response = await fetch(`${getApiDomain()}/thanks-categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategory }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Category added successfully' });
                setNewCategory('');
                fetchCategories();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to add category' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`${getApiDomain()}/thanks-categories/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Category deleted successfully' });
                fetchCategories();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to delete category' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        }
    };

    return (
        <Box>
            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="New Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    size="small"
                    fullWidth
                />
                <Button variant="contained" onClick={handleAdd}>
                    Add
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No categories found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ThanksCategories;
