import { UserFormData, UserTypes } from "@/types/UserTypes";
import { Box, CircularProgress } from "@mui/material";
import UserName from "../components/UserName";
import { FormEvent, useState } from "react";
import PictureDownload from "@/components/utils/PictureDownload";
import UserPhone from "../components/UserPhone";
import { useMutation } from "@apollo/client";
import { mutationUpdateUser } from "@/graphql/users/mutationUpdateUser";
import { queryMe } from "@/graphql/users/queryMe";
import { uploadPicture } from "@/components/utils/uploadPicture";
import { showToast } from "@/components/utils/toastHelper";
import { Toaster } from "react-hot-toast";
import { StepFormButton } from "@/styles/MuiButtons";
import { queryMeContext } from "@/graphql/users/queryMeContext";

type UserInfosAccountProps = {
  user: UserTypes;
};

const UserInfosAccount: React.FC<UserInfosAccountProps> = ({ user }) => {
  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [nickName, setNickName] = useState<string>(user.nickName);
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phoneNumber);
  const [currentPicture, setCurrentPicture] = useState<string>(user.picture);
  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // MUTATION
  const [doUpdate, { loading }] = useMutation(mutationUpdateUser, {
    refetchQueries: [{ query: queryMe }, { query: queryMeContext }],
  });

  // SUBMIT
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      let filename = null;
      if (picture) {
        filename = await uploadPicture(nickName, picture);
      }
      const data = {
        firstName: firstName,
        lastName: lastName,
        nickName: nickName,
        phoneNumber: phoneNumber,
        picture: filename ? filename : currentPicture,
      };
      const result = await doUpdate({
        variables: {
          data,
          userUpdateId: user.id,
        },
      });
      if ("id" in result.data?.item) {
        showToast("success", `Profil modifié avec succès`);
      }
    } catch (error) {
      if (error.message === "Failed to fetch") {
        showToast("error", "Erreur de connexion, veuillez réessayer");
      } else {
        showToast("error", "Erreur pendant la mise à jour du profil");
      }
    }
  }
  return (
    <Box
      component="form"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      onSubmit={onSubmit}
    >
      <Toaster />

      <UserName
        userName={firstName}
        setUserName={setFirstName}
        type="firstName"
      />
      <UserName userName={lastName} setUserName={setLastName} type="lastName" />
      <UserName userName={nickName} setUserName={setNickName} type="nickName" />
      <UserPhone phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
      <PictureDownload
        picture={picture}
        setPicture={setPicture}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        curentPicture={currentPicture}
        setCurentPicture={setCurrentPicture}
      />

      <StepFormButton>
        {loading ? <CircularProgress size={24} /> : "Modifier"}
      </StepFormButton>
    </Box>
  );
};

export default UserInfosAccount;
