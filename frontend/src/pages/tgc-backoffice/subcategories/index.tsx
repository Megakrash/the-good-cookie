import BackOfficeSubCategories from "@/components/backoffice/subCategories/BackOfficeSubCategories";
import AdminProtection from "@/components/backoffice/AdminProtection";

const BackOfficeSubCategoriesPage = (): React.ReactNode => {
  return (
    <>
      <BackOfficeSubCategories />
    </>
  );
};

export default AdminProtection(BackOfficeSubCategoriesPage);
