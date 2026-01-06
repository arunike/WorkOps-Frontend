import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box, Drawer, Grid, Typography } from "@mui/material";
import Scrollbar from "../../components/Scrollbar";
import NavSection from "../../components/NavSection";
import { MHidden } from "../../components/@material-extend";
import Logo from "../../components/Logo";
import sidebarConfig from "./SidebarConfig";
import { useAuth } from "../../utils/context/AuthContext";
import { api } from "../../utils/api";

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const { isAdmin, userData } = useAuth();

  useEffect(
    (pathname) => {
      if (isOpenSidebar) {
        onCloseSidebar();
      }
    },
    [pathname]
  );

  const isManager = userData && (
    (userData.Title && userData.Title.startsWith("Head of")) ||
    (userData.Title && userData.Title === "CEO") ||
    (userData.Title && userData.Title === "Manager")
  );

  const [menuPermissions, setMenuPermissions] = useState([]);
  const [orderedConfig, setOrderedConfig] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [permissionsData, orderData] = await Promise.all([
          api("/menu-permissions"),
          api("/admin/sidebar-order")
        ]);

        setMenuPermissions(permissionsData || []);

        if (orderData && Array.isArray(orderData) && orderData.length > 0) {
          const reordered = [];
          // Add items in order
          orderData.forEach(title => {
            const found = sidebarConfig.find(item => item.title === title);
            if (found) reordered.push(found);
          });
          // Add any missing items (newly added to code but not in saved order)
          sidebarConfig.forEach(item => {
            if (!orderData.includes(item.title)) {
              reordered.push(item);
            }
          });
          setOrderedConfig(reordered);
        } else {
          setOrderedConfig(sidebarConfig);
        }

      } catch (error) {
        console.error("Failed to fetch settings", error);
        setOrderedConfig(sidebarConfig);
      }
    };

    fetchSettings();
  }, []);

  const hasPermission = (menuItem) => {
    if (!userData) return false;

    const itemPermissions = menuPermissions.filter(
      (p) => p.menu_item.toLowerCase() === menuItem.toLowerCase()
    );

    if (itemPermissions.length === 0) return true;

    const hasAccess = itemPermissions.some((perm) => {
      if (perm.permission_type === "everyone") return true;
      if (perm.permission_type === "department" && userData.Department === perm.permission_value) return true;
      if (perm.permission_type === "title" && userData.Title === perm.permission_value) return true;
      return false;
    });

    if (menuItem.toLowerCase() === "associates") {
      console.log("Associates permission check:", {
        menuItem,
        userDepartment: userData.Department,
        userTitle: userData.Title,
        itemPermissions,
        hasAccess
      });
    }

    return hasAccess;
  };

  const filteredConfig = orderedConfig.reduce((acc, item) => {
    // Check permission for the parent item
    const hasParentPermission = hasPermission(item.title);

    if (hasParentPermission) {
      if (item.children) {
        // If parent has children, filter them as well
        const filteredChildren = item.children.filter(child => hasPermission(child.title));

        // Only include parent if it has allowed children (or if logic allows empty parents, but usually we hide empty parents)
        // However, some parents might be just headers. Let's assume we include valid children.
        // If filteredChildren is empty but parent is allowed, it might look empty. 
        // Better UX: Show parent only if it has children remaining.
        if (filteredChildren.length > 0) {
          acc.push({ ...item, children: filteredChildren });
        }
      } else {
        // Item has no children and is permitted
        acc.push(item);
      }
    }
    return acc;
  }, []);

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Grid container direction="column" alignItems="center">
          <Logo sx={{ width: 90, height: 90 }} />
        </Grid>
      </Box>

      <NavSection navConfig={filteredConfig} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH, bgcolor: "third.main" },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "third.main",
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
