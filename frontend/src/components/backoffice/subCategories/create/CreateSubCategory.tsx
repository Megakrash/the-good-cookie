import { FormEvent, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import BackOfficeInput from "../../components/BackOfficeInput";
import UserAvatar from "@/components/users/components/UserAvatar";
import { useMutation, useQuery } from "@apollo/client";
import { CategoriesTypes } from "@/types/CategoryTypes";
import { queryAllCat } from "@/graphql/Categories";
import { StepFormButton } from "@/styles/MuiButtons";
import { uploadPicture } from "@/components/utils/uploadPicture";
import { SubCategoryFormData } from "@/types/SubCategoryTypes";
import { mutationCreateSubCategory } from "@/graphql/SubCategories";
import { Toaster } from "react-hot-toast";
import { showToast } from "@/components/utils/toastHelper";

const CreateSubCategories = (): React.ReactNode => {
  // Get all categories
  const { data } = useQuery<{ items: CategoriesTypes }>(queryAllCat);
  const categories = data ? data.items : [];
  // State
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Form validation
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Check if form is valid
  useEffect(() => {
    if (name && categoryId && picture) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, categoryId, picture]);

  // CREATE
  const [doCreate, { loading }] = useMutation(mutationCreateSubCategory);

  // SUBMIT
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const pictureId = await uploadPicture(name, picture);

      const data: SubCategoryFormData = {
        name,
        category: { id: categoryId },
        pictureId,
      };

      const result = await doCreate({
        variables: {
          data,
        },
      });
      if ("id" in result.data?.item) {
        showToast("success", `Sous-catégorie ${name} créée avec succès`);
        setName("");
        setCategoryId(undefined);
        setPicture(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      showToast("error", "Erreur pendant la création de la sous-catégorie");
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
        Ajouter une sous-catégorie
      </Typography>
      <BackOfficeInput data={name} setData={setName} label="Nom" />
      <FormControl fullWidth>
        <InputLabel id="subcategory-select-label">Catégorie*</InputLabel>
        <Select
          labelId="subcategory-select-label"
          id="subcategory-select"
          value={categoryId || ""}
          onChange={(e) =>
            setCategoryId(
              e.target.value === "" ? undefined : Number(e.target.value),
            )
          }
          label="Sélectionnez une catégorie"
          required
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ width: "100%" }}>
        <UserAvatar
          picture={picture}
          setPicture={setPicture}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />
      </Box>
      <StepFormButton disabled={!isFormValid}>
        {loading ? <CircularProgress size={24} /> : "Créer"}
      </StepFormButton>
    </Box>
  );
};

export default CreateSubCategories;
