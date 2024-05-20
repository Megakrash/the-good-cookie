import React from "react";
import BackOfficeSidebar from "./sideBar/BackOfficeSideBar";
import { Box, Container } from "@mui/material";
import { VariablesColors } from "@/styles/Variables.colors";
import Head from "next/head";

const colors = new VariablesColors();
const { colorWhite } = colors;

const BackOfficeLayout = ({ children }): React.ReactNode => {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Head>
        <title>TGC BackOffice</title>
        <meta name="description" content="TGC back-office" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/cookicon.ico" />
      </Head>
      <BackOfficeSidebar />
      <Container
        component="main"
        sx={{
          marginLeft: "300px",
          marginTop: "75px",
          minHeight: "calc(100vh - 75px)",
          padding: 0,
          backgroundColor: colorWhite,
        }}
        maxWidth={false}
      >
        {children}
      </Container>
    </Box>
  );
};

export default BackOfficeLayout;
