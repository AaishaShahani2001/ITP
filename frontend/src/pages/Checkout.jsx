// src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

//const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}

function CheckoutInner() {
  const { items, total, clear } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const appointmentIds = useMemo(()=>items.map(i => i.id), [items]);

  useEffect(() => {
    (async () => {
      if (items.length === 0) return;
      const res = await fetch(`${API_BASE}/payments/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentIds, currency }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setCurrency(data.currency);
    })();
  }, [items, currency]);

  const validName = fullName.trim().length >= 2;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const payNow = async () => {
    if (!stripe || !elements || !clientSecret) return;
    if (!validName || !validEmail) {
      alert("Please enter a valid name and email.");
      return;
    }
    setLoading(true);
    const card = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: { name: fullName, email },
      }
    });
    setLoading(false);

    if (error) {
      alert(error.message || "Payment failed");
      return;
    }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      clear();
      navigate("/payment-success");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-2 text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="mt-4 space-y-3">
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Name on card"
          value={fullName}
          onChange={e=>setFullName(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Email for receipt"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />
        <div className="border rounded-lg p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <div className="flex items-center justify-between">
          <div className="font-bold">Total: ${total().toFixed(2)} {currency.toUpperCase()}</div>
          <button
            onClick={payNow}
            disabled={!stripe || loading || !clientSecret}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>

      {/* Basic validations / messages */}
      {!validName && <p className="mt-2 text-sm text-red-600">Enter the name as it appears on the card.</p>}
      {!validEmail && <p className="text-sm text-red-600">Enter a valid email address.</p>}
    </div>
  );
}
