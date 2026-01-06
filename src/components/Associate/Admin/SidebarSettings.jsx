import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Card, Typography, Button, Container, Stack } from '@mui/material';
import Page from '../../../components/Page';
import { api } from '../../../utils/api';
// Using sidebarConfig just to get the initial full list of possible items
import sidebarConfig from '../../../layouts/dashboard/SidebarConfig';

function SortableItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '16px',
        marginBottom: '8px',
        backgroundColor: '#fff',
        border: '1px solid #eee',
        borderRadius: '4px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Box component="span" sx={{ mr: 2, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                ☰
            </Box>
            <Typography variant="subtitle1">{props.id}</Typography>
        </div>
    );
}

export default function SidebarSettings() {
    // We work with titles as IDs
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const savedOrder = await api('/admin/sidebar-order');

                const allTitles = sidebarConfig.map(item => item.title);

                if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
                    // Merge saved order with any new items in config that might be missing
                    const merged = [...savedOrder];
                    allTitles.forEach(t => {
                        if (!merged.includes(t)) merged.push(t);
                    });
                    // Remove items that no longer exist in config
                    const final = merged.filter(t => allTitles.includes(t));
                    setItems(final);
                } else {
                    setItems(allTitles);
                }
            } catch (error) {
                console.error("Failed to fetch sidebar order", error);
                setItems(sidebarConfig.map(item => item.title));
            }
        };
        fetchOrder();
    }, []);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api('/admin/sidebar-order', {
                method: 'PUT',
                body: items
            });
            alert('Sidebar order saved! Refresh the page to see changes.');
        } catch (error) {
            console.error(error);
            alert('Failed to save order');
        }
        setLoading(false);
    };

    return (
        <Page title="Sidebar Settings">
            <Container maxWidth="md">
                <Stack direction="row" alignItems="center" justify="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Sidebar Order Settings
                    </Typography>
                </Stack>

                <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Drag and drop items to reorder the sidebar navigation.
                    </Typography>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map((id) => (
                                <SortableItem key={id} id={id} />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Order'}
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}
