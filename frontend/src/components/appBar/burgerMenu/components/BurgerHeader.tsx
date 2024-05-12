import React from "react";
import { useRouter } from "next/router";
import { Box, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type BurgerHeaderProps = {
  handleCloseNavMenu: () => void;
};

const BurgerHeader = (props: BurgerHeaderProps): React.ReactNode => {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "10px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginLeft: "22%",
        }}
      >
        The Good Cookie
      </Typography>

      <Button
        endIcon={<CloseIcon />}
        size="small"
        onClick={props.handleCloseNavMenu}
      ></Button>
    </Box>
  );
};

export default BurgerHeader;
