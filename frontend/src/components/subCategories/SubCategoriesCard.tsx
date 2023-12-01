import { SubCategoryTypes } from "@/types/types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { PATH_IMAGE } from "@/api/configApi";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";

const SubCategoriesCard = (props: SubCategoryTypes): React.ReactNode => {
  const picturePath: string = `${PATH_IMAGE}/subCategory/${props.picture}`;
  return (
    <Card sx={{ width: 280, marginBottom: "25px" }}>
      <CardActionArea href={`/sousCategories/${props.id}`}>
        <CardContent>
          <Typography
            sx={{ textAlign: "center" }}
            gutterBottom
            variant="h4"
            component="div"
          >
            {props.name}
          </Typography>
          <CardMedia
            sx={{ minHeight: 200, width: "auto" }}
            image={picturePath}
            title={props.name}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SubCategoriesCard;
