import CreateCategories from "@/components/backoffice/categories/create/CreateCategory";
import AdminProtection from "@/components/backoffice/AdminProtection";

const CreateCategoriesPage = (): React.ReactNode => {
  return (
    <>
      <CreateCategories />
    </>
  );
};

export default AdminProtection(CreateCategoriesPage);
