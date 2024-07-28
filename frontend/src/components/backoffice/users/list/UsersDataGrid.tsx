import React, { useMemo, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { Box } from "@mui/material";
import { VariablesColors } from "@/styles/Variables.colors";
import router from "next/router";
import { UserTypes } from "@/types/UserTypes";

const colors = new VariablesColors();
const { errorColor, colorOrange } = colors;

type CategoryDataGridProps = {
  users: UserTypes[];
};

const UsersDataGrid: React.FC<CategoryDataGridProps> = ({ users }) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const rows = users.map((user) => {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      nickName: user.nickName,
      email: user.email,
      profil: user.profil,
      gender: user.gender,
      role: user.role,
      city: user.city,
      adress: user.adress,
      zipCode: user.zipCode,
      phoneNumber: user.phoneNumber,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
  const handleEditClick = (id: string) => {
    router.push(`/tgc-backoffice/users/${id}`);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "firstName",
        headerName: "Nom",
        width: 130,
        sortable: true,
      },
      {
        field: "lastName",
        headerName: "Prénom",
        width: 130,
        sortable: true,
      },
      {
        field: "nickName",
        headerName: "Surnom",
        width: 100,
      },
      {
        field: "email",
        headerName: "Email",
        width: 200,
      },
      {
        field: "profil",
        headerName: "Profil",
        width: 130,
        valueGetter: (value, row) => {
          return row.profil === "INDIVIDUAL" ? "Particulier" : "Professionnel";
        },
      },
      {
        field: "gender",
        headerName: "Genre",
        width: 80,
        valueGetter: (value, row) => {
          return row.gender === "MAN"
            ? "Homme"
            : row.gender === "WOMAN"
              ? "Femme"
              : "Autre";
        },
      },
      {
        field: "phoneNumber",
        headerName: "Téléphone",
        width: 120,
      },
      {
        field: "createdAt",
        headerName: "Création",
        width: 120,
        renderCell: (params: GridRenderCellParams) =>
          params.row?.createdAt
            ? format(new Date(params.row.createdAt), "dd/MM/yyyy")
            : "-",
      },
      {
        field: "updatedAt",
        headerName: "Modification",
        width: 120,
        renderCell: (params: GridRenderCellParams) =>
          params.row?.updatedAt
            ? format(new Date(params.row.updatedAt), "dd/MM/yyyy")
            : "-",
      },
      {
        field: "actions",
        headerName: "Action",
        width: 150,
        renderCell: (params: GridRenderCellParams) =>
          params.row ? (
            <>
              <GridActionsCellItem
                icon={<EditIcon style={{ color: colorOrange }} />}
                label="Modifier"
                className="textPrimary"
                onClick={() => handleEditClick(params.id.toString())}
                color="inherit"
              />
              <GridActionsCellItem
                icon={<DeleteIcon style={{ color: errorColor }} />}
                label="Supprimer"
                color="inherit"
              />
            </>
          ) : null,
      },
    ],
    [errorColor, colorOrange],
  );

  return (
    <Box style={{ height: 631, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        checkboxSelection
      />
    </Box>
  );
};

export default UsersDataGrid;
