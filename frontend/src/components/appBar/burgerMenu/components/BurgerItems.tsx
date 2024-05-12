import React from "react";
import { useRouter } from "next/router";
import { MenuItem, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@mui/icons-material/Search";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import MessageIcon from "@mui/icons-material/Message";
import { VariablesColors } from "@/styles/Variables.colors";

type BurgerItemsProps = {
  handleCloseNavMenu: () => void;
};

const colors = new VariablesColors();
const { colorOrange } = colors;

const menuItems = [
  { icon: <AddBoxIcon />, text: "Déposer une annonce", route: "/annonces/new" },
  { icon: <SearchIcon />, text: "Rechercher", route: "/search" },
  { icon: <MessageIcon />, text: "Messages", route: "/messages" },
  { icon: <ContactSupportIcon />, text: "Contact", route: "/contact" },
];

const MenuItemComponent = ({ icon, text, route, handleCloseNavMenu }) => {
  const router = useRouter();
  return (
    <MenuItem
      onClick={() => {
        handleCloseNavMenu();
        router.replace(route);
      }}
    >
      {React.cloneElement(icon, {
        sx: {
          width: "30px",
          marginRight: "8px",
          height: "auto",
          color: colorOrange,
        },
      })}
      <Typography textAlign="center">{text}</Typography>
    </MenuItem>
  );
};

const BurgerItems = ({
  handleCloseNavMenu,
}: BurgerItemsProps): React.ReactNode => {
  return (
    <>
      {menuItems.map((item, index) => (
        <MenuItemComponent
          key={index}
          icon={item.icon}
          text={item.text}
          route={item.route}
          handleCloseNavMenu={handleCloseNavMenu}
        />
      ))}
    </>
  );
};

export default BurgerItems;
