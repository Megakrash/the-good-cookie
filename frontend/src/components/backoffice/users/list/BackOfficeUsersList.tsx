import React from "react";
import { useQuery } from "@apollo/client";
import UsersDataGrid from "./UsersDataGrid";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import router from "next/router";
import LoadingApp from "@/styles/LoadingApp";
import { UserTypes } from "@/types/UserTypes";
import { queryAllUsers } from "@/graphql/users/queryAllUsers";

const BackOfficeUsersList = (): React.ReactNode => {
  const { data, loading } = useQuery<{ items: UserTypes[] }>(queryAllUsers);
  if (loading) return <LoadingApp />;
  const users = data?.items || [];
  return (
    <Box sx={{ marginTop: "30px" }}>
      {users && <UsersDataGrid users={users} />}
    </Box>
  );
};

export default BackOfficeUsersList;
