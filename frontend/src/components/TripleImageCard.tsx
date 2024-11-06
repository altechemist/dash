import jewelry from "../assets/jewelry.jpg";
import sports from "../assets/sports.jpg";
import beauty from "../assets/beauty.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TripleImageCard() {
  // Show products based on category
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const selectCategory = (category: string) => {
    setActiveCategory(category);
    navigate(`/products/${category.toLowerCase()}`);
  };
  return (
    <div className="container-fluid">
      <p className="hidden">{activeCategory}</p>
      <div className="row g-1 text-center mb-2 categories-card">
        <div className="col-sm-6 col-md-4">
          <div
            className="h-120 p-5 text-bg-dark rounded-4 text-start align-content-end"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${jewelry})`,
              backgroundSize: "cover",
              backgroundPosition: "40% 20%",
            }}
          >
            <button
              className="btn btn-outline-light shadow"
              type="button"
              onClick={() => selectCategory("jewelry")}
            >
              Jewelry <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="col-sm-6 col-md-4">
          <div
            className="h-120 p-5 text-bg-dark rounded-4 text-start align-content-end"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${sports})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <button
              className="btn btn-outline-light shadow"
              type="button"
              onClick={() => selectCategory("sports")}
            >
              Sports <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="col-sm-6 col-md-4">
          <div
            className="h-120 p-5 text-bg-dark rounded-4 text-start align-content-end"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${beauty})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <button className="btn btn-outline-light shadow" type="button" onClick={() => selectCategory("beauty")}>
              Beauty <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
