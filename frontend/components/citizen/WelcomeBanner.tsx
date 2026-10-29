"use client";

import { Assignment, Home, Person, Refresh } from "@mui/icons-material";

import type { Panchayat } from "./types";

type Props = {
  citizenName: string;
  panchayat: Panchayat | null;
  refreshing: boolean;
  onApply: (serviceType: string) => void;
  onRefresh: () => void;
};

export default function WelcomeBanner({
  citizenName,
  panchayat,
  refreshing,
  onApply,
  onRefresh,
}: Props) {
  const firstName = citizenName.trim().split(/\s+/)[0] || "Citizen";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white shadow-sm sm:p-8">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
      <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-white/5" />

      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-100">Citizen Portal</p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome back, {firstName}!
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
            Access Gram Panchayat services, submit applications, and track their
            progress from one place.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2">
              <Person fontSize="small" />
              {citizenName}
            </span>

            {panchayat && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2">
                <Home fontSize="small" />
                {panchayat.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onApply("Other")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
          >
            <Assignment fontSize="small" />
            New Application
          </button>

          <button
            type="button"
            disabled={refreshing}
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
          >
            <Refresh
              fontSize="small"
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>
    </section>
  );
}
