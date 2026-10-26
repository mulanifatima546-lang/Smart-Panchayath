"use client";

import { api } from "@/constant/api";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Admin = {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;

  address: {
    pinCode: string;
    state: string;
    street: string;
  };

  createdAt: string;
  updatedAt: string;
  __v: number;
};

type AdminContextType = {
  admin: Admin | null;
  loading: boolean;
  error: string | null;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAdmin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/admin");

      setAdmin(data.admin);
    } catch (err) {
      setAdmin(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, loading, error }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
