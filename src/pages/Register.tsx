import React, { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  PersonStandingIcon,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useRegister } from "../hooks/auth/useRegister";
import { LoadingOverlay } from "../components/Spinner";

const Register: React.FC = () => {
  const { signup, isPending } = useRegister();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signup(formData);
    console.log(formData);
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
                  Name
                </label>
                <div className="relative">
                  <PersonStandingIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-morandi-primary transition-colors" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="your name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-transparent focus:bg-white focus:border-morandi-primary focus:ring-2 focus:ring-morandi-primary/20 outline-none transition-all duration-300 placeholder-stone-400 text-stone-600"
                    required
                  />
                </div>
              </div>
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
              <span>註冊</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="mt-8 text-center">
              <Link
                to="/login"
                // onClick={goHome}
                className="text-stone-400 hover:text-stone-600 text-md flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
              >
                <span>已有帳號？點這登入 👈</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
