import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAppointment as deleteAppointmentApi } from "../../services/apiAppointments";
import toast from "react-hot-toast";

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteAppointment,
    isPending: isDeleting,
    error,
  } = useMutation({
    mutationFn: (id: string) => deleteAppointmentApi(id),
    onSuccess: () => {
      toast.success("已刪除預約!");
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteAppointment, isDeleting, error };
}
