import React, { useState, useEffect } from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import type { AdminAppointment } from "../types";
import { AppointmentStatus, TIME_SLOTS } from "../types";
import { useUpdateAppointment } from "../hooks/appointment/useUpdateAppointment";
import { useDeleteAppointment } from "../hooks/appointment/useDeleteAppointment";

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    updatedData: Partial<AdminAppointment>,
    shouldNotify: boolean
  ) => void;
  appointment: AdminAppointment | null;
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  appointment,
}) => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>(
    AppointmentStatus.PENDING
  );
  const [shouldNotify, setShouldNotify] = useState(true);

  const updateAppointmentMutation = useUpdateAppointment();
  const { deleteAppointment } = useDeleteAppointment();

  useEffect(() => {
    if (appointment) {
      setDate(appointment.date);
      setTimeSlot(appointment.timeSlot);
      setStatus(appointment.status);
      setShouldNotify(true);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSave(
    //   {
    //     ...appointment,
    //     date,
    //     timeSlot,
    //     status,
    //   },
    //   shouldNotify
    // );
    updateAppointmentMutation.mutate({
      id: appointment.id,
      date,
      timeSlot,
      status,
    });
    isOpen = false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
          <h3 className="text-xl font-serif font-bold text-stone-700">
            編輯預約資訊
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Guest Name Display */}
            <div className="flex items-center gap-2 text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
              <span className="text-sm font-medium">預約人：</span>
              <span className="font-bold">{appointment.name}</span>
            </div>

            {/* Date Selection */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-500">
                預約日期
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-morandi-primary/20 focus:border-morandi-primary outline-none text-stone-600"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-500">
                預約時段
              </label>
              <div className="relative">
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-morandi-primary/20 focus:border-morandi-primary outline-none text-stone-600 appearance-none"
                  required
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-500">
                預約狀態
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as AppointmentStatus)
                  }
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-morandi-primary/20 focus:border-morandi-primary outline-none text-stone-600 appearance-none"
                >
                  {Object.values(AppointmentStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            {/* Notify Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="notify"
                checked={shouldNotify}
                onChange={(e) => setShouldNotify(e.target.checked)}
                className="w-5 h-5 rounded border-stone-300 text-morandi-primary focus:ring-morandi-primary cursor-pointer"
              />
              <label
                htmlFor="notify"
                className="text-sm text-stone-600 select-none cursor-pointer"
              >
                透過 LINE 通知客人變更
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-morandi-primary text-stone-500 rounded-xl hover:bg-morandi-accent font-medium shadow-md hover:shadow-lg transition-all"
            >
              儲存變更
            </button>
            <button
              onClick={() => {
                const ok =
                  window.confirm("確定要刪除這筆預約嗎？此動作無法復原");
                if (ok) {
                  deleteAppointment(appointment.id);
                  onClose();
                }
              }}
              type="button"
              className="flex-1 py-3 bg-red-400 text-white rounded-xl hover:bg-morandi-accent font-medium shadow-md hover:shadow-lg transition-all"
            >
              刪除預約
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
