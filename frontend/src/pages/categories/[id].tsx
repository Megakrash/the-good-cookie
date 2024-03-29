import LayoutFull from "@/components/layout/LayoutFull";
import { useRouter } from "next/router";
import SubCategoriesCard from "@/components/subCategories/SubCategoriesCard";
import { CategoryTypes } from "@/types/CategoryTypes";
import { useQuery } from "@apollo/client";
import { queryCatByIdAndSub } from "@/components/graphql/Categories";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Box } from "@mui/material";
import IconBreadcrumbs from "@/components/breadcrumbs/Breadcrumbs";

const responsive = {
  desktopB: {
    breakpoint: { max: 4000, min: 1500 },
    items: 4,
    slidesToSlide: 2,
  },
  desktopM: {
    breakpoint: { max: 1500, min: 1200 },
    items: 3,
    slidesToSlide: 2,
  },
  desktopS: {
    breakpoint: { max: 1200, min: 900 },
    items: 2,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 900, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
  mobil: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

function CategoryComponent(): React.ReactNode {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, loading } = useQuery<{ item: CategoryTypes }>(
    queryCatByIdAndSub,
    {
      variables: { categoryByIdId: id },
      skip: id === undefined,
    },
  );

  const category = data ? data.item : null;
  return (
    <>
      {category && (
        <LayoutFull title={`TGG : ${category.name}`}>
          <IconBreadcrumbs
            items={[
              {
                url: "/final-item",
                text: `${category.name.toUpperCase()}`,
              },
            ]}
          />
          <div>
            {category.subCategories.length >= 1 ? (
              <Box
                sx={{
                  width: "95%",
                  marginTop: "50px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Carousel
                  containerClass="carousel-container"
                  responsive={responsive}
                  infinite
                  centerMode
                  renderDotsOutside
                >
                  {category.subCategories.map((subCat) => (
                    <SubCategoriesCard
                      key={subCat.id}
                      id={subCat.id}
                      name={subCat.name}
                      picture={subCat.picture}
                    />
                  ))}
                </Carousel>
              </Box>
            ) : (
              <p>{`Aucune offre dans la catégorie ${category.name} pour le moment !`}</p>
            )}
          </div>
        </LayoutFull>
      )}
    </>
  );
}

export default CategoryComponent;
