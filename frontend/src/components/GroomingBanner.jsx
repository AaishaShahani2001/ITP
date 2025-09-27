import React from "react";
import { Link } from "react-router-dom";
import { LuScissors, LuCircleCheck, LuArrowLeft } from "react-icons/lu";

export default function GroomingBanner() {
  return (
    <section className="relative bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/careservice"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:underline"
        >
          <LuArrowLeft size={18} /> Back to Services
        </Link>

        {/* Main content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-extrabold">
              <LuScissors size={36} /> Pet Grooming
            </h1>
            <p className="mt-2 text-lg opacity-90">
              Professional grooming to keep your pet looking and feeling great
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 text-sm md:text-base font-medium">
            <span className="inline-flex items-center gap-2">
              <LuCircleCheck size={18} /> Certified Groomers
            </span>
            <span className="inline-flex items-center gap-2">
              <LuCircleCheck size={18} /> Premium Products
            </span>
            <span className="inline-flex items-center gap-2">
              <LuCircleCheck size={18} /> Stress-Free Environment
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
