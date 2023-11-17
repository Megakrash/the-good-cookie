import { ReactNode } from "react";
import { useMutation } from "@apollo/client";
import { mutationDeleteAd, queryAllAds } from "../graphql/Ads";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <CardActions>
      <Button
        startIcon={<DeleteIcon />}
        type="button"
        onClick={deleteAd}
        size="small"
      >{`Effacer`}</Button>
    </CardActions>
  );
};
export default DeleteAd;
