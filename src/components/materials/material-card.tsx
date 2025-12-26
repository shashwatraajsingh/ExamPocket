"use client";

import Link from "next/link";
import { FileText, Download, Eye, Calendar, GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Material, University, NoteCategory } from "@/lib/database.types";
import { UNIVERSITIES, NOTE_CATEGORIES } from "@/lib/constants";
import { formatFileSize, formatDate } from "@/lib/utils";

interface MaterialCardProps {
    material: Material;
}

export function MaterialCard({ material }: MaterialCardProps) {
    const university = UNIVERSITIES[material.university as University];

    return (
        <Link href={`/view/${material.id}`}>
            <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${university?.color}15` }}
                        >
                            <FileText
                                className="h-5 w-5"
                                style={{ color: university?.color }}
                            />
                        </div>
                        <Badge variant="secondary" className="text-xs font-normal shrink-0">
                            {university?.name}
                        </Badge>
                    </div>
                    <CardTitle className="mt-3 text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {material.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                            {material.subject}
                        </Badge>
                        {material.semester && (
                            <Badge variant="outline" className="text-xs font-normal">
                                Sem {material.semester}
                            </Badge>
                        )}
                        {material.note_category && (
                            <Badge variant="outline" className="text-xs font-normal">
                                {NOTE_CATEGORIES[material.note_category as NoteCategory]}
                            </Badge>
                        )}
                        {material.year && material.material_type === "pyq" && (
                            <Badge variant="outline" className="text-xs font-normal">
                                {material.year}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {material.view_count}
                            </span>
                            <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {material.download_count}
                            </span>
                        </div>
                        <span>{formatFileSize(material.file_size)}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
