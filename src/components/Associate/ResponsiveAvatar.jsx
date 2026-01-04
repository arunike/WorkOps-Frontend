import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../utils/avatarUtils";

const ResponsiveAvatar = ({ src, name, ...other }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("lg"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));
  const mobile = useMediaQuery(theme.breakpoints.up("xs"));

  const sizes = () => {
    if (desktop) return { width: 200, height: 200 };

    if (tablet) return { width: 150, height: 150 };
    if (mobile) return { width: 150, height: 150 };
  };

  const avatarProps = src ? { src } : (name ? stringAvatar(name) : {});

  return (
    <Avatar
      {...avatarProps}
      {...other}
      sx={{
        ...sizes(),
        ...avatarProps.sx,
        ...other.sx,
        fontSize: '4rem'
      }}
    />
  );
};
export default ResponsiveAvatar;
