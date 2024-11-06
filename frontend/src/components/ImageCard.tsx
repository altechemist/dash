import { useNavigate } from "react-router-dom";
import summer_dress from "../assets/summer-dress.jpg";
import men from "../assets/men.jpg";
import { useState } from "react";

export default function ImageCard() {
  // Show products based on category
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const selectCategory = (category: string) => {
    setActiveCategory(category);
    navigate(`/products/${category.toLowerCase()}`);
  };

  return (
    <div className="container-fluid">
      <div className="row g-1 text-center mb-2 categories-card">
        <p className="hidden">{activeCategory}</p>
        <div className="col-sm-6 col-md-7">
          <div
            className="h-120 p-5 text-bg-dark rounded-4 text-start align-content-end"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${summer_dress})`,
              backgroundSize: "cover",
              backgroundPosition: "60% 20%",
            }}
          >
            <button
              className="btn btn-outline-light btn-lg shadow"
              type="button"
              onClick={() => selectCategory('women')}
            >
              Women <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="col-sm-6 col-md-5">
          <div
            className="h-120 p-5 text-bg-dark rounded-4 text-start align-content-end"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${men})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
           
           <button className="btn btn-outline-light btn-lg shadow" type="button"
           onClick={() => selectCategory('men')}>
              Men <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
