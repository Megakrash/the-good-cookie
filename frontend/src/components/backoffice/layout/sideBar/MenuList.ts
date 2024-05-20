import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import DirectionsSubwayFilledIcon from "@mui/icons-material/DirectionsSubwayFilled";

export const menuItems = [
  {
    id: "users",
    text: "Gestion des utilisateurs",
    icon: AccountBoxIcon,
    subMenus: [
      {
        id: "users-list",
        text: "Utilisateurs",
        icon: AssignmentIndIcon,
        href: "/tgc-backoffice/users-list",
      },
      {
        id: "users-roles",
        text: "Rôles",
        icon: AssignmentIcon,
        href: "/tgc-backoffice/users-roles",
      },
    ],
  },
  {
    id: "categories",
    text: "Gestion des catégories",
    icon: CategoryIcon,
    subMenus: [
      {
        id: "categories-list",
        text: "Catégories",
        icon: CategoryIcon,
        href: "/tgc-backoffice/categories-list",
      },
      {
        id: "subcategories",
        text: "Sous-catégories",
        icon: DirectionsSubwayFilledIcon,
        href: "/tgc-backoffice/categories-subcategories",
      },
    ],
  },
];
