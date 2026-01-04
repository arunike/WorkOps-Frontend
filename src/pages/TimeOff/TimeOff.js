import React from "react";
import Page from "../../components/Page";
import { useAuth } from "../../utils/context/AuthContext";
import HRTimeOff from "./HRTimeOff";
import EmployeeTimeOff from "./EmployeeTimeOff";
import "react-big-calendar/lib/css/react-big-calendar.css";

const TimeOff = () => {
  const { isAdmin } = useAuth();

  return (
    <Page title="WorkOps - Time Off">
      {isAdmin ? <HRTimeOff /> : <EmployeeTimeOff />}
    </Page>
  );
};

export default TimeOff;
