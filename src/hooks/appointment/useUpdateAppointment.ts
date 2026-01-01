import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointment } from "../../services/apiAppointments";
import toast from "react-hot-toast";

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      // 更新成功後，讓 appointments 重新抓
      toast.success("已更改 😀");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
