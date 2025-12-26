import { Suspense } from "react";
import { Metadata } from "next";
import { PYQsContent } from "@/components/pyqs/pyqs-content";
import { NotesSkeleton } from "@/components/notes/notes-skeleton";

export const metadata: Metadata = {
    title: "Previous Year Questions",
    description: "Year-wise previous year questions for AKTU, ABES EC, AKGEC, and KIET exams.",
};

export default function PYQsPage() {
    return (
        <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Previous Year Questions</h1>
                <p className="mt-2 text-muted-foreground">
                    Access year-wise PYQs to understand exam patterns and prepare effectively.
                </p>
            </div>
            <Suspense fallback={<NotesSkeleton />}>
                <PYQsContent />
            </Suspense>
        </div>
    );
}
