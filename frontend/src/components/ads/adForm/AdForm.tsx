import React, { FormEvent, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  AdTypes,
  AdTags,
  AdCreateFormData,
  AdUpdateFormData,
} from "@/types/AdTypes";
import {
  queryAllAds,
  queryAdById,
  mutationCreateAd,
  mutationUpdateAd,
} from "@/graphql/Ads";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import UserZipCity from "@/components/users/components/UserZipCity";
import AdTitle from "./components/AdTitle";
import AdDescription from "./components/AdDescription";
import AdPrice from "./components/AdPrice";
import { showToast } from "@/components/utils/toastHelper";
import { uploadPicture } from "@/components/utils/uploadPicture";
import CategorySelect from "@/components/utils/CategorySelect";
import TagSelect from "@/components/utils/TagSelect";
import PictureDownload from "@/components/utils/PictureDownload";
import { Box, CircularProgress, Typography } from "@mui/material";
import { StepFormButton } from "@/styles/MuiButtons";
type AdFormProps = {
  ad?: AdTypes;
};

const AdForm: React.FC<AdFormProps> = ({ ad }) => {
  const router = useRouter();

  // Form states
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

  // Check for tag modifications
  const tagsChanged = (newTags: AdTags, oldTags: AdTags) => {
    if (newTags.length !== oldTags.length) return true;
    const newTagIds = newTags.map((tag) => tag.id).sort();
    const oldTagIds = oldTags.map((tag) => tag.id).sort();
    return !newTagIds.every((id, index) => id === oldTagIds[index]);
  };

  // SUBMIT
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // If newAd
    if (!ad) {
      try {
        const pictureId = await uploadPicture(title, newPicture);

        const data: AdCreateFormData = {
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

        const result = await doCreate({
          variables: {
            data,
          },
        });
        if ("id" in result.data?.item) {
          router.push(`/ads/${result.data.item.id}`);
        } else {
          showToast("error", "Erreur pendant la création de votre annonce");
        }
      } catch (error) {
        console.error("error", error);
        showToast("error", "Erreur pendant la création de votre annonce");
      }
    }
    // If update Ad
    if (ad) {
      try {
        let pictureId = null;
        if (newPicture) {
          pictureId = await uploadPicture(title, newPicture);
        }
        const data: AdUpdateFormData = {};
        if (title !== ad.title) data.title = title;

        if (description !== ad.description) data.description = description;

        if (price !== ad.price) data.price = price;

        if (city !== ad.city) data.city = city;

        if (zipCode !== ad.zipCode) data.zipCode = zipCode;

        if (coordinates !== ad.location.coordinates) {
          data.location = { type: "Point", coordinates: coordinates };
        }
        if (selectedCategory !== ad.category.id) {
          data.category = { id: Number(selectedCategory) };
        }
        if (tagsChanged(selectedTags, ad.tags)) {
          data.tags = selectedTags;
        }
        if (pictureId !== null) data.pictureId = pictureId;

        const result = await doUpdate({
          variables: {
            data,
            adUpdateId: ad?.id,
          },
        });
        if (!result.errors?.length) {
          showToast("success", "Annonce mise à jour");
        } else {
          showToast("error", "Erreur pendant la mise à jour de votre annonce");
        }
      } catch (error) {
        console.error("error", error);
        showToast("error", "Erreur pendant la création de votre annonce");
      }
    }
  }
  // If update Ad
  useEffect(() => {
    if (ad) {
      const transformedTags = ad.tags.map((tag) => ({ id: tag.id }));
      setTitle(ad.title);
      setDescription(ad.description);
      setZipCode(ad.zipCode);
      setCoordinates(ad.location.coordinates);
      setCity(ad.city);
      setPrice(ad.price);
      setCurentPicture(ad.picture.filename);
      setSelectedCategory(ad.category.id);
      setSelectedTags(transformedTags);
    }
  }, [ad]);
  return (
    <Box
      sx={{
        width: ad ? "50%" : "98%",
      }}
    >
      <Toaster />

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          "& > :not(style)": { m: 2, width: "380px" },
        }}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <Typography textAlign={"center"} variant="h4">
          {!ad ? "Création de votre annonce" : "Modifier votre annonce"}
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
          type={ad ? "updateAd" : "createAd"}
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
        <StepFormButton disabled={loading || !isFormValid}>
          {loading ? (
            <CircularProgress size={24} />
          ) : ad ? (
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
