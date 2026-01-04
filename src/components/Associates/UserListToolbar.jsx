import PropTypes from "prop-types";
import * as React from "react";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import { styled } from "@mui/material/styles";

import {
  Box,
  Switch,
  Toolbar,
  OutlinedInput,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  TextField,
  MenuItem,
} from "@mui/material";


const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  setChecked: PropTypes.func,
  checked: PropTypes.bool,
};

export default function UserListToolbar({
  numSelected,
  filterName,
  onFilterName,
  setChecked,
  checked,
  departments = [],
  offices = [],
  filterDepartment,
  onFilterDepartment,
  filterOffice,
  onFilterOffice,
}) {
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
        <SearchStyle
          size="small"
          value={filterName}
          onChange={onFilterName}
          placeholder="Search..."
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: "text.disabled" }}
              />
            </InputAdornment>
          }
        />

        {/* Department Filter */}
        <TextField
          select
          size="small"
          label="Department"
          value={filterDepartment}
          onChange={onFilterDepartment}
          sx={{ width: 150 }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {departments.map((option) => (
            <MenuItem key={option.id || option} value={option.name || option}>
              {option.name || option}
            </MenuItem>
          ))}
        </TextField>

        {/* Office Filter */}
        <TextField
          select
          size="small"
          label="Office"
          value={filterOffice}
          onChange={onFilterOffice}
          sx={{ width: 150 }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {offices.map((option) => (
            <MenuItem key={option.id || option} value={option.name || option}>
              {option.name || option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              sx={{ ml: 1 }}
              onChange={(event) => setChecked(event.target.checked)}
              checked={checked}
            />
          }
          label="Terminated"
        />
      </FormGroup>
    </RootStyle>
  );
}
