import { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getAllCategories } from "@/components/apiRest/ApiCategories";
import { AdFormData, CategoriesTypes } from "@/types";
import axios from "axios";
import { API_URL } from "@/configApi";
import toast, { Toaster } from "react-hot-toast";

const NewAd = (): React.ReactNode => {
  //Get all categories
  const [categories, setCategories] = useState<CategoriesTypes>([]);

  useEffect(() => {
    getAllCategories(setCategories);
  }, []);

  // Post new Ad
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as AdFormData;

    if ("categoryId" in data) {
      data.category = { id: Number(data.categoryId) };
      delete data.categoryId;
    }

    axios
      .post(`${API_URL}/annonces`, data)
      .then(() => {
        toast("Votre annonce a étée crée avec succès.");
        form.reset();
      })

      .catch(() => {
        console.error("error");
      });
  };
  return (
    <>
      <Layout title="TGD : Créer mon annonce">
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
          <input
            className=""
            type="email"
            name="owner"
            placeholder="Email*"
            required
          />
          <br />
          <input
            className=""
            type="number"
            name="price"
            placeholder="Prix de vente*"
            required
          />
          <br />
          <input
            className=""
            type="text"
            name="picture"
            placeholder="Lien de votre image*"
            required
          />
          <br />
          <input
            className=""
            type="text"
            name="location"
            placeholder="Ville*"
            required
          />
          <br />

          <select name="categoryId">
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
      </Layout>
    </>
  );
};

export default NewAd;
