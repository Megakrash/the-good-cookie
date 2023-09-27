import { CategoriesTypes } from "@/types";
import Link from "next/link";

const NavCategories = (props: CategoriesTypes): React.ReactNode => {
  return (
    <>
      {" "}
      <Link
        href={`/categories/${props.id}`}
        className="category-navigation-link"
      >
        {props.name}
      </Link>
    </>
  );
};

export default NavCategories;
