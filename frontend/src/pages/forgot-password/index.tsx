import ForgotPassword from "@/components/users/forgotPassword/ForgotPassword";
import LayoutFull from "@/components/layout/LayoutFull";

function ForgotPasswordPage(): React.ReactNode {
  return (
    <LayoutFull title="TGC : Mot de passe oublié">
      <ForgotPassword />
    </LayoutFull>
  );
}

export default ForgotPasswordPage;
