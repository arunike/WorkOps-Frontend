import { Navigate, useRoutes, useLocation } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import { useAuth } from "./utils/context/AuthContext";
import Page404 from "./pages/Page404/Page404";
import Associates from "./pages/Associates/Associates";
import NewAssociate from "./components/Associate/newAssociate";
import AssociateDetails from "./pages/AssociateDetails/AssociateDetails";
import Admin from "./pages/Admin/Admin";
import MyTasks from "./pages/Tasks/Tasks";
import MyTeam from "./pages/MyTeam/MyTeam";
import Page403 from "./pages/Page403/Page403";

import PrivateRoute from "./pages/PrivateRoute/PrivateRoute";
import TimeOff from "./pages/TimeOff/TimeOff";
import Thanks from "./pages/Thanks/Thanks";
import GiveThanks from "./components/Thanks/GiveThanks";
import Hierarchy from "./pages/Hierarchy/Hierarchy";
import TimeEntry from "./pages/TimeEntry/TimeEntry";
import Approvals from "./pages/Approvals/Approvals";
import TimeOffApprovals from "./pages/Approvals/TimeOffApprovals";

export default function Router() {
  const { currentUser, isAdmin } = useAuth();
  let location = useLocation();
  return useRoutes([
    {
      path: "/",
      element: currentUser ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/home" replace /> },
        {
          path: "home",
          element: (
            <PrivateRoute role="Standard">
              <Home />
            </PrivateRoute>
          ),
        },
        {
          path: "associates",
          element: <Associates />,
        },
        { path: "associates/:id", element: <AssociateDetails /> },
        { path: "associates/newassociate", element: <NewAssociate /> },
        { path: "app/register", element: isAdmin ? <SignUp /> : <Page403 /> },
        { path: "tasks", element: <MyTasks /> },
        { path: "myteam", element: <MyTeam /> },
        { path: "hierarchy", element: <Hierarchy /> },
        { path: "timeoff", element: <TimeOff /> },
        { path: "thanks", element: <Thanks /> },
        { path: "thanks/givethanks", element: <GiveThanks /> },
        {
          path: "admin/database",
          element: (
            <PrivateRoute role="Admin">
              <Admin />
            </PrivateRoute>
          ),
        },
        { path: "timeentry", element: <TimeEntry /> },
        {
          path: "timeoff/approvals",
          element: <TimeOffApprovals />
        },
        {
          path: "approvals",
          element: (
            <PrivateRoute role="Standard">
              <Approvals />
            </PrivateRoute>
          )
        },
      ],
    },
    {
      path: "/",
      element: !currentUser ? (
        <LogoOnlyLayout />
      ) : (
        <Navigate to="/home" />
      ),
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "/", element: <Navigate to="/home" /> },
        { path: "/error", element: <Page404 /> },
        { path: "*", element: <Page404 /> },
      ],
    },
    { path: "*", element: <Navigate to="/error" replace /> },
  ]);
}
