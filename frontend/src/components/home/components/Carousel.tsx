import { CategoryTypes } from "@/types/CategoryTypes";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import UniversCard from "./UniversCard";

type CarouselProps = {
  categories: CategoryTypes[];
};
const responsive = {
  bigScreen: {
    breakpoint: { max: 4000, min: 1600 },
    items: 4,
    slidesToSlide: 1,
    partialVisibilityGutter: 0,
  },
  desktop: {
    breakpoint: { max: 1600, min: 1280 },
    items: 3,
    slidesToSlide: 1,
    partialVisibilityGutter: 0,
  },
  tablet: {
    breakpoint: { max: 1280, min: 780 },
    items: 2,
    slidesToSlide: 1,
    partialVisibilityGutter: 0,
  },
  mobile: {
    breakpoint: { max: 780, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const CarouselUnivers: React.FC<CarouselProps> = ({ categories }) => {
  return (
    <Carousel
      containerClass=""
      responsive={responsive}
      className="carousel"
      arrows
      infinite
      additionalTransfrom={0}
      showDots={true}
      //   centerMode={true}
    >
      {categories.map((category) => (
        <UniversCard key={category.id} category={category} />
      ))}
    </Carousel>
  );
};

export default CarouselUnivers;
