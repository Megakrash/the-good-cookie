import React, { FormEvent, useEffect, useState } from "react";
import { API_URL, PATH_IMAGE } from "@/api/configApi";
import axios from "axios";
import { AdFormData, AdTypes, AdTags } from "@/types/AdTypes";
import { CategoriesTypes } from "@/types/CategoryTypes";
import { TagsTypes } from "@/types/TagTypes";
import toast, { Toaster } from "react-hot-toast";
import { queryAllCatAndSub } from "@/components/graphql/Categories";
import {
  queryAllAds,
  queryAdById,
  mutationCreateAd,
  mutationUpdateAd,
} from "@/components/graphql/Ads";
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
import { DownloadInput } from "@/styles/MuiStyled";
import UserZipCity from "@/components/users/components/UserZipCity";
import AdTitle from "./components/AdTitle";
import AdDescription from "./components/AdDescription";
import AdPrice from "./components/AdPrice";
import { queryAllTags } from "../../graphql/Tags";

type AdFormProps = {
  ad?: AdTypes;
};

function AdForm(props: AdFormProps): React.ReactNode {
  const router = useRouter();
  // Get Categories&SubCategories & Tags
  const { data: dataCategories } = useQuery<{ items: CategoriesTypes }>(
    queryAllCatAndSub,
  );
  const categories = dataCategories ? dataCategories.items : [];

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
  const [subCategoryId, setSubCategoryId] = useState<null | number>();
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
    const dataFile = new FormData();
    dataFile.append("title", title);
    dataFile.append("file", newPicture);

    try {
      let pictureId: number | null = null;
      if (newPicture) {
        const uploadResponse = await axios.post(`${API_URL}picture`, dataFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        pictureId = uploadResponse.data.id;
      }

      const data: AdFormData = {
        title,
        description,
        price,
        city,
        zipCode,
        coordinates,
        subCategory: subCategoryId ? { id: Number(subCategoryId) } : null,
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
          router.replace(`/annonces/${result.data.item.id}`);
        } else {
          toast("Erreur pendant la création de votre annonce");
        }
      } else {
        const result = await doUpdate({
          variables: {
            data,
            adUpdateId: props.ad?.id,
          },
        });
        if (!result.errors?.length) {
          toast("Annonce mise à jour");
        } else {
          toast("Erreur pendant la mise à jour de votre annonce");
        }
      }
    } catch (error) {
      console.error("error", error);
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
      setSubCategoryId(props.ad.subCategory ? props.ad.subCategory.id : null);
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
      {categories && tags && (
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
          <FormControl fullWidth>
            <InputLabel id="subcategory-select-label">Catégorie*</InputLabel>
            <Select
              className="adForm_boxForm_input"
              labelId="subcategory-select-label"
              id="subcategory-select"
              value={subCategoryId || ""}
              onChange={(e) =>
                setSubCategoryId(
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              label="Sélectionnez une sous-catégorie"
              required
            >
              <MenuItem value="" disabled>
                Sélectionnez une catégorie
              </MenuItem>
              {categories.map((category) => [
                <MenuItem key={category.id} value="" disabled>
                  {category.name}
                </MenuItem>,
                ...category.subCategories.map((subCategory) => (
                  <MenuItem
                    key={`subcategory-${category.id}-${subCategory.id}`}
                    value={subCategory.id}
                    style={{ marginLeft: "20px" }}
                  >
                    {subCategory.name}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
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
                image={`${PATH_IMAGE}/pictures/${props.ad.picture.filename}`}
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
