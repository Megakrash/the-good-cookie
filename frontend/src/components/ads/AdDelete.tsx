import { ReactNode } from "react";
import { useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { mutationDeleteAd } from "@/graphql/ads/mutationDeleteAd";
import { queryAllAds } from "@/graphql/ads/queryAllAds";
import { queryAdByUser } from "@/graphql/ads/queryAdByUser";

type DeleteAdProps = {
  id: string;
};

function DeleteAd(props: DeleteAdProps): ReactNode {
  const [doDelete] = useMutation(mutationDeleteAd, {
    refetchQueries: [queryAllAds, queryAdByUser],
  });

  async function deleteAd() {
    await doDelete({
      variables: {
        adDeleteId: props.id,
      },
    });
  }

  return (
    <Button
      startIcon={<DeleteIcon />}
      type="button"
      onClick={deleteAd}
      size="small"
    >
      Supprimer
    </Button>
  );
}
export default DeleteAd;
