import LayoutFull from "@/components/layout/LayoutFull";
import UserAccount from "@/components/users/userAccount/UserAccount";

function AccountPage(): React.ReactNode {
  return (
    <LayoutFull title="TGC : Connexion">
      <UserAccount />
    </LayoutFull>
  );
}

export default AccountPage;
