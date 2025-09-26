import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../store/cartStore";
import { useSnackbar } from "notistack";
import ConfirmDialog from "../components/ConfirmDialog";

const API_BASE = "http://localhost:3000/api";

const SERVICE_LABEL = {
  vet: "Veterinary Care",
  grooming: "Grooming",
  daycare: "Daycare",
};

const EDIT_PATH = {
  vet: "/vet-edit", // vet-edit form
  grooming: "/grooming-edit", //grooming-edit form
  daycare: "/daycare-edit", //daycare-edit form
};

function broadcastAppointmentsChanged(detail = {}) {
  window.dispatchEvent(new CustomEvent("appointments:changed", { detail }));
}

/* ---------------- Price mapping ------------------ */
const PRICE_TABLE = {
  grooming: {
    "basic-bath-brush": 2500,
    "full-grooming": 6500,
    "nail-trim": 1500,
    "deshedding": 4500,
    "flea-tick": 5500,
    "premium-spa": 9500,
  },
  daycare: {
    "half-day": 3000,
    "full-day": 5500,
    "extended-day": 7000,
  },
  vet: {
    "general-health-checkup": 7500,
    "vaccination": 4500,
    "emergency-care": 15000,
  },
};

// small helper to normalize keys like "Full Day" → "full-day"
function keyify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// getting price details for each appointment
function getPrice(a) {
  const service = String(a?.service || "").toLowerCase();
  const pkgKey =
    keyify(a?.packageId) ||
    keyify(a?.packageName) ||
    keyify(a?.selectedService) ||
    keyify(a?.title);

  const table = PRICE_TABLE[service] || {};
  const fromTable = table[pkgKey];
  return Number.isFinite(Number(fromTable)) ? Number(fromTable) : 0;
}

/* ---------- NEW: date formatter used in the list ---------- */
function fmtDate(ymd) {
  if (!ymd) return "-";
  try {
    const [Y, M, D] = String(ymd).split("-").map((n) => parseInt(n || "0", 10));
    const d = new Date(Y, (M || 1) - 1, D || 1);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return ymd;
  }
}

export default function MyAppointmentPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [params] = useSearchParams();

  const [email, setEmail] = useState(() => params.get("email") || "");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAppt, setPendingAppt] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // cart bits
  const { addItem, addMany } = useCart();
  const [selected, setSelected] = useState(null); // mini summary modal
  const [showAddMore, setShowAddMore] = useState(false); // add-more modal

  const pendingTimersRef = useRef(new Map()); // id -> { timer, prevItems, snackbarKey }

  // Keep latest email for event handler (avoid stale closures)
  const emailRef = useRef(email);
  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  // normalize id in one place
  const getApptId = (a) => a?._id || a?.id;

  // open/close dialog
  function openConfirm(appt) {
    setPendingAppt(appt);
    setConfirmOpen(true);
  }
  function closeConfirm() {
    setConfirmOpen(false);
    setPendingAppt(null);
    setDeletingId(null);
  }

  // --- API: fetch my appointments by email ---
  async function fetchMyAppointments(emailArg) {
    const url = `${API_BASE}/schedule/mine?email=${encodeURIComponent(emailArg)}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON but got: ${text.slice(0, 120)}…`);
    }

    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  }

  async function loadMine(forceEmail) {
    const e = forceEmail ?? emailRef.current;
    if (!e) {
      alert("Please enter your email first.");
      return;
    }
    try {
      setLoading(true);
      const list = await fetchMyAppointments(e);
      setItems(list);
    } catch (err) {
      console.error(err);
      alert(`Failed to load: ${err.message || err}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // auto-load if ?email= is present
  useEffect(() => {
    if (email) loadMine(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔔 Listen for updates from other pages (e.g., EditVetForm)
  useEffect(() => {
    const handler = () => {
      if (emailRef.current) loadMine(emailRef.current);
    };
    window.addEventListener("appointments:changed", handler);
    return () => window.removeEventListener("appointments:changed", handler);
  }, []);

  // --- Actions (EDIT & DELETE) ---
  async function confirmDelete() {
    if (!pendingAppt) return;
    const id = getApptId(pendingAppt);
    if (!id) {
      enqueueSnackbar("Missing appointment id.", { variant: "warning" });
      closeConfirm();
      return;
    }

    // show 'Deleting…' on the confirm button
    setDeletingId(id);

    // Optimistic remove
    const prevItems = items;
    setItems((cur) => cur.filter((x) => getApptId(x) !== id));

    try {
      const res = await fetch(`${API_BASE}/${pendingAppt.service}/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // revert on failure
        setItems(prevItems);
        enqueueSnackbar(data?.message || data?.error || "Delete failed", { variant: "error" });
        return;
      }

      enqueueSnackbar("Appointment deleted.", { variant: "success" });

      // notify calendar & dashboards
      broadcastAppointmentsChanged({ action: "deleted", service: pendingAppt.service, id });
    } catch (e) {
      // revert on network error
      setItems(prevItems);
      enqueueSnackbar("Network error while deleting.", { variant: "error" });
    } finally {
      closeConfirm();
    }
  }

  function edit(appt) {
    const apptId = appt?.id || appt?._id;
    if (!apptId) {
      alert("Missing appointment id.");
      return;
    }

    if (!EDIT_PATH[appt.service]) {
      alert("Unknown service type.");
      return;
    }

    // For vet: pass both a query param (editId) AND the doc via location.state
    if (appt.service === "vet") {
      navigate(`${EDIT_PATH.vet}?editId=${apptId}`, { state: { appointment: appt } });
      return;
    }

    // (optional) keep existing paths for other services
    navigate(`${EDIT_PATH[appt.service]}?editId=${apptId}`);
  }

  // Pay Online — open mini summary first
  function pay(appt) {
    if (appt.paymentStatus === "paid") return;
    setSelected(appt);
  }

  function proceedToCheckoutFromSummary() {
    if (!selected) return;
    addItem({
      id: selected._id || selected.id,
      service: selected.service,
      title: selected.title,
      price: getPrice(selected),
      extras: selected.extras || [],
    });
    setShowAddMore(true);
  }

  function addMoreAndGo(ids) {
    const extra = items
      .filter((a) => ids.includes(a.id || a._id))
      .map((a) => ({
        id: a._id || a.id,
        title: a.title,
        price: getPrice(a),
        extras: a.extras || [],
      }));
    addMany(extra);
    setShowAddMore(false);
    setSelected(null);
    navigate("/cart");
  }

  function skipAddMore() {
    setShowAddMore(false);
    setSelected(null);
    navigate("/cart");
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
        My Appointments
      </h1>

      {/* Email input + Load button */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-6">
        <input
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full md:w-80 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => loadMine()}
          disabled={loading}
          className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Load My Appointments"}
        </button>
      </div>

      {/* List */}
      {items.length === 0 && !loading ? (
        <p className="text-slate-600">No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((a) => (
            <li
              key={`${a.service}-${a._id || a.id}`}
              className="bg-white rounded-xl p-4 ring-1 ring-black/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Service</span>
                  <span className="text-sm font-semibold">
                    {SERVICE_LABEL[a.service] || a.service}
                  </span>
                </div>
                <div className="text-slate-900 font-semibold">{a.title}</div>

                {/* Date • Start–End */}
                <div className="text-sm text-slate-600">
                  {fmtDate(a.date || a.dateISO)} • {a.start}–{a.end}
                </div>

                {/* Price line */}
                <div className="mt-1 font-semibold">
                  Price: Rs. {getPrice(a).toFixed(2)}
                </div>

                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  <Badge
                    label={`Status: ${a.status || "pending"}`}
                    tone={statusTone(a.status)}
                  />
                  <Badge
                    label={`Payment: ${a.paymentStatus || "unpaid"}`}
                    tone={a.paymentStatus === "paid" ? "green" : "slate"}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => edit(a)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => openConfirm(a)}
                  disabled={a.status === "cancelled" || a.status === "rejected" || loading}
                  className="rounded-lg bg-red-600 text-white px-3 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-red-700"
                >
                  Cancel
                </button>

                <button
                  onClick={() => pay(a)}
                  disabled={
                    a.paymentStatus === "paid" ||
                    a.status === "cancelled" ||
                    a.status === "rejected" ||
                    loading
                  }
                  className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-emerald-700"
                >
                  {a.paymentStatus === "paid" ? "Paid" : "Pay Online"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* --- Mini Order Summary modal --- */}
      {selected && !showAddMore && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:w-[480px] rounded-t-2xl sm:rounded-2xl p-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <p className="mt-1 text-gray-700">{selected.title}</p>
            <ul className="mt-2 text-sm text-gray-600 list-disc ml-5">
              {(selected.extras || []).map((e, i) => (
                <li key={i}>
                  {e.name} (+Rs. {Number(e.price || 0).toFixed(2)})
                </li>
              ))}
            </ul>

            <div className="mt-3 font-bold">
              Total: Rs.&nbsp;
              {(
                getPrice(selected) +
                (selected.extras || []).reduce((a, e) => a + Number(e.price || 0), 0)
              ).toFixed(2)}
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => setSelected(null)} className="px-3 py-2 rounded-lg border">
                Cancel
              </button>
              <button onClick={proceedToCheckoutFromSummary} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- “Add anything else?” modal --- */}
      {showAddMore && (
        <AddMoreModal
          appts={items.filter(
            (a) =>
              a.id !== selected?.id &&
              a.status !== "cancelled" &&
              a.status !== "rejected" &&
              a.paymentStatus !== "paid"
          )}
          onSkip={skipAddMore}
          onConfirm={addMoreAndGo}
          onClose={() => setShowAddMore(false)}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete appointment?"
        message="This action cannot be undone. Are you sure you want to delete this appointment?"
        confirmLabel="Delete"
        cancelLabel="Keep"
        loading={Boolean(deletingId)}
        onConfirm={confirmDelete}
        onClose={closeConfirm}
      />
    </section>
  );
}

/* ---------- tiny helpers ---------- */

function Badge({ label, tone = "slate" }) {
  const tones = {
    green: "text-emerald-700 bg-emerald-50 ring-emerald-200",
    red: "text-red-700 bg-red-50 ring-red-200",
    amber: "text-amber-800 bg-amber-50 ring-amber-200",
    slate: "text-slate-700 bg-slate-100 ring-slate-200",
    blue: "text-blue-700 bg-blue-50 ring-blue-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md ring-1 text-[12px] ${tones[tone]}`}>
      {label}
    </span>
  );
}

function statusTone(s) {
  switch ((s || "pending").toLowerCase()) {
    case "accepted":
      return "green";
    case "rejected":
      return "red";
    case "cancelled":
      return "amber";
    default:
      return "blue"; // pending
  }
}

function AddMoreModal({ appts, onSkip, onConfirm, onClose }) {
  const [picked, setPicked] = useState([]);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-[520px] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add anything else?</h3>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>

        <div className="mt-3 max-h-64 overflow-auto divide-y">
          {appts.length === 0 && <div className="text-gray-500 py-4">No other pending appointments.</div>}
          {appts.map((a) => (
            <label key={a.id} className="flex items-center gap-3 py-2">
              <input type="checkbox" checked={picked.includes(a.id)} onChange={() => toggle(a.id)} />
              <div>
                <div className="font-medium">
                  {SERVICE_LABEL[a.service] || a.service} — {a.title}
                </div>
                <div className="text-sm text-slate-600">Rs. {getPrice(a).toFixed(2)}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          <button onClick={onSkip} className="px-3 py-2 rounded-lg border">Skip</button>
          <button
            onClick={() => onConfirm(picked)}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50"
            disabled={appts.length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
