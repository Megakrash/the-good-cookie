import React from "react";
import axios from "axios";
import { PATH_IMAGE } from "@/api/configApi";
import {
  mutationUpdateAd,
  queryAdById,
  queryAllAds,
} from "@/components/graphql/Ads";
import { useMutation } from "@apollo/client";
import { Box, Button, CardMedia } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type DeleteAdPictureType = {
  adId: number;
  adPicture: string;
};

const DeleteAdPicture = (props: DeleteAdPictureType): React.ReactNode => {
  const [doUpdate] = useMutation(mutationUpdateAd, {
    refetchQueries: [queryAdById, queryAllAds],
  });

  const handleDeletePicture = () => {
    doUpdate({
      variables: {
        data: { picture: "" },
        adUpdateId: props.adId,
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <CardMedia
        sx={{
          width: "100%",
          height: 200,
          margin: "auto",
          objectFit: "contain",
        }}
        image={`${PATH_IMAGE}/ads/${props.adPicture}`}
      />
      <Button
        sx={{
          backgroundColor: "white",
        }}
        variant="outlined"
        startIcon={<DeleteIcon />}
        onClick={handleDeletePicture}
      >
        Effacer
      </Button>
    </Box>
  );
};

export default DeleteAdPicture;
