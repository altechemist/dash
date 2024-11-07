import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../store/orderSlice";
import { fetchCart, setCart } from "../store/cartSlice";
import PayPalButtonComponent from "../components/PayPalButtons";
import { AppDispatch, RootState } from "../store/store";
import MiniCart from "./MiniCart";

export default function Checkout() {
  // Component state for form data and validation
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    address2: "",
    country: "",
    state: "",
    zip: "",
    sameAddress: false,
    saveInfo: false,
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | null;
    show: boolean;
  }>({
    message: "",
    type: null,
    show: false,
  });

  // Redux dispatch and state access
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { cart } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (user?.uid) {
      // If user is logged in, fetch cart data
      if (user?.uid) {
        dispatch(fetchCart(user.uid));
      } else {
        // Get cart from local storage
        const cartFromLocalStorage = localStorage.getItem("guestCart");
        if (cartFromLocalStorage) {
          dispatch(setCart(JSON.parse(cartFromLocalStorage)));
        }
      }
    }
  }, [dispatch, user?.uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const validateForm = () => {
    const { firstName, lastName, username, address, country, state, zip } = formData;

    // Check form validity
    if (!firstName || !lastName || !username || !address || !country || !state || !zip) {
      setAlert({
        message: "All fields are required.",
        type: "error",
        show: true,
      });
      setIsFormValid(false); 
      return;
    }

    // Form is valid
    setIsFormValid(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateForm();
    if (isFormValid) {
      if (!user?.uid) {
        setAlert({
          message: "You must be logged in to place an order.",
          type: "error",
          show: true,
        });
        return;
      }

      // Prepare order data from form and cart
      const orderData = {
        userId: user.uid,
        items: Array.isArray(cart)
          ? cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            }))
          : [],
        status: "Pending",
        billingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          address: formData.address,
          address2: formData.address2,
          country: formData.country,
          state: formData.state,
          zip: formData.zip,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Dispatch action to create order
      dispatch(createOrder(orderData))
        .then(() => {
          setAlert({
            message: "Order placed successfully!",
            type: "success",
            show: true,
          });

          // Optionally clear form data or reset validation
          setFormData({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            address: "",
            address2: "",
            country: "",
            state: "",
            zip: "",
            sameAddress: false,
            saveInfo: false,
          });
        })
        .catch((error) => {
          setAlert({
            message: `Error placing order: ${error.message}`,
            type: "error",
            show: true,
          });
        });
    } else {
      setAlert({
        message: "Please fill out all required fields.",
        type: "error",
        show: true,
      });
    }
  };

  const handleAlertDismiss = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="container">
      <div className="row g-3">
        <div className="col-md-6 col-lg-7">
          <h3 className="mb-3">Billing Address</h3>
          {/* Alert Messages */}
          {alert.show && (
            <div
              className={`alert alert-${alert.type === "success" ? "success" : "danger"} mt-3`}
              role="alert"
              onClick={handleAlertDismiss}
            >
              {alert.message}
            </div>
          )}
          <form className="needs-validation" noValidate onSubmit={handleSubmit}>
            {/* Form Fields for Billing Address */}
            <div className="row g-3">
              {/* First Name */}
              <div className="col-sm-6">
                <label htmlFor="firstName" className="form-label">
                  First name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Last Name */}
              <div className="col-sm-6">
                <label htmlFor="lastName" className="form-label">
                  Last name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Username */}
              <div className="col-12">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Email */}
              <div className="col-12">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-body-secondary">(Optional)</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {/* Address */}
              <div className="col-12">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Address 2 (Optional) */}
              <div className="col-12">
                <label htmlFor="address2" className="form-label">
                  Address 2{" "}
                  <span className="text-body-secondary">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address2"
                  value={formData.address2}
                  onChange={handleChange}
                />
              </div>
              {/* Country */}
              <div className="col-md-5">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* State */}
              <div className="col-md-4">
                <label htmlFor="state" className="form-label">
                  State
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Zip */}
              <div className="col-md-3">
                <label htmlFor="zip" className="form-label">
                  Zip
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <button className="w-100 btn btn-primary btn-lg" type="submit" disabled={isFormValid}>
              Pay Now
            </button>
          </form>
          {isFormValid && (
            <PayPalButtonComponent formData={formData} />
          )}
        </div>
        <div className="col-md-6 col-lg-5 order-md-last">
        <h3 className="mb-4">Your Cart</h3>
          <MiniCart />
        </div>
      </div>
    </div>
  );
}
