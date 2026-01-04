import Box from "@mui/material/Box";
import {
  Grid,
  Avatar,
  AvatarGroup,
  Skeleton,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";

import { useAuth } from "../../../utils/context/AuthContext";
import {
  associateContext,
  associatesContext,
} from "../../../utils/context/contexts";
import { stringAvatar } from "../../../utils/avatarUtils";

const AssociateSubdetails = () => {
  const { associates } = useContext(associatesContext);
  const { associateData, setAssociateData } = useContext(associateContext);
  const { isAdmin } = useAuth();
  const [managerDetails, setManagerDetails] = useState();
  const [TeamMembers, setTeamMembers] = useState([]);
  const [isEditingManager, setIsEditingManager] = useState(false);

  console.log("Associate Data:", associateData);

  const fetchTeamMembers = async () => {
    const TempMembers = associates.filter(
      (associate) => associate.Department === associateData.Department
    );

    return TempMembers;
  };

  const fetchManager = (ID) => {
    if (!ID) return null;
    try {
      // ID can be int or string, safe compare
      // eslint-disable-next-line eqeqeq
      const manager = associates.find((associate) => associate.id == ID);
      return manager;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleUpdateManager = async (event) => {
    const newManagerId = event.target.value;

    const payload = { ...associateData, manager_id: parseInt(newManagerId) };

    try {
      const response = await fetch(`http://localhost:8081/associates/${associateData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setAssociateData(payload);
        const newManager = fetchManager(newManagerId);
        setManagerDetails(newManager);
        setIsEditingManager(false);
      } else {
        console.error("Failed to update manager");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const getMembers = async () => {
      const associateFromServer = await fetchTeamMembers();
      setTeamMembers(associateFromServer);
      // Backend returns 'manager_id', legacy might be 'Manager'
      const mgrId = associateData.manager_id || associateData.Manager;
      const managerFromServer = fetchManager(mgrId);
      setManagerDetails(managerFromServer);
    };
    getMembers();
  }, [associateData, associates]);

  return (
    <>
      {TeamMembers ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 0,
              pr: 0,
            },
          }}
        >
          <Box sx={{ p: 1, pr: 1, pt: 3 }} dir="ltr">
            <Grid
              container
              direction="column"
              justifyContent="space-around"
              alignItems="flex-start"
            >
              <Grid item xs={12} sx={{ pb: 1 }}>

                <Grid
                  container
                  columnSpacing={2}
                  direction="rows"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item xs={12} sx={{ pr: 2, pb: 1, pl: 4 }}>
                    <Typography variant="overline" sx={{ pl: 1, pt: 1 }}>
                      Manager
                      {isAdmin && managerDetails && !isEditingManager && (
                        <Button
                          size="small"
                          onClick={() => setIsEditingManager(true)}
                          sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}
                        >
                          Change
                        </Button>
                      )}
                      {isEditingManager && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => setIsEditingManager(false)}
                          sx={{ ml: 1, minWidth: 'auto', p: 0.5 }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Typography>
                  </Grid>

                  {/* Show Manager Details if exists and not editing */}
                  {managerDetails && !isEditingManager ? (
                    <Grid
                      container
                      direction="rows"
                      justifyContent="space-around"
                      alignItems="center"
                    >
                      <Grid item xs={2} sx={{ pr: 2, pl: 1 }}>
                        {(() => {
                          const mgrName = `${managerDetails.FirstName} ${managerDetails.LastName}`;
                          const avatarProps = managerDetails.profilePicture
                            ? { src: managerDetails.profilePicture }
                            : stringAvatar(mgrName);
                          return (
                            <Avatar
                              {...avatarProps}
                              alt={mgrName}
                              sx={{ ...avatarProps.sx, width: 60, height: 60 }}
                            />
                          );
                        })()}
                      </Grid>
                      <Grid item xs={8} sx={{ pr: 2, pl: 3 }}>
                        <Typography variant="h6">
                          {managerDetails.FirstName} {managerDetails.LastName}
                        </Typography>
                        <Typography variant="h7">
                          {managerDetails.Title}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    // Show Editor or Empty State
                    <>
                      {(isAdmin) ? (
                        <Grid item xs={12} sx={{ pt: 1, pl: 1, pb: 1 }}>
                          <TextField
                            select
                            sx={{ width: "200px" }}
                            name="manager_id"
                            size="small"
                            label="Choose Manager"
                            value={managerDetails ? managerDetails.id : ''}
                            onChange={handleUpdateManager}
                          >
                            {associates
                              .sort((a, b) => (a.FirstName > b.FirstName ? 1 : -1))
                              .map((associate, index) => (
                                <MenuItem
                                  key={associate.id}
                                  value={associate.id}
                                >
                                  {associate.FirstName} {associate.LastName}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>
                      ) : (
                        <Grid item xs={12} sx={{ pt: 1, pl: 4, pb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            No manager assigned.
                          </Typography>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>

              </Grid>
              <Grid item xs={12} sx={{ pt: 5, pl: 1, pb: 1 }}>
                <Typography variant="overline">Team Members</Typography>
                <Grid container alignItems="flex-start">
                  <Grid item>
                    <AvatarGroup sx={{ pb: 1, pt: 2 }} max={6}>
                      {TeamMembers.map((FilteredMember) => {
                        if (!(FilteredMember.id === associateData.id)) {
                          const memberName = `${FilteredMember.FirstName} ${FilteredMember.LastName}`;
                          const memberProps = FilteredMember.profilePicture
                            ? { src: FilteredMember.profilePicture }
                            : stringAvatar(memberName);
                          return (
                            <Avatar
                              key={FilteredMember.id}
                              {...memberProps}
                              alt={memberName}
                            />
                          );
                        }
                        return null;
                      })}
                    </AvatarGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" height={40} />
        </Box>
      )}
    </>
  );
};

export default AssociateSubdetails;
