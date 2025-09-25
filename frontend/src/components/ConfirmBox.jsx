export default function ConfirmBox({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  loading = false,
  tone = "success", // "success" | "danger" | "neutral"
}) {
  if (!open) return null;

  const btnClass =
    tone === "danger"
      ? "bg-rose-600 hover:bg-rose-700"
      : tone === "success"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-slate-800 hover:bg-slate-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={loading ? undefined : onClose} />
      {/* Dialog */}
      <div className="relative bg-white w-[95%] max-w-md rounded-2xl shadow-2xl ring-1 ring-black/10 p-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-slate-600">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-3 py-2 rounded-lg text-white font-semibold disabled:opacity-50 ${btnClass}`}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
