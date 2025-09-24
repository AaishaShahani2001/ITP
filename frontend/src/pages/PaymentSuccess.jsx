// src/pages/PaymentSuccess.jsx
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-8 text-center">
          {/* Success icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">
            Payment Successful
          </h1>
          <p className="mt-2 text-slate-600">
            Your appointment(s) have been marked as <span className="font-medium">paid</span>.
            A receipt has been sent to your email.
          </p>

          {/* Divider */}
          <div className="my-6 h-px bg-slate-200" />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-center">
            <Link
              to="/myCareappointments"
              className="inline-flex justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-white font-medium hover:bg-emerald-700"
            >
              View My Appointments
            </Link>
            <Link
              to="/"
              className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-700 font-medium hover:bg-slate-50"
            >
              Go Home
            </Link>
          </div>

          {/*  tiny note */}
          <p className="mt-4 text-xs text-slate-500">
            If your appointments don’t show as paid, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
