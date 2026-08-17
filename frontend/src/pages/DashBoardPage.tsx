import React from "react";
import { useAuth } from "../context/AuthContext";

export default function DashBoardPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Yönetim Paneli</h1>
          <p className="text-slate-400 text-sm">
            Giriş başarılı, korumalı alandasınız!
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
