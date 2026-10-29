"use client";

import { ErrorOutlined, Refresh } from "@mui/icons-material";

type Props = {
  error: string;
  onRetry: () => void;
};

export default function DashboardError({ error, onRetry }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <ErrorOutlined className="mx-auto mb-3 text-red-500" fontSize="large" />

        <h1 className="text-xl font-bold text-slate-900">
          Dashboard unavailable
        </h1>

        <p className="mt-2 text-sm text-slate-600">{error}</p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Refresh fontSize="small" />
          Try again
        </button>
      </div>
    </main>
  );
}
