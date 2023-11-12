import { AdTypes } from "@/types";
import { PATH_IMAGE } from "@/configApi";
// import Link from "next/link";
// import DeleteAd from "./AdDelete";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Box, CardActionArea } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

type AdCardProps = {
  ad?: AdTypes;
};

const AdCard = (props: AdCardProps): React.ReactNode => {
  const adImageUrl = `${PATH_IMAGE}/ads/${props.ad.picture}`;
  const userImageUrl = `${PATH_IMAGE}/users/${props.ad.user.picture}`;

  function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  return (
    <CardActionArea
      sx={{
        width: 332,
      }}
      href={`/annonces/${props.ad.id}`}
    >
      <Card
        sx={{
          width: 330,
          height: 380,
          "&:hover": {
            border: (theme) => `2px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        <CardMedia
          sx={{
            width: "100%",
            height: 200,
            margin: "auto",
            objectFit: "contain",
          }}
          image={adImageUrl}
          title={props.ad.title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="body1"
            color="text.secondary"
            component="div"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <PlaceIcon sx={{ marginRight: "4px" }} />{" "}
              {capitalizeFirstLetter(props.ad.location)}
            </Box>
          </Typography>
          <Typography
            sx={{
              height: "75px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
            variant="h5"
          >
            {props.ad.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1" color="primary">
              {props.ad.price}€
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar alt={props.ad.user.nickName} src={userImageUrl} />
              <Typography variant="body2" color="text.secondary">
                {props.ad.user.nickName}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
    //  <CardActions>
    //       <Link href={`/annonces/${props.id}/edit`}>
    //         <Button size="small">{`Modifier`}</Button>
    //       </Link>
    //       <DeleteAd id={props.id} />
    //     </CardActions>
  );
};

export default AdCard;
