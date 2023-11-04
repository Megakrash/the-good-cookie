import { FormEvent, useEffect, useState } from "react";
import { AdFormData, CategoriesTypes, TagsTypes, AdTypes, Tag } from "@/types";
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

type AdFormProps = {
  ad?: AdTypes;
};

const AdCreate = (props: AdFormProps): React.ReactNode => {
  // Get Categories&SubCategories & Tags
  const {
    data: dataCategories,
    error: errorCategories,
    loading: loadindCategories,
  } = useQuery<{ items: CategoriesTypes }>(queryAllCatAndSub);
  const categories = dataCategories ? dataCategories.items : [];

  const {
    data: dataTags,
    error: errorTags,
    loading: loadingTags,
  } = useQuery<{ items: TagsTypes }>(queryAllTags);
  const tags = dataTags ? dataTags.items : [];

  // Form
  const [error, setError] = useState<"title" | "price">();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("");
  const [subCategoryId, setSubCategoryId] = useState<null | number>(null);
  const [selectedTags, setSelectedTags] = useState<null | Tag[]>();
  const handleChangeTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push({ id: options[i].value });
      }
    }
    setSelectedTags(value);
  };

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
    setError(undefined);
    const data: AdFormData = {
      title,
      description,
      picture,
      price,
      location,
      subCategory: subCategoryId ? { id: Number(subCategoryId) } : null,
      tags: selectedTags ? selectedTags : null,
      user: { id: 2 },
    };

    if (data.title.trim().length < 3) {
      setError("title");
    } else if (data.price < 0) {
      setError("price");
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
    <>
      <h2>
        {!props.ad ? "Création de votre annonce" : "Modifier votre annonce"}
      </h2>
      <div>
        <Toaster
          toastOptions={{
            style: {
              background: "#ff8a00",
              color: "#fff",
            },
          }}
        />
      </div>
      <form onSubmit={onSubmit}>
        <input
          className=""
          type="text"
          name="title"
          placeholder="Titre de l'annonce*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          className=""
          name="description"
          placeholder="Description*"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <input
          className=""
          type="number"
          name="price"
          placeholder="Prix de vente*"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <br />
        <input
          className=""
          type="text"
          name="picture"
          placeholder="Lien de votre image*"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
          required
        />
        <br />
        <input
          className=""
          type="text"
          name="location"
          placeholder="Ville*"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <br />
        {/* <input
            className=""
            type="file"
            name="picture"
            placeholder="Choisir une image"
            accept=".jpg, .png"
            // onChange={(e) => {
            //   setNewPic(e.target.files[0]);
            // }}
            required
          /> */}
        <br />
        <select
          name="subCategory"
          onChange={(e) => setSubCategoryId(Number(e.target.value))}
        >
          <option>Sélectonnez une catégorie</option>
          {categories.map((category) => (
            <optgroup key={category.id} label={category.name}>
              {category.subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <select multiple onChange={handleChangeTag}>
          <option value="" disabled>
            Sélectionnez un Tag
          </option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit" disabled={loading}>
          {!props.ad ? "Créer mon annonce" : "Mettre à jour"}
        </button>
      </form>
    </>
  );
};

export default AdCreate;
