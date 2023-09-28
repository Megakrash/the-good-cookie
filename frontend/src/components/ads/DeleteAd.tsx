import { API_URL } from "@/configApi";
import axios from "axios";
import { ReactNode } from "react";
import { FaTrashAlt } from "react-icons/fa";

type DeleteAdProps = {
  type: "ad" | "category";
  id: number;
  onReRender: () => void;
};

const DeleteAd = (props: DeleteAdProps): ReactNode => {
  const deleteAd = () => {
    axios
      .delete(`${API_URL}/annonces/${props.id}`)
      .then(() => {
        props.onReRender();
      })
      .catch(() => {
        console.error("error");
      });
  };

  return (
    <button
      className=""
      type="button"
      onClick={() => {
        deleteAd();
      }}
    >
      <FaTrashAlt />
    </button>
  );
};
export default DeleteAd;
