import { useRef, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { updateAssociatesContext } from "../../utils/context/contexts";

export default function UserMoreMenu({ id, userName }) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const { setUpdateAssociates } = useContext(updateAssociatesContext);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
            try {
                const response = await fetch(`http://localhost:8081/associates/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setUpdateAssociates(prev => prev + 1);
                } else {
                    console.error("Failed to delete user");
                    alert("Failed to delete user");
                }
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
        setIsOpen(false);
    };

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Icon icon={moreVerticalFill} width={20} height={20} />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: '100%' }
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem component={RouterLink} to={`/associates/${id}`} sx={{ color: 'text.secondary' }}>
                    <ListItemIcon>
                        <Icon icon={editFill} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>

                <MenuItem onClick={handleDelete} sx={{ color: 'text.secondary' }}>
                    <ListItemIcon>
                        <Icon icon={trash2Outline} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>
        </>
    );
}
