import Link from 'next/link';

type NavSubcategoriesProps = {
  id: number;
  name: string;
};

function NavSubCategories(props: NavSubcategoriesProps): React.ReactNode {
  return (
    <>
      {' '}
      <Link
        href={`/sousCategories/${props.id}`}
        className="category-navigation-link"
      >
        {props.name}
      </Link>
    </>
  );
}

export default NavSubCategories;
