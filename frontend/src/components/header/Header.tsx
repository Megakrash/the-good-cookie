import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useMutation } from "@apollo/client";
import { mutationSignOut, queryMeContext } from "../graphql/Users";

export default function Header(): React.ReactNode {
  const [doSignout] = useMutation(mutationSignOut, {
    refetchQueries: [queryMeContext],
  });
  async function logout() {
    doSignout();
  }

  return (
    <header className="header">
      <div className="main-menu">
        <h1>
          <Link href="/" className="button logo link-button">
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
        <Link href="/connexion" className="button link-button">
          <span className="desktop-long-label">Connexion</span>
        </Link>
        <Link href="/contact" className="button link-button">
          <span className="desktop-long-label">Contact</span>
        </Link>
        <IconButton onClick={logout} color="primary" aria-label="Logout">
          <ExitToAppIcon fontSize="inherit" />
        </IconButton>
      </div>
    </header>
  );
}
