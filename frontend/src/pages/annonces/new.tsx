import { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { AdFormData, CategoriesTypes } from "@/types";
import axios from "axios";
import { API_URL } from "@/configApi";

const NewAd = (): React.ReactNode => {
  // Get Categories
  const [categories, setCategories] = useState<CategoriesTypes[]>([]);
  const getCategories = () => {
    axios
      .get(`${API_URL}/category`)
      .then((res) => {
        setCategories(res.data);
      })

      .catch(() => {
        console.error("error");
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const [confirmMessage, setConfirmMessage] = useState<boolean>(false);

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
        setConfirmMessage(true);
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
        {confirmMessage && (
          <div className="">Votre formulaire a été soumis avec succès.</div>
        )}
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
            {categories.map((el) => (
              <option key={el.id} value={el.id}>
                {el.name.toUpperCase()}
              </option>
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
