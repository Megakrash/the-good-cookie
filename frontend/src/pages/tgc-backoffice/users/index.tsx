import AdminProtection from "@/components/backoffice/AdminProtection";
import BackOfficeUsersList from "@/components/backoffice/users/list/BackOfficeUsersList";

const BackOfficeUsersPage = (): React.ReactNode => {
  return (
    <>
      <BackOfficeUsersList />
    </>
  );
};

export default AdminProtection(BackOfficeUsersPage);
