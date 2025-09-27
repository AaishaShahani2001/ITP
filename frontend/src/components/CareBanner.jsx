import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowNarrowRight } from "react-icons/hi";

export default function AllCareService() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const target = document.getElementById("carearea");
    if (target) {
      // CareArea is on the same page → smooth scroll
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } 
    else {
      // CareArea is a separate page → navigate to it (with hash)
      navigate("/carearea#carearea");
    }
  };

  return (
    <section
      role="banner"
      aria-label="Professional Pet Services"
      className="relative isolate bg-gray-200 text-black
                 min-h-[60vh] flex items-center justify-center text-center
                 px-2 py-10 md:py-14 rounded-b-2xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20
                      bg-[radial-gradient(60%_60%_at_50%_40%,white,transparent)]" />

      <div className="relative z-10 max-w-screen-lg mx-auto">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
          Professional Pet Services
        </h1>

        <p className="text-base md:text-xl/7 opacity-95 max-w-3xl mx-auto mb-7 text-gray-500">
          Comprehensive care for your beloved pets with experienced professionals
          and state-of-the-art facilities.
        </p>

        <button
          onClick={handleGetStarted}
          className="inline-flex items-center gap-2 bg-white text-slate-800
                     font-semibold px-5 py-3 rounded-xl shadow-lg
                     transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none
                     focus:ring-2 focus:ring-white/70"
          type="button"
        >
          Get Started
          <HiArrowNarrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
