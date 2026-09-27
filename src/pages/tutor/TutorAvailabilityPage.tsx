import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, Save, Plus, Trash2 } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { WeeklyAvailabilitySlot } from '../../types';
import { formatTimeDisplay, DAY_NAMES } from '../../utils/date';

const STANDARD_TIMES = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

export const TutorAvailabilityPage: React.FC = () => {
  const { currentUser, updateTutorAvailability, state } = useDemo();

  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailabilitySlot[]>(() => {
    if (currentUser?.weeklyAvailability && currentUser.weeklyAvailability.length > 0) {
      return currentUser.weeklyAvailability;
    }
    // Default 7 days
    return DAY_NAMES.map((dayName, idx) => ({
      dayOfWeek: idx,
      dayName,
      slots: ['10:00', '14:00', '16:00'],
    }));
  });

  const [isSaved, setIsSaved] = useState(false);

  if (!currentUser) return null;

  const toggleSlot = (dayIdx: number, slot: string) => {
    setWeeklyAvailability((prev) =>
      prev.map((item) => {
        if (item.dayOfWeek !== dayIdx) return item;
        const exists = item.slots.includes(slot);
        const updatedSlots = exists
          ? item.slots.filter((s) => s !== slot)
          : [...item.slots, slot].sort();
        return { ...item, slots: updatedSlots };
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTutorAvailability(currentUser.id, weeklyAvailability);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Weekly Availability Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configure your standard open hours ({state.settings.timezone}). Students will be able to book only during these selected slots.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          Save Weekly Schedule
        </button>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Availability updated successfully! Instant sync with student booking calendars.</span>
        </div>
      )}

      {/* Days Grid */}
      <div className="space-y-4">
        {weeklyAvailability.map((day) => (
          <div
            key={day.dayOfWeek}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                {day.dayName}
              </span>
              <span className="text-xs text-slate-400">
                {day.slots.length} slot(s) enabled
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {STANDARD_TIMES.map((time) => {
                const isSelected = day.slots.includes(time);
                return (
                  <button
                    type="button"
                    key={time}
                    onClick={() => toggleSlot(day.dayOfWeek, time)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    {formatTimeDisplay(time)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
