// src/pages/DaycareBookingForm.jsx
import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import daycareImg from "../assets/dayCare.jpg";

/* ---- helpers: format local date safely (no UTC shift) ---- */
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

// Daycare packages (sample)
const daycarePackages = [
  { id: "half-day", name: "Half-Day Play Session", durationHours: 4 },
  { id: "full-day", name: "Full-Day Daycare", durationHours: 8 },
  { id: "extended-day", name: "Extended Daycare (Late Pickup)", durationHours: 10 },
];

// --- Time slots: every 30 mins between 08:00–20:00 ---
const buildSlots = () => {
  const slots = [];
  for (let m = 8 * 60; m <= 20 * 60; m += 30) {
    const h24 = Math.floor(m / 60);
    const mm = m % 60;
    const h12 = ((h24 + 11) % 12) + 1;
    const ampm = h24 >= 12 ? "PM" : "AM";
    const label = `${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${ampm}`;
    slots.push({ value: m, label });
  }
  return slots;
};
const TIME_SLOTS = buildSlots();

// Block common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "yopmail.com", "guerrillamail.com", "10minutemail.com",
  "temp-mail.org", "tempmail.dev", "discard.email", "getnada.com", "trashmail.com",
]);

// Pet types
const PET_TYPES = ["Dog", "Cat", "Rabbit", "Parrot", "Other"];

const NAME_REGEX = /^[A-Za-z\s]+$/;
const PHONE_REGEX = /^(011|070|071|072|075|076|077|078)\d{7}$/;
const ALLOWED_PREFIXES = ["011", "070", "071", "072", "075", "076", "077", "078"];
const TEN_DIGIT_PREFIX = new RegExp(`^(?:${ALLOWED_PREFIXES.join("|")})\\d{7}$`);

const labelForPkg = (id) => daycarePackages.find((p) => p.id === id)?.name || id;

export default function DaycareBookingForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const preselectedPackageName = params.get("service") || "";
  const defaultPackageId =
    daycarePackages.find((p) => p.name === preselectedPackageName)?.id || "";

  const schema = yup.object({
    ownerName: yup.string().trim().required().min(2).max(60).matches(NAME_REGEX),
    ownerEmail: yup
      .string()
      .transform((v) => (typeof v === "string" ? v.trim().toLowerCase() : v))
      .required()
      .email()
      .max(254)
      .test("not-disposable", "Please use a real (non-disposable) email.", (val) => {
        if (!val || !val.includes("@")) return true;
        const domain = val.split("@")[1];
        return domain && !DISPOSABLE_DOMAINS.has(domain.toLowerCase());
      }),
    ownerPhone: yup.string().required().matches(PHONE_REGEX),
    emergencyPhone: yup
      .string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
      .test("em-prefix", `Enter a 10-digit number starting with ${ALLOWED_PREFIXES.join("/")}`,
        (val) => !val || TEN_DIGIT_PREFIX.test(val)),
    petType: yup.string().required().oneOf(PET_TYPES),
    petName: yup.string().transform((v) => (typeof v === "string" ? v.trim() : v))
      .required().min(2).max(40).matches(NAME_REGEX),
    packageId: yup.string().required()
      .test("pkg-locked", "Package cannot be changed.",
        (val) => !defaultPackageId || val === defaultPackageId),
    date: yup.date().typeError("Please choose a valid date.")
      .required("Date is required.")
      .min(new Date(new Date().setHours(0, 0, 0, 0)), "Date cannot be in the past."),
    dropOff: yup.number().typeError("Select a drop-off time.").required().min(480).max(1200),
    pickUp: yup.number().typeError("Select a pick-up time.").required().min(480).max(1200)
      .test("after-drop", "Pick-up must be after drop-off.",
        function (val) { const { dropOff } = this.parent; return typeof dropOff === "number" && typeof val === "number" ? val > dropOff : false; }),
    notes: yup.string().max(300),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      emergencyPhone: "",
      petType: "",
      petName: "",
      packageId: defaultPackageId || "",
      date: null,
      dropOff: undefined,
      pickUp: undefined,
      notes: "",
    },
  });

  const dropOffVal = watch("dropOff");
  const pickUpOptions = useMemo(() => {
    if (typeof dropOffVal !== "number") return TIME_SLOTS;
    return TIME_SLOTS.filter((t) => t.value > dropOffVal);
  }, [dropOffVal]);

  const onSubmit = async (values) => {
    // ✅ TZ-safe date formatting
    const localNoon = normalizeToLocalNoon(values.date);
    const dateISO = toLocalYMD(localNoon);

    const payload = {
      ownerName: values.ownerName.trim(),
      ownerEmail: values.ownerEmail.trim(),
      ownerPhone: values.ownerPhone.trim(),
      emergencyPhone: values.emergencyPhone?.trim() || null,
      petType: values.petType,
      petName: values.petName.trim(),
      packageId: values.packageId,
      dateISO,                                           // <-- changed
      dropOffMinutes: Number(values.dropOff),
      pickUpMinutes: Number(values.pickUp),
      notes: values.notes?.trim() || "",
    };

    try {
      const res = await fetch("http://localhost:3000/api/daycare/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        const msg = typeof data === "string" ? data : data?.message || "Request failed";
        enqueueSnackbar("❌ " + msg, { variant: "error" });
        return;
      }

      enqueueSnackbar("Daycare booking created!", { variant: "success" });
      navigate("/book/daycare");
    } catch {
      enqueueSnackbar("❌ Network error. Is the API running on http://localhost:3000 ?", {
        variant: "error",
      });
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative">
              <img src={daycareImg} alt="Pets enjoying daycare" className="h-56 w-full object-cover lg:h-full" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-teal-600/10" />
            </div>

            {/* Form */}
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Book Daycare Service</h2>
              <p className="text-slate-600 mb-6">Fill in the details below to reserve your pet’s spot.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Owner info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Aaisha Shahani"
                      {...register("ownerName", { setValueAs: (v) => (v || "").replace(/[^A-Za-z\s]/g, "") })}
                      onInput={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern={PHONE_REGEX.source}
                      maxLength={10}
                      placeholder="0712345678 / 0112345678"
                      {...register("ownerPhone", { setValueAs: (v) => (v || "").replace(/\D/g, "").slice(0, 10) })}
                      onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.ownerPhone && <p className="mt-1 text-sm text-red-600">{errors.ownerPhone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner Email</label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="aaisha@example.com"
                      {...register("ownerEmail")}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.ownerEmail && <p className="mt-1 text-sm text-red-600">{errors.ownerEmail.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact (optional)</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern={PHONE_REGEX.source}
                      maxLength={10}
                      placeholder="0712345678 / 0112345678"
                      {...register("emergencyPhone", {
                        setValueAs: (v) => {
                          const onlyDigits = (v || "").replace(/\D/g, "").slice(0, 10);
                          return onlyDigits === "" ? "" : onlyDigits;
                        },
                      })}
                      onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.emergencyPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone.message}</p>
                    )}
                  </div>
                </div>

                {/* Pet Type + Pet Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pet Type</label>
                    <select
                      {...register("petType")}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select pet type</option>
                      {PET_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errors.petType && <p className="mt-1 text-sm text-red-600">{errors.petType.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pet Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Milo"
                      {...register("petName", { setValueAs: (v) => (v || "").replace(/[^A-Za-z\s]/g, "") })}
                      onInput={(e) => (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.petName && <p className="mt-1 text-sm text-red-600">{errors.petName.message}</p>}
                  </div>
                </div>

                {/* Package */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Package</label>
                  {defaultPackageId ? (
                    <>
                      <div className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200">
                        {labelForPkg(defaultPackageId)}
                      </div>
                      <input type="hidden" value={defaultPackageId} {...register("packageId")} />
                    </>
                  ) : (
                    <select
                      {...register("packageId")}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select a package</option>
                      {daycarePackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                      ))}
                    </select>
                  )}
                  {errors.packageId && <p className="mt-1 text-sm text-red-600">{errors.packageId.message}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="mm/dd/yyyy"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        minDate={new Date()}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dateFormat="MM/dd/yyyy"
                        isClearable
                      />
                    )}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                </div>

                {/* Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Drop-off Time</label>
                    <select
                      {...register("dropOff")}
                      onChange={(e) => {
                        setValue("dropOff", Number(e.target.value));
                        setValue("pickUp", undefined);
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select time</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {errors.dropOff && <p className="mt-1 text-sm text-red-600">{errors.dropOff.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pick-up Time</label>
                    <select
                      {...register("pickUp")}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Select time</option>
                      {pickUpOptions.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {errors.pickUp && <p className="mt-1 text-sm text-red-600">{errors.pickUp.message}</p>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Special Instructions / Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Dietary restrictions, medications, behavioral notes..."
                    {...register("notes")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/book/daycare")}
                    className="rounded-lg border border-slate-300 bg-white text-slate-700 px-4 py-2 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-emerald-600 text-white px-5 py-2 font-semibold hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {isSubmitting ? "Booking..." : "Book Daycare"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /card */}
      </div>
    </section>
  );
}
