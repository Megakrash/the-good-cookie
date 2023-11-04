import { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { AdFormData, CategoriesTypes } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import { mutationCreateAd } from "@/components/graphql/Ads";
import { queryAllCatAndSub } from "@/components/graphql/Categories";
import { useQuery } from "@apollo/client";

const NewAd = (): React.ReactNode => {

  const {
    data: dataCategories,
    error: errorCategories,
    loading: loadindCategories,
  } = useQuery<{ items: CategoriesTypes }>(queryAllCatAndSub);
  const categories = dataCategories ? dataCategories.items : [];


  // Post new Ad
  // const onSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const form = event.target as HTMLFormElement;
  //   const formData = new FormData(form);
  //   formData.append("user", "1");
  //   const price = formData.get("price");
  //   if (typeof price === "string") {
  //     formData.set("price", String(Number(price)));
  //   }
  //   const subCategory = formData.get("subCategory");
  //   if (typeof subCategory === "string") {
  //     formData.set("subCategory", String(Number(subCategory)));
  //   }

  //   axios
  //     .post(`${API_URL}/annonce`, formData)
  //     .then(() => {
  //       toast("Votre annonce a étée crée avec succès.");
  //       form.reset();
  //     })

  //     .catch(() => {
  //       toast.error(`Quelque chose s'est mal passé`);
  //       console.error("error");
  //     });
  // };
  return (
    <>
      {/* <Layout title="TGD : Créer mon annonce">
        <h2>Création de votre annonce</h2>
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
            required
          />
          <br />
          <textarea
            className=""
            name="description"
            placeholder="Description*"
            required
          />
          <br />
          {/* <input
            className=""
            type="email"
            name="owner"
            placeholder="Email*"
            required
          />
          <br /> */}
          <input
            className=""
            type="number"
            name="price"
            placeholder="Prix de vente*"
            required
          />
          <br />
          {/* <input
            className=""
            type="text"
            name="picture"
            placeholder="Lien de votre image*"
            required
          />
          <br /> */}
          <input
            className=""
            type="text"
            name="location"
            placeholder="Ville*"
            required
          />
          <br />
          <input
            className=""
            type="file"
            name="picture"
            placeholder="Choisir une image"
            accept=".jpg, .png"
            // onChange={(e) => {
            //   setNewPic(e.target.files[0]);
            // }}
            required
          />
          <br />
          <select name="subCategory">
            <option>Sélectonnez une catégorie</option>
            {categories.map((category) => (
              <optgroup key={category.id} label={category.name}>
                {category.subCategory.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <br />
          <button type="submit">Créer mon annonce</button>
        </form>
      </Layout> */}
    </>
  );
};

export default NewAd;
