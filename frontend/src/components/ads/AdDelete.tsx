import { ReactNode } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { mutationDeleteAd, queryAllAds } from "../graphql/Ads";

type DeleteAdProps = {
  id: number;
};

const DeleteAd = (props: DeleteAdProps): ReactNode => {
  const [doDelete] = useMutation(mutationDeleteAd, {
    refetchQueries: [queryAllAds],
  });

  async function deleteAd() {
    await doDelete({
      variables: {
        adDeleteId: props.id,
      },
    });
  }

  return (
    <button className="" type="button" onClick={deleteAd}>
      <FaTrashAlt />
    </button>
  );
};
export default DeleteAd;
