import { useMutation } from "@tanstack/react-query";
import { createAppointment as createAppointmentApi } from "../../services/apiAppointments";
import toast from "react-hot-toast";

export function useCreateAppointment() {
  const { mutateAsync: createAppointment, error } = useMutation({
    mutationFn: createAppointmentApi,
    onSuccess: () => {
      toast.success("預約成功 😎");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Oops! 好像哪裡有問題 ☹️");
    },
  });

  return { createAppointment, error };
}
