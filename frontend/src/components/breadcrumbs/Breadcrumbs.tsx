import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import GrainIcon from "@mui/icons-material/Grain";

type BreadcrumbItem = {
  url: string;
  text: string;
};

type IconBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

const IconBreadcrumbs = ({ items }: IconBreadcrumbsProps): React.ReactNode => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        underline="hover"
        sx={{ display: "flex", alignItems: "center" }}
        color="inherit"
        href="/"
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        HOME
      </Link>
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;
        return isLastItem ? (
          <Typography
            key={index}
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {item.text}
          </Typography>
        ) : (
          <Link
            key={index}
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href={item.url}
          >
            <CategoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {item.text}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
export default IconBreadcrumbs;
