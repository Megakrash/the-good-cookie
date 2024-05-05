import React from "react";
import { Box, Button, CardMedia } from "@mui/material";
import { DownloadInput } from "@/styles/MuiInput";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type UserAvatarProps = {
  picture: File | null;
  setPicture: (picture: File) => void;
  previewUrl: string;
  setPreviewUrl: (previewUrl: string) => void;
};

const UserAvatar = (props: UserAvatarProps): React.ReactNode => {
  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      props.setPicture(file);
      props.setPreviewUrl(URL.createObjectURL(file));
    }
  }
  return (
    <Box>
      {props.previewUrl && (
        <CardMedia
          sx={{
            width: "200px",
            height: "200px",
            margin: "auto",
            objectFit: "cover",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
          image={props.previewUrl}
        />
      )}
      <Button
        component="label"
        variant="contained"
        fullWidth
        startIcon={<CloudUploadIcon />}
      >
        {`Télécharger`}
        <DownloadInput
          type="file"
          accept=".jpg, .png, .webp"
          onChange={handleFileSelection}
        />
      </Button>
    </Box>
  );
};

export default UserAvatar;
