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
          </Box>
        </Card>
      </Container>
    </Page>
  );
};

export default Admin;
