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

  useEffect(() => {
    const fetchMenuPermissions = async () => {
      try {
        const response = await fetch("http://localhost:8081/menu-permissions");
        if (response.ok) {
          const data = await response.json();
          setMenuPermissions(data);
        }
      } catch (error) {
        console.error("Failed to fetch menu permissions", error);
      }
    };

    fetchMenuPermissions();
  }, []);

  const hasPermission = (menuItem) => {
    if (!userData) return false;

    const itemPermissions = menuPermissions.filter(
      (p) => p.menu_item.toLowerCase() === menuItem.toLowerCase()
    );

    if (itemPermissions.length === 0) return false;

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

  const filteredConfig = sidebarConfig.filter((item) => {
    return hasPermission(item.title);
  });

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

      <Box sx={{ flexGrow: 1 }}></Box>
      <Box>
        <Grid container justifyContent="center" sx={{ pb: 2 }}>
          <Typography variant="h7" color="lightGrey">
            Version 0.78.1
          </Typography>
        </Grid>
      </Box>
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
