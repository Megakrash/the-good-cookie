import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import AdminProtection from "@/components/backoffice/AdminProtection";
import UpdateCategory from "@/components/backoffice/categories/update/UpdateCategory";
import { CategoryTypes } from "@/types/CategoryTypes";
import { queryCatByIdWithParent } from "@/graphql/categories/queryCatByIdWithParent";
import LoadingApp from "@/styles/LoadingApp";

const EditCategory = (): React.ReactNode => {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery<{ item: CategoryTypes }>(
    queryCatByIdWithParent,
    {
      variables: { categoryByIdId: id },
    },
  );
  if (loading) return <LoadingApp />;

  const category = data ? data.item : null;

  return (
    <>
      <UpdateCategory category={category} />
    </>
  );
};

export default AdminProtection(EditCategory);
