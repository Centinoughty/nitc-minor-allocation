import { useState } from "react";
import { Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimelineIcon from "@mui/icons-material/Timeline";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  useTranslate,
  MenuItemLink,
  MenuProps,
  useSidebarState,
} from "react-admin";
import SubMenu from "./SubMenu";

// import visitors from '../visitors';
// import invoices from '../invoices';
// import products from '../products';
// import categories from '../categories';
// import reviews from '../reviews';
// import SubMenu from './SubMenu';

type MenuName = "allotmentDetails";

const Menu = ({ dense = false }: MenuProps) => {
  const [state, setState] = useState({
    allotmentDetails: true,
  });
  const translate = useTranslate();
  const [open] = useSidebarState();

  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  return (
    <Box
      sx={{
        width: open ? 200 : 50,
        marginTop: 1,
        marginBottom: 1,
        borderRight: "1px solid #ccc",
        height: "100%",
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      {/* <DashboardMenuItem /> */}

      <MenuItemLink
        to="/students"
        state={{ _scrollToTop: true }}
        primaryText={translate(`Students`, {
          smart_count: 2,
        })}
        leftIcon={<PersonIcon />}
        dense={dense}
      />
      <MenuItemLink
        to="/minors"
        state={{ _scrollToTop: true }}
        primaryText={translate(`Courses`, {
          smart_count: 2,
        })}
        leftIcon={<MenuBookIcon />}
        dense={dense}
      />
      <MenuItemLink
        to="/timeline"
        state={{ _scrollToTop: true }}
        primaryText={translate(`Timeline`, {
          smart_count: 2,
        })}
        leftIcon={<TimelineIcon />}
        dense={dense}
      />     
      <SubMenu
        handleToggle={() => handleToggle("allotmentDetails")}
        isOpen={state.allotmentDetails}
        name="Allotment Details"
        icon={<HowToRegIcon />}
        dense={dense}
      >
        <MenuItemLink
          to="/studentwise"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Student Wise`, {
            smart_count: 2,
          })}
          leftIcon={<PeopleIcon />}
          dense={dense}
        />
        <MenuItemLink
          to="/coursewise"
          state={{ _scrollToTop: true }}
          primaryText={translate(`Course Wise`, {
            smart_count: 2,
          })}
          leftIcon={<LibraryBooksIcon />}
          dense={dense}
        />
      </SubMenu>
      <MenuItemLink
        to="/settings"
        state={{ _scrollToTop: true }}
        primaryText={translate(`Settings`, {
          smart_count: 2,
        })}
        leftIcon={<SettingsIcon />}
        dense={dense}
      />
    </Box>
  );
};

export default Menu;
