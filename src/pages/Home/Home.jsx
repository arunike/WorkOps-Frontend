import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
} from "@mui/material";
import DepartmentGraph from "../../components/Graphs/departmentGraph";
import OfficeGraph from "../../components/Graphs/officeGraph";
import TotalEmployed from "../../components/Graphs/TotalEmployed";
import StarterTimeline from "../../components/Timeline/starterTimeline";
import BirthdayTimeline from "../../components/Timeline/birthdayTimeline";
import TotalEmployedHistory from "../../components/Graphs/TotalEmployedHistory";
import AverageSalary from "../../components/Graphs/AverageSalary";
import Page from "../../components/Page";
import { useAuth } from "../../utils/context/AuthContext";
import MaleVSFemaleGraph from "../../components/Graphs/MaleVSFemale";
import { api } from "../../utils/api";

const Home = () => {
  const { currentUser } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const data = await api("/menu-permissions");
      setPermissions(data);
    } catch (error) {
      console.error("Failed to fetch permissions", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = (widgetName) => {
    // If loading or no user, default safe (maybe hidden? or visible? defaulting to visible to avoid flash)
    if (loading || !currentUser) return true;

    const widgetRules = permissions.filter(p => p.menu_item === widgetName);

    // If no rules exist for this widget, it is visible to everyone
    if (widgetRules.length === 0) return true;

    // Check if any rule allows the user
    const hasPermission = widgetRules.some(rule => {
      if (rule.permission_type === "everyone") return true;
      if (rule.permission_type === "department" && currentUser.Department === rule.permission_value) return true;
      if (rule.permission_type === "title" && currentUser.Title === rule.permission_value) return true;
      return false;
    });

    return hasPermission;
  };

  return (
    <Page title="WorkOps - Dashboard">
      <Grid container direction="row" spacing={3} sx={{ paddingTop: 3 }}>
        {/* Top Row: Summary Stats & History */}
        {checkPermission("total employed") && (
          <Grid item xs={12} sm={6} md={3}>
            <TotalEmployed />
          </Grid>
        )}
        {checkPermission("average salary") && (
          <Grid item xs={12} sm={6} md={3}>
            <AverageSalary />
          </Grid>
        )}
        {checkPermission("history graph") && (
          <Grid item xs={12} md={6}>
            <TotalEmployedHistory />
          </Grid>
        )}

        {/* Middle Row: Breakdown Graphs & Starters */}
        {checkPermission("office graph") && (
          <Grid item xs={12} md={4}>
            <OfficeGraph />
          </Grid>
        )}
        {checkPermission("department graph") && (
          <Grid item xs={12} md={4}>
            <DepartmentGraph />
          </Grid>
        )}
        {checkPermission("starter timeline") && (
          <Grid item xs={12} md={4}>
            <StarterTimeline />
          </Grid>
        )}

        {/* Bottom Row: Birthdays */}
        {checkPermission("birthday timeline") && (
          <Grid item xs={12}>
            <BirthdayTimeline />
          </Grid>
        )}
      </Grid>
    </Page>
  );
};

export default Home;
