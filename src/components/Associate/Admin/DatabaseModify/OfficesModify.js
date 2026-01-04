import { useState, useEffect } from "react";
import { Box, Button, Grid, List, ListItem, TextField, Alert } from "@mui/material";

const OfficesModify = () => {
  const [allOffices, setAllOffices] = useState([]);
  const [newOffice, setNewOffice] = useState("");
  const [error, setError] = useState("");

  const fetchOffices = async () => {
    try {
      const response = await fetch("http://localhost:8081/offices");
      if (response.ok) {
        const data = await response.json();
        setAllOffices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleAdd = async () => {
    if (!newOffice) return;
    try {
      const response = await fetch("http://localhost:8081/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOffice }),
      });
      if (response.ok) {
        setNewOffice("");
        fetchOffices();
      }
    } catch (err) {
      setError("Failed to add office");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container direction="rows" justify="flex-start">
        <Grid item xs={12}>
          <List component="nav">
            {allOffices.map((office, index) => {
              const name = typeof office === 'string' ? office : office.name;
              const id = typeof office === 'string' ? null : office.id;

              return (
                <ListItem key={index}>
                  <TextField
                    sx={{ pr: 2, minWidth: 200 }}
                    size="small"
                    value={name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button
                    color="error"
                    variant="contained"
                    size="small"
                    disabled={!id}
                    onClick={async () => {
                      if (id && window.confirm(`Delete ${name}?`)) {
                        await fetch(`http://localhost:8081/offices/${id}`, { method: 'DELETE' });
                        fetchOffices();
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
                placeholder="New Office Name"
                sx={{ pr: 2, minWidth: 200 }}
                size="small"
                value={newOffice}
                onChange={(e) => setNewOffice(e.target.value)}
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
export default OfficesModify;
