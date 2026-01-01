import { useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface registerTypes {
  fullName: string;
  email: string;
  password: string;
}

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: signup, isPending } = useMutation({
    mutationFn: ({ fullName, email, password }: registerTypes) =>
      signupApi({ fullName, email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      toast.success("註冊成功 🙂");
      navigate("/");
    },

    onError: (err) => {
      toast.error("帳號或密碼可能有錯誤哦");
      console.log("Error", err);
    },
  });

  return { signup, isPending };
}
