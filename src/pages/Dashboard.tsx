import React, { useState } from "react";
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Users,
  CheckCircle,
  Clock,
  Edit2,
  Send,
  Search,
  LogOut,
  Bell,
} from "lucide-react";
import type { AdminAppointment } from "../types";
import { AppointmentStatus } from "../types";
import { LinePreviewModal } from "../components/LinePreviewModal";
import { Modal } from "../components/Modal";
import { EditAppointmentModal } from "../components/EditAppointmentModal";

import { useAppointment } from "../hooks/appointment/useAppointment";
import { Spinner } from "../components/Spinner";
import { useUpdateAppointment } from "../hooks/appointment/useUpdateAppointment";
import { useLogout } from "../hooks/auth/useLogout";

const Dashboard: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AdminAppointment | null>(null);

  const { appointments, isLoading } = useAppointment();
  const { mutate: updateAppointment } = useUpdateAppointment();

  const { logout } = useLogout();

  // Modals state
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Unified Success Modal State
  const [successModalConfig, setSuccessModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // Stats
  const totalAppointments = appointments.length;
  const pendingReviews = appointments.filter(
    (a) => a.status === AppointmentStatus.PENDING
  ).length;
  const today = new Date();
  const todayAppointments = appointments.filter((a) => a.date === today).length;

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case AppointmentStatus.CONFIRMED:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case AppointmentStatus.COMPLETED:
        return "bg-slate-100 text-slate-600 border-slate-200";
      case AppointmentStatus.CANCELLED:
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleApproveClick = (appointment: AdminAppointment) => {
    setSelectedAppointment(appointment);
    setIsLineModalOpen(true);
  };

  const handleEditClick = (appointment: AdminAppointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleSendNotification = () => {
    if (selectedAppointment) {
      // Update status
      // setAppointments((prev) =>
      //   prev.map((apt) =>
      //     apt.id === selectedAppointment.id
      //       ? { ...apt, status: AppointmentStatus.CONFIRMED }
      //       : apt
      //   )
      // );

      setIsLineModalOpen(false);
      // Small delay for UX
      setTimeout(() => {
        setSuccessModalConfig({
          isOpen: true,
          title: "發送成功",
          message: "已發送 LINE 通知給客人，並將預約狀態更新為「已確認」。",
        });
      }, 300);
      setSelectedAppointment(null);
    }
  };

  const handleSaveEdit = (updatedData: {
    id: string;
    date: string;
    timeSlot: string;
    status: string;
  }) => {
    // setAppointments((prev) =>
    //   prev.map((apt) =>
    //     apt.id === updatedData.id ? { ...apt, ...updatedData } : apt
    //   )
    // );
    // setIsEditModalOpen(false);
    // setSelectedAppointment(null);

    // const message = shouldNotify
    //   ? "預約資訊已更新，並已發送 LINE 通知給客人。"
    //   : "預約資訊已更新成功。";

    // setTimeout(() => {
    //   setSuccessModalConfig({
    //     isOpen: true,
    //     title: "更新成功",
    //     message: message,
    //   });
    // }, 300);

    updateAppointment(updatedData);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-stone-100">
          <h1 className="text-xl font-serif font-bold text-morandi-text tracking-wider">
            NAIL ADMIN
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 bg-morandi-primary/10 text-morandi-primary rounded-xl font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>儀表板</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-stone-500 hover:bg-stone-50 rounded-xl font-medium transition-colors"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>預約行事曆</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-stone-500 hover:bg-stone-50 rounded-xl font-medium transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>客戶管理</span>
          </a>
        </nav>
        <div className="p-4 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-stone-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>登出</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-700">早安 😁😆🥹</h2>
            <p className="text-stone-400 text-sm mt-1">今天也是美好的一天 ✨</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋預約..."
                className="pl-10 pr-4 py-2 rounded-full border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-morandi-primary/30 text-sm w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
            <button className="p-2 bg-white border border-stone-200 rounded-full text-stone-500 hover:text-morandi-primary hover:border-morandi-primary transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CalendarIcon className="w-24 h-24 text-morandi-primary" />
            </div>
            <span className="text-stone-400 text-sm font-medium uppercase tracking-wide mb-2">
              本月總預約
            </span>
            <span className="text-4xl font-bold text-stone-700">
              {totalAppointments}
            </span>
            <div className="mt-4 text-sm text-green-500 font-medium flex items-center gap-1">
              <span>+12%</span>
              <span className="text-stone-400 font-normal">較上月</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-24 h-24 text-amber-500" />
            </div>
            <span className="text-stone-400 text-sm font-medium uppercase tracking-wide mb-2">
              待審核預約
            </span>
            <span className="text-4xl font-bold text-amber-500">
              {pendingReviews}
            </span>
            <div className="mt-4 text-sm text-amber-500 font-medium flex items-center gap-1">
              <span>需盡快處理</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle className="w-24 h-24 text-morandi-secondary" />
            </div>
            <span className="text-stone-400 text-sm font-medium uppercase tracking-wide mb-2">
              今日預約
            </span>
            <span className="text-4xl font-bold text-stone-700">
              {todayAppointments}
            </span>
            <div className="mt-4 text-sm text-stone-400 font-medium flex items-center gap-1">
              <span className="text-stone-700">2</span>
              <span>位已報到</span>
            </div>
          </div>
        </div>

        {/* Appointment Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-stone-700">近期預約審核</h3>
            <button className="text-sm text-morandi-primary font-medium hover:text-morandi-accent">
              查看全部
            </button>
          </div>

          <div className="overflow-x-auto flex justify-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">預約時間</th>
                    <th className="px-6 py-4 font-semibold">客人姓名</th>
                    <th className="px-6 py-4 font-semibold">服務項目</th>
                    <th className="px-6 py-4 font-semibold">款式</th>
                    <th className="px-6 py-4 font-semibold">聯絡電話</th>
                    <th className="px-6 py-4 font-semibold">狀態</th>
                    <th className="px-6 py-4 font-semibold text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-stone-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-700">
                            {apt.date}
                          </span>
                          <span className="text-xs text-stone-400">
                            {apt.timeSlot}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-stone-700">
                          {apt.name}
                        </div>
                        <div className="text-xs text-stone-400">
                          {apt.contactId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {apt.services.map((s: string) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded-md"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {apt.style}
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-500 font-mono">
                        {apt.phone}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            apt.status
                          )}`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {apt.status === AppointmentStatus.PENDING && (
                            <button
                              onClick={() => handleApproveClick(apt)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-morandi-secondary/20 text-morandi-text hover:bg-morandi-secondary hover:text-white rounded-lg text-xs font-medium transition-all"
                            >
                              <Send className="w-3 h-3" />
                              審核
                            </button>
                          )}
                          <button
                            onClick={() => handleEditClick(apt)}
                            className="p-1.5 text-stone-400 hover:text-morandi-primary hover:bg-stone-100 rounded-lg transition-colors"
                            title="編輯預約"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* LINE Confirmation Modal (Approval Flow) */}
      <LinePreviewModal
        isOpen={isLineModalOpen}
        onClose={() => setIsLineModalOpen(false)}
        onSend={handleSendNotification}
        appointment={selectedAppointment}
      />

      {/* Edit Modal (Edit Flow) */}
      <EditAppointmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        appointment={selectedAppointment}
      />

      {/* Success Modal (Generic) */}
      <Modal
        isOpen={successModalConfig.isOpen}
        onClose={() =>
          setSuccessModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title={successModalConfig.title}
        message={successModalConfig.message}
      />
    </div>
  );
};

export default Dashboard;
