import { AdTypes } from "@/types";
import Link from "next/link";
import Image from "next/image";
import DeleteAd from "./DeleteAd";

type AdCardProps = AdTypes & {
  onReRender: () => void;
};

const AdCard = (props: AdCardProps): React.ReactNode => {
  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" href={`/annonces/${props.id}`}>
        <Image
          className="ad-card-image"
          src={props.picture}
          width="200"
          height="200"
          alt={props.title}
        />
        <div className="ad-card-text">
          <p className="ad-card-title">{props.title}</p>
          <p className="ad-card-price">{props.price} €</p>
          <p className="ad-card-price">{props.location}</p>
        </div>
      </Link>
      <DeleteAd type={"ad"} id={props.id} onReRender={props.onReRender} />
    </div>
  );
};

export default AdCard;
