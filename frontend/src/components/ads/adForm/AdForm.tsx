import React, { FormEvent, useEffect, useState } from "react";
import { AdFormData, AdTypes, AdTags } from "@/types/AdTypes";
import { Toaster } from "react-hot-toast";
import {
  queryAllAds,
  queryAdById,
  mutationCreateAd,
  mutationUpdateAd,
} from "@/graphql/Ads";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Box, CircularProgress, Typography } from "@mui/material";
import UserZipCity from "@/components/users/components/UserZipCity";
import AdTitle from "./components/AdTitle";
import AdDescription from "./components/AdDescription";
import AdPrice from "./components/AdPrice";
import { uploadPicture } from "@/components/utils/uploadPicture";
import { showToast } from "@/components/utils/toastHelper";
import CategorySelect from "@/components/utils/CategorySelect";
import TagSelect from "@/components/utils/TagSelect";
import PictureDownload from "@/components/utils/PictureDownload";
import { StepFormButton } from "@/styles/MuiButtons";

type AdFormProps = {
  ad?: AdTypes;
};

const AdForm = (props: AdFormProps): React.ReactNode => {
  const router = useRouter();

  // Form
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [curentPicture, setCurentPicture] = useState<string>("");
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [zipCode, setZipCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
  const [selectedCategory, setSelectedCategory] = useState<null | number>();
  const [selectedTags, setSelectedTags] = useState<AdTags>([]);
  // Form validation
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  useEffect(() => {
    if (
      title &&
      description &&
      price &&
      zipCode &&
      selectedCategory &&
      (curentPicture || newPicture)
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [title, description, price, zipCode, selectedCategory, newPicture]);

  // Submit & Update queries

  const [doCreate, { loading: createLoading }] = useMutation(mutationCreateAd, {
    refetchQueries: [queryAllAds],
  });
  const [doUpdate, { loading: updateLoading }] = useMutation(mutationUpdateAd, {
    refetchQueries: [queryAdById, queryAllAds],
  });
  const loading = createLoading || updateLoading;

  // SUBMIT
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const pictureId = await uploadPicture(title, newPicture);

      const data: AdFormData = {
        title,
        description,
        price,
        city,
        zipCode,
        location: { type: "Point", coordinates: coordinates },
        category: selectedCategory ? { id: Number(selectedCategory) } : null,
        tags: selectedTags,
        ...(pictureId !== null && { pictureId }),
      };

      if (!props.ad) {
        const result = await doCreate({
          variables: {
            data,
          },
        });
        if ("id" in result.data?.item) {
          router.push(`/annonces/${result.data.item.id}`);
        } else {
          showToast("error", "Erreur pendant la création de votre annonce");
        }
      } else {
        const result = await doUpdate({
          variables: {
            data,
            adUpdateId: props.ad?.id,
          },
        });
        if (!result.errors?.length) {
          showToast("success", "Annonce mise à jour");
        } else {
          showToast("error", "Erreur pendant la mise à jour de votre annonce");
        }
      }
    } catch (error) {
      console.error("error", error);
      showToast("error", "Erreur pendant la création de votre annonce");
    }
  }
  // If update Ad
  useEffect(() => {
    if (props.ad) {
      setTitle(props.ad.title);
      setDescription(props.ad.description);
      setZipCode(props.ad.zipCode);
      setCoordinates(props.ad.coordinates);
      setCity(props.ad.city);
      setPrice(props.ad.price);
      setCurentPicture(props.ad.picture.filename);
      setSelectedCategory(props.ad.category ? props.ad.category.id : null);
      const transformedTags = props.ad.tags.map((tag) => ({ id: tag.id }));
      setSelectedTags(transformedTags);
    }
  }, [props.ad]);
  return (
    <Box
      sx={{
        width: props.ad ? "50%" : "98%",
        margin: "auto",
      }}
    >
      <Toaster />

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          "& > :not(style)": { m: 2, width: "50ch" },
        }}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <Typography variant="h4">
          {!props.ad ? "Création de votre annonce" : "Modifier votre annonce"}
        </Typography>
        <AdTitle title={title} setTitle={setTitle} />
        <AdDescription
          description={description}
          setDescription={setDescription}
        />
        <AdPrice price={price} setPrice={setPrice} />
        <UserZipCity
          zipCode={zipCode}
          setCity={setCity}
          setZipCode={setZipCode}
          setCoordinates={setCoordinates}
        />
        <CategorySelect
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          type="createAd"
        />
        <TagSelect
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <PictureDownload
          picture={newPicture}
          setPicture={setNewPicture}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          curentPicture={curentPicture}
          setCurentPicture={setCurentPicture}
        />
        <StepFormButton
          sx={{ margin: "auto" }}
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : props.ad ? (
            "Modifier mon annonce"
          ) : (
            "Créer mon annonce"
          )}
        </StepFormButton>
      </Box>
    </Box>
  );
};

export default AdForm;
