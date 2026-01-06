import { useState, useEffect } from "react";
import { Box, Button, Grid, List, ListItem, TextField, Alert } from "@mui/material";
import { api } from "../../../../utils/api";

const DocCategoriesModify = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await api("/document-categories");
      setAllCategories(data);
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
      await api("/document-categories", {
        method: "POST",
        body: { name: newCat },
      });
      setNewCat("");
      fetchCategories();
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
                        try {
                          await api(`/document-categories/${id}`, { method: 'DELETE' });
                          fetchCategories();
                        } catch (e) { console.error("Failed to delete", e); }
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
