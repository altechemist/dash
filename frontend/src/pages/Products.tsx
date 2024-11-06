import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { fetchAllProducts } from "../store/productSlice";
import ProductCard from "../components/ProductCard";


export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { category } = useParams<{ category?: string }>();

  // Local state for filtered products
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Fetch products when the component mounts or when category changes
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    // Filter products by category
    if (category) {
      if (category === "all") {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter(
          (product) => product.category === category 
        );
        setFilteredProducts(filtered);
      }
    } else {
      setFilteredProducts(products);
    }
  }, [category, products]);

  return (
    <div className="container-fluid">
      {/* Loading and Error Handling */}
      {loading && <div className="alert alert-info">Loading products...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Display products in a grid layout */}
      <div className="row">
        {filteredProducts.length === 0 && !loading ? (
          <div className="col-12">
            <div className="alert alert-warning">No products available.</div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
