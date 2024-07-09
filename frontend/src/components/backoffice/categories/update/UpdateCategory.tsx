import { FormEvent, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BackOfficeInput from "../../components/BackOfficeInput";
import { useMutation } from "@apollo/client";
import { CategoryFormData, CategoryTypes } from "@/types/CategoryTypes";
import { queryAllCatWithHierarchy } from "@/graphql/categories/queryAllCatWithHierarchy";
import { StepFormButton } from "@/styles/MuiButtons";
import { Toaster } from "react-hot-toast";
import { showToast } from "@/components/utils/toastHelper";
import CategorySelect from "../../../utils/CategorySelect";
import PictureDownload from "@/components/utils/PictureDownload";
import { uploadPicture } from "@/components/utils/uploadPicture";
import router from "next/router";
import { mutationUpdateCategory } from "@/graphql/categories/mutationUpdateCategory";
import { queryAllCategories } from "@/graphql/categories/queryAllCategories";
import DisplaySwitch from "@/components/utils/DisplaySwitch";

type UpdateCategoryProps = {
  category: CategoryTypes;
};

const UpdateCategories: React.FC<UpdateCategoryProps> = ({ category }) => {
  useEffect(() => {
    if (category) {
      setName(category.name);
      setCurentPicture(category.picture ? category.picture : null);
      setParentCategory(
        category.parentCategory ? category.parentCategory.id : null,
      );
      setDisplay(category.display);
    }
  }, [category]);

  // State
  const [name, setName] = useState<string>("");
  const [display, setDisplay] = useState<boolean | null>(null);
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [curentPicture, setCurentPicture] = useState<string | null>(null);
  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
  const [doUpdate, { loading }] = useMutation(mutationUpdateCategory, {
    refetchQueries: [
      { query: queryAllCatWithHierarchy },
      { query: queryAllCategories },
    ],
  });

  // SUBMIT
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      let filename = null;
      if (picture) {
        filename = await uploadPicture(name, picture);
      }
      const data: CategoryFormData = {
        name: name,
        display: display,
        parentCategory: parentCategory ? { id: parentCategory } : null,
        picture: filename ? filename : curentPicture,
      };
      const result = await doUpdate({
        variables: {
          data,
          categoryUpdateId: category.id,
        },
      });
      if ("id" in result.data?.item) {
        showToast("success", `Catégorie ${name} modifiée avec succès`);
      }
    } catch (error) {
      if (error.message === "Failed to fetch") {
        showToast("error", "Erreur de connexion, veuillez réessayer");
      } else {
        showToast("error", "Erreur pendant la mise à jour de la catégorie");
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
        Modifier une catégorie
      </Typography>
      <BackOfficeInput data={name} setData={setName} label="Nom" />
      <CategorySelect
        type="createCategory"
        selectedCategory={parentCategory}
        setSelectedCategory={setParentCategory}
      />
      <DisplaySwitch display={display} setDisplay={setDisplay} />
      <PictureDownload
        picture={picture}
        setPicture={setPicture}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        curentPicture={curentPicture}
        setCurentPicture={setCurentPicture}
      />
      <StepFormButton disabled={!isFormValid}>
        {loading ? <CircularProgress size={24} /> : "Modifier"}
      </StepFormButton>
    </Box>
  );
};

export default UpdateCategories;
