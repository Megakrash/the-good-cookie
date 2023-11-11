import React, { FormEvent, useEffect, useState } from "react";
import {
  AdFormData,
  CategoriesTypes,
  TagsTypes,
  AdTypes,
  AdTags,
} from "@/types";
import toast, { Toaster } from "react-hot-toast";
import { queryAllCatAndSub } from "@/components/graphql/Categories";
import { queryAllTags } from "../graphql/Tags";
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
  TextField,
  Box,
  Button,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
type AdFormProps = {
  ad?: AdTypes;
};
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const AdForm = (props: AdFormProps): React.ReactNode => {
  // Get Categories&SubCategories & Tags
  const { data: dataCategories } = useQuery<{ items: CategoriesTypes }>(
    queryAllCatAndSub
  );
  const categories = dataCategories ? dataCategories.items : [];

  const { data: dataTags } = useQuery<{ items: TagsTypes }>(queryAllTags);
  const tags = dataTags ? dataTags.items : [];

  // Form
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [description, setDescription] = useState<string>("");
  const [picture, setPicture] = useState<string>("chourette.jpg");
  const [price, setPrice] = useState<number>(0);
  const [location, setLocation] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<null | number>();
  const [selectedTags, setSelectedTags] = useState<AdTags>([]);
  const handleChangeTag = (event: SelectChangeEvent<number[]>) => {
    const value: number[] = event.target.value as unknown as number[];
    const selectedOptions: AdTags = value.map((id) => ({ id: id }));
    setSelectedTags(selectedOptions);
  };

  // Submit & Update
  const router = useRouter();

  const [doCreate, { loading: createLoading }] = useMutation(mutationCreateAd, {
    refetchQueries: [queryAllAds],
  });
  const [doUpdate, { loading: updateLoading }] = useMutation(mutationUpdateAd, {
    refetchQueries: [queryAdById, queryAllAds],
  });
  const loading = createLoading || updateLoading;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data: AdFormData = {
      title,
      description,
      picture,
      price,
      location,
      subCategory: subCategoryId ? { id: Number(subCategoryId) } : null,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      user: { id: 2 },
    };

    if (data.title.trim().length < 3) {
      setError(true);
      setHelperText("Le titre doit être d'au moins 3 caractères.");
      return;
    } else if (data.price < 0) {
      // setError("price");
    } else {
      if (!props.ad) {
        const result = await doCreate({
          variables: {
            data: data,
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
            data: data,
            adUpdateId: props.ad?.id,
          },
        });
        if (!result.errors?.length) {
          toast("Annonce mise à jour");
        }
      }
    }
  }

  useEffect(() => {
    if (props.ad) {
      setTitle(props.ad.title);
      setDescription(props.ad.description);
      setLocation(props.ad.location);
      setPrice(props.ad.price);
      setPicture(props.ad.picture);
      setSubCategoryId(props.ad.subCategory ? props.ad.subCategory.id : null);
    }
  }, [props.ad]);
  return (
    <React.Fragment>
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
          component="form"
          sx={{
            "& > :not(style)": { m: 2, width: "50ch" },
          }}
          // noValidate
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <h2>
            {!props.ad ? "Création de votre annonce" : "Modifier votre annonce"}
          </h2>
          <TextField
            id="title"
            size="small"
            label="Titre de votre annonce"
            variant="outlined"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            error={error}
            helperText={helperText}
            required
          />
          <TextField
            id="description"
            multiline
            fullWidth
            rows={8}
            label="Détail de votre annonce"
            variant="outlined"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            id="price"
            size="small"
            label="Prix de votre annonce"
            variant="outlined"
            value={price || ""}
            onChange={(e) =>
              setPrice(e.target.value === "" ? 0 : Number(e.target.value))
            }
            required
          />
          <TextField
            id="location"
            size="small"
            label="Ville"
            variant="outlined"
            value={location || ""}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <FormControl fullWidth>
            <InputLabel id="subcategory-select-label">Catégorie*</InputLabel>
            <Select
              labelId="subcategory-select-label"
              id="subcategory-select"
              value={subCategoryId || ""}
              onChange={(e) =>
                setSubCategoryId(
                  e.target.value === "" ? undefined : Number(e.target.value)
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
              required
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>
          <Button variant="contained" type="submit" disabled={loading}>
            {props.ad ? "Modifer mon annonce" : "Créer mon annonce"}
          </Button>
        </Box>
      )}

      <input
        className=""
        type="text"
        name="picture"
        placeholder="Lien de votre image*"
        value={picture}
        onChange={(e) => setPicture(e.target.value)}
        required
      />
    </React.Fragment>
  );
};

export default AdForm;
