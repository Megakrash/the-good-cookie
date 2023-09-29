import { SubCategoriesTypes } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { PATH_IMAGE } from "@/configApi";

const SubCategoriesCard = (props: SubCategoriesTypes): React.ReactNode => {
  const picturePath: string = `${PATH_IMAGE}subCategory/`;
  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" href={`/sousCategories/${props.id}`}>
        <Image
          className="ad-card-image"
          src={picturePath + props.picture}
          width="100"
          height="100"
          alt={props.name}
        />
        <div className="ad-card-text">
          <p className="ad-card-title">{props.name}</p>
        </div>
      </Link>
    </div>
  );
};

export default SubCategoriesCard;
