import { useState, useEffect } from "react";
import { Box, Button, Grid, List, ListItem, TextField, Alert } from "@mui/material";

const DepartmentsModify = () => {
  const [allDepartments, setAllDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [error, setError] = useState("");

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:8081/departments");
      if (response.ok) {
        const data = await response.json();
        setAllDepartments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async () => {
    if (!newDept) return;
    try {
      const response = await fetch("http://localhost:8081/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDept }),
      });
      if (response.ok) {
        setNewDept("");
        fetchDepartments();
      }
    } catch (err) {
      setError("Failed to add department");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container direction="rows" justify="flex-start">
        <Grid item xs={12}>
          <List component="nav">
            {allDepartments.map((dept, index) => {
              const name = dept.name || dept;
              const id = dept.id;

              return (
                <ListItem key={index}>
                  <TextField
                    sx={{ pr: 2, minWidth: 200 }}
                    size="small"
                    value={name}
                    InputProps={{ readOnly: true }}
                  />
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    disabled={!id}
                    onClick={async () => {
                      if (id && window.confirm(`Delete ${name}?`)) {
                        await fetch(`http://localhost:8081/departments/${id}`, { method: 'DELETE' });
                        fetchDepartments();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </ListItem>
              );
            })}
            <ListItem>
              <TextField
                placeholder="New Department"
                sx={{ pr: 2, minWidth: 200 }}
                size="small"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleAdd}
              >
                Add
              </Button>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DepartmentsModify;
