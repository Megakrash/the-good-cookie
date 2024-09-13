import { AdTypes } from "@/types/AdTypes";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Box, CardActionArea } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import router from "next/router";

type AdCardProps = {
  ad: AdTypes;
};

const AdCard = (props: AdCardProps): React.ReactNode => {
  // Path images
  const adImageUrl = props.ad.picture
    ? `${process.env.NEXT_PUBLIC_PATH_IMAGE}${props.ad.picture}`
    : "/images/default/default.webp";
  const userImageUrl = props.ad.user.picture
    ? `${process.env.NEXT_PUBLIC_PATH_IMAGE}${props.ad.user.picture}`
    : "/images/default/avatar.webp";

  return (
    <>
      {props.ad && (
        <CardActionArea
          sx={{
            width: 280,
            height: 390,
          }}
          onClick={() => router.push(`/offer/${props.ad.id}`)}
        >
          <Card
            sx={{
              width: 280,
              height: 390,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 1,
            }}
          >
            {/* Picture */}
            <CardMedia
              component="img"
              sx={{
                width: "100%",
                height: 200,
                objectFit: "contain",
              }}
              image={adImageUrl}
              title={props.ad.title}
            />
            {/* Title */}
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
              variant="h6"
            >
              {props.ad.title}
            </Typography>
            {/* Price */}
            <Typography variant="body1" color="primary">
              {props.ad.price}€
            </Typography>
            {/* Coordinates & User */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* City and ZipCode */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "end",
                }}
              >
                <PlaceIcon sx={{ marginRight: "2px" }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                >{`${props.ad.city} ${props.ad.zipCode}`}</Typography>
              </Box>
              {/* User */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  alt={props.ad.user.nickName}
                  sx={{ width: "35px", height: "35px" }}
                  src={userImageUrl}
                />
                <Typography variant="body2" color="text.secondary">
                  {props.ad.user.nickName}
                </Typography>
              </Box>
            </Box>
          </Card>
        </CardActionArea>
      )}
    </>
  );
};

export default AdCard;
