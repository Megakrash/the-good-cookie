import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  Box,
  Divider,
  Toolbar,
} from "@mui/material";
import { useRouter } from "next/router";
import BackOfficeAppBar from "../appBar/BackOfficeAppBar";
import { menuItems, MenuItem, SubMenu } from "./MenuList";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { VariablesColors } from "@/styles/Variables.colors";

const colors = new VariablesColors();
const { colorLightGrey, colorOrange } = colors;

const BackOfficeSidebar = (): React.ReactNode => {
  const router = useRouter();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  // Expand and collapse the menus
  const handleClick = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open the menu corresponding to the URL
  useEffect(() => {
    const openStates: { [key: string]: boolean } = {};
    menuItems.forEach((item) => {
      item.subMenus?.forEach((sub) => {
        if (router.pathname.includes(sub.href)) {
          openStates[item.id] = true;
        }
        if (sub.subMenus) {
          sub.subMenus.forEach((subSub) => {
            if (router.pathname.includes(subSub.href)) {
              openStates[sub.id] = true;
              openStates[item.id] = true;
            }
          });
        }
      });
    });
    setOpen(openStates);
  }, [router.pathname]);

  const renderSubMenuItems = (
    subMenus: SubMenu[],
    parentPadding: number = 4,
  ) => {
    return subMenus.map((sub) => (
      <React.Fragment key={sub.id}>
        <ListItem disablePadding>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => {
              router.push(`${sub.href}`);
            }}
          >
            <ListItemButton sx={{ pl: parentPadding }}>
              {sub.icon && (
                <ListItemIcon sx={{ color: colorOrange }}>
                  {React.createElement(sub.icon)}
                </ListItemIcon>
              )}
              <ListItemText primary={sub.text} sx={{ ml: -2 }} />
            </ListItemButton>
          </Box>
        </ListItem>
        {sub.subMenus && (
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" sx={{ mt: -1 }} disablePadding>
              {renderSubMenuItems(sub.subMenus, parentPadding + 5)}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleClick(item.id)}>
            <ListItemIcon sx={{ color: colorOrange }}>
              {React.createElement(item.icon)}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ ml: -2 }} />
          </ListItemButton>
        </ListItem>
        <Divider />
        {item.subMenus && (
          <Collapse in={open[item.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderSubMenuItems(item.subMenus)}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <BackOfficeAppBar />
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            marginTop: "25px",
            width: 300,
            boxSizing: "border-box",
            backgroundColor: colorLightGrey,
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: colorOrange }}>
                {React.createElement(DashboardIcon)}
              </ListItemIcon>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  router.push(`/tgc-backoffice`);
                }}
              >
                <ListItemText primary="Dashboard" sx={{ ml: -2 }} />
              </Box>
            </ListItemButton>
          </ListItem>
          <Divider />
          {renderMenuItems(menuItems)}
        </List>
      </Drawer>
    </Box>
  );
};

export default BackOfficeSidebar;
