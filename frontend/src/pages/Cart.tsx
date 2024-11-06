import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchCart,
  removeFromCart,
  setCart,
  calculateSubtotal,
  updateCartItemQuantity, setSubtotal
} from "../store/cartSlice";
import productImage from "../assets/logo.png";

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

  // Calculate subtotal dynamically
  let subtotal: number | undefined | string;
  if (cart) subtotal = calculateSubtotal(cart);
  dispatch(setSubtotal());


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
    alert("Proceeding to checkout...");
  };

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
            className="Cart-item d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center">
              <img
                className="img-fluid"
                style={{ width: "7rem", height: "7rem", objectFit: "contain" }}
                src={item.productImage || productImage}
                alt="Product"
              />
              <div className="Cart-information">
                <p className="ms-2">{item.productName}</p>
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
                className="btn btn-sm btn-outline-danger"
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
          <p>R{Number(subtotal) && Number(subtotal).toFixed(2)}</p>
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
