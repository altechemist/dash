import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { addToCart } from "../store/cartSlice";
import { addToWishlist } from "../store/userSlice";

export default function ProductPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { productId } = useParams<{ productId: string }>();
  const { products, loading, error } = useSelector((state: RootState) => state.product);
  const { user } = useSelector((state: RootState) => state.user);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // Store product quantity

  // Find the product by its ID from the product list in the Redux store
  const product = products.find((p) => p.id === productId);

  // Check if product exists
  if (loading) {
    return <div className="alert alert-info">Loading product details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div className="alert alert-warning">Product not found.</div>;
  }

  const handleAddToCart = () => {
    if (user && selectedSize && product.images && productId) {
      dispatch(addToCart(productId, product.name, product.price, product.images[0], 1, "guest"));
    } else {
      alert("Please select a size and log in to add to the cart.");
    }
  };

  const handleAddToWishlist = () => {
    if (user && product.id) {
      dispatch(addToWishlist(user.uid, product.id));
    } else {
      alert("Please log in to add to your wishlist.");
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          {/* Image Carousel */}
          <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {product.images?.map((image, index) => (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={image}>
                  <img
                    src={image}
                    className="d-block w-100"
                    alt={product.name}
                    style={{ objectFit: "cover", height: "400px" }}
                  />
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>
          <h4 className="text-muted">{product.brand}</h4>
          <p><strong>SKU:</strong> {product.sku}</p>
          <p><strong>Product Code:</strong> {product.productCode}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Category:</strong> {product.category} {">"} {product.subCategory}</p>

          {/* Size Selector */}
          <div className="mb-3">
            <label htmlFor="sizeSelect" className="form-label">Select Size</label>
            <select
              id="sizeSelect"
              className="form-select"
              onChange={handleSizeChange}
              value={selectedSize || ""}
            >
              <option value="" disabled>Select a size</option>
              {product.sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input */}
          <div className="mb-3">
            <label htmlFor="quantityInput" className="form-label">Quantity</label>
            <input
              id="quantityInput"
              type="number"
              className="form-control"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max="99"
            />
          </div>

          {/* Product Description */}
          <div className="mb-3">
            <h5>Product Information</h5>
            <p>{product.description}</p>
          </div>

          {/* Return Policy */}
          <div className="mb-3">
            <p><strong>Returnable:</strong> {product.isReturnable ? "Yes" : "No"}</p>
          </div>

          {/* Action Buttons */}
          <button className="btn btn-primary me-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="btn btn-outline-secondary" onClick={handleAddToWishlist}>
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
