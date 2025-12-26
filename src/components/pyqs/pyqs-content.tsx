"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ClipboardList, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MaterialCard } from "@/components/materials/material-card";
import { EmptyState } from "@/components/empty-state";
import { createClient } from "@/lib/supabase/client";
import { Material, University } from "@/lib/database.types";
import { UNIVERSITIES, YEARS } from "@/lib/constants";

export function PYQsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        university: searchParams.get("university") || "",
        year: searchParams.get("year") || "",
    });

    useEffect(() => {
        fetchMaterials();
    }, [filters]);

    const fetchMaterials = async () => {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
            .from("materials")
            .select("*")
            .eq("material_type", "pyq")
            .order("year", { ascending: false });

        if (filters.university) {
            query = query.eq("university", filters.university as University);
        }
        if (filters.year) {
            query = query.eq("year", parseInt(filters.year));
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching materials:", error);
        } else {
            setMaterials(data || []);
        }
        setLoading(false);
    };

    const updateFilter = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update URL
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        router.push(`/pyqs?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        setFilters({ university: "", year: "" });
        router.push("/pyqs", { scroll: false });
    };

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <Select
                    value={filters.university}
                    onValueChange={(value) => updateFilter("university", value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="University" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(UNIVERSITIES).map(([key, uni]) => (
                            <SelectItem key={key} value={key}>
                                {uni.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.year}
                    onValueChange={(value) => updateFilter("year", value)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {YEARS.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-9"
                    >
                        <X className="mr-1 h-4 w-4" />
                        Clear ({activeFiltersCount})
                    </Button>
                )}
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters.university && (
                        <Badge variant="secondary" className="gap-1">
                            {UNIVERSITIES[filters.university as University]?.name}
                            <button
                                onClick={() => updateFilter("university", "")}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.year && (
                        <Badge variant="secondary" className="gap-1">
                            {filters.year}
                            <button
                                onClick={() => updateFilter("year", "")}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}

            {/* Results */}
            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-48 rounded-lg skeleton" />
                    ))}
                </div>
            ) : materials.length === 0 ? (
                <EmptyState
                    icon={<ClipboardList className="h-12 w-12" />}
                    title="No PYQs found"
                    description={
                        activeFiltersCount > 0
                            ? "Try adjusting your filters to find more materials."
                            : "Previous year questions will appear here once uploaded."
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map((material) => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            )}
        </div>
    );
}
