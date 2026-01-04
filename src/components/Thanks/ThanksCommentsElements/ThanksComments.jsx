import {
  Avatar,
  Typography,
  Grid,
  Divider,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

import React, { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import moment from "moment";
import { GetAssociateDetails } from "../../../utils/getAssociateDetails";
import { stringAvatar } from "../../../utils/avatarUtils";

const ThanksComments = ({
  timestamp,
  comment,
  id,
  commentId,
  thanksId,
  userId,
  refreshSocialData,
}) => {
  const [edit, setEdit] = useState(false);
  const [newComment, setNewComment] = useState();

  const user = GetAssociateDetails(id);
  const deleteComment = async (commentID) => {
    try {
      const response = await fetch(`http://localhost:8081/thanks/comment/${commentID}`, {
        method: "DELETE",
      });
      if (response.ok) {
        if (refreshSocialData) {
          refreshSocialData();
        }
      }
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };
  const editComment = async (commentID, newCommentContent) => {
    try {
      const response = await fetch(`http://localhost:8081/thanks/comment/${commentID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newCommentContent }),
      });
      if (response.ok) {
        setEdit(false);
        if (refreshSocialData) {
          refreshSocialData();
        }
      }
    } catch (error) {
      console.error("Error editing comment", error);
    }
  };

  const pressEdit = () => {
    setNewComment(comment);
    setEdit(!edit);
  };
  return (
    <>
      <Divider variant="fullWidth" />
      <Grid container direction="column" padding={1}>
        <Grid item>
          <Grid
            container
            direction="row"
            alignItems="flex-start"
            columnSpacing={1}
          >
            <Grid item>
              {user && (
                <Avatar
                  {...(user.profilePicture
                    ? { src: user.profilePicture }
                    : stringAvatar(`${user.FirstName} ${user.LastName}`)
                  )}
                  sx={{ width: 25, height: 25, ...(user.profilePicture ? {} : stringAvatar(`${user.FirstName} ${user.LastName}`).sx) }}
                />
              )}
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h7" sx={{ fontWeight: 600 }}>
                    {user.FirstName} {user.LastName}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ opacity: 0.5, paddingLeft: 1 }}
                  >
                    {moment(timestamp).from(new Date())}
                  </Typography>
                  {id === userId ? (
                    <>
                      <IconButton onClick={() => pressEdit()}>
                        <ModeEditIcon sx={{ width: 16, height: 16 }} />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteComment(commentId)}
                      >
                        <DeleteForeverIcon sx={{ width: 16, height: 16 }} />
                      </IconButton>
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {edit ? (
            <>
              <TextField
                variant="outlined"
                size="small"
                value={newComment ? newComment : ""}
                inputProps={{ style: { fontSize: 12 } }}
                fullWidth
                multiline
                onChange={(event) => setNewComment(event.target.value)}
                sx={{ borderColor: "yellow" }}
              ></TextField>
              <Button
                variant="contained"
                size="small"
                onClick={() => editComment(commentId, thanksId, newComment)}
              >
                Save
              </Button>
            </>
          ) : (
            <Box>
              <Typography variant="h7">{comment}</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ThanksComments;
