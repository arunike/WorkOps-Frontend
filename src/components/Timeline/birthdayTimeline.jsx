import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import CakeIcon from "@mui/icons-material/Cake";
import { Card, Avatar, Typography, Grid, Box } from "@mui/material";
import moment from "moment";
import { associatesContext } from "../../utils/context/contexts.js";

export default function BirthdayTimeline() {
  const todayDate = new Date();
  const now = moment(todayDate);

  const { associates } = React.useContext(associatesContext);
  const GetInitial = (name) => {
    return name.slice(0, 1) + ".";
  };
  const BirthdayFunc = (arrayofAssocaites) => {
    const haveBirthdaySoon = [];
    arrayofAssocaites.forEach((associate) => {
      // Handle the custom DOB object from App.js or standard Date
      let dobDate;
      if (associate.DOB && typeof associate.DOB.toDate === 'function') {
        dobDate = associate.DOB.toDate();
      } else {
        dobDate = new Date(associate.DOB);
      }

      const birthDayCurrentYear = moment(dobDate).year(now.year()).startOf('day');
      const today = moment().startOf('day');

      let daysRemaining = birthDayCurrentYear.diff(today, "days");

      if (daysRemaining < 0) {
        // Birthday passed this year, look at next year
        const birthDayNextYear = moment(dobDate).year(now.year() + 1).startOf('day');
        daysRemaining = birthDayNextYear.diff(today, "days");
      }

      if (daysRemaining >= 0 && daysRemaining <= 60) {
        haveBirthdaySoon.push({
          ...associate,
          daysRemaining: daysRemaining,
        });
      }
    });
    return haveBirthdaySoon.sort(function (a, b) {
      return a.daysRemaining - b.daysRemaining;
    });
  };

  return (
    <Card>
      <Grid container direction="column">
        <Grid item>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item pt={3} pl={2}>
              <Typography variant="h6">Upcoming Birthdays</Typography>
            </Grid>
            <Grid item pt={2} pr={2}>
              <CakeIcon color="primary" fontSize="large" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {associates &&
            BirthdayFunc(associates).filter(
              (associate) => associate.EmplStatus !== "Terminated"
            ).length > 0 ? (
            <Timeline position="left" sx={{ p: 3, pt: 4 }}>
              <TimelineSeparator />
              {BirthdayFunc(associates)
                .filter((associate) => associate.EmplStatus !== "Terminated")
                .map((starter) => {
                  const { FirstName, profilePicture, DOB, daysRemaining } =
                    starter;

                  return (
                    <TimelineItem key={profilePicture}>
                      <TimelineOppositeContent
                        color="text.secondary"
                        sx={{ m: "auto 0" }}
                      >
                        {DOB &&
                          (DOB.toDate ? moment(DOB.toDate()) : moment(DOB)).format(
                            "MMMM Do"
                          )}{" "}
                        - {daysRemaining === 0 ? "Today!" : `${daysRemaining} days`}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="primary" variant="filled">
                          {/* <CheckCircleOutlineIcon fontSize="small" /> */}
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>

                      <TimelineContent sx={{ m: "auto 0" }}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <Grid>
                            <Avatar
                              src={profilePicture}
                              alt="Profile Pic"
                              sx={{ width: 30, height: 30 }}
                            />
                          </Grid>
                          <Grid sx={{ pl: 2 }}>
                            <Typography>
                              {FirstName} {GetInitial(FirstName)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
            </Timeline>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No upcoming birthdays
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}
