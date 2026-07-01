"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSpaceById, uploadSpaceThumbnail } from "@/features/spaces/services";
import { resolveBackendMediaUrl } from "@/lib/media-url";
import { useAuthStore } from "@/store/auth-store";
import { getCategoryGradientClass } from "../space-details/space-utils";
import { cn } from "@/lib/utils";
import type { Space } from "@/lib/types/api-types";

interface ThumbnailManagerProps {
  space: Space;
  spaceId: string;
}

const MAX_SIZE_MB = 4;

function resolveThumbUrl(
  raw: string | null | undefined,
  token: string | null,
  cacheBuster?: string,
): string | null {
  const resolved = resolveBackendMediaUrl(raw);
  if (!resolved) return null;
  const separator = resolved.includes("?") ? "&" : "?";
  const busterStr = cacheBuster ? `v=${cacheBuster}` : "";
  if (!token || !resolved.startsWith("/api/backend-files/")) {
    return busterStr ? `${resolved}${separator}${busterStr}` : resolved;
  }
  return busterStr
    ? `${resolved}${separator}token=${encodeURIComponent(token)}&${busterStr}`
    : `${resolved}${separator}token=${encodeURIComponent(token)}`;
}

export function ThumbnailManager({ space: initialSpace, spaceId }: ThumbnailManagerProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const token = useAuthStore((s) => s.token);

  // Local blob URL shown while the upload is in-flight.
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  // URL from the upload response (may be null if backend didn't return one).
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(undefined);
  // Whether we need to refetch to get the real URL.
  const [needsRefetch, setNeedsRefetch] = useState(false);
  const [cacheBuster, setCacheBuster] = useState<string>("");

  // Re-fetch space data after upload when the response didn't include the URL.
  const { data: refetchedSpace } = useQuery({
    queryKey: ["spaces", spaceId, "details"],
    queryFn: () => getSpaceById(spaceId),
    enabled: needsRefetch,
  });

  // Source of truth for the displayed thumbnail, in priority order:
  // 1. local blob preview (while uploading)
  // 2. URL from upload response
  // 3. URL from refetch
  // 4. URL from the prop passed by parent
  const activeSpace = refetchedSpace ?? initialSpace;
  const serverUrl =
    uploadedUrl !== undefined
      ? uploadedUrl  // explicit value from upload response (may be null)
      : activeSpace.thumbnailImageUrl;

  const displaySrc = localPreview ?? resolveThumbUrl(serverUrl, token, cacheBuster);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadSpaceThumbnail(spaceId, file),
    onSuccess: async (response) => {
      console.log("[ThumbnailManager] upload response:", response);

      const returnedUrl = response?.thumbnailImageUrl ?? null;
      setUploadedUrl(returnedUrl ?? undefined);
      setLocalPreview(null);
      setCacheBuster(String(Date.now()));

      if (!returnedUrl) {
        // Backend didn't return a URL in the response body — trigger a refetch
        // of the space to pick up the new thumbnailImageUrl.
        setNeedsRefetch(true);
      }

      toast.success("Thumbnail updated.");

      // Invalidate broadly so SpaceCard and SpaceHeader also update.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "details"] }),
        queryClient.invalidateQueries({ queryKey: ["spaces"] }),
      ]);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Unable to upload thumbnail.");
      setLocalPreview(null);
    },
  });

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }
    setLocalPreview(URL.createObjectURL(file));
    uploadMutation.mutate(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Space thumbnail</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Shown on the space card and header. Falls back to the category gradient when none is set.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Preview: plain <img> inside a gradient-background container */}
        <div
          className={cn(
            "relative size-24 shrink-0 overflow-hidden rounded-xl",
            getCategoryGradientClass(activeSpace.category),
          )}
        >
          {displaySrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={displaySrc}
              src={displaySrc}
              alt={activeSpace.name}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          {uploadMutation.isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploadMutation.isPending}
            onClick={() => inputRef.current?.click()}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ImagePlus />
            )}
            {uploadMutation.isPending ? "Uploading…" : "Upload image"}
          </Button>
          <p className="text-xs text-muted-foreground">
            PNG or JPG, up to {MAX_SIZE_MB}MB.
          </p>
        </div>
      </div>
    </div>
  );
}
