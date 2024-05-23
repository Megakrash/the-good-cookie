import { FormEvent, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BackOfficeInput from "../../components/BackOfficeInput";
import { useMutation } from "@apollo/client";
import { CategoryFormData } from "@/types/CategoryTypes";
import { mutationCreateCategory } from "@/graphql/Categories";
import { StepFormButton } from "@/styles/MuiButtons";
import { Toaster } from "react-hot-toast";
import { showToast } from "@/components/utils/toastHelper";

const CreateCategories = (): React.ReactNode => {
  // State
  const [name, setName] = useState<string>("");
  // Form validation
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Check if form is valid
  useEffect(() => {
    if (name) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name]);

  // CREATE
  const [doCreate, { loading }] = useMutation(mutationCreateCategory);

  // SUBMIT
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data: CategoryFormData = {
        name: name,
      };

      const result = await doCreate({
        variables: {
          data,
        },
      });
      if ("id" in result.data?.item) {
        showToast("success", `Catégorie ${name} créée avec succès`);
        setName("");
      }
    } catch (error) {
      if (error.message === "Category name already in use") {
        showToast("error", `La catégorie ${name} existe déjà`);
        setName("");
      }
      if (error.message === "Failed to fetch") {
        showToast("error", "Erreur de connexion, veuillez réessayer");
      } else {
        showToast("error", "Erreur pendant la création de la catégorie");
      }
    }
  }
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 450,
        gap: 3,
      }}
      onSubmit={onSubmit}
    >
      <Toaster />
      <Typography
        variant="h5"
        textAlign={"center"}
        fontWeight={600}
        gutterBottom
        mt={2}
      >
        Ajouter une catégorie
      </Typography>
      <BackOfficeInput data={name} setData={setName} label="Nom" />
      <StepFormButton disabled={!isFormValid}>
        {loading ? <CircularProgress size={24} /> : "Créer"}
      </StepFormButton>
    </Box>
  );
};

export default CreateCategories;
