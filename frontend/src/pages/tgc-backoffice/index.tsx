import BackOfficeDashboard from "@/components/backoffice/dashboard/BackOccideDashBoard";
import AdminProtection from "@/components/backoffice/AdminProtection";

const BackOfficePage = (): React.ReactNode => {
  return (
    <>
      <BackOfficeDashboard />
    </>
  );
};

export default AdminProtection(BackOfficePage);
