"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Folder,
  Link2,
  Upload,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageMotion } from "@/components/shared/PageMotion";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type {
  FileItem,
  FolderItem,
  LinkItem,
  StorageContents,
} from "@/lib/types/api-types";
import { useAuthStore } from "@/store/auth-store";
import {
  getSpaceById,
  getSpaceStorage,
  uploadSpaceFile,
  getFolderContents,
  createFolder,
  createLink,
  deleteFolder,
  deleteStorageItem,
} from "../../services";
import { isSpaceMember } from "../../space-membership";
import { formatBytes } from "./space-utils";

interface SpaceFilesPageClientProps {
  spaceId: string;
}

const emptyStorage: StorageContents = {
  folders: [],
  files: [],
  links: [],
};

export function SpaceFilesPageClient({ spaceId }: SpaceFilesPageClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id);

  // Folder navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);

  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const { data, error, isLoading } = useQuery({
    queryKey: ["spaces", spaceId, "files", currentFolderId],
    queryFn: async () => {
      const spacePromise = getSpaceById(spaceId);
      const storagePromise = currentFolderId
        ? getFolderContents(spaceId, currentFolderId)
        : getSpaceStorage(spaceId);

      const [space, storage] = await Promise.all([spacePromise, storagePromise]);
      return { space, storage };
    },
  });

  const space = data?.space;
  const storage = data?.storage ?? emptyStorage;
  const canManageFiles = space ? isSpaceMember(space, currentUserId) : false;
  const canDeleteStorageItem = (creatorId?: string | null) =>
    Boolean(space?.isOwner || (currentUserId && creatorId === currentUserId));
  const fileCount =
    storage.files.length + storage.folders.length + storage.links.length;

  // Mutations
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadSpaceFile(spaceId, file, currentFolderId),
    onSuccess: async () => {
      toast.success("File uploaded.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "files"] }),
        queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "details"] }),
      ]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (uploadError) => {
      toast.error(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload this file.",
      );
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: (name: string) =>
      createFolder(spaceId, { name, parentId: currentFolderId }),
    onSuccess: async () => {
      toast.success("Folder created.");
      setIsFolderModalOpen(false);
      setNewFolderName("");
      await queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "files"] });
    },
    onError: (createError) => {
      toast.error(
        createError instanceof Error
          ? createError.message
          : "Unable to create folder.",
      );
    },
  });

  const createLinkMutation = useMutation({
    mutationFn: ({ name, url }: { name: string; url: string }) =>
      createLink(spaceId, { name, url, folderId: currentFolderId }),
    onSuccess: async () => {
      toast.success("Link added.");
      setIsLinkModalOpen(false);
      setNewLinkName("");
      setNewLinkUrl("");
      await queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "files"] });
    },
    onError: (createError) => {
      toast.error(
        createError instanceof Error
          ? createError.message
          : "Unable to add link.",
      );
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (folder: FolderItem) => {
      if (!canDeleteStorageItem(folder.createdById)) {
        throw new Error("Only the owner or item creator can delete this folder.");
      }

      return deleteFolder(spaceId, folder.id);
    },
    onSuccess: async () => {
      toast.success("Folder deleted.");
      await queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "files"] });
    },
    onError: (deleteError) => {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete folder.",
      );
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (item: FileItem | LinkItem) => {
      const creatorId = "uploadedById" in item ? item.uploadedById : item.createdById;

      if (!canDeleteStorageItem(creatorId)) {
        throw new Error("Only the owner or item creator can delete this item.");
      }

      return deleteStorageItem(spaceId, item.id);
    },
    onSuccess: async () => {
      toast.success("Item deleted.");
      await queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "files"] });
    },
    onError: (deleteError) => {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete item.",
      );
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load shared files.",
      );
    }
  }, [error]);

  const handleFolderClick = (folder: FolderItem) => {
    setCurrentFolderId(folder.id);
    setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setCurrentFolderId(null);
      setFolderPath([]);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setCurrentFolderId(newPath[newPath.length - 1].id);
      setFolderPath(newPath);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-28 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md rounded-xl border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">Files unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Shared files could not be found."}
          </p>
          <Link
            href={`/spaces/${spaceId}`}
            className={buttonVariants({ variant: "outline", className: "mt-6" })}
          >
            Back to space
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageFiles) {
      toast.error("Join this space before creating folders.");
      return;
    }

    if (newFolderName.trim()) {
      createFolderMutation.mutate(newFolderName.trim());
    }
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageFiles) {
      toast.error("Join this space before adding links.");
      return;
    }

    if (newLinkName.trim() && newLinkUrl.trim()) {
      createLinkMutation.mutate({
        name: newLinkName.trim(),
        url: newLinkUrl.trim(),
      });
    }
  };

  return (
    <PageMotion className="space-y-6 p-6">
      <header className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Link
            href={`/spaces/${spaceId}`}
            className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-3" })}
          >
            <ArrowLeft />
            Back to space
          </Link>
          <div className="space-y-1">
            <h1 className="truncate text-2xl font-semibold">Shared Files</h1>
            <p className="text-sm text-muted-foreground">
              {space.name} contains {fileCount} shared item
              {fileCount === 1 ? "" : "s"} inside this folder.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          {canManageFiles && (
            <>
              <Button
                type="button"
                size="sm"
                disabled={uploadMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload />
                {uploadMutation.isPending ? "Uploading..." : "Upload file"}
              </Button>

              <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsFolderModalOpen(true)}
                >
                  <Plus />
                  New Folder
                </Button>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateFolder} className="space-y-4 py-2">
                    <Input
                      required
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <DialogFooter>
                      <DialogClose render={<Button type="button" variant="outline" />}>
                        Cancel
                      </DialogClose>
                      <Button type="submit" disabled={createFolderMutation.isPending}>
                        {createFolderMutation.isPending ? "Creating..." : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsLinkModalOpen(true)}
                >
                  <Plus />
                  Add Link
                </Button>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Add External Link</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateLink} className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Input
                        required
                        placeholder="Link Name (e.g. Figma Project)"
                        value={newLinkName}
                        onChange={(e) => setNewLinkName(e.target.value)}
                      />
                      <Input
                        required
                        type="url"
                        placeholder="URL (https://...)"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose render={<Button type="button" variant="outline" />}>
                        Cancel
                      </DialogClose>
                      <Button type="submit" disabled={createLinkMutation.isPending}>
                        {createLinkMutation.isPending ? "Adding..." : "Add"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
          {!canManageFiles && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => toast.error("Join this space before managing files.")}
            >
              <Upload />
              Join to manage files
            </Button>
          )}

          <Badge variant="secondary">{storage.folders.length} folders</Badge>
          <Badge variant="secondary">{storage.files.length} files</Badge>
          <Badge variant="secondary">{storage.links.length} links</Badge>
        </div>
      </header>

      {/* Breadcrumbs Navigation */}
      <div className="bg-card border rounded-xl p-3 flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mr-2">
          Location:
        </span>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {folderPath.length === 0 ? (
                <BreadcrumbPage>Root</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  onClick={() => handleBreadcrumbClick(-1)}
                  className="cursor-pointer"
                >
                  Root
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {folderPath.length > 0 && <BreadcrumbSeparator />}
            {folderPath.map((item, index) => {
              const isLast = index === folderPath.length - 1;
              return (
                <React.Fragment key={item.id}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => handleBreadcrumbClick(index)}
                        className="cursor-pointer"
                      >
                        {item.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {fileCount ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {storage.folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => handleFolderClick(folder)}
              onDelete={
                canDeleteStorageItem(folder.createdById)
                  ? () => deleteFolderMutation.mutate(folder)
                  : undefined
              }
              deletePending={deleteFolderMutation.isPending}
            />
          ))}
          {storage.files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={
                canDeleteStorageItem(file.uploadedById)
                  ? () => deleteItemMutation.mutate(file)
                  : undefined
              }
              deletePending={deleteItemMutation.isPending}
            />
          ))}
          {storage.links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={
                canDeleteStorageItem(link.createdById)
                  ? () => deleteItemMutation.mutate(link)
                  : undefined
              }
              deletePending={deleteItemMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">No shared files in this folder yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Files, folders, and links will appear here once members add them.
          </p>
        </div>
      )}
    </PageMotion>
  );
}

function ItemShell({
  children,
  icon,
  onDelete,
  deletePending = false,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onDelete?: () => void;
  deletePending?: boolean;
}) {
  return (
    <article className="relative flex min-w-0 items-start gap-3 rounded-xl border bg-card p-4 shadow-sm group hover:border-primary/50 transition-all">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive cursor-pointer"
                disabled={deletePending}
                onClick={(e) => e.stopPropagation()}
              />
            }
          >
            <Trash2 className="size-4" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is permanent and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </article>
  );
}

function FolderCard({
  folder,
  onClick,
  onDelete,
  deletePending,
}: {
  folder: FolderItem;
  onClick: () => void;
  onDelete?: () => void;
  deletePending: boolean;
}) {
  return (
    <ItemShell
      icon={
        <div className="cursor-pointer animate-pulse-slow" onClick={onClick}>
          <Folder className="size-5 text-yellow-500 fill-yellow-500/10" />
        </div>
      }
      onDelete={onDelete}
      deletePending={deletePending}
    >
      <div className="space-y-1 cursor-pointer" onClick={onClick}>
        <h2 className="truncate text-sm font-semibold hover:underline">{folder.name}</h2>
        <p className="text-xs text-muted-foreground">
          {folder.itemCount} item{folder.itemCount === 1 ? "" : "s"}
        </p>
      </div>
    </ItemShell>
  );
}

function FileCard({
  file,
  onDelete,
  deletePending,
}: {
  file: FileItem;
  onDelete?: () => void;
  deletePending: boolean;
}) {
  const downloadHref = getFileDownloadHref(file.downloadUrl);
  const canDownload = Boolean(downloadHref);

  return (
    <ItemShell
      icon={<FileText className="size-5 text-blue-500" />}
      onDelete={onDelete}
      deletePending={deletePending}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="truncate text-sm font-semibold">{file.name}</h2>
          <p className="truncate text-xs text-muted-foreground">
            {file.fileType || file.mimeType} - {formatBytes(file.sizeInBytes)}
          </p>
        </div>
        {canDownload ? (
          <a
            href={downloadHref}
            download={file.name}
            className={buttonVariants({ size: "sm", variant: "outline", className: "w-full cursor-pointer" })}
          >
            <Download />
            Download
          </a>
        ) : (
          <span
            className={buttonVariants({
              size: "sm",
              variant: "outline",
              className: "w-full pointer-events-none opacity-50",
            })}
          >
            <Download />
            Download unavailable
          </span>
        )}
      </div>
    </ItemShell>
  );
}

function getFileDownloadHref(downloadUrl?: string | null) {
  if (!downloadUrl || downloadUrl === "#") {
    return undefined;
  }

  if (downloadUrl.startsWith("/uploads/")) {
    return `/api/backend-files${downloadUrl}`;
  }

  if (downloadUrl.startsWith("uploads/")) {
    return `/api/backend-files/${downloadUrl}`;
  }

  return downloadUrl;
}

function LinkCard({
  link,
  onDelete,
  deletePending,
}: {
  link: LinkItem;
  onDelete?: () => void;
  deletePending: boolean;
}) {
  return (
    <ItemShell
      icon={<Link2 className="size-5 text-purple-500" />}
      onDelete={onDelete}
      deletePending={deletePending}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="truncate text-sm font-semibold">{link.name}</h2>
          <p className="truncate text-xs text-muted-foreground">{link.url}</p>
        </div>
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "sm", variant: "outline", className: "w-full cursor-pointer" })}
        >
          <ExternalLink />
          Open link
        </a>
      </div>
    </ItemShell>
  );
}
