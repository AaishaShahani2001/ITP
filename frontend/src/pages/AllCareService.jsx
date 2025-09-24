import React, { useEffect, useState } from "react";
import CareBanner from "../components/CareBanner.jsx";
import CareArea from "./CareArea.jsx";
import ScheduleCalendar from "../components/ScheduleCalendar.jsx";

const API_BASE = "http://localhost:3000";

export default function AllCareService() {
  const [date, setDate] = useState(() => new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const ymd = date.toISOString().slice(0, 10);

  // Load all services for the selected day
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [v, g, d] = await Promise.all([
          fetch(`${API_BASE}/api/vet/appointments?date=${ymd}`).then((r) => r.json()).catch(() => []),
          fetch(`${API_BASE}/api/grooming/appointments?date=${ymd}`).then((r) => r.json()).catch(() => []),
          fetch(`${API_BASE}/api/daycare/appointments?date=${ymd}`).then((r) => r.json()).catch(() => []),
        ]);
        if (!alive) return;
        setAppointments([
          ...(Array.isArray(v) ? v : []),
          ...(Array.isArray(g) ? g : []),
          ...(Array.isArray(d) ? d : []),
        ]);
      } catch {
        if (alive) setAppointments([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [ymd]);

  // When a free slot is selected on the calendar
  function handleBook({ start, end }) {
    alert(`Free slot selected:\n${start.toLocaleString()} → ${end.toLocaleString()}`);
    // Example: navigate(`/book/grooming?date=${ymd}&start=${start.toISOString()}&end=${end.toISOString()}`)
  }

  return (
    <div>
      <CareBanner />
      <CareArea />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Schedule</h2>
            <p className="text-slate-600">Booked slots are shown with labels.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Date</label>
            <input
              type="date"
              value={ymd}
              onChange={(e) => setDate(new Date(e.target.value + "T00:00:00"))}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        {loading && (
          <div className="mb-4 text-slate-600">Loading appointments…</div>
        )}

        <ScheduleCalendar
          appointments={appointments}
          onBook={handleBook}
          date={date}
          onDateChange={setDate}
          startHour={8}
          endHour={20}
          slotMinutes={30}
        />
      </div>
    </div>
  );
}
