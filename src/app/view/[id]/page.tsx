import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PDFViewerPage } from "@/components/viewer/pdf-viewer-page";

interface ViewPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ViewPageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: material } = await supabase
        .from("materials")
        .select("title, description, subject")
        .eq("id", id)
        .single();

    if (!material) {
        return {
            title: "Material Not Found",
        };
    }

    return {
        title: material.title,
        description: material.description || `${material.subject} study material`,
    };
}

export default async function ViewPage({ params }: ViewPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: material, error } = await supabase
        .from("materials")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !material) {
        notFound();
    }

    // Increment view count
    await supabase.rpc("increment_view_count", { material_id: id });

    return <PDFViewerPage material={material} />;
}
