import CreateSubCategories from "@/components/backoffice/subCategories/create/CreateSubCategory";
import AdminProtection from "@/components/backoffice/AdminProtection";

const CreateSubCategoriesPage = (): React.ReactNode => {
  return (
    <>
      <CreateSubCategories />
    </>
  );
};

export default AdminProtection(CreateSubCategoriesPage);
