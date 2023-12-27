import LayoutFull from "@/components/LayoutFull";
import UserConnection from "@/components/users/userConnexion/UserConnexion";

const SignUpPage = (): React.ReactNode => {
  return (
    <LayoutFull title="TGC : Connexion">
      <UserConnection />
    </LayoutFull>
  );
};

export default SignUpPage;
