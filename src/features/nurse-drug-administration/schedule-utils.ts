export type NurseScheduleFrequency =
  | "OD"
  | "BD"
  | "TDS"
  | "QID"
  | "Every 6 Hours"
  | "Every 8 Hours"
  | "Every 12 Hours"
  | "SOS"
  | "STAT"
  | "Continuous"
  | string;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateOnly(value: string) {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return null;
}

function formatDatePart(date: Date) {
  return DATE_FORMATTER.format(date).replace(/ /g, "-");
}

export function formatDateDisplay(value?: string | null) {
  if (!value || value === "-") return value ?? "-";
  const date = toDateOnly(value);
  if (date) return formatDatePart(date);
  return value;
}

export function formatDateTimeDisplay(value?: string | null) {
  if (!value || value === "-") return value ?? "-";
  const dateTime = new Date(value);
  if (Number.isNaN(dateTime.getTime())) return value;
  return `${formatDatePart(dateTime)} ${TIME_FORMATTER.format(dateTime)}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getEndDate(startDate: string, days: string) {
  const start = toDateOnly(startDate);
  const dayCount = Number(days);
  if (!start || !Number.isFinite(dayCount) || dayCount <= 0) return "-";
  return formatDatePart(addDays(start, dayCount - 1));
}

export function getNextDueLabel(frequency: NurseScheduleFrequency) {
  const normalized = frequency.trim().toUpperCase();
  if (!normalized) return "-";
  if (normalized === "SOS") return "As Needed";
  if (normalized === "STAT") return "One immediate administration only";
  if (normalized === "CONTINUOUS") return "Continuous Infusion";
  if (normalized === "OD") return "08:00 AM daily";
  if (normalized === "BD") return "08:00 AM, 08:00 PM";
  if (normalized === "TDS") return "08:00 AM, 02:00 PM, 08:00 PM";
  if (normalized === "QID") return "06:00 AM, 12:00 PM, 06:00 PM, 12:00 AM";
  if (normalized === "EVERY 6 HOURS") return "06:00, 12:00, 18:00, 00:00";
  if (normalized === "EVERY 8 HOURS") return "06:00, 02:00 PM, 10:00 PM";
  if (normalized === "EVERY 12 HOURS") return "08:00 AM, 08:00 PM";
  return frequency;
}

function getFrequencySlots(frequency: NurseScheduleFrequency) {
  const normalized = frequency.trim().toUpperCase();
  if (normalized === "OD") return ["08:00 AM"];
  if (normalized === "BD") return ["08:00 AM", "08:00 PM"];
  if (normalized === "TDS") return ["08:00 AM", "02:00 PM", "08:00 PM"];
  if (normalized === "QID") return ["06:00 AM", "12:00 PM", "06:00 PM", "12:00 AM"];
  if (normalized === "EVERY 6 HOURS") return ["06:00", "12:00", "18:00", "00:00"];
  if (normalized === "EVERY 8 HOURS") return ["06:00", "02:00 PM", "10:00 PM"];
  if (normalized === "EVERY 12 HOURS") return ["08:00 AM", "08:00 PM"];
  if (normalized === "STAT") return ["Immediate"];
  if (normalized === "CONTINUOUS") return ["Continuous Infusion"];
  if (normalized === "SOS") return ["As Needed"];
  return [];
}

export function buildSchedule(startDate: string, days: string, frequency: NurseScheduleFrequency) {
  const start = toDateOnly(startDate);
  const dayCount = Number(days);
  if (!start || !Number.isFinite(dayCount) || dayCount <= 0) return [];
  const slots = getFrequencySlots(frequency);
  if (!slots.length || slots[0] === "As Needed" || slots[0] === "Immediate" || slots[0] === "Continuous Infusion") return [];

  return Array.from({ length: dayCount }, (_, index) => {
    const currentDate = addDays(start, index);
    return {
      date: formatDatePart(currentDate),
      times: slots,
    };
  });
}
