import React from "react";
import { useNavigate } from "react-router-dom";
import { LuClock3 } from "react-icons/lu";
import VetBanner from "../components/VetBanner";
import doc1 from "../assets/doc1.png"; // ← update path if needed

// Doctor info
export const vetDoctor = {
  _id: "doc1",
  name: "Dr. Sarah Patel",
  image: doc1,
  speciality: "Veterinary Doctor",
  degree: "MBBS",
  experience: "2 Years",
  about:
    "Dr. Patel is committed to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
  fees: "Rs.4000",
};

const vetServices = [
  {
    id: "general-checkup",
    name: "General Health Checkup",
    price: 7500,
    duration: "30 mins",
    description:
      "Comprehensive exam including vital signs, weight check, and overall wellness assessment.",
  },
  {
    id: "vaccination",
    name: "Vaccination",
    price: 4500,
    duration: "15 mins",
    description:
      "Essential vaccinations to protect your pet from common diseases and infections.",
  },
  {
    id: "emergency-care",
    name: "Emergency Care",
    price: 15000,
    duration: "60 mins",
    description:
      "Immediate attention for urgent health issues and emergencies.",
  },
];

export default function VetCareDetails() {
  const navigate = useNavigate();

  const handleBook = (svc) => {
    navigate(
      `/vet-booking/?service=${encodeURIComponent(
        svc.name
      )}&price=${svc.price}`
    );
  };

  return (
    <div>
      <VetBanner />

      {/* Doctor Card */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-7 flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={vetDoctor.image}
              alt={vetDoctor.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold text-slate-900">{vetDoctor.name}</h3>
              <p className="mt-1 text-slate-600">
                {vetDoctor.speciality} • {vetDoctor.degree} • {vetDoctor.experience}
              </p>
              <p className="mt-3 text-slate-700">{vetDoctor.about}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-sm font-semibold ring-1 ring-blue-200">
                  Consultation: {vetDoctor.fees}
                </span>
                <button
                  onClick={() =>
                    document.getElementById("vet-services")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
                >
                  View Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="vet-services" className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Our Services
          </h2>
          <p className="mt-2 text-slate-600">
            Choose a veterinary service and book your appointment.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vetServices.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
                  <span className="text-blue-600 font-extrabold">Rs. {s.price}</span>
                </div>

                <div className="mt-2 flex items-center text-slate-500 text-sm gap-2">
                  <LuClock3 className="shrink-0" />
                  <span>{s.duration}</span>
                </div>

                <p className="mt-3 text-slate-600 text-sm leading-6">{s.description}</p>

                <button
                  onClick={() => handleBook(s)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-500 text-white font-semibold px-4 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
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
