import { useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface LoginTypes {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: ({ email, password }: LoginTypes) =>
      loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      toast.success("登入成功!");
      // navigate("/");
    },

    onError: (err) => {
      toast.error("帳號或密碼可能有錯誤哦");
      console.log("Error", err);
    },
  });

  return { login, isPending };
}
