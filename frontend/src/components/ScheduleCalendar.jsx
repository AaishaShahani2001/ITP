// src/pages/ScheduleCalendar.jsx
import React, { useMemo, useState, useCallback, useRef } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  startOfDay,
  startOfMonth,
  endOfMonth,
  endOfWeek,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const API_BASE = "http://localhost:3000/api";

/* ---------- date-fns localizer ---------- */
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse: (str, fmt, refDate) => parse(str, fmt, refDate, { locale: enUS }),
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function ScheduleCalendar({
  startHour = 8,
  endHour = 20,
  slotMinutes = 30,
  onBook = () => {},
}) {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 💡 "Today @ 00:00" boundary used everywhere to filter out past *days*
  const TODAY = startOfDay(new Date());

  // color events by service
  const eventPropGetter = (event) => {
    const s = event.resource?.service;
    let style = { backgroundColor: "#e2e8f0", borderRadius: 8, border: "none", color: "#0f172a" };
    if (s === "grooming") style.backgroundColor = "#fde7ff";
    if (s === "vet") style.backgroundColor = "#dbeafe";
    if (s === "daycare") style.backgroundColor = "#dcfce7";
    return { style };
  };

  // ---------- custom event renderers ----------
  const MonthEvent = ({ event }) => {
    const t = `${format(event.start, "hh:mm a")}–${format(event.end, "hh:mm a")}`;
    return (
      <div className="leading-tight">
        <div className="text-[11px] font-semibold">{t}</div>
        <div className="text-[11px]">{event.title}</div>
      </div>
    );
  };
  const GridEvent = ({ event }) => <div className="text-[12px]">{event.title}</div>;

  // fetch one day from all services
  const fetchDay = useCallback(async (ymd) => {
    const mk = (arr, service) =>
      (Array.isArray(arr) ? arr : []).map((a) => {
        const startD = toDate(a.date || ymd, a.start);
        const endD = toDate(a.date || ymd, a.end);
        return {
          id: a.id || a._id || `${service}-${ymd}-${a.start}-${a.end}`,
          title: a.title || service, // title WITHOUT time (Day/Week already show time)
          start: startD,
          end: endD,
          resource: { service },
        };
      });

    const [vRes, gRes, dRes] = await Promise.allSettled([
      fetch(`${API_BASE}/vet/appointments?date=${ymd}`),
      fetch(`${API_BASE}/grooming/appointments?date=${ymd}`),
      fetch(`${API_BASE}/daycare/appointments?date=${ymd}`),
    ]);

    const dayEvents = [];
    if (vRes.status === "fulfilled" && vRes.value.ok) {
      const data = await vRes.value.json().catch(() => []);
      dayEvents.push(...mk(data, "vet"));
    }
    if (gRes.status === "fulfilled" && gRes.value.ok) {
      const data = await gRes.value.json().catch(() => []);
      dayEvents.push(...mk(data, "grooming"));
    }
    if (dRes.status === "fulfilled" && dRes.value.ok) {
      const data = await dRes.value.json().catch(() => []);
      dayEvents.push(...mk(data, "daycare"));
    }
    return dayEvents;
  }, []);

  // --------- range loader with batching + guard ----------
  const loadIdRef = useRef(0);

  const fetchRange = useCallback(
    async (start, end) => {
      setLoading(true);
      const myLoadId = ++loadIdRef.current; // newer navigations cancel older loads
      try {
        // If the whole range is in the past, don't fetch anything.
        if (end < TODAY) {
          if (loadIdRef.current === myLoadId) setEvents([]);
          return;
        }

        //  Only fetch from TODAY forward — this is the key change.
        const days = enumerateDays(start, end)
          .filter((d) => d >= TODAY); // <-- filter out past *days*

        const BATCH = 7; // fetch 7 days at a time (keeps Month snappy)
        const all = [];
        for (let i = 0; i < days.length; i += BATCH) {
          const chunk = days.slice(i, i + BATCH);
          const results = await Promise.all(chunk.map((d) => fetchDay(toYMD(d))));
          if (loadIdRef.current !== myLoadId) return; // user navigated again
          all.push(...results.flat());
        }
        if (loadIdRef.current === myLoadId) setEvents(all);
      } catch (e) {
        console.error("Calendar load error:", e);
        if (loadIdRef.current === myLoadId) setEvents([]);
      } finally {
        if (loadIdRef.current === myLoadId) setLoading(false);
      }
    },
    [fetchDay, TODAY]
  );

  // compute the full visible grid for a given month (Mon–Sun rows)
  const getVisibleMonthRange = useCallback((anchorDate) => {
    const start = startOfWeek(startOfMonth(anchorDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(anchorDate), { weekStartsOn: 1 });
    return { start: startOfDay(start), end: startOfDay(end) };
  }, []);

  // react-big-calendar calls this when the grid changes (dragging / buttons)
  const handleRangeChange = useCallback(
    (range) => {
      if (Array.isArray(range)) {
        // Month view -> array of dates covering the grid
        const start = startOfDay(range[0]);
        const end = startOfDay(range[range.length - 1]);
        fetchRange(start, end);
        setDate(range[0] || new Date());
      } else if (range && range.start && range.end) {
        // Day/Week -> {start, end}
        const start = startOfDay(range.start);
        const end = startOfDay(range.end);
        fetchRange(start, end);
        setDate(range.start);
      }
    },
    [fetchRange]
  );

  // Proactively load when user clicks Next/Back/Today in Month view
  const handleNavigate = useCallback(
    (newDate, view) => {
      setDate(newDate);
      if (view === Views.MONTH) {
        const { start, end } = getVisibleMonthRange(newDate);
        fetchRange(start, end);
      }
      // For Day/Week, onRangeChange fires with the right span; no extra work needed
    },
    [fetchRange, getVisibleMonthRange]
  );

  return (
    <section className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-black">Scheduled Appointments</h2>
        {loading && <span className="text-sm text-slate-500">Loading…</span>}
      </div>

      <Calendar
        localizer={localizer}
        date={date}
        onNavigate={handleNavigate}         // keep our navigate handler
        onRangeChange={handleRangeChange}   // trigger loads on view/span changes
        events={events}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        defaultView={Views.WEEK}
        step={slotMinutes}
        timeslots={1}
        min={timeOfDay(startHour)}
        max={timeOfDay(endHour)}
        selectable
        // ❗ Optional: Block booking in the past (defensive UX)
        onSelectSlot={({ start, end }) => {
          if (startOfDay(start) < TODAY) return; // ignore clicks on past days
          onBook({ start, end });
        }}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventPropGetter}
        components={{
          month: { event: MonthEvent },
          week: { event: GridEvent },
          day: { event: GridEvent },
        }}
        className="rounded-lg border border-gray-200"
      />
    </section>
  );
}

/* ---------- helpers ---------- */
function toDate(ymd, hhmm) {
  let s = (hhmm || "").toString().trim().toUpperCase();
  let ampm = null;
  if (s.endsWith("AM") || s.endsWith("PM")) {
    ampm = s.slice(-2);
    s = s.replace(/AM|PM/, "").trim();
  }
  const [hStr, mStr] = s.split(":");
  let h = parseInt(hStr || "0", 10);
  const m = parseInt(mStr || "0", 10);
  if (ampm) {
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
  }
  const [Y, M, D] = (ymd || "").split("-").map((n) => parseInt(n || "0", 10));
  return new Date(Y, (M || 1) - 1, D || 1, h, m, 0, 0);
}
function timeOfDay(hour) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d;
}
function toYMD(d) {
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function enumerateDays(start, end) {
  const out = [];
  let cur = startOfDay(start);
  const last = startOfDay(end);
  while (cur <= last) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}
