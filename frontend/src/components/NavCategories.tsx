import Link from "next/link";

export type NavCategoriesProps = {
  id: number;
  name: string;
  link: string;
};

const NavCategories = (props: NavCategoriesProps): React.ReactNode => {
  return (
    <>
      {" "}
      <Link href={props.link} className="category-navigation-link">
        {props.name}
      </Link>
    </>
  );
};

export default NavCategories;
