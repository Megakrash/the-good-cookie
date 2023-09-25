import Link from "next/link";

export type NavCategoriesProps = {
  id: number;
  title: string;
  link: string;
};

const NavCategories = (props: NavCategoriesProps): React.ReactNode => {
  return (
    <>
      {" "}
      <Link href={props.link} className="category-navigation-link">
        {props.title}
      </Link>{" "}
      •
    </>
  );
};

export default NavCategories;
