import { LocationOn } from "@mui/icons-material";
import type { Panchayat } from "./types";

type Props = {
  panchayat: Panchayat | null;
};

export default function PanchayatCard({ panchayat }: Props) {
  const location = [panchayat?.village, panchayat?.district, panchayat?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <LocationOn />
        </div>

        <div>
          <h2 className="font-bold text-slate-900">Gram Panchayat</h2>
          <p className="text-xs text-slate-500">Your local administration</p>
        </div>
      </div>

      {panchayat ? (
        <div className="mt-5 space-y-3">
          <h3 className="font-semibold text-slate-900">{panchayat.name}</h3>

          <p className="flex items-start gap-2 text-sm text-slate-600">
            <LocationOn
              fontSize="small"
              className="mt-0.5 shrink-0 text-slate-400"
            />
            <span>
              {location || panchayat.address || "Address unavailable"}
            </span>
          </p>

          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500">Sarpanch</p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {panchayat.sarpanch || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Contact number</p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {panchayat.contactNumber || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="mt-1 break-all text-sm font-medium text-slate-800">
              {panchayat.email || "—"}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-500">
          No Gram Panchayat is linked to your account yet. Please contact your
          administrator to link your account.
        </p>
      )}
    </section>
  );
}
