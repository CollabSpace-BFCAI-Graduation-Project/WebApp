"use client";

import Link from "next/link";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Folder, Link2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StorageContents } from "@/lib/types/api-types";

import { uploadSpaceFile } from "../../services";
import { formatBytes } from "./space-utils";

interface SharedFilesSectionProps {
  spaceId: string;
  storage: StorageContents;
  canManageFiles: boolean;
}

export function SharedFilesSection({
  spaceId,
  storage,
  canManageFiles,
}: SharedFilesSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadSpaceFile(spaceId, file),
    onSuccess: async () => {
      toast.success("File uploaded.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "details"] }),
        queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "files"] }),
      ]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload this file.",
      );
    },
  });
  const handleUploadClick = () => {
    if (!canManageFiles) {
      toast.error("Join this space before uploading files.");
      return;
    }

    fileInputRef.current?.click();
  };
  const items = [
    ...storage.folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      meta: `${folder.itemCount} items`,
      icon: Folder,
    })),
    ...storage.files.map((file) => ({
      id: file.id,
      name: file.name,
      meta: `${file.fileType || file.mimeType} - ${formatBytes(file.sizeInBytes)}`,
      icon: FileText,
    })),
    ...storage.links.map((link) => ({
      id: link.id,
      name: link.name,
      meta: link.url,
      icon: Link2,
    })),
  ].slice(0, 5);

  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>Shared Files</CardTitle>
          <CardDescription>
            Recent files, folders, and links for this space.
          </CardDescription>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            onChange={(event) => {
              if (!canManageFiles) {
                toast.error("Join this space before uploading files.");
                return;
              }

              const file = event.target.files?.[0];
              if (file) {
                uploadMutation.mutate(file);
              }
            }}
          />
          {canManageFiles ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={uploadMutation.isPending}
                onClick={handleUploadClick}
              >
                <Upload />
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
              <Link
                href={`/spaces/${spaceId}/files`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </>
          ) : (
            <Button type="button" size="sm" variant="outline" onClick={handleUploadClick}>
              <Upload />
              Join to upload
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <div className="divide-y rounded-lg border">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 items-center gap-3 px-4 py-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <item.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm font-medium">No shared files yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Files and links will appear here once members add them.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
