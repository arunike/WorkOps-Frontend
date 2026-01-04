import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import { associatesContext } from "../../../utils/context/contexts";

const TaskConfiguration = () => {
  const { associates } = useContext(associatesContext);
  const [secondApprover, setSecondApprover] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch current setting
    const fetchSetting = async () => {
      try {
        const response = await fetch("http://localhost:8081/settings/second_approver_id");
        if (response.ok) {
          const data = await response.json();
          if (data.value) {
            setSecondApprover(data.value);
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSetting();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8081/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "second_approver_id",
          value: secondApprover.toString(),
        }),
      });

      if (response.ok) {
        setMsg("Configuration saved successfully.");
        setError(false);
      } else {
        setMsg("Failed to save configuration.");
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setMsg("Error saving configuration.");
      setError(true);
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "white", borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Task Approval Configuration
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Select the user who acts as the Second Approver (e.g., Head of People/HR).
      </Typography>

      {msg && (
        <Alert severity={error ? "error" : "success"} sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
          <InputLabel id="second-approver-label">Second Approver</InputLabel>
          <Select
            labelId="second-approver-label"
            value={secondApprover}
            label="Second Approver"
            onChange={(e) => setSecondApprover(e.target.value)}
          >
            {associates.map((assoc) => (
              <MenuItem key={assoc.id} value={assoc.id}>
                {assoc.FirstName} {assoc.LastName} ({assoc.Title})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TaskConfiguration;
