"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileText, Filter, X } from "lucide-react";

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
import { Material, University, NoteCategory } from "@/lib/database.types";
import { UNIVERSITIES, NOTE_CATEGORIES, SEMESTERS } from "@/lib/constants";

export function NotesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        university: searchParams.get("university") || "",
        semester: searchParams.get("semester") || "",
        category: searchParams.get("category") || "",
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
            .eq("material_type", "notes")
            .order("created_at", { ascending: false });

        if (filters.university) {
            query = query.eq("university", filters.university as University);
        }
        if (filters.semester) {
            query = query.eq("semester", parseInt(filters.semester));
        }
        if (filters.category) {
            query = query.eq("note_category", filters.category as NoteCategory);
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
        router.push(`/notes?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        setFilters({ university: "", semester: "", category: "" });
        router.push("/notes", { scroll: false });
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
                    value={filters.semester}
                    onValueChange={(value) => updateFilter("semester", value)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        {SEMESTERS.map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                                Semester {sem}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.category}
                    onValueChange={(value) => updateFilter("category", value)}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(NOTE_CATEGORIES).map(([key, name]) => (
                            <SelectItem key={key} value={key}>
                                {name}
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
                    {filters.semester && (
                        <Badge variant="secondary" className="gap-1">
                            Semester {filters.semester}
                            <button
                                onClick={() => updateFilter("semester", "")}
                                className="ml-1 hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.category && (
                        <Badge variant="secondary" className="gap-1">
                            {NOTE_CATEGORIES[filters.category as NoteCategory]}
                            <button
                                onClick={() => updateFilter("category", "")}
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
                    icon={<FileText className="h-12 w-12" />}
                    title="No notes found"
                    description={
                        activeFiltersCount > 0
                            ? "Try adjusting your filters to find more materials."
                            : "Notes will appear here once uploaded."
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
