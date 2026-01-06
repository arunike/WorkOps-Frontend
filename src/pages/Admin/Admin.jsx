import React from "react";
import { Container, Typography, Card, Box } from "@mui/material";
import ModifyDatabase from "../../components/Associate/Admin/DatabaseModify";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DocCategoriesModify from "../../components/Associate/Admin/DatabaseModify/DocCategoriessModify";
import OfficesModify from "../../components/Associate/Admin/DatabaseModify/OfficesModify";
import AssociatesData from "../../components/Associate/Admin/AssociatesData";
import TimeOffData from "../../components/Associate/Admin/TimeOffData";
import TasksData from "../../components/Associate/Admin/TasksData";
import ThanksData from "../../components/Associate/Admin/ThanksData";
import MenuPermissions from "../../components/Associate/Admin/MenuPermissions";
import TaskConfiguration from "../../components/Associate/Admin/TaskConfiguration";
import DefaultPasswordConfig from "../../components/Associate/Admin/DefaultPasswordConfig";
import DashboardPermissionsConfig from "../../components/Associate/Admin/DashboardPermissionsConfig";
import OvertimeConfig from "../../components/Associate/Admin/OvertimeConfig";
import TimeOffConfig from "../../components/Associate/Admin/TimeOffConfig";
import TimeEntryRecords from "../../components/Associate/Admin/TimeEntryRecords";
import OvertimeRequests from "../../components/Associate/Admin/OvertimeRequests";
import ThanksCategories from "../../components/Associate/Admin/ThanksCategories";
import PTOConfig from "../../components/Associate/Admin/PTOConfig";
import ProfileEditPermissions from "../../components/Associate/Admin/ProfileEditPermissions";
import HolidayManagement from "../../components/Associate/Admin/HolidayManagement";
import Page from "../../components/Page";

const Admin = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const adminFeatures = [
    {
      id: "panel1",
      title: "Departments",
      subtitle: "Add, rename, delete",
      component: <ModifyDatabase />,
    },
    {
      id: "panel2",
      title: "Document Categories",
      subtitle: "Add, rename, delete",
      component: <DocCategoriesModify />,
    },
    {
      id: "panel3",
      title: "Offices",
      subtitle: "Add, rename, delete",
      component: <OfficesModify />,
    },
    {
      id: "panel3b",
      title: "Thanks Categories",
      subtitle: "Add, delete",
      component: <ThanksCategories />,
    },
    {
      id: "panel4",
      title: "Associates Data",
      subtitle: "View all associates full data",
      component: <AssociatesData />,
    },
    {
      id: "panel5",
      title: "Time Off Requests",
      subtitle: "View all time off history",
      component: <TimeOffData />,
    },
    {
      id: "panel6",
      title: "Tasks",
      subtitle: "View all tasks",
      component: <TasksData />,
    },
    {
      id: "panel7",
      title: "Thanks Messages",
      subtitle: "View all kudos",
      component: <ThanksData />,
    },
    {
      id: "panel8",
      title: "Menu Permissions",
      subtitle: "Manage sidebar menu access",
      component: <MenuPermissions />,
    },
    {
      id: "panel9",
      title: "Task Configuration",
      subtitle: "Configure approvers",
      component: <TaskConfiguration />,
    },
    {
      id: "panel10",
      title: "System Settings",
      subtitle: "Global configuration",
      component: <DefaultPasswordConfig />,
    },
    {
      id: "panel11",
      title: "Dashboard Configuration",
      subtitle: "Manage widget visibility",
      component: <DashboardPermissionsConfig />,
    },
    {
      id: "panel12",
      title: "Overtime Configuration",
      subtitle: "Manage overtime exemptions",
      component: <OvertimeConfig />,
    },
    {
      id: "panel13",
      title: "Time Off Configuration",
      subtitle: "Manage time off exemptions",
      component: <TimeOffConfig />,
    },
    {
      id: "panel14",
      title: "Time Entry Records",
      subtitle: "View all time entries",
      component: <TimeEntryRecords />,
    },
    {
      id: "panel14b",
      title: "PTO Configuration",
      subtitle: "Configure PTO accrual",
      component: <PTOConfig />,
    },
    {
      id: "panel14c",
      title: "Profile Edit Permissions",
      subtitle: "Control who can edit profiles",
      component: <ProfileEditPermissions />,
    },
    {
      id: "panel15",
      title: "Overtime Requests",
      subtitle: "View overtime history",
      component: <OvertimeRequests />,
    },
    {
      id: "panel19",
      title: "Holiday Management",
      subtitle: "Manage company holidays",
      component: <HolidayManagement />,
    },
  ];

  // Auto-sort alphabetically by title
  const sortedFeatures = [...adminFeatures].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <Page title="WorkOps - Admin">
      <Container maxWidth="lg">
        <h1>Admin</h1>
        <Card>
          <Box p={2}>
            {sortedFeatures.map((feature) => (
              <Accordion
                key={feature.id}
                expanded={expanded === feature.id}
                onChange={handleChange(feature.id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${feature.id}bh-content`}
                  id={`${feature.id}bh-header`}
                  sx={{ backgroundColor: "#eef0f2" }}
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {feature.subtitle}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>{feature.component}</AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Card>
      </Container>
    </Page>
  );
};

export default Admin;
