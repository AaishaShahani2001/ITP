import React from 'react'
import DayCareBanner from '../components/DayCareBanner.jsx'
import { useNavigate } from "react-router-dom";
import { LuClock3 } from "react-icons/lu";


const packages = [
  {
    id: "half-day",
    name: "Half-Day Play Session",
    price: 3000, // Rs.
    duration: "4 hrs",
    description:
      "Supervised playtime, socialization with matched groups, and a healthy snack.",
  },
  {
    id: "full-day",
    name: "Full-Day Daycare",
    price: 5500,
    duration: "8 hrs",
    description:
      "Morning & afternoon play blocks, nap time, feeding as per schedule.",
  },
  {
    id: "extended-day",
    name: "Extended Daycare (Late Pickup)",
    price: 7000,
    duration: "10 hrs",
    description:
      "Full-day care plus evening walk and flexible pickup window for busy owners.",
  },
];

const PetDaycareDetails = () => {
  const navigate = useNavigate();

  const handleBook = (pkg) => {
    navigate(
      `/daycarebooking/?service=${encodeURIComponent(
        pkg.name
      )}&price=${pkg.price}`
    );
  };

  return (
    <div>
      <DayCareBanner />
       <section className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Daycare Packages
          </h2>
          <p className="mt-2 text-slate-600">
            Choose a package and book your spot for a fun, safe day.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {p.name}
                  </h3>
                  <span className="text-teal-700 font-extrabold">
                    Rs.{p.price}
                  </span>
                </div>

                <div className="mt-2 flex items-center text-slate-500 text-sm gap-2">
                  <LuClock3 className="shrink-0" />
                  <span>{p.duration}</span>
                </div>

                <p className="mt-3 text-slate-600 text-sm leading-6">
                  {p.description}
                </p>

                <button
                  onClick={() => handleBook(p)}
                  className="mt-5 inline-flex w-full items-center justify-center
                             rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600
                             text-white font-semibold px-4 py-3
                             hover:opacity-95 focus:outline-none focus:ring-2
                             focus:ring-teal-500/40"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PetDaycareDetails