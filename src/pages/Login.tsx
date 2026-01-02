import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { LoadingOverlay } from "../components/Spinner";
import { useLogin } from "../hooks/auth/useLogin";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const { login, isPending } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //   const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  const handleLineLogin = () => {
    const projectRef = "qkgglpyddnmyhoybssye"; 
    const functionUrl = `https://${projectRef}.supabase.co/functions/v1/line-auth?action=init`;
    window.location.href = functionUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-morandi-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-morandi-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-morandi-secondary/10 rounded-full blur-3xl"></div>

      <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 max-w-md w-full overflow-hidden relative animate-fade-in">
        {/* Loading Overlay */}
        <LoadingOverlay isLoading={isPending} text="驗證中..." />

        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-morandi-secondary/30 via-morandi-primary/40 to-morandi-secondary/30"></div>

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-3 rounded-full bg-morandi-bg mb-4">
              <Sparkles className="w-6 h-6 text-morandi-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-morandi-text tracking-wider mb-2">
              Nail Studio Admin
            </h1>
            <p className="text-stone-400 text-sm font-light">
              Welcome back to Nail Studio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-medium text-stone-500 mb-1.5 ml-1 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-morandi-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@nailstudio.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-transparent focus:bg-white focus:border-morandi-primary focus:ring-2 focus:ring-morandi-primary/20 outline-none transition-all duration-300 placeholder-stone-400 text-stone-600"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-stone-500 mb-1.5 ml-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-morandi-primary transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-transparent focus:bg-white focus:border-morandi-primary focus:ring-2 focus:ring-morandi-primary/20 outline-none transition-all duration-300 placeholder-stone-400 text-stone-600"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-morandi-primary hover:bg-morandi-accent text-stone-600 rounded-xl font-medium tracking-wide shadow-lg shadow-morandi-primary/20 transform active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>登入</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="mt-8 text-center space-y-4">
              <button
                type="button"
                onClick={handleLineLogin}
                className="w-full py-3.5 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl font-medium tracking-wide shadow-lg shadow-[#06C755]/20 transform active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {/* LINE Icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M20.8 10.4c0-4.6-4.5-8.4-10-8.4s-10 3.8-10 8.4c0 4.1 3.6 7.6 8.4 8.2.3.1.8.2.9 0l.2-1.3c.1-.4 0-.5-.3-.7-1.1-.6-1.8-1.5-1.8-2.6 0-2.8 3-5.1 6.8-5.1 3.7 0 6.6 2.3 6.6 5.1 0 2.8-2.9 5.1-6.5 5.1-1.2 0-2.4-.3-3.4-.8l-3 1c-.8.3-1.3.1-1-.8l.8-4.2C3.1 14.7 6.4 18 10.8 18c5.5 0 10-3.8 10-7.6z" />
                </svg>
                <span>LINE 登入</span>
              </button>

              <Link
                to="/register"
                // onClick={goHome}
                className="text-stone-400 hover:text-stone-600 text-md flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
              >
                <span>沒有帳號？點擊註冊 👈</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
