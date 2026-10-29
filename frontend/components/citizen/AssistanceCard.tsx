import { Notifications, SupportAgent } from "@mui/icons-material";
import type { Panchayat } from "./types";

type Props = {
  panchayat: Panchayat | null;
};

export default function AssistanceCard({ panchayat }: Props) {
  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
      <div className="flex items-center gap-3">
        <Notifications className="text-emerald-700" />
        <h2 className="font-bold text-emerald-950">Need assistance?</h2>
      </div>

      <p className="mt-2 text-sm leading-6 text-emerald-900/80">
        For application updates or help with a service request, contact your
        Gram Panchayat office.
      </p>

      {panchayat?.contactNumber && (
        <a
          href={`tel:${panchayat.contactNumber}`}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <SupportAgent fontSize="small" />
          Contact Panchayat
        </a>
      )}
    </section>
  );
}
