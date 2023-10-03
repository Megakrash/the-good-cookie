import { CategoryTypes } from "@/types";
import Link from "next/link";

const NavCategories = (props: CategoryTypes): React.ReactNode => {
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
