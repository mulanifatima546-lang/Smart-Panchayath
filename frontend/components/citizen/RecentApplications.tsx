"use client";

import { useMemo, useState } from "react";
import {
  Assignment,
  ChevronRight,
  Description,
  Search,
} from "@mui/icons-material";

import type { CitizenApplication } from "./types";
import { formatDate, getApplicationSearchText, getStatusStyle } from "./utils";

type Props = {
  applications: CitizenApplication[];
  onView: (applicationId: string) => void;
  onViewAll: () => void;
  onApply: () => void;
};

export default function RecentApplications({
  applications,
  onView,
  onViewAll,
  onApply,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return applications;

    return applications.filter((application) =>
      getApplicationSearchText(application).includes(search),
    );
  }, [applications, searchTerm]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-slate-900">Recent Applications</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your recent applications.
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            fontSize="small"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search applications..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <Assignment className="mx-auto text-slate-300" fontSize="large" />

          <h3 className="mt-3 font-semibold text-slate-800">
            No applications found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {searchTerm
              ? "Try another search term."
              : "Your submitted applications will appear here."}
          </p>

          {!searchTerm && (
            <button
              type="button"
              onClick={onApply}
              className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Start an application
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredApplications.map((application) => (
            <button
              type="button"
              key={application._id}
              onClick={() => onView(application._id)}
              className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Description fontSize="small" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {application.serviceType}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Application No:{" "}
                    {application.applicationNumber || application._id}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Submitted:{" "}
                    {formatDate(
                      application.submitedAt || application.createdAt,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(application.status)}`}
                >
                  {application.status}
                </span>

                <span className="text-xs font-medium text-emerald-700">
                  View details <ChevronRight fontSize="inherit" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={onViewAll}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
        >
          View all applications
          <ChevronRight fontSize="small" />
        </button>
      </div>
    </section>
  );
}
