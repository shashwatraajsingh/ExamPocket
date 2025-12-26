"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText,
    Trash2,
    ExternalLink,
    Loader2,
    MoreHorizontal,
    Eye,
    Download,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/empty-state";
import { createClient } from "@/lib/supabase/client";
import { Material, University } from "@/lib/database.types";
import { UNIVERSITIES, MATERIAL_TYPES } from "@/lib/constants";
import { formatFileSize, formatDate } from "@/lib/utils";

export function MaterialsList() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("materials")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching materials:", error);
            toast.error("Failed to load materials");
        } else {
            setMaterials(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!materialToDelete) return;

        setDeleting(true);

        try {
            const supabase = createClient();

            // Delete from storage
            const filePath = `materials/${materialToDelete.university}/${materialToDelete.file_name}`;
            await supabase.storage.from("materials").remove([filePath]);

            // Delete from database
            const { error } = await supabase
                .from("materials")
                .delete()
                .eq("id", materialToDelete.id);

            if (error) throw error;

            setMaterials((prev) =>
                prev.filter((m) => m.id !== materialToDelete.id)
            );
            toast.success("Material deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete material");
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setMaterialToDelete(null);
        }
    };

    const openDeleteDialog = (material: Material) => {
        setMaterialToDelete(material);
        setDeleteDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (materials.length === 0) {
        return (
            <EmptyState
                icon={<FileText className="h-12 w-12" />}
                title="No materials yet"
                description="Upload your first study material to get started."
                action={
                    <Button asChild>
                        <Link href="/admin/upload">Upload Material</Link>
                    </Button>
                }
            />
        );
    }

    return (
        <>
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>University</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-center">Views</TableHead>
                            <TableHead className="text-center">Downloads</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {materials.map((material) => {
                            const university = UNIVERSITIES[material.university as University];
                            return (
                                <TableRow key={material.id}>
                                    <TableCell>
                                        <div className="max-w-[200px]">
                                            <p className="font-medium truncate">{material.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {material.subject}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className="font-normal"
                                            style={{
                                                backgroundColor: `${university?.color}15`,
                                                color: university?.color,
                                            }}
                                        >
                                            {university?.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal">
                                            {MATERIAL_TYPES[material.material_type]?.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-sm">
                                            <Eye className="h-3 w-3" />
                                            {material.view_count}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-sm">
                                            <Download className="h-3 w-3" />
                                            {material.download_count}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {formatFileSize(material.file_size)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(material.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/view/${material.id}`} target="_blank">
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => openDeleteDialog(material)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Material</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{materialToDelete?.title}"? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
