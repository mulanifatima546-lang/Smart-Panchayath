"use client";

import { api } from "@/constant/api";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Panchayat = {
  _id: string;
  name: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  address: string;
  contactNumber: string;
  email: string;
  sarpanch: string;
  createdAt: string;
  updatedAt: string;
};

type PanchayatContextType = {
  panchayats: Panchayat[];
  loading: boolean;
  error: string | null;
};

const PanchayatContext = createContext<PanchayatContextType | undefined>(
  undefined,
);

export function PanchayatProvider({ children }: { children: ReactNode }) {
  const [panchayats, setPanchayat] = useState<Panchayat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPanchayat = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/panchayat");

      setPanchayat(data.panchayats);
      console.log({ panchayats: data.panchayats });
    } catch (err) {
      setPanchayat([]);
      console.log(error);

      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getPanchayat();
  }, []);

  return (
    <PanchayatContext.Provider value={{ panchayats, loading, error }}>
      {children}
    </PanchayatContext.Provider>
  );
}

export function usePanchayat() {
  const context = useContext(PanchayatContext);

  if (!context) {
    throw new Error("usePanchayat must be used inside PanchayatProvider");
  }

  return context;
}
