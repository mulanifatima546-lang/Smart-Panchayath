import { ChevronRight } from "@mui/icons-material";
import type { DashboardService } from "./types";

type Props = {
  services: DashboardService[];
  onApply: (serviceType: string) => void;
};

export default function ServiceGrid({ services, onApply }: Props) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Available Services</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select a service to start a new application.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <button
            key={service.serviceType}
            type="button"
            onClick={() => onApply(service.serviceType)}
            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex w-full items-start justify-between gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${service.color}`}
              >
                {service.icon}
              </div>

              <ChevronRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              {service.title}
            </h3>

            <p className="mt-2 text-sm leading-5 text-slate-500">
              {service.description}
            </p>

            <span className="mt-4 text-sm font-semibold text-emerald-700">
              Apply now
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
