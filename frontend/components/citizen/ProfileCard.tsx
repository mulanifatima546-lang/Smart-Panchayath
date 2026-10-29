import { AccountCircle, CheckCircle, ErrorOutlined } from "@mui/icons-material";

import type { Citizen } from "./types";

type Props = {
  citizen: Citizen;
};

export default function ProfileCard({ citizen }: Props) {
  const address = [
    citizen.address?.houseNumber,
    citizen.address?.street,
    citizen.address?.city,
    citizen.address?.state,
    citizen.address?.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <AccountCircle />
        </div>

        <div>
          <h2 className="font-bold text-slate-900">My Profile</h2>
          <p className="text-xs text-slate-500">Your account information</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs text-slate-500">Full name</p>
          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {citizen.name}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Email address</p>
          <p className="mt-1 break-all text-sm font-medium text-slate-800">
            {citizen.email}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Account verification</p>
          <p
            className={`mt-1 inline-flex items-center gap-1.5 text-sm font-medium ${
              citizen.isVerified ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {citizen.isVerified ? (
              <CheckCircle fontSize="small" />
            ) : (
              <ErrorOutlined fontSize="small" />
            )}

            {citizen.isVerified ? "Verified" : "Not verified"}
          </p>
        </div>

        {citizen.address && (
          <div>
            <p className="text-xs text-slate-500">Address</p>
            <p className="mt-1 text-sm text-slate-800">
              {address || "Address not provided"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
