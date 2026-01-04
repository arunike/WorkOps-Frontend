import "./approverElements.css";
import { Avatar } from "@mui/material";
import React from "react";
import { stringAvatar } from "../../../utils/avatarUtils";

const ApprovalAvatar = ({
  profilePicture,
  FirstName,
  LastName,
  Title,
  comment,
  awidth = 40,
  aheight = 40,
  id,
}) => {
  return (
    <>
      <div className="TimelineContentAvatarContainer">
        <div className="TimelineContentAvatar">
          <Avatar
            {...(profilePicture
              ? { src: profilePicture }
              : stringAvatar(`${FirstName} ${LastName}`)
            )}
            sx={{
              width: awidth,
              height: aheight,
              ...(profilePicture ? {} : stringAvatar(`${FirstName} ${LastName}`).sx)
            }}
          />
          <div className="TimelineContentAvatarDetails">
            {FirstName && LastName && (
              <div className="TimelineContentDetailsAvatarName">
                {FirstName + " " + LastName}
              </div>
            )}
            {Title && (
              <div className="TimelineContentDetailsAvatarTitle">{Title}</div>
            )}
            {comment && (
              <div className="TimelineContentAvatarComments">{comment}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovalAvatar;
