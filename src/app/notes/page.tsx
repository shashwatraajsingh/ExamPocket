import { Suspense } from "react";
import { Metadata } from "next";
import { NotesContent } from "@/components/notes/notes-content";
import { NotesSkeleton } from "@/components/notes/notes-skeleton";

export const metadata: Metadata = {
    title: "Notes",
    description: "Browse chapter-wise and subject-wise notes for AKTU, ABES EC, AKGEC, and KIET.",
};

export default function NotesPage() {
    return (
        <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
                <p className="mt-2 text-muted-foreground">
                    Browse chapter-wise and subject-wise notes for all semesters.
                </p>
            </div>
            <Suspense fallback={<NotesSkeleton />}>
                <NotesContent />
            </Suspense>
        </div>
    );
}
