"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePanchayat } from "@/context/panchayat.context";
import type { Panchayat } from "@/context/panchayat.context";
import PanchayatPageHeader from "@/components/panchayat/PanchayatPageHeader";
import PanchayatStats from "@/components/panchayat/PanchayatStats";
import PanchayatTable from "@/components/panchayat/PanchayatTable";

export default function ManagePanchayat() {
  const { panchayats } = usePanchayat();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const panchayatList = useMemo<Panchayat[]>(
    () => (Array.isArray(panchayats) ? panchayats : []),
    [panchayats],
  );

  const filteredPanchayats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return panchayatList;

    return panchayatList.filter((panchayat) =>
      [
        panchayat.name,
        panchayat.state,
        panchayat.district,
        panchayat.taluka,
        panchayat.village,
        panchayat.address,
        panchayat.contactNumber,
        panchayat.email,
        panchayat.sarpanch,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [panchayatList, search]);

  const districtCount = new Set(
    panchayatList
      .map((item) => item.district?.trim().toLowerCase())
      .filter(Boolean),
  ).size;

  const talukaCount = new Set(
    panchayatList
      .map((item) => item.taluka?.trim().toLowerCase())
      .filter(Boolean),
  ).size;

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <PanchayatPageHeader onAdd={() => router.push("/new-panchayat")} />

      <PanchayatStats
        total={panchayatList.length}
        districts={districtCount}
        talukas={talukaCount}
      />

      <PanchayatTable
        panchayats={filteredPanchayats}
        total={panchayatList.length}
        search={search}
        onSearchChange={setSearch}
        onAdd={() => router.push("/new-panchayat")}
        onView={(id) => router.push(`/panchayat/${encodeURIComponent(id)}`)}
        onEdit={(id) =>
          router.push(`/panchayat/${encodeURIComponent(id)}/edit`)
        }
      />
    </div>
  );
}
