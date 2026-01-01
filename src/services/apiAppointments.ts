import { supabase } from "../lib/supabase";
import type { AppointmentFormData } from "../types";
import { AppointmentStatus } from "../types";

export async function getAppointments() {
  const { data, error } = await supabase.from("appointments").select("*");

  if (error) {
    throw new Error("Appointments could not be loaded");
  }

  return data;
}

export async function createAppointment(newAppointment: AppointmentFormData) {
  const { data, error } = await supabase
    .from("appointments")
    .insert([
      {
        name: newAppointment.name,
        phone: newAppointment.phone,
        contactId: newAppointment.contactId,
        date: newAppointment.date,
        timeSlot: newAppointment.timeSlot,
        services: newAppointment.services,
        style: newAppointment.style,
        status: AppointmentStatus.PENDING,
      },
    ])
    .select();
}

export async function updateAppointment(updatedAppointment: {
  id: string;
  date: string;
  timeSlot: string;
  status: string;
}) {
  const { data, error } = await supabase
    .from("appointments")
    .update({
      date: updatedAppointment.date,
      timeSlot: updatedAppointment.timeSlot,
      status: updatedAppointment.status,
    })
    .eq("id", updatedAppointment.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteAppointment(id: string) {
  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
}
