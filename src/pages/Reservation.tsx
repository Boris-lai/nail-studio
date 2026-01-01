import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  User,
  Smartphone,
  AtSign,
  Check,
  Palette,
  ChevronDown,
} from "lucide-react";
import { ServiceType, NailStyle, TIME_SLOTS } from "../types";

import type { AppointmentFormData } from "../types";

import { Modal } from "../components/Modal";
import { useCreateAppointment } from "../hooks/appointment/useCreateAppointment";

const Reservation: React.FC = () => {
  const { createAppointment } = useCreateAppointment();

  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    phone: "",
    contactId: "",
    date: "",
    timeSlot: "",
    services: [],
    style: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AppointmentFormData, string>>
  >({});

  // 姓名、電話、lineId ig、日期、時段
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AppointmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 服務項目
  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const currentServices = prev.services;
      const newServices = currentServices.includes(service)
        ? currentServices.filter((s) => s !== service)
        : [...currentServices, service];

      return { ...prev, services: newServices };
    });
    if (errors.services)
      setErrors((prev) => ({ ...prev, services: undefined }));
  };

  // 款式偏好
  const handleStyleSelect = (style: string) => {
    setFormData((prev) => ({ ...prev, style }));
    if (errors.style) setErrors((prev) => ({ ...prev, style: undefined }));
  };

  // 表單驗證處理
  const validateForm = () => {
    const newErrors: Partial<Record<keyof AppointmentFormData, string>> = {};
    if (!formData.name) newErrors.name = "請輸入姓名";
    if (!formData.phone) newErrors.phone = "請輸入電話";
    // if (!formData.contactId) newErrors.contactId = "請輸入 Line ID";
    if (!formData.date) newErrors.date = "請選擇日期";
    if (!formData.timeSlot) newErrors.timeSlot = "請選擇時段";
    if (formData.services.length === 0)
      newErrors.services = "請至少選擇一項服務";
    if (!formData.style) newErrors.style = "請選擇一種風格";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // setIsModalOpen(true);

      createAppointment(formData);
      console.log(formData);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans bg-morandi-bg">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-full bg-white shadow-sm mb-4">
            <Sparkles className="w-8 h-8 text-morandi-primary" />
          </div>
          <h1 className="text-4xl font-serif font-semibold text-morandi-text mb-2 tracking-widest">
            NAIL STUDIO
          </h1>
          <p className="text-morandi-accent tracking-wide uppercase text-sm">
            Make your hands tell a story
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/50 p-8 sm:p-10 space-y-10 relative overflow-hidden"
        >
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-morandi-secondary/30 via-morandi-primary/40 to-morandi-secondary/30"></div>

          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-morandi-text flex items-center gap-2 border-b border-morandi-light pb-2">
              <User className="w-5 h-5 text-morandi-secondary" />
              <span>基本資料</span>
            </h2>

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-stone-500 mb-1 ml-1">
                  姓名
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="請輸入您的姓名"
                  className={`w-full px-4 py-3 rounded-xl bg-morandi-bg/50 border ${
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-transparent group-hover:border-morandi-secondary/50"
                  } focus:border-morandi-primary focus:ring-2 focus:ring-morandi-primary/20 focus:outline-none transition-all duration-300 placeholder-stone-400`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1 ml-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-medium text-stone-500 mb-1 ml-1">
                    聯絡電話
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="09xx-xxx-xxx"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-morandi-bg/50 border ${
                        errors.phone
                          ? "border-red-300 bg-red-50"
                          : "border-transparent group-hover:border-morandi-secondary/50"
                      } focus:border-morandi-primary focus:ring-2 focus:ring-morandi-primary/20 focus:outline-none transition-all duration-300 placeholder-stone-400`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-400 mt-1 ml-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-stone-500 mb-1 ml-1">
                    Line ID / IG (可選填)
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      name="contactId"
                      value={formData.contactId}
                      onChange={handleInputChange}
                      placeholder="輸入 ID"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-morandi-bg/50 border ${
                        errors.contactId
                          ? "border-red-300 bg-red-50"
                          : "border-transparent group-hover:border-morandi-secondary/50"
                      } focus:border-morandi-primary focus:ring-2 focus:ring-morandi-primary/20 focus:outline-none transition-all duration-300 placeholder-stone-400`}
                    />
                  </div>
                  {errors.contactId && (
                    <p className="text-xs text-red-400 mt-1 ml-1">
                      {errors.contactId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Appointment Time */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-morandi-text flex items-center gap-2 border-b border-morandi-light pb-2">
              <Calendar className="w-5 h-5 text-morandi-secondary" />
              <span>預約時間</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-stone-500 mb-1 ml-1">
                  預約日期
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl bg-morandi-bg/50 border ${
                      errors.date
                        ? "border-red-300 bg-red-50"
                        : "border-transparent group-hover:border-morandi-secondary/50"
                    } focus:border-morandi-primary focus:ring-2 focus:ring-morandi-primary/20 focus:outline-none transition-all duration-300 text-stone-600`}
                  />
                </div>
                {errors.date && (
                  <p className="text-xs text-red-400 mt-1 ml-1">
                    {errors.date}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-stone-500 mb-1 ml-1">
                  時段選擇
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 z-10" />
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl bg-morandi-bg/50 border ${
                      errors.timeSlot
                        ? "border-red-300 bg-red-50"
                        : "border-transparent group-hover:border-morandi-secondary/50"
                    } focus:border-morandi-primary focus:ring-2 focus:ring-morandi-primary/20 focus:outline-none appearance-none transition-all duration-300 text-stone-600 cursor-pointer`}
                  >
                    <option value="" disabled>
                      選擇時段
                    </option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
                {errors.timeSlot && (
                  <p className="text-xs text-red-400 mt-1 ml-1">
                    {errors.timeSlot}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Service Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-morandi-text flex items-center gap-2 border-b border-morandi-light pb-2">
              <Sparkles className="w-5 h-5 text-morandi-secondary" />
              <span>服務項目 (可複選)</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {Object.values(ServiceType).map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-200 border ${
                    formData.services.includes(service)
                      ? "bg-morandi-primary/10 border-morandi-primary text-morandi-text"
                      : "bg-white border-stone-100 hover:border-morandi-secondary text-stone-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm sm:text-base">
                      {service}
                    </span>
                    {formData.services.includes(service) && (
                      <Check className="w-4 h-4 text-morandi-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.services && (
              <p className="text-xs text-red-400 ml-1">{errors.services}</p>
            )}
          </div>

          {/* Section 4: Style Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-morandi-text flex items-center gap-2 border-b border-morandi-light pb-2">
              <Palette className="w-5 h-5 text-morandi-secondary" />
              <span>款式偏好</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.values(NailStyle).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleStyleSelect(style)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
                    formData.style === style
                      ? "bg-morandi-secondary/20 border-morandi-secondary shadow-inner"
                      : "bg-white border-stone-100 hover:bg-stone-50 hover:scale-105"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full mb-2 ${
                      style === NailStyle.SOLID
                        ? "bg-[#D4A5A5]"
                        : style === NailStyle.MARBLE
                        ? "bg-gradient-to-br from-[#EBE5E5] to-[#9E8888]"
                        : style === NailStyle.FRENCH
                        ? 'bg-white border border-stone-200 relative overflow-hidden after:content-[""] after:absolute after:top-0 after:left-0 after:w-full after:h-1/3 after:bg-[#D4A5A5]'
                        : "bg-gradient-to-tr from-[#B8C6C6] via-white to-[#D4A5A5] ring-2 ring-offset-1 ring-[#D4A5A5]/30"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      formData.style === style
                        ? "text-stone-700"
                        : "text-stone-400"
                    }`}
                  >
                    {style}
                  </span>
                </button>
              ))}
            </div>
            {errors.style && (
              <p className="text-xs text-red-400 ml-1">{errors.style}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-morandi-primary hover:bg-morandi-accent text-stone-600 font-serif tracking-widest text-lg shadow-lg shadow-morandi-primary/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              送出預約
            </button>
            <p className="text-center text-xs text-stone-400 mt-4 font-light">
              送出後我們將於 24 小時內與您確認
            </p>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="預約資料已送出"
        message="感謝您的預約！我們已收到您的資訊，將盡快與您聯繫確認細節。"
      />
    </div>
  );
};

export default Reservation;
