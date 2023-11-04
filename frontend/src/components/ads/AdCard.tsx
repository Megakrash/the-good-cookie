import { AdTypes } from "@/types";
import { PATH_IMAGE } from "@/configApi";
import Link from "next/link";
import Image from "next/image";
import DeleteAd from "./AdDelete";

const AdCard = (props: AdTypes): React.ReactNode => {
  const picPath = `${PATH_IMAGE}ads/`;
  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" href={`/annonces/${props.id}`}>
        <Image
          className="ad-card-image"
          src={picPath + props.picture}
          width="200"
          height="200"
          alt={props.title}
        />
        <div className="ad-card-text">
          <p className="ad-card-title">{props.title}</p>
          <p className="ad-card-price">{props.price} €</p>
          <p className="ad-card-price">{props.location}</p>
          {props.tags.map((tag) => (
            <p key={tag.id} className="ad-card-price">
              {tag.name}
            </p>
          ))}
        </div>
      </Link>
      <DeleteAd id={props.id} />
      <Link href={`/annonces/${props.id}/edit`}>Modifier mon annonce</Link>
    </div>
  );
};

export default AdCard;
