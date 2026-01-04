import React, { useContext, useMemo, useState, useEffect, useRef } from 'react';
import { associatesContext } from '../../utils/context/contexts';
import { useAuth } from '../../utils/context/AuthContext';
import Page from '../../components/Page';
import {
    Container,
    Typography,
    Card,
    Box,
    Avatar,
    IconButton,
    Fab,
    Stack,
    Tooltip
} from '@mui/material';
import { stringAvatar } from '../../utils/avatarUtils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { styled, useTheme, alpha } from '@mui/material/styles';

const TreeNode = styled('li')(({ theme }) => ({
    float: 'left',
    textAlign: 'center',
    listStyleType: 'none',
    position: 'relative',
    padding: '20px 5px 0 5px',
    transition: 'all 0.5s',
    WebkitTransition: 'all 0.5s',
    MozTransition: 'all 0.5s',

    // Connectors
    '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: '50%',
        borderTop: `1px solid ${theme.palette.divider}`,
        width: '50%',
        height: '20px',
    },
    '&::after': {
        right: 'auto',
        left: '50%',
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    '&:only-child::after, &:only-child::before': {
        display: 'none',
    },
    '&:only-child': {
        paddingTop: 0,
    },
    '&:first-of-type::before, &:last-of-type::after': {
        border: '0 none',
    },
    '&:last-of-type::before': {
        borderRight: `1px solid ${theme.palette.divider}`,
        borderRadius: '0 5px 0 0',
    },
    '&:first-of-type::after': {
        borderRadius: '5px 0 0 0',
    },
}));

const TreeUl = styled('ul')(({ theme }) => ({
    paddingTop: '20px',
    position: 'relative',
    transition: 'all 0.5s',
    WebkitTransition: 'all 0.5s',
    MozTransition: 'all 0.5s',
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 0,

    // Line down from parent to children
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        borderLeft: `1px solid ${theme.palette.divider}`,
        width: 0,
        height: '20px',
    }
}));

const NodeCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    borderRadius: '8px',
    minWidth: '150px',
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
    position: 'relative',
    transition: 'all 0.3s',
    cursor: 'default',
    '&:hover': {
        boxShadow: theme.shadows[4],
        borderColor: theme.palette.primary.main,
    }
}));

const OrgNode = ({ node, childrenMap, currentUser }) => {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const children = childrenMap[node.id] || [];
    const hasChildren = children.length > 0;
    const isCurrentUser = currentUser && node.id === currentUser.id;

    return (
        <TreeNode>
            <NodeCard
                id={`node-${node.id}`}
                elevation={isCurrentUser ? 12 : 1}
                sx={{
                    ...(isCurrentUser && {
                        border: `2px solid ${theme.palette.primary.main}`,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        transform: 'scale(1.05)',
                        zIndex: 20
                    })
                }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <Avatar
                    src={node.profilePicture}
                    alt={`${node.FirstName} ${node.LastName}`}
                    {...(node.profilePicture ? {} : stringAvatar(`${node.FirstName} ${node.LastName}`))}
                    sx={{
                        width: 48,
                        height: 48,
                        mb: 1,
                        border: isCurrentUser ? `2px solid ${theme.palette.primary.dark}` : 'none',
                        ...(node.profilePicture ? {} : stringAvatar(`${node.FirstName} ${node.LastName}`).sx)
                    }}
                />
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: isCurrentUser ? 'bold' : 'normal' }}>
                    {node.FirstName} {node.LastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ mb: hasChildren ? 0.5 : 1 }}>
                    {node.Title}
                </Typography>

                {hasChildren && (
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}
                        sx={{ p: 0.5 }}
                    >
                        {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                    </IconButton>
                )}
            </NodeCard>

            {hasChildren && open && (
                <TreeUl>
                    {children.map(child => (
                        <OrgNode key={child.id} node={child} childrenMap={childrenMap} currentUser={currentUser} />
                    ))}
                </TreeUl>
            )}
        </TreeNode>
    );
};

const Hierarchy = () => {
    const { associates } = useContext(associatesContext);
    const { currentUser } = useAuth();
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const { roots, childrenMap } = useMemo(() => {
        const childrenMap = {};
        const roots = [];
        const allIds = new Set(associates.map(a => a.id));

        associates.forEach(associate => {
            const managerId = associate.manager_id;
            if (!managerId || (managerId === 0) || !allIds.has(managerId)) {
                roots.push(associate);
            } else {
                if (!childrenMap[managerId]) {
                    childrenMap[managerId] = [];
                }
                childrenMap[managerId].push(associate);
            }
        });

        return { roots, childrenMap };
    }, [associates]);

    // Pan Handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setLastPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastPosition.x;
        const deltaY = e.clientY - lastPosition.y;
        setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
        setLastPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Zoom Handlers
    const handleWheel = (e) => {
        if (e.ctrlKey || true) { // Always Zoom on wheel inside container
            e.preventDefault();
            const scaleAmount = -e.deltaY * 0.001;
            setZoom(prev => Math.min(Math.max(0.3, prev + scaleAmount), 3));
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);


    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.3));
    const handleResetZoom = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleFindMe = () => {
        if (currentUser) {
            handleResetZoom();
        }
    };

    return (
        <Page title="WorkOps - Hierarchy">
            <Container maxWidth={false} sx={{ pb: 5, height: '85vh', overflow: 'hidden', position: 'relative' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h4">
                        Company Hierarchy
                    </Typography>
                </Stack>

                {/* Controls */}
                <Stack
                    direction="column"
                    spacing={1}
                    sx={{
                        position: 'absolute',
                        right: 32,
                        top: 80,
                        zIndex: 1000,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 2,
                        p: 1,
                        boxShadow: 3
                    }}
                >
                    <Tooltip title="Find Me (Reset View)">
                        <Fab size="small" color="secondary" onClick={handleFindMe}><MyLocationIcon /></Fab>
                    </Tooltip>
                    <Tooltip title="Reset Zoom & Pan">
                        <Fab size="small" color="inherit" onClick={handleResetZoom}><RestartAltIcon /></Fab>
                    </Tooltip>
                    <Tooltip title="Zoom In">
                        <Fab size="small" color="primary" onClick={handleZoomIn}><ZoomInIcon /></Fab>
                    </Tooltip>
                    <Tooltip title="Zoom Out">
                        <Fab size="small" color="inherit" onClick={handleZoomOut}><ZoomOutIcon /></Fab>
                    </Tooltip>
                </Stack>

                <Box
                    ref={containerRef}
                    sx={{
                        mt: 2,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        border: '1px solid #eee',
                        borderRadius: 1,
                        bgcolor: '#fafafa',
                        position: 'relative',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        touchAction: 'none'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    <Box sx={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: 'center top',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 5,
                        pb: 20
                    }}>
                        <div className="tree" style={{ width: 'max-content' }}>
                            <ul style={{ padding: 0, display: 'inline-flex' }}>
                                {roots.length > 0 ? (
                                    roots.map(root => (
                                        <OrgNode key={root.id} node={root} childrenMap={childrenMap} currentUser={currentUser} />
                                    ))
                                ) : (
                                    <Typography variant="h6" color="text.secondary">Loading hierarchy...</Typography>
                                )}
                            </ul>
                        </div>
                    </Box>
                </Box>
            </Container>
        </Page>
    );
};

export default Hierarchy;
