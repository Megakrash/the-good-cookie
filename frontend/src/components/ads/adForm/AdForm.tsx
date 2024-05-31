import React, { FormEvent, useEffect, useState } from "react";
import { PATH_IMAGE } from "@/api/configApi";
import { AdFormData, AdTypes, AdTags } from "@/types/AdTypes";
import { TagsTypes } from "@/types/TagTypes";
import { Toaster } from "react-hot-toast";
import {
  queryAllAds,
  queryAdById,
  mutationCreateAd,
  mutationUpdateAd,
} from "@/graphql/Ads";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Box,
  Button,
  CardMedia,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DownloadInput } from "@/styles/MuiInput";
import UserZipCity from "@/components/users/components/UserZipCity";
import AdTitle from "./components/AdTitle";
import AdDescription from "./components/AdDescription";
import AdPrice from "./components/AdPrice";
import { queryAllTags } from "../../../graphql/Tags";
import { uploadPicture } from "@/components/utils/uploadPicture";
import { showToast } from "@/components/utils/toastHelper";
import CategorySelect from "@/components/utils/CategorySelect";

type AdFormProps = {
  ad?: AdTypes;
};

function AdForm(props: AdFormProps): React.ReactNode {
  const router = useRouter();
  // Get Tags

  const { data: dataTags } = useQuery<{ items: TagsTypes }>(queryAllTags);
  const tags = dataTags ? dataTags.items : [];

  // Form
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [curentPicture, setCurentPicture] = useState<string>("");
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewPicture(file);
      setCurentPicture("");
      setPreviewUrl(URL.createObjectURL(file));
    }
  }
  const [price, setPrice] = useState<number>(0);
  const [zipCode, setZipCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
  const [selectedCategory, setSelectedCategory] = useState<null | number>();
  const [selectedTags, setSelectedTags] = useState<AdTags>([]);
  const handleChangeTag = (event: SelectChangeEvent<number[]>) => {
    const value: number[] = event.target.value as unknown as number[];
    const selectedOptions: AdTags = value.map((id) => ({ id }));
    setSelectedTags(selectedOptions);
  };

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
      className="adForm"
      sx={{
        width: props.ad ? "50%" : "98%",
        margin: "auto",
      }}
    >
      <Toaster
        toastOptions={{
          style: {
            background: "#ff8a00",
            color: "#fff",
          },
        }}
      />
      {tags && (
        <Box
          className="adForm_boxForm"
          component="form"
          sx={{
            "& > :not(style)": { m: 2, width: "50ch" },
          }}
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <h2>
            {!props.ad ? "Création de votre annonce" : "Modifier votre annonce"}
          </h2>
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
          <FormControl fullWidth>
            <InputLabel id="tags">Tag(s)</InputLabel>
            <Select
              className="adForm_boxForm_input"
              labelId="tags-label"
              id="select-tags"
              multiple
              value={selectedTags.map((tag) => tag.id)}
              onChange={handleChangeTag}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) =>
                selected
                  .map((id) => tags.find((tag) => tag.id === id)?.name || "")
                  .join(", ")
              }
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {curentPicture === "" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              {previewUrl && (
                <CardMedia
                  sx={{
                    width: "100%",
                    height: 200,
                    margin: "auto",
                    objectFit: "contain",
                  }}
                  image={previewUrl}
                />
              )}
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Image pour votre annonce
                <DownloadInput
                  type="file"
                  accept=".jpg, .png, .webp"
                  onChange={handleFileSelection}
                  required={!props.ad}
                />
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <CardMedia
                sx={{
                  width: "100%",
                  height: 200,
                  margin: "auto",
                  objectFit: "contain",
                }}
                image={`${PATH_IMAGE}/pictures/${curentPicture}`}
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                {`Modifier l'image`}
                <DownloadInput
                  type="file"
                  accept=".jpg, .png, .webp"
                  onChange={handleFileSelection}
                />
              </Button>
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
          >
            {props.ad ? "Modifer mon annonce" : "Créer mon annonce"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default AdForm;
