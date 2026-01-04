import { useAuth } from "../../utils/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Page403 from "../Page403/Page403";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Logo from "../../components/Logo";
import { Stack } from "@mui/material";

const PrivateRoute = ({ children, role }) => {
  const { currentUser, isAdmin } = useAuth();
  let location = useLocation();

  if (currentUser === undefined) {
    return (
      <>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          alignContent="center"
        >
          <Logo sx={{ width: 200, height: 200 }} />
          Loading...
        </Stack>
      </>
    );
  } else if (currentUser === null) {
    console.log("ting to", location);
    return <Navigate to="/login" state={{ from: location }} />;
  } else {
    if (role === "Admin") {
      if (!isAdmin && currentUser) {
        return <Page403 />;
      }
    }
    return children;
  }
};

export default PrivateRoute;
