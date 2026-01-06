import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Typography,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import DepartmentGraph from "../../components/Graphs/departmentGraph";
import OfficeGraph from "../../components/Graphs/officeGraph";
import TotalEmployed from "../../components/Graphs/TotalEmployed";
import StarterTimeline from "../../components/Timeline/starterTimeline";
import BirthdayTimeline from "../../components/Timeline/birthdayTimeline";
import TotalEmployedHistory from "../../components/Graphs/TotalEmployedHistory";
import AverageSalary from "../../components/Graphs/AverageSalary";
import Page from "../../components/Page";
import { useAuth } from "../../utils/context/AuthContext";
import { api } from "../../utils/api";

const WIDGET_MAP = {
  "total employed": { component: <TotalEmployed />, gridProps: { xs: 12, sm: 6, md: 3 } },
  "average salary": { component: <AverageSalary />, gridProps: { xs: 12, sm: 6, md: 3 } },
  "history graph": { component: <TotalEmployedHistory />, gridProps: { xs: 12, md: 6 } },
  "office graph": { component: <OfficeGraph />, gridProps: { xs: 12, md: 4 } },
  "department graph": { component: <DepartmentGraph />, gridProps: { xs: 12, md: 4 } },
  "starter timeline": { component: <StarterTimeline />, gridProps: { xs: 12, md: 4 } },
  "birthday timeline": { component: <BirthdayTimeline />, gridProps: { xs: 12 } }
};

// Sortable Grid Item Wrapper
const SortableGridItem = ({ id, component, gridProps, isEditing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: !isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isEditing ? 'grab' : 'default',
    position: 'relative',
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <Grid
      item
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      {...gridProps}
    >
      <Box sx={{
        position: 'relative',
        height: '100%',
        border: isEditing ? '2px dashed #ccc' : 'none',
        borderRadius: 2,
        '&:hover': {
          borderColor: isEditing ? 'primary.main' : 'transparent'
        }
      }}>
        {component}
        {isEditing && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            background: 'transparent'
          }} />
        )}
      </Box>
    </Grid>
  );
};

const Home = () => {
  const { currentUser, isAdmin } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [widgetOrder, setWidgetOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalOrder, setOriginalOrder] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [permData, orderData] = await Promise.all([
        api("/menu-permissions"),
        api("/admin/dashboard-order")
      ]);

      setPermissions(permData || []);

      const allWidgetIds = Object.keys(WIDGET_MAP);
      let newOrder = allWidgetIds;

      if (orderData && Array.isArray(orderData) && orderData.length > 0) {
        const merged = [...orderData];
        allWidgetIds.forEach(id => {
          if (!merged.includes(id)) merged.push(id);
        });
        newOrder = merged.filter(id => allWidgetIds.includes(id));
      }

      setWidgetOrder(newOrder);
      setOriginalOrder(newOrder);
    } catch (error) {
      console.error("Failed to fetch settings", error);
      setWidgetOrder(Object.keys(WIDGET_MAP));
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = (widgetName) => {
    if (loading || !currentUser) return true;
    const widgetRules = permissions.filter(p => p.menu_item === widgetName);
    if (widgetRules.length === 0) return true;

    return widgetRules.some(rule => {
      if (rule.permission_type === "everyone") return true;
      if (rule.permission_type === "department" && currentUser.Department === rule.permission_value) return true;
      if (rule.permission_type === "title" && currentUser.Title === rule.permission_value) return true;
      return false;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setWidgetOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Cancelled
      setWidgetOrder(originalOrder);
    } else {
      setOriginalOrder(widgetOrder);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      await api("/admin/dashboard-order", "PUT", widgetOrder);
      setOriginalOrder(widgetOrder);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save order", err);
    }
  };

  // Filter visible widgets first so we don't drag invisible items hole
  const visibleWidgets = widgetOrder.filter(id => checkPermission(id));

  return (
    <Page title="WorkOps - Dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Dashboard</Typography>
        {isAdmin && (
          <Box>
            {!isEditing ? (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={() => setIsEditing(true)}
              >
                Edit Layout
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<CancelIcon />}
                  variant="outlined"
                  color="error"
                  onClick={toggleEdit}
                >
                  Cancel
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save Order
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleWidgets}
          strategy={rectSortingStrategy}
        >
          <Grid container direction="row" spacing={3}>
            {visibleWidgets.map(widgetId => {
              const widgetDef = WIDGET_MAP[widgetId];
              if (!widgetDef) return null;

              return (
                <SortableGridItem
                  key={widgetId}
                  id={widgetId}
                  component={widgetDef.component}
                  gridProps={widgetDef.gridProps}
                  isEditing={isEditing}
                />
              );
            })}
          </Grid>
        </SortableContext>
      </DndContext>
    </Page>
  );
};

export default Home;
