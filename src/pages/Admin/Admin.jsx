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
  return (
    <Page title="WorkOps - Admin">
      <Container maxWidth="lg">
        <h1>Admin</h1>
        <Card>
          <Box p={2}>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ backgroundColor: "#eef0f2" }}
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  Departments...
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Add, rename, delete
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ModifyDatabase />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ backgroundColor: "#eef0f2" }}
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  Document categories...
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Add, rename, delete
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DocCategoriesModify />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ backgroundColor: "#eef0f2" }}
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  Offices...
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Add, rename, delete
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <OfficesModify />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel3b"} onChange={handleChange("panel3b")}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3b-content"
                id="panel3b-header"
                sx={{ backgroundColor: "#eef0f2" }}
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>
                  Thanks Categories...
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Add, delete
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ThanksCategories />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel4"} onChange={handleChange("panel4")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Associates Data</Typography>
                <Typography sx={{ color: "text.secondary" }}>View all associates full data</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AssociatesData />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel5"} onChange={handleChange("panel5")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Time Off Requests</Typography>
                <Typography sx={{ color: "text.secondary" }}>View all time off history</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TimeOffData />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel6"} onChange={handleChange("panel6")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Tasks</Typography>
                <Typography sx={{ color: "text.secondary" }}>View all tasks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TasksData />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel7"} onChange={handleChange("panel7")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Thanks Messages</Typography>
                <Typography sx={{ color: "text.secondary" }}>View all kudos</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ThanksData />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel8"} onChange={handleChange("panel8")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Menu Permissions</Typography>
                <Typography sx={{ color: "text.secondary" }}>Manage sidebar menu access</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <MenuPermissions />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel9"} onChange={handleChange("panel9")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Task Configuration</Typography>
                <Typography sx={{ color: "text.secondary" }}>Configure approvers</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TaskConfiguration />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel10"} onChange={handleChange("panel10")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>System Settings</Typography>
                <Typography sx={{ color: "text.secondary" }}>Global configuration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DefaultPasswordConfig />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel11"} onChange={handleChange("panel11")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Dashboard Configuration</Typography>
                <Typography sx={{ color: "text.secondary" }}>Manage widget visibility</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DashboardPermissionsConfig />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel12"} onChange={handleChange("panel12")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Overtime Configuration</Typography>
                <Typography sx={{ color: "text.secondary" }}>Manage overtime exemptions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <OvertimeConfig />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel13"} onChange={handleChange("panel13")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Time Off Configuration</Typography>
                <Typography sx={{ color: "text.secondary" }}>Manage time off exemptions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TimeOffConfig />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel14"} onChange={handleChange("panel14")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Time Entry Records</Typography>
                <Typography sx={{ color: "text.secondary" }}>View all time entries</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TimeEntryRecords />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel14b"} onChange={handleChange("panel14b")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>PTO Configuration</Typography>
                <Typography sx={{ color: "text.secondary" }}>Configure PTO accrual</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PTOConfig />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel14c"} onChange={handleChange("panel14c")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Profile Edit Permissions</Typography>
                <Typography sx={{ color: "text.secondary" }}>Control who can edit profiles</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ProfileEditPermissions />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === "panel15"} onChange={handleChange("panel15")}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#eef0f2" }}>
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Overtime Requests</Typography>
                <Typography sx={{ color: "text.secondary" }}>View overtime history</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <OvertimeRequests />
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === "panel19"}
              onChange={handleChange("panel19")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel19bh-content"
                id="panel19bh-header"
                sx={{ backgroundColor: "#eef0f2" }}
              >
                <Typography sx={{ width: "33%", flexShrink: 0 }}>Holiday Management</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Manage company holidays
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <HolidayManagement />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Card>
      </Container>
    </Page>
  );
};

export default Admin;
