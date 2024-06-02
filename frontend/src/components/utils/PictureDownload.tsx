import React from "react";
import { Box, Button, CardMedia } from "@mui/material";
import { DownloadInput } from "@/styles/MuiInput";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { PATH_IMAGE } from "@/api/configApi";

type PictureDownloadProps = {
  picture: File | null;
  setPicture: (picture: File) => void;
  previewUrl: string;
  setPreviewUrl: (previewUrl: string) => void;
  curentPicture?: string;
  setCurentPicture?: (curentPicture: string) => void;
};

const PictureDownload = (props: PictureDownloadProps): React.ReactNode => {
  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      props.setPicture(file);
      props.setPreviewUrl(URL.createObjectURL(file));
      props?.setCurentPicture("");
    }
  }
  return (
    <Box>
      {(props.previewUrl || props.curentPicture) && (
        <CardMedia
          sx={{
            width: "200px",
            height: "200px",
            margin: "auto",
            objectFit: "cover",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
          image={
            props.previewUrl
              ? props.previewUrl
              : `${PATH_IMAGE}/pictures/${props.curentPicture}`
          }
        />
      )}
      <Button
        component="label"
        variant="contained"
        fullWidth
        startIcon={<CloudUploadIcon />}
      >
        {`Télécharger une image (JPG, PNG, WEBP)`}
        <DownloadInput
          type="file"
          accept=".jpg, .png, .webp"
          onChange={handleFileSelection}
        />
      </Button>
    </Box>
  );
};

export default PictureDownload;
