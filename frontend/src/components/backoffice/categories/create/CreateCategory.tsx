import { FormEvent, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BackOfficeInput from "../../components/BackOfficeInput";
import { useMutation } from "@apollo/client";
import { CategoryFormData } from "@/types/CategoryTypes";
import {
  mutationCreateCategory,
  queryAllCatWithHierarchy,
} from "@/graphql/Categories";
import { StepFormButton } from "@/styles/MuiButtons";
import { Toaster } from "react-hot-toast";
import { showToast } from "@/components/utils/toastHelper";
import CategorySelect from "../../components/CategorySelect";

const CreateCategories = (): React.ReactNode => {
  // State
  const [name, setName] = useState<string>("");
  const [parentCategory, setParentCategory] = useState<number | null>(null);
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
  const [doCreate, { loading }] = useMutation(mutationCreateCategory, {
    refetchQueries: [{ query: queryAllCatWithHierarchy }],
  });

  // SUBMIT
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data: CategoryFormData = {
        name: name,
        parentCategory: parentCategory ? { id: parentCategory } : null,
      };

      const result = await doCreate({
        variables: {
          data,
        },
      });
      if ("id" in result.data?.item) {
        showToast("success", `Catégorie ${name} créée avec succès`);
        setName("");
        setParentCategory(null);
      }
    } catch (error) {
      if (error.message === "Category name already in use") {
        showToast("error", `La catégorie ${name} existe déjà`);
        setName("");
        setParentCategory(null);
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
      <CategorySelect
        selectedCategory={parentCategory}
        setSelectedCategory={setParentCategory}
      />
      <StepFormButton disabled={!isFormValid}>
        {loading ? <CircularProgress size={24} /> : "Créer"}
      </StepFormButton>
    </Box>
  );
};

export default CreateCategories;
