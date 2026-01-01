import React from "react";
import { MessageCircle } from "lucide-react";
import type { AdminAppointment } from "../types";

interface LinePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  appointment: AdminAppointment | null;
}

export const LinePreviewModal: React.FC<LinePreviewModalProps> = ({
  isOpen,
  onClose,
  onSend,
  appointment,
}) => {
  if (!isOpen || !appointment) return null;

  const messageTemplate = `您好 ${appointment.name}，

感謝您的預約！
您的美甲服務已確認：
📅 時間：${appointment.date} ${appointment.timeSlot}
💅 項目：${appointment.services.join(", ")}
✨ 款式：${appointment.style}

期待您的光臨！`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 flex flex-col h-auto">
        <div className="flex items-center gap-3 mb-4 border-b pb-4 border-stone-100">
          <div className="bg-[#06C755] p-2 rounded-full">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-stone-700">發送 LINE 通知</h3>
        </div>

        <div className="bg-stone-50 p-4 rounded-lg mb-6 border border-stone-200">
          <p className="text-xs text-stone-400 mb-2 uppercase tracking-wide">
            訊息預覽
          </p>
          <pre className="whitespace-pre-wrap font-sans text-sm text-stone-600 leading-relaxed">
            {messageTemplate}
          </pre>
        </div>

        <div className="flex gap-3 mt-auto">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-white border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={onSend}
            className="flex-1 py-2.5 px-4 bg-[#06C755] text-white rounded-lg hover:bg-[#05b34c] font-medium shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
          >
            <span>確認並發送</span>
          </button>
        </div>
      </div>
    </div>
  );
};
