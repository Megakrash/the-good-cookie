import Link from "next/link";

export type AdCardProps = {
  id: number;
  title: string;
  description: string;
  owner: string;
  price: number;
  createdDate: string;
  picture: string;
  location: string;
  category: {
    id: number;
    name: string;
  };
  link: string;
};

const AdCard = (props: AdCardProps): React.ReactNode => {
  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" href={props.link}>
        <img className="ad-card-image" src={props.picture} />
        <div className="ad-card-text">
          <p className="ad-card-title">{props.title}</p>
          <p className="ad-card-price">{props.price} €</p>
          <p className="ad-card-price">{props.location} €</p>
        </div>
      </Link>
    </div>
  );
};

export default AdCard;
