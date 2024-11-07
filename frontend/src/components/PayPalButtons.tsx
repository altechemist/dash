import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../store/orderSlice";
import { AppDispatch, RootState } from "../store/store";

interface PayPalButtonComponentProps {
  formData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    address: string;
    address2: string;
    country: string;
    state: string;
    zip: string;
  };
}

const PayPalButtonComponent: React.FC<PayPalButtonComponentProps> = ({
  formData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Get cart and subtotal from Redux store
  const cart = useSelector((state: RootState) => state.cart.cart);
  const subtotal = Number(useSelector((state: RootState) => state.cart.subtotal));

  // Get user from Redux store
  const { user } = useSelector((state: RootState) => state.user);

  // Function to create the order in PayPal
  const onCreateOrder = ( actions: any) => {
    // Check if subtotal is valid and greater than zero
    
    if (!Number(subtotal) || Number(subtotal) <= 0) {
      setError(`Invalid subtotal: ${subtotal}. Please check your cart.`);
      return;
    }

    // Ensure two decimal precision for subtotal
    const totalAmount = subtotal.toFixed(2); 

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalAmount,
          },
        },
      ],
    });
  };

  // Function to handle the approval of the order
  const onApproveOrder = ( actions: any) => {
    setLoading(true);
    return actions.order
      .capture()
      .then((details: any) => {
        const name = details.payer.name.given_name;
        alert(`Transaction completed by ${name}`);

        const order = {
          userId: user?.uid || "guest",
          items: cart?.items || [],
          status: "Completed",
          billingInfo: formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Dispatch createOrder action
        dispatch(createOrder(order));

        setSuccess(true);
      })
      .catch((err: string) => {
        setError("Payment could not be processed. Please try again.");
        setSuccess(false);
        setLoading(false);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PayPalScriptProvider
      options={{ clientId: import.meta.env.VITE_SANDBOX_CLIENT_ID }}
    >
      <div>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {success && <div>Payment successful!</div>}
        <PayPalButtons createOrder={onCreateOrder} onApprove={onApproveOrder} />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButtonComponent;
