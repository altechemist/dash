import React, { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch } from "react-redux";
import { createOrder } from "../store/orderSlice";

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
  cart: Array<{ productId: string; quantity: number }>;
}

const PayPalButtonComponent: React.FC<PayPalButtonComponentProps> = ({ formData, cart }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>("0.01");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Calculate the total amount (you can implement your calculation logic here)
    const totalAmount = cart.reduce((total, item) => total + item.quantity * 10, 0); // Example price: 10 USD per item
    setAmount(totalAmount.toFixed(2));
  }, [cart]);

  const onCreateOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
          },
        },
      ],
    });
  };

  const onApproveOrder = (data: any, actions: any) => {
    setLoading(true);
    return actions.order
      .capture()
      .then((details: any) => {
        const name = details.payer.name.given_name;
        alert(`Transaction completed by ${name}`);

        const order = {
          userId: "userId",
          items: cart,
          status: "Completed",
          billingInfo: formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Dispatch createOrder action
        dispatch(createOrder(order));

        setSuccess(true);
      })
      .catch((err) => {
        setError("Payment could not be processed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
      <div>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {success && <div>Payment successful!</div>}
        <PayPalButtons
          createOrder={onCreateOrder}
          onApprove={onApproveOrder}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButtonComponent;
