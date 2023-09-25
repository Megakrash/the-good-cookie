import Link from "next/link";

export type AdCardProps = {
  id: number;
  title: string;
  imgUrl: string;
  price: number;
  link: string;
};

const AdCard = (props: AdCardProps): React.ReactNode => {
  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" href={props.link}>
        <img className="ad-card-image" src={props.imgUrl} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-price">{props.price} €</div>
        </div>
      </Link>
    </div>
  );
};

export default AdCard;
