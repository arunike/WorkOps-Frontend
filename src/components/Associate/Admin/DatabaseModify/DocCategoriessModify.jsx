import { useState, useEffect } from "react";
import { Box, Button, Grid, List, ListItem, TextField, Alert } from "@mui/material";

const DocCategoriesModify = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8081/document-categories");
      if (response.ok) {
        const data = await response.json();
        setAllCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCat) return;
    try {
      const response = await fetch("http://localhost:8081/document-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCat }),
      });
      if (response.ok) {
        setNewCat("");
        fetchCategories();
      }
    } catch (err) {
      setError("Failed to add category");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container direction="rows" justify="flex-start">
        <Grid item xs={12}>
          <List component="nav">
            {allCategories && allCategories.map((cat, index) => {
              const name = cat.name;
              const id = cat.id;

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
                        await fetch(`http://localhost:8081/document-categories/${id}`, { method: 'DELETE' });
                        fetchCategories();
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
                placeholder="New Category"
                sx={{ pr: 2, minWidth: 200 }}
                size="small"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
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
export default DocCategoriesModify;
