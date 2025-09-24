import React from "react";
import { useCart } from "../store/cartStore.js";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, removeItem, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-gray-600">
          Cart is empty.{" "}
          <Link className="text-blue-600 underline" to="/my-appointments">
            Add appointments
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y rounded-xl border">
            {items.map((it, idx) => {
              // Prefer `id`, then `_id`, finally a deterministic fallback to avoid duplicate keys
              const safeKey =
                it?.id ??
                it?._id ??
                `${it?.service || "svc"}-${it?.title || "item"}-${idx}`;

              const linePrice = Number(it?.price || 0);
              const extras = Array.isArray(it?.extras) ? it.extras : [];
              const extrasTotal = extras.reduce(
                (acc, e) => acc + Number(e?.price || 0),
                0
              );

              return (
                <div key={safeKey} className="p-4 flex items-start justify-between">
                  <div>
                    <div className="font-medium">
                      {it?.title || "Appointment"}
                    </div>

                    {extras.length > 0 && (
                      <ul className="mt-1 text-sm text-gray-600 list-disc ml-5">
                        {extras.map((e, eIdx) => (
                          <li key={`${safeKey}-extra-${eIdx}`}>
                            {e?.name || "Extra"} (+$
                            {Number(e?.price || 0).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-1 font-semibold">
                      ${linePrice.toFixed(2)}
                      {extrasTotal > 0 && (
                        <span className="text-sm text-gray-600">
                          {" "}
                          (+${extrasTotal.toFixed(2)} extras)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(it?.id ?? it?._id)}
                    className="px-3 py-1.5 rounded-lg border text-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-bold">
              Total: ${Number(total()).toFixed(2)}
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
