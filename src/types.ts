export interface AppointmentFormData {
  name: string;
  phone: string;
  contactId: string; // Line ID or Social
  date: string;
  timeSlot: string;
  services: string[];
  style: string;
}

export const ServiceType = {
  BASIC_CARE: "基礎保養",
  SINGLE_COLOR: "單色凝膠",
  DESIGN_GEL: "造型凝膠",
  REMOVAL: "卸甲重作",
} as const;

export type ServiceType = (typeof ServiceType)[keyof typeof ServiceType];

export const NailStyle = {
  SOLID: "純色簡約",
  MARBLE: "暈染氛圍",
  FRENCH: "法式優雅",
  LUXURY: "華麗精緻",
} as const;

export type NailStyle = (typeof NailStyle)[keyof typeof NailStyle];

export const TIME_SLOTS = ["10:00", "13:00", "16:00", "19:00"];

// Dashboard Types
export const AppointmentStatus = {
  PENDING: "待審核",
  CONFIRMED: "已確認",
  COMPLETED: "已完成",
  CANCELLED: "已取消",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export interface AdminAppointment extends AppointmentFormData {
  id: string;
  status: AppointmentStatus;
}
