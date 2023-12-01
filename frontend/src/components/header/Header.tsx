import NavSubCategories from "../subCategories/NavSubCategories";
import Link from "next/link";
import { CategoriesTypes } from "@/types/types";
import { useQuery } from "@apollo/client";
import { queryAllCatAndSub } from "../graphql/Categories";

export default function Header(): React.ReactNode {
  const { data, error, loading } = useQuery<{ items: CategoriesTypes }>(
    queryAllCatAndSub
  );

  const categories = data ? data.items : [];

  return (
    <header className="header">
      <div className="main-menu">
        <h1>
          <Link href="/" className="button logo link-button">
            <span className="mobile-short-label">TGC</span>
            <span className="desktop-long-label">THE GOOD CORNER</span>
          </Link>
        </h1>
        <Link href="/annonces/new" className="button link-button">
          <span className="desktop-long-label">Publier une annonce</span>
        </Link>
        <Link href="/inscription" className="button link-button">
          <span className="desktop-long-label">Mon compte</span>
        </Link>
        <Link href="/inscription/creation" className="button link-button">
          <span className="desktop-long-label">Créer un compte</span>
        </Link>
      </div>
    </header>
  );
}
