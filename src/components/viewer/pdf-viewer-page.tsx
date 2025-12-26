"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Document, Page, pdfjs } from "react-pdf";
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCw,
    ArrowLeft,
    Maximize2,
    Minimize2,
    Loader2,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Material, University, NoteCategory } from "@/lib/database.types";
import { UNIVERSITIES, NOTE_CATEGORIES } from "@/lib/constants";
import { formatFileSize, formatDate } from "@/lib/utils";

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerPageProps {
    material: Material;
}

export function PDFViewerPage({ material }: PDFViewerPageProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [rotation, setRotation] = useState<number>(0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const university = UNIVERSITIES[material.university as University];

    const onDocumentLoadSuccess = useCallback(
        ({ numPages }: { numPages: number }) => {
            setNumPages(numPages);
            setIsLoading(false);
        },
        []
    );

    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, numPages));
    };

    const zoomIn = () => {
        setScale((prev) => Math.min(prev + 0.25, 3));
    };

    const zoomOut = () => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const rotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div
            className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "min-h-screen"
                }`}
        >
            {/* Header */}
            <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <Button variant="ghost" size="icon" asChild className="shrink-0">
                                <Link href={material.material_type === "pyq" ? "/pyqs" : "/notes"}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div className="min-w-0">
                                <h1 className="text-sm font-medium truncate">{material.title}</h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge
                                        variant="secondary"
                                        className="text-xs font-normal shrink-0"
                                        style={{
                                            backgroundColor: `${university?.color}15`,
                                            color: university?.color,
                                        }}
                                    >
                                        {university?.name}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {material.subject}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="sticky top-[61px] z-30 border-b bg-muted/50">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between gap-2">
                        {/* Page Navigation */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goToPrevPage}
                                disabled={pageNumber <= 1}
                                className="h-8 w-8"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm tabular-nums min-w-[80px] text-center">
                                {pageNumber} / {numPages || "..."}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={goToNextPage}
                                disabled={pageNumber >= numPages}
                                className="h-8 w-8"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Zoom & Rotation Controls */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={zoomOut}
                                disabled={scale <= 0.5}
                                className="h-8 w-8"
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-sm tabular-nums min-w-[50px] text-center">
                                {Math.round(scale * 100)}%
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={zoomIn}
                                disabled={scale >= 3}
                                className="h-8 w-8"
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Separator orientation="vertical" className="h-6 mx-1" />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={rotate}
                                className="h-8 w-8"
                            >
                                <RotateCw className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleFullscreen}
                                className="h-8 w-8"
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="h-4 w-4" />
                                ) : (
                                    <Maximize2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto bg-muted/30">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-center">
                        <Document
                            file={material.file_url}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            }
                            error={
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground">
                                        Failed to load PDF. Please try downloading instead.
                                    </p>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                rotate={rotation}
                                loading={
                                    <div className="flex items-center justify-center py-20">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                }
                                className="shadow-lg"
                            />
                        </Document>
                    </div>
                </div>
            </div>

            {/* Info Footer */}
            {!isFullscreen && (
                <div className="border-t bg-muted/30">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                {material.semester && (
                                    <Badge variant="outline">Semester {material.semester}</Badge>
                                )}
                                {material.note_category && (
                                    <Badge variant="outline">
                                        {NOTE_CATEGORIES[material.note_category as NoteCategory]}
                                    </Badge>
                                )}
                                {material.chapter && (
                                    <Badge variant="outline">{material.chapter}</Badge>
                                )}
                                {material.year && material.material_type === "pyq" && (
                                    <Badge variant="outline">{material.year}</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <span>{formatFileSize(material.file_size)}</span>
                                <span>{formatDate(material.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
