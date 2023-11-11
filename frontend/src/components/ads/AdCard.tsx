import { AdTypes } from "@/types";
import { PATH_IMAGE } from "@/configApi";
import Link from "next/link";
import DeleteAd from "./AdDelete";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { CardActionArea } from "@mui/material";

const AdCard = (props: AdTypes): React.ReactNode => {
  const adImageUrl = `${PATH_IMAGE}/ads/${props.picture}`;
  const userImageUrl = `${PATH_IMAGE}/users/${props.user.picture}`;
  return (
    <Card sx={{ width: 250 }}>
      <CardActionArea href={`/annonces/${props.id}`}>
        <CardMedia
          sx={{ maxHeight: 250, minHeight: 200, width: 250 }}
          image={adImageUrl}
          title={props.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {props.description}
          </Typography>
          <Avatar alt={props.user.nickName} src={userImageUrl} />
          <Typography variant="body2" color="text.secondary">
            {props.user.nickName}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Link href={`/annonces/${props.id}/edit`}>
          <Button size="small">{`Modifier`}</Button>
        </Link>
        <DeleteAd id={props.id} />
      </CardActions>
    </Card>
  );
};

export default AdCard;
