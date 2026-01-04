import { Button, Card, Grid, CardHeader } from "@mui/material";
import { useState, useContext, useMemo } from "react";
import { associatesContext } from "../../utils/context/contexts";
import ChangeTitleTask from "./addTaskElements/ChangeTitleTask";
import IncreaseSalary from "./addTaskElements/IncreaseSalary";
import { addNotification } from "../Thanks/thanksFunctions";
import { useEffect } from "react";

const AddTask = ({
  userDetails,
  myManager,
  taskType,
  handleCloseAction,
  setPopupOpen,
}) => {
  const { associates } = useContext(associatesContext);

  // Fetch second approver from settings, fallback to HR Head
  const [secondApproverId, setSecondApproverId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8081/settings/second_approver_id")
      .then((res) => res.json())
      .then((data) => {
        if (data.value) {
            setSecondApproverId(parseInt(data.value));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const hrPerson = useMemo(() => {
    if (secondApproverId) {
        return associates.find(a => a.id === secondApproverId);
    }
    // Fallback
    const hrPersonFromDB = associates.find(
      (assoc) => assoc.Department === "People" && assoc.Title && assoc.Title.toLowerCase().includes("head")
    );
    return hrPersonFromDB || associates.find((assoc) => assoc.Department === "People");
  }, [associates, secondApproverId]);

  const isCEO = userDetails.Title === "CEO";

  const isHR = userDetails.Department === "People";

  const ceo = useMemo(() => {
    return associates.find(a => a.Title === "CEO");
  }, [associates]);

  // Filter associates based on permissions
  const availableAssociates = useMemo(() => {
    if (isCEO) {
      // CEO can create tasks for everyone
      return associates;
    } else if (isHR) {
      // HR can create tasks for everyone except CEO
      return associates.filter(a => a.Title !== "CEO");
    } else {
      // Regular users can only create tasks for their direct reports
      return associates.filter(a => a.manager_id === userDetails.id);
    }
  }, [associates, userDetails, isCEO, isHR]);

  const [taskValues, setTaskValues] = useState({});
  const [selectedTargetId, setSelectedTargetId] = useState(null);

  const targetAssociateManager = useMemo(() => {
    if (!selectedTargetId) return myManager;

    const targetAssociate = associates.find(a => a.id === selectedTargetId);
    if (!targetAssociate || !targetAssociate.manager_id) return myManager;

    const manager = associates.find(a => a.id === targetAssociate.manager_id);
    return manager || myManager;
  }, [selectedTargetId, associates, myManager]);

  console.log(taskType, "task type");

  const handleValues = (event) => {
    const { name, value } = event.target;

    if (name === "TargetValue") {
      setSelectedTargetId(value);
    }

    console.log(event.target.value);

    // Build approvers object with target associate's manager
    const approvers = {};
    if (targetAssociateManager) {
      approvers[targetAssociateManager.id] = {
        status: "pending",
        timestamp: "pending",
        order: 1,
      };
    }
    if (hrPerson) {
      approvers[hrPerson.id] = {
        status: "pending",
        timestamp: "pending",
        order: 2,
      };
    }

    setTaskValues({
      ...taskValues,
      [name]: value,
      status: "pending",
      TaskName: taskType,
      requester: userDetails.id,
      approvers,
      requesterName: userDetails.FirstName + " " + userDetails.LastName,
      timestamp: Math.round(new Date().getTime() / 1000),
    });
    console.log(taskValues);
  };
  const writeTask = async () => {
    try {
      const response = await fetch("http://localhost:8081/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskValues),
      });

      if (response.ok) {
        console.log("Task created successfully");
        setPopupOpen(false);
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  console.log("task type", taskType);

  return (
    <Card>
      <CardHeader title="New Task" />
      <Grid
        container
        direction="column"
        spacing={3}
        sx={{
          p: 3,
          "& .MuiTextField-root": { width: "100%" },
        }}
      >
        {taskType === "Title Change" ? (
          <Grid item md={12}>
            <Grid container direction="column" spacing={2}>
              <ChangeTitleTask
                handleValues={handleValues}
                associates={availableAssociates}
                myManager={targetAssociateManager}
                hrPerson={hrPerson}
              />
            </Grid>
          </Grid>
        ) : null}
        {taskType && taskType === "Salary Increase" ? (
          <Grid item md={12}>
            <Grid container direction="column" spacing={2}>
              <IncreaseSalary
                handleValues={handleValues}
                associates={availableAssociates}
                myManager={targetAssociateManager}
                hrPerson={hrPerson}
              />
            </Grid>
          </Grid>
        ) : null}
        <Grid item md={12}>
          <Grid container direction="rows">
            <Grid item md={6} sx={{ pr: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  handleCloseAction();
                }}
              >
                Cancel
              </Button>
            </Grid>

            <Grid item md={6}>
              <Button fullWidth variant="contained" onClick={writeTask}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AddTask;
