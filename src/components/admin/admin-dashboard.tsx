"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Upload, Eye, Download, TrendingUp, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { UNIVERSITIES } from "@/lib/constants";
import { University } from "@/lib/database.types";

interface Stats {
    totalMaterials: number;
    totalViews: number;
    totalDownloads: number;
    byUniversity: Record<string, number>;
    recentMaterials: Array<{
        id: string;
        title: string;
        university: string;
        created_at: string;
    }>;
}

export function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const supabase = createClient();

        const { data: materials } = await supabase
            .from("materials")
            .select("id, title, university, view_count, download_count, created_at")
            .order("created_at", { ascending: false });

        if (materials) {
            const totalViews = materials.reduce((sum, m) => sum + m.view_count, 0);
            const totalDownloads = materials.reduce((sum, m) => sum + m.download_count, 0);

            const byUniversity: Record<string, number> = {};
            materials.forEach((m) => {
                byUniversity[m.university] = (byUniversity[m.university] || 0) + 1;
            });

            setStats({
                totalMaterials: materials.length,
                totalViews,
                totalDownloads,
                byUniversity,
                recentMaterials: materials.slice(0, 5),
            });
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your study materials
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Material
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Materials"
                    value={stats?.totalMaterials || 0}
                    icon={<FileText className="h-4 w-4" />}
                />
                <StatsCard
                    title="Total Views"
                    value={stats?.totalViews || 0}
                    icon={<Eye className="h-4 w-4" />}
                />
                <StatsCard
                    title="Total Downloads"
                    value={stats?.totalDownloads || 0}
                    icon={<Download className="h-4 w-4" />}
                />
                <StatsCard
                    title="Universities"
                    value={Object.keys(stats?.byUniversity || {}).length}
                    icon={<TrendingUp className="h-4 w-4" />}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* By University */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Materials by University</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats?.byUniversity && Object.keys(stats.byUniversity).length > 0 ? (
                            <div className="space-y-3">
                                {Object.entries(stats.byUniversity).map(([key, count]) => {
                                    const university = UNIVERSITIES[key as University];
                                    return (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: university?.color }}
                                                />
                                                <span className="text-sm">{university?.name || key}</span>
                                            </div>
                                            <span className="text-sm font-medium">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No materials yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Materials */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent Uploads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats?.recentMaterials && stats.recentMaterials.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentMaterials.map((material) => (
                                    <div
                                        key={material.id}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm truncate max-w-[200px]">
                                            {material.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {UNIVERSITIES[material.university as University]?.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No materials yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            </CardContent>
        </Card>
    );
}
