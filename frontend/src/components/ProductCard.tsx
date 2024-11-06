import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../store/cartSlice";
import { addToWishlist, removeFromWishlist } from "../store/userSlice";
import { RootState, AppDispatch } from "../store/store";

import placeholder_image from "../assets/placeholder-image.webp";

interface Product {
  id?: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  sku: string;
  category: string;
  subCategory: string;
  sizeOptions: string[];
  isReturnable: boolean;
  bashProductUUID: string;
  productCode: string;
  soldBy: string;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  // Handle product sharing functionality
  const handleShareToggle = () => {
    setIsSharing(!isSharing);
  };

  // Handle Add to Cart for both guest and logged-in users
  const handleAddToCart = (productId: string | undefined) => {
    // productId: string, productName: string, productPrice: number, productImage: string, quantity: number, userId?: string
    if (user && productId && product.images) {
      dispatch(
        addToCart(
          productId,
          product.name,
          product.price,
          product.images[0],
          1,
          user.uid
        )
      );
    } else {
      // Handle guest users - store cart in localStorage
      const localCart = JSON.parse(
        localStorage.getItem("guestCart") || '{"items": []}'
      );

      const existingItemIndex = localCart.items.findIndex(
        (item: {
          productId: string;
          productName: string;
          productPrice: number;
          productImage: string;
          quantity: number;
        }) => item.productId === productId
      );

      if (existingItemIndex > -1) {
        localCart.items[existingItemIndex].quantity += 1;
      } else {
        localCart.items.push({
          productId,
          productName: product.name,
          productPrice: product.price,
          productImage: product.images?.[0] || placeholder_image,
          quantity: 1,
        });
      }

      // Save the updated cart to localStorage
      localStorage.setItem("guestCart", JSON.stringify(localCart));

      if (productId && product.images)
        dispatch(
          addToCart(
            productId,
            product.name,
            product.price,
            product.images[0],
            1,
            "guest"
          )
        );
    }
  };

  // Handle Like/Adding to Wishlist
  const handleLike = (productId: string | undefined) => {
    if (user && productId) {
      setIsLiked(!isLiked);
      if (isLiked) {
        dispatch(removeFromWishlist(user.uid, productId));
        alert("Removed from wishlist");
      } else {
        dispatch(addToWishlist(user.uid, productId));
        alert("Added to wishlist");
      }
    } else {
      alert("Please log in to like this product.");
    }
  };

  // Navigate to product details page when card is clicked
  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const productLink = `${window.location.origin}/product/${product.id}`;

  return (
    <div className="col-md-4 mb-4">
      {product && (
        <div
          className="card shadow border-3"
          onClick={handleViewProduct}
          style={{ cursor: "pointer" }}
        >
          <div style={{ position: "relative" }}>
            {/* Like (Heart) and Share buttons */}
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
              <div className="btn-group gap-1">
                <button
                  className={`btn btn-primary bi ${
                    isLiked ? "bi-heart-fill text-danger" : "bi-heart"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(product.id);
                  }}
                ></button>
                <button
                  className="btn btn-primary bi bi-share-fill"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareToggle();
                  }}
                ></button>
              </div>

              {/* Share options */}
              {isSharing && (
                <div
                  className="btn-group ms-1"
                  style={{ backgroundColor: "black" }}
                >
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${productLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="btn bi bi-facebook text-light"></i>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${productLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="btn bi bi-twitter-x text-light"></i>
                  </a>
                  <a
                    href={`https://www.instagram.com/?url=${productLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="btn bi bi-instagram text-light"></i>
                  </a>
                </div>
              )}
            </div>

            {/* Product image */}
            <img
              className="card-img-top img-fluid p-1 rounded-3"
              src={product.images?.[0] || placeholder_image}
              alt={product.name}
            />
          </div>

          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text text-truncate">{product.description}</p>
            <div className="d-flex justify-content-between align-items-center">
              <p className="fw-bold mb-0">R {product.price.toFixed(2)}</p>

              <button
                className="btn btn-primary rounded-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product.id);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
