import { UserTypes } from "@/types/UserTypes";
import { Avatar, Box, Card, CardActionArea, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React from "react";
import { PATH_IMAGE } from "@/api/configApi";

type UserCardProps = {
  user: UserTypes;
};

const UserCard = (props: UserCardProps): React.ReactNode => {
  const userImageUrl = `${PATH_IMAGE}/${props.user.picture.filename}`;
  const totalAds = props.user.ads?.length || 0;
  return (
    <CardActionArea
      sx={{
        width: 350,
      }}
      href={`/user/${props.user.id}`}
    >
      <Card
        sx={{
          width: 350,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Avatar
            alt={props.user.nickName}
            sx={{ width: "65px", height: "65px" }}
            src={userImageUrl}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {props.user.nickName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${totalAds} annonces`}
            </Typography>
          </Box>
        </Box>
        <ArrowForwardIosIcon />
      </Card>
    </CardActionArea>
  );
};

export default UserCard;
