import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchCart,
  removeFromCart,
  setCart,
  updateCartItemQuantity,
  setSubtotal,
} from "../store/cartSlice";
import productImage from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

// Types for Cart and CartItem
interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  subtotal?: number;
}

const Cart = () => {
  // Get cart state from Redux store
  const { cart, loading, error } = useSelector(
    (state: RootState) => state.cart
  );
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Fetch cart on load
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCart(user.uid));
    } else {
      // Get cart from local storage
      const cartFromLocalStorage = localStorage.getItem("guestCart");
      if (cartFromLocalStorage) {
        dispatch(setCart(JSON.parse(cartFromLocalStorage)));
      }
    }
  }, [dispatch, user?.uid]);

  // Handle removing an item from the cart
  const handleRemoveFromCart = (productId: string) => {
    if (user?.uid) {
      dispatch(removeFromCart(user.uid, productId));
    } else {
      dispatch(removeFromCart("guest", productId));
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number, productId: string) => {
    if (newQuantity < 1) return;
    if (user?.uid) {
      dispatch(updateCartItemQuantity(user.uid, productId, newQuantity));
      dispatch(setSubtotal());
    } else {
      // Handle guest cart (localStorage)
      const localCart: Cart = JSON.parse(
        localStorage.getItem("guestCart") || '{"items": []}'
      );
      const itemIndex = localCart.items.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex >= 0) {
        localCart.items[itemIndex].quantity = newQuantity;
        localStorage.setItem("guestCart", JSON.stringify(localCart));
        dispatch(setCart(localCart));
      }
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (user?.uid) {
      // Send cart items to the server for checkout
      navigate("/checkout");
    } else {
      // Clear the guest cart and display a success message
      alert("Please Login to checkout");
      navigate("/checkout");
    }
  };

  // Get subtotal from Redux store
  const subtotal = useSelector((state: RootState) => state.cart.subtotal);

  // Render the cart items
  const displayItems = () => {
    if (loading) {
      return <div>Loading cart...</div>;
    }

    if (error) {
      return <div className="alert alert-danger">Error: {error}</div>;
    }

    if (!cart || cart.items.length === 0) {
      return <div>Your cart is empty.</div>;
    }

    return (
      <div className="cart-items">
        {cart.items.map((item: CartItem) => (
          <div
            key={item.productId}
            className="Cart-item d-flex align-items-center justify-content-between py-2 border-bottom"
          >
            <div className="d-flex align-items-center">
              <img
                className="img-fluid rounded-4"
                src={item.productImage || productImage}
                alt="Product"
              />
              <div className="Cart-information">
                <p className="ms-2 card-title mb-2 fw-2 fw-bold">
                  {item.productName}
                </p>
                <p className="ms-2">
                  R{item.productPrice} x {item.quantity} = R
                  {(item.productPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="btn-group">
              {/* Quantity controls */}
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    handleQuantityChange(item.quantity - 1, item.productId)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>

                {/* Display the quantity as a label or p */}
                <label className="mx-2">{item.quantity}</label>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    handleQuantityChange(item.quantity + 1, item.productId)
                  }
                >
                  +
                </button>
              </div>

              {/* Remove button */}
              <button
                className="btn  ms-1 btn-sm btn-outline-danger"
                onClick={() => handleRemoveFromCart(item.productId)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}

      </div>
    );
  };

  return (
    <div className="Cart-modal">
      <div className="Cart-card container">
        {displayItems()}

        {/* Change item count */}
        <div className="d-flex justify-content-between">
          <p>Items:</p>
          <p>{cart?.items.length}</p>
        </div>

        {/* Subtotals */}
        <div className="d-flex justify-content-between">
          <p>Subtotal:</p>
          <p>R{subtotal && subtotal.toFixed(2)}</p>
        </div>

        {/* Checkout Button */}
        {cart && cart?.items.length > 0 && (
          <button
            className="Checkout-button btn btn-primary w-100"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
