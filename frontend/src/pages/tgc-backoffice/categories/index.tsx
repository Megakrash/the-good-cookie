import BackOfficeCategories from "@/components/backoffice/categories/BackOfficeCategories";
import AdminProtection from "@/components/backoffice/AdminProtection";

const BackOfficeCategoriesPage = (): React.ReactNode => {
  return (
    <>
      <BackOfficeCategories />
    </>
  );
};

export default AdminProtection(BackOfficeCategoriesPage);
