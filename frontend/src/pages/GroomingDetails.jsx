import React from "react";
import { useNavigate } from "react-router-dom";
import { LuClock3 } from "react-icons/lu";
import GroomingBanner from "../components/GroomingBanner.jsx";

const services = [
  {
    id: "basic-bath-brush",
    name: "Basic Bath & Brush",
    price: 2500,
    duration: "45 mins",
    description:
      "Complete bath with premium shampoo, thorough brushing, and basic nail trim.",
  },
  {
    id: "full-grooming",
    name: "Full Grooming Package",
    price: 6500,
    duration: "90 mins",
    description:
      "Bath, haircut, nail trim, ear cleaning, and teeth brushing for a complete makeover.",
  },
  {
    id: "nail-trim",
    name: "Nail Trim Only",
    price: 1500,
    duration: "15 mins",
    description:
      "Professional nail trimming to keep your pet's nails healthy and comfortable.",
  },
  {
    id: "deshedding",
    name: "De-shedding Treatment",
    price: 4500,
    duration: "60 mins",
    description:
      "Specialized treatment to reduce shedding and keep your home cleaner.",
  },
  {
    id: "flea-tick",
    name: "Flea & Tick Treatment",
    price: 5500,
    duration: "75 mins",
    description:
      "Thorough flea and tick removal with medicated bath and preventive treatment.",
  },
  {
    id: "premium-spa",
    name: "Premium Spa Package",
    price: 9500,
    duration: "120 mins",
    description:
      "Luxury treatment including aromatherapy bath, massage, and premium styling.",
  },
];

export default function GroomingDetails() {
  const navigate = useNavigate();

  const handleBook = (svc) => {
    // keep it simple: pass selected service via query params
    navigate(
      `/grooming-booking?service=${encodeURIComponent(
        svc.name
      )}&price=${svc.price}`
    );
  };

  return (
    <div>
      <GroomingBanner />
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Grooming Services
        </h2>
        <p className="mt-2 text-slate-600">
          Choose a package and book your appointment.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {s.name}
                </h3>
                <span className="text-fuchsia-800 font-extrabold">
                  Rs.{s.price}
                </span>
              </div>

              <div className="mt-2 flex items-center text-slate-500 text-sm gap-2">
                <LuClock3 className="shrink-0" />
                <span>{s.duration}</span>
              </div>

              <p className="mt-3 text-slate-600 text-sm leading-6">
                {s.description}
              </p>

              <button
                onClick={() => handleBook(s)}
                className="mt-5 inline-flex w-full items-center justify-center
                           rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500
                           text-white font-semibold px-4 py-3
                           hover:opacity-95 focus:outline-none focus:ring-2"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
    
  );
}
