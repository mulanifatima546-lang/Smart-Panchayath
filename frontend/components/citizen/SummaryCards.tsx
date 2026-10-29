import type { SummaryCardData } from "./types";

type Props = {
  cards: SummaryCardData[];
  rejected: number;
  moreInformationRequired: number;
};

export default function SummaryCards({
  cards,
  rejected,
  moreInformationRequired,
}: Props) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Application Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          A summary of your submitted service requests.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                {card.icon}
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">{card.detail}</p>
          </div>
        ))}
      </div>

      {(rejected > 0 || moreInformationRequired > 0) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {rejected > 0 && (
            <span className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Rejected: {rejected}
            </span>
          )}

          {moreInformationRequired > 0 && (
            <span className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
              More information required: {moreInformationRequired}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
