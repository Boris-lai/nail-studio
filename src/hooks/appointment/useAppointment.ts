import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../../services/apiAppointments";

export function useAppointment() {
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  return { appointments, isLoading, error };
}
