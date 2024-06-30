import React from "react";
import { AdTypes } from "@/types/AdTypes";
import {
  Box,
  CardMedia,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import UserCard from "../users/userCard/UserCard";
import PlaceIcon from "@mui/icons-material/Place";
import { transformerDate } from "../utils/dateUtils";
import BuyContactCard from "./components/BuyContactCard";
import { PATH_IMAGE } from "@/api/configApi";
import Chat from "../chat/Chat";

type AdPageProps = {
  ad: AdTypes;
};

const AdPage: React.FC<AdPageProps> = ({ ad }) => {
  const theme = useTheme();
  const [showChat, setShowChat] = React.useState(false);
  const adImageUrl = `${PATH_IMAGE}${ad.picture}`;
  const updatedAt = transformerDate(ad.updatedAt);
  return (
    <Grid
      container
      item
      xs={11}
      sm={12}
      md={12}
      lg={10}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        margin: "auto",
        marginTop: 5,
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        },
      }}
    >
      <Grid
        item
        xs={11}
        sm={11}
        md={6}
        lg={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Picture */}
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: 350,
            objectFit: "contain",
            borderRadius: "10px",
          }}
          image={adImageUrl}
          title={ad.title}
        />
        <Divider />
        {/* Box Title & Price & Date */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
            variant="h5"
          >
            {ad.title}
          </Typography>
          {/* Price */}
          <Typography variant="h6">{ad.price}€</Typography>
          {/* Update date */}
          <Typography variant="body2">{`Mise à jour le ${updatedAt}`}</Typography>
        </Box>
        <Divider />
        {/* Box Description & Address */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Description */}
          <Typography variant="h6">Description</Typography>
          {/* Address */}
          <Typography variant="subtitle1">{ad.description}</Typography>
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
            >{`${ad.city} ${ad.zipCode}`}</Typography>
          </Box>
        </Box>
        <Divider />
      </Grid>
      {/* UserCard & BuyContactCard */}
      <Grid item xs={11} sm={0} md={5} lg={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <UserCard user={ad.user} />
          <BuyContactCard ad={ad} />
          {showChat && <Chat receiverId={ad.user.id} adId={ad.id} />}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdPage;
