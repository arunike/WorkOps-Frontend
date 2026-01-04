import React, { useState, useEffect } from "react";
import {
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import { useAuth } from "../../utils/context/AuthContext";
import ThanksCard from "../../components/Thanks/ThanksCard";
import Page from "../../components/Page";

const Thanks = () => {
  const { userData } = useAuth();
  const [thanks, setThanks] = useState();
  const [filterID, setFilterID] = useState();
  const [pagination, setPagination] = useState(3);
  const paginationChoices = [3, 10, 20, 30, 40];
  useEffect(() => {
    const getThanks = async () => {
      try {
        const response = await fetch("http://localhost:8081/thanks");
        const data = await response.json();

        if (data) {
          const mappedThanks = data.map(t => ({
            ...t,
            ThanksID: t.id,
            From: t.from_id,
            To: t.to_id,
            Comment: t.message,
            Category: t.category,
            Timestamp: t.timestamp
          })).sort((a, b) => (a.Timestamp < b.Timestamp ? 1 : -1));

          setThanks(mappedThanks);
        } else {
          setThanks([]);
        }
      } catch (error) {
        console.error("Failed to fetch thanks:", error);
        setThanks([]);
      }
    };
    getThanks();
  }, [pagination]);

  const filteredThanks = (array, id) => {
    if (id) {
      return array.filter((thank) => {
        return thank.To === id;
      });
    }
    return array;
  };

  return (
    <>
      <Page title="WorkOps - Thanks">
        <Box
          sx={{
            px: 1,
            py: 0.5,
            mb: 2,
            borderRadius: "10px",
            boxShadow: 7,
            background: "white",
            borderBottom: "solid black 3px",
          }}
        >
          <Grid
            container
            direction="row"
            sx={{ p: 1 }}
            justifyContent="space-between"
            alignContent="center"
            alignItems="center"
          >
            <Grid item>
              <Grid
                container
                direction="row"
                columnSpacing={2}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid item lg={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={(e) => {
                          if (e.target.checked === true) {
                            setFilterID(userData.id);
                          } else {
                            setFilterID(undefined);
                          }
                        }}
                      />
                    }
                    label="My Thanks"
                  />
                </Grid>
                <Grid item lg={6}>
                  <TextField
                    select
                    fullWidth
                    label="Per Page"
                    value={pagination}
                    size="small"
                    onChange={(e) => setPagination(e.target.value)}
                  >
                    {paginationChoices.map((pad) => (
                      <MenuItem value={pad} key={pad}>
                        {pad}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Button variant="contained" component={Link} to={"givethanks"}>
                Give Thanks
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid
          container
          direction="row"
          columnSpacing={1}
          rowSpacing={1}
          alignItems="center"
        >
          {thanks && userData ? (
            filteredThanks(thanks, filterID).length > 0 ? (
              filteredThanks(thanks, filterID).map((thank) => {
                return (
                  <Grid item xs={12} md={3} lg={3} key={thank.ThanksID}>
                    <ThanksCard
                      thanksId={thank.ThanksID}
                      thanksData={thank}
                      userId={userData.id}
                    />
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                  <Typography variant="h6" color="text.secondary">
                    No thanks messages yet. Be the first to give thanks!
                  </Typography>
                </Box>
              </Grid>
            )
          ) : (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                <CircularProgress />
              </Box>
            </Grid>
          )}
        </Grid>
      </Page>
    </>
  );
};

export default Thanks;
