import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";
import DirectionsSubwayFilledIcon from "@mui/icons-material/DirectionsSubwayFilled";

export interface SubMenu {
  id: string;
  text: string;
  href: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  subMenus?: SubMenu[];
}

export interface MenuItem {
  id: string;
  text: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  href?: string;
  subMenus?: SubMenu[];
}

export const menuItems: MenuItem[] = [
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
        href: "/tgc-backoffice/categories",
        subMenus: [
          {
            id: "categories-create",
            text: "Créer",
            icon: AddIcon,
            href: "/tgc-backoffice/categories/new",
          },
        ],
      },
      {
        id: "subcategories",
        text: "Sous-catégories",
        icon: DirectionsSubwayFilledIcon,
        href: "/tgc-backoffice/subcategories",
        subMenus: [
          {
            id: "subcategories-create",
            text: "Créer",
            icon: AddIcon,
            href: "/tgc-backoffice/subcategories/new",
          },
        ],
      },
    ],
  },
];
