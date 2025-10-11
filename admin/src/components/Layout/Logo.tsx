import { SVGProps } from "react";
import { useTheme } from "@mui/material/styles";

const Logo = (props: SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  return (
    // fill={theme.palette.secondary.light}

    <span>
      <p
        style={{
          color: theme.palette.secondary.light,
          fontSize: 20,
        }}
      >
        Admin Dashboard
      </p>
    </span>
  );
};

export default Logo;
