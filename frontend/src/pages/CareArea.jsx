import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { LuStethoscope, LuScissors, LuHouse, LuCalendarDays } from "react-icons/lu";

const services = [
  {
    key: "vetappointment",
    title: "Veterinary Care",
    blurb:
      "Professional medical care for your pets with certified veterinary doctor.",
    points: [
      "Regular check-ups",
      "vaccinations",
      "Emergency medical care",
      "Dental care",
      "Health monitoring and advice",
    ],
    icon: LuStethoscope,
    to: "/book/vetappointment",
    iconGradient: "from-blue-500 to-blue-600",
    btnGradient: "from-blue-500 to-blue-600",
  },
  {
    key: "grooming",
    title: "Pet Grooming",
    blurb:
      "Keep your pets looking and feeling their best with our grooming services.",
    points: [
      "Full-service bathing and drying",
      "Hair cutting and styling",
      "Nail trimming",
      "Ear cleaning",
      "Flea and tick treatments",
    ],
    icon: LuScissors,
    to: "/book/grooming",
    iconGradient: "from-purple-500 to-fuchsia-500",
    btnGradient: "from-purple-500 to-fuchsia-500",
  },
  {
    key: "daycare",
    title: "Pet Daycare",
    blurb:
      "Safe and fun daycare services for your pets while you're away.",
    points: [
      "Supervised playtime",
      "Socialization with other pets",
      "Exercises and activities",
      "Comfortable Rest Areas",
      "Feeding and medication",
    ],
    icon: LuHouse,
    to: "/book/daycare",
    iconGradient: "from-emerald-500 to-green-600",
    btnGradient: "from-emerald-500 to-green-600",
  },
];

export default function CareArea() {
  useEffect(() => {
    if (window.location.hash === "#carearea") {
      const el = document.getElementById("carearea");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section id="carearea" className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Our Services
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            We offer a complete range of services to keep your pets healthy,
            happy, and well-cared for.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ key, title, blurb, points, icon: Icon, to, iconGradient, btnGradient }) => (
            <div
              key={key}
              className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-7 hover:shadow-md transition"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-white bg-gradient-to-br ${iconGradient} mb-5`}
              >
                <Icon size={26} />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
              <p className="mt-2 text-slate-600">{blurb}</p>

              {/* Bullet list */}
              <ul className="mt-4 space-y-2 text-slate-700">
                {points.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-6">
                <Link
                  to={to}
                  aria-label={`Book ${title}`}
                  className={`inline-flex w-full items-center justify-center gap-2
                              rounded-xl text-white font-semibold px-4 py-3 shadow
                              focus:outline-none focus:ring-2 focus:ring-black/10
                              bg-gradient-to-br ${btnGradient} hover:opacity-90 active:opacity-95`}
                >
                  <LuCalendarDays size={20} />
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
