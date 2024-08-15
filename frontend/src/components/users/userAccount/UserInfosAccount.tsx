import { UserTypes, UserUpdateFormData } from "@/types/UserTypes";
import { Box, CircularProgress } from "@mui/material";
import UserName from "../components/UserName";
import { FormEvent, useEffect, useState } from "react";
import PictureDownload from "@/components/utils/PictureDownload";
import UserPhone from "../components/UserPhone";
import { useMutation } from "@apollo/client";
import { mutationUpdateUser } from "@/graphql/users/mutationUpdateUser";
import { queryMe } from "@/graphql/users/queryMe";
import { uploadPicture } from "@/components/utils/uploadPicture";
import { showToast } from "@/components/utils/toastHelper";
import { Toaster } from "react-hot-toast";
import { GreyBtnOrangeHover, StepFormButton } from "@/styles/MuiButtons";
import { queryMeContext } from "@/graphql/users/queryMeContext";
import UserPassword from "../components/UserPassword";

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
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  // HANDLE PASSWORD
  const updatePassword = () => {
    setShowNewPassword(!showNewPassword);
  };
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
      const data: UserUpdateFormData = {
        firstName: firstName,
        lastName: lastName,
        nickName: nickName,
        phoneNumber: phoneNumber,
        picture: filename ? filename : currentPicture,
        currentPassword: currentPassword ? currentPassword : null,
        newPassword: newPassword ? newPassword : null,
      };
      const result = await doUpdate({
        variables: {
          data,
          userUpdateId: user.id,
        },
      });
      if ("id" in result.data?.item) {
        showToast("success", `Profil modifié avec succès`);
        setNewPassword("");
        setCurrentPassword("");
        setShowNewPassword(false);
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
      <GreyBtnOrangeHover onClick={updatePassword} type="button">
        Modifier mon mot de passe
      </GreyBtnOrangeHover>
      {showNewPassword && (
        <>
          <UserPassword
            password={currentPassword}
            setPassword={setCurrentPassword}
            label="Mot de passe actuel"
          />
          <UserPassword
            password={newPassword}
            setPassword={setNewPassword}
            label="Nouveau mot de passe"
          />
        </>
      )}
      <PictureDownload
        picture={picture}
        setPicture={setPicture}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        curentPicture={currentPicture}
        setCurentPicture={setCurrentPicture}
      />
      <StepFormButton disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Modifier"}
      </StepFormButton>
    </Box>
  );
};

export default UserInfosAccount;
