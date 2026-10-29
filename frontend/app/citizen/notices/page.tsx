"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Campaign,
  CalendarToday,
  Search,
  AttachFile,
  Refresh,
  OpenInNew,
  MarkEmailRead,
  NotificationsActive,
} from "@mui/icons-material";

import { api } from "@/constant/api";

interface NoticeAttachment {
  url?: string;
  name?: string;
  originalName?: string;
  [key: string]: unknown;
}

interface Notice {
  _id: string;
  title: string;
  description: string;
  category: string;
  noticeType?: string;
  status: "draft" | "published" | "withdrawn";
  audience?: string;
  createdAt?: string;
  publishedAt?: string | null;
  expiresAt?: string | null;
  attachments?: NoticeAttachment[];
  isRead?: boolean;
}

interface NoticesResponse {
  status: boolean;
  message?: string;
  data: Notice[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotices, setTotalNotices] = useState(0);

  const fetchNotices = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<NoticesResponse>("/notice", {
        params: {
          page: pageNumber,
          limit: 50,
        },
      });

      const result = response.data;

      if (!result.status) {
        throw new Error(result.message || "Unable to load notices.");
      }

      setNotices(Array.isArray(result.data) ? result.data : []);
      setPage(result.pagination?.page ?? pageNumber);
      setTotalPages(result.pagination?.totalPages ?? 1);
      setTotalNotices(result.pagination?.total ?? result.data?.length ?? 0);
    } catch (err: unknown) {
      let message = "Unable to load notices. Please try again.";

      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        ).response;

        message = response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      console.error("Failed to fetch notices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotices(1);
  }, [fetchNotices]);

  const categories = useMemo(() => {
    const unique = notices
      .map((notice) => notice.category)
      .filter((category): category is string => Boolean(category));

    return ["All", ...Array.from(new Set(unique))];
  }, [notices]);

  const filteredNotices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notices.filter((notice) => {
      const matchesCategory =
        selectedCategory === "All" || notice.category === selectedCategory;

      const matchesSearch = [notice.title, notice.description, notice.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [notices, search, selectedCategory]);

  const formatDate = (value?: string | null) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const markAsRead = async (notice: Notice) => {
    if (notice.isRead) return;

    try {
      await api.patch(`/notice/${notice._id}/read`);

      setNotices((current) =>
        current.map((item) =>
          item._id === notice._id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to mark notice as read:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-600 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Campaign sx={{ fontSize: 38 }} />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-100">
                Citizen Information Centre
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Panchayat Notices
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-50 sm:text-base">
                View public announcements, important updates, and notifications
                published by your Panchayat.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void fetchNotices(page)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold transition hover:bg-white/25 disabled:opacity-50 sm:self-center"
            >
              <Refresh fontSize="small" />
              Refresh
            </button>
          </div>
        </section>

        {/* Search and category filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              fontSize="small"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by notice title, description, or category..."
              aria-label="Search notices"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Results count */}
        {!loading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Latest Notices
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredNotices.length} of {totalNotices} notices
              </p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-11 w-11 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
                <div className="mt-6 h-4 w-1/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-800">Could not load notices</p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void fetchNotices(page)}
              className="mt-4 rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Notice cards */}
        {!loading && !error && filteredNotices.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotices.map((notice) => (
              <article
                key={notice._id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Campaign />
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    {notice.category && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                        {notice.category}
                      </span>
                    )}

                    {notice.isRead && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        Read
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-5 break-words text-lg font-bold leading-snug text-slate-800 group-hover:text-emerald-800">
                  {notice.title}
                </h3>

                <p className="mt-3 flex-1 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                  {notice.description || "No additional details available."}
                </p>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <CalendarToday sx={{ fontSize: 15 }} />
                  <span>
                    {formatDate(notice.publishedAt || notice.createdAt)}
                  </span>
                </div>

                {notice.attachments?.map((attachment, index) => {
                  const url = attachment.url;
                  if (typeof url !== "string" || !url) return null;

                  return (
                    <a
                      key={`${notice._id}-attachment-${index}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                    >
                      <AttachFile fontSize="small" />
                      {attachment.name ||
                        attachment.originalName ||
                        "View attachment"}
                      <OpenInNew sx={{ fontSize: 16 }} />
                    </a>
                  );
                })}

                {!notice.isRead && (
                  <button
                    type="button"
                    onClick={() => void markAsRead(notice)}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <MarkEmailRead fontSize="small" />
                    Mark as read
                  </button>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredNotices.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              {notices.length === 0 ? (
                <NotificationsActive sx={{ fontSize: 32 }} />
              ) : (
                <Search sx={{ fontSize: 32 }} />
              )}
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              {notices.length === 0
                ? "No notices available"
                : "No matching notices"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {notices.length === 0
                ? "Published notices for your Panchayat will appear here."
                : "Try another search term or select a different category."}
            </p>

            {(search || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-5 font-semibold text-emerald-700 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => void fetchNotices(page - 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => void fetchNotices(page + 1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
