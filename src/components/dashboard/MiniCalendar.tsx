import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface MiniCalendarProps {
  className?: string;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      isCurrentMonth: true,
      isToday: isCurrentMonth && d === todayDate,
    });
  }

  // Next month leading days to complete full grid (multiple of 7)
  const remaining = 35 - calendarDays.length;
  if (remaining > 0) {
    for (let n = 1; n <= remaining; n++) {
      calendarDays.push({
        day: n,
        isCurrentMonth: false,
        isToday: false,
      });
    }
  }

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <span className="font-['Space_Grotesk'] text-sm font-bold text-slate-900">
            {monthNames[month]} {year}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Bulan sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Bulan berikutnya"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((d, idx) => (
          <span
            key={idx}
            className={`text-[10px] font-bold uppercase tracking-wider ${
              idx === 0 ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((item, idx) => (
          <div
            key={idx}
            className={`h-7 w-7 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all ${
              item.isToday
                ? 'bg-blue-600 text-white font-bold shadow-xs shadow-blue-500/30'
                : item.isCurrentMonth
                ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                : 'text-slate-300'
            }`}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
};
