import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }) {
  return (
    <Box component="img" src="/images/logo.png" sx={{ width: 40, height: 40, ...sx }} alt="logo" />
  );
}
