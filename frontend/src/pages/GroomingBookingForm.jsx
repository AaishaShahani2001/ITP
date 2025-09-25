// src/pages/GroomingBookingForm.jsx
import React from "react";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import groomingImg from "../assets/grooming.jpg";

// ---- helpers: local-date formatting (no UTC shift) ----
function toLocalYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function normalizeToLocalNoon(d) {
  const c = new Date(d);
  c.setHours(12, 0, 0, 0);
  return c;
}

// Pet types
const PET_TYPES = ["Dog", "Cat", "Rabbit", "Bird", "Other"];

// Packages (sample — align with your GroomingDetails list)
const PACKAGES = [
  { id: "basic-bath-brush", name: "Basic Bath & Brush", price: 2500 },
  { id: "full-grooming", name: "Full Grooming Package", price: 6500 },
  { id: "nail-trim", name: "Nail Trim Only", price: 1500 },
  { id: "deshedding", name: "De-shedding Treatment", price: 4500 },
  { id: "flea-tick", name: "Flea & Tick Treatment", price: 5500 },
  { id: "premium-spa", name: "Premium Spa Package", price: 9500 },
];

// Half-hour slots 08:00–20:00
const buildSlots = () => {
  const out = [];
  for (let m = 8 * 60; m <= 20 * 60; m += 30) {
    const h24 = Math.floor(m / 60);
    const mm = m % 60;
    const h12 = ((h24 + 11) % 12) + 1;
    const ampm = h24 >= 12 ? "PM" : "AM";
    out.push({ value: m, label: `${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${ampm}` });
  }
  return out;
};
const TIME_SLOTS = buildSlots();

/* ------- validation ------- */
const LK_PHONE_REGEX = /^(011|070|071|072|075|076|077|078)\d{7}$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;

const schema = yup.object({
  ownerName: yup.string().transform(v => (typeof v === "string" ? v.trim() : v))
    .required().matches(NAME_REGEX).min(2).max(60),
  phone: yup.string().required().matches(LK_PHONE_REGEX),
  email: yup.string().email().required(),
  petType: yup.string().oneOf(PET_TYPES).required(),
  packageId: yup.string().oneOf(PACKAGES.map(p => p.id)).required(),
  date: yup.date().typeError("Choose a valid date.")
    .required("Preferred date is required.")
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Date cannot be in the past."),
  timeSlot: yup.number().typeError("Select a time slot.").required().min(480).max(1200),
  notes: yup.string().max(400),
});

export default function GroomingBookingForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  // Prefill from query
  const preService = params.get("service") || "";
  const prePrice = params.get("price") || "";
  const defaultPkg =
    PACKAGES.find((p) => p.name === preService || String(p.price) === prePrice)?.id || "";
  const isLockedPackage = Boolean(defaultPkg);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ownerName: "",
      phone: "",
      email: "",
      petType: "",
      packageId: defaultPkg,
      date: null,
      timeSlot: undefined,
      notes: "",
    },
  });

  const onSubmit = async (vals) => {
    // ✅ timezone-safe date
    const dateISO = toLocalYMD(normalizeToLocalNoon(vals.date));

    const payload = {
      ownerName: vals.ownerName.trim(),
      phone: vals.phone.trim(),
      email: vals.email.trim(),
      petType: vals.petType,
      packageId: vals.packageId,
      dateISO, // <-- changed
      timeSlotMinutes: Number(vals.timeSlot),
      notes: vals.notes?.trim() || "",
    };

    try {
      const res = await fetch("http://localhost:3000/api/grooming/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        const msg = typeof data === "string" ? data : data?.error || data?.message || "Request failed";
        enqueueSnackbar("❌ " + msg, { variant: "error" });
        return;
      }

      enqueueSnackbar("Grooming appointment created!", { variant: "success" });
      navigate("/book/grooming");
    } catch (err) {
      console.error(err);
      enqueueSnackbar("❌ Network error. Is the API running on http://localhost:3000 ?", {
        variant: "error",
      });
    }
  };

  const pkgById = (id) => PACKAGES.find((p) => p.id === id);
  const lockedLabel = defaultPkg ? `${pkgById(defaultPkg)?.name} — Rs.${pkgById(defaultPkg)?.price}` : "";

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
            <img src={groomingImg} alt="Pet grooming" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/20 to-violet-600/10" />
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 ring-1 ring-black/5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Book Grooming Appointment</h2>
            <p className="text-slate-600 mb-4">Choose a package and your preferred date & time.</p>

            {preService && (
              <div className="mb-6 rounded-xl bg-violet-50 text-violet-900 px-4 py-3 ring-1 ring-violet-200">
                <div className="font-semibold">Selected:</div>
                <div className="text-sm">
                  {preService} {prePrice && <span>• Rs. {prePrice}</span>}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Owner info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Aaisha Shahani"
                    {...register("ownerName")}
                    onInput={(e) => {
                      const v = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
                      if (v !== e.currentTarget.value) e.currentTarget.value = v;
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="0711234567"
                    {...register("phone")}
                    onInput={(e) => {
                      const digits = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
                      if (digits !== e.currentTarget.value) e.currentTarget.value = digits;
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="mt-1 text-[12px] text-slate-500">
                    Must start with 011/070/071/072/075/076/077/078 and be 10 digits.
                  </p>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>

              {/* Pet type & package */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pet Type</label>
                  <select
                    {...register("petType")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Select pet type</option>
                    {PET_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.petType && <p className="mt-1 text-sm text-red-600">{errors.petType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Package</label>
                  {isLockedPackage ? (
                    <>
                      <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                        {lockedLabel}
                      </div>
                      <input type="hidden" value={defaultPkg} {...register("packageId")} />
                    </>
                  ) : (
                    <select
                      {...register("packageId")}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="">Select a package</option>
                      {PACKAGES.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — Rs.{p.price}</option>
                      ))}
                    </select>
                  )}
                  {errors.packageId && <p className="mt-1 text-sm text-red-600">{errors.packageId.message}</p>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="mm/dd/yyyy"
                        selected={field.value}
                        onChange={(d) => field.onChange(d)}
                        minDate={new Date()}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        dateFormat="MM/dd/yyyy"
                        isClearable
                      />
                    )}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                  <select
                    {...register("timeSlot")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  {errors.timeSlot && <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Special Requests / Notes</label>
                <textarea
                  rows={4}
                  placeholder="Any behaviors, allergies, sensitivities, or grooming preferences…"
                  {...register("notes")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/book/grooming")}
                  className="rounded-lg border border-slate-300 bg-white text-slate-700 px-4 py-2 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-violet-600 text-white px-5 py-2 font-semibold hover:bg-violet-700 disabled:opacity-60"
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
