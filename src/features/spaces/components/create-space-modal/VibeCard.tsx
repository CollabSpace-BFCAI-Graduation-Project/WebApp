import { Button } from "@/components/ui/button";
import { useCreateSpaceFormStore } from "@/store/create-space-form";
import { Vibe, SpaceVibe } from "../../types";
import { useFormContext } from "react-hook-form";
import { CreateSpaceFormValues } from "../../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInviteCode, createSpace, updateSpacePrivacy, uploadSpaceThumbnail } from "../../services";
import { getSpacePrivacy, isPublicSpace } from "../../space-membership";
import { syncSpacePrivacyInCache } from "../../space-privacy-sync";
import { toast } from "sonner";
import { useCategory } from "../../hooks/useCategory";
import { useSearch } from "../../hooks/useSearch";
import { useSort } from "../../hooks/useSort";
import { useTab } from "../../hooks/useTab";

interface VibeCardProps {
  vibe: Vibe;
}

const SPACE_TYPE_BY_VIBE: Record<SpaceVibe, number> = {
  "Art Gallery": 0,
  "Cyber Lab": 1,
  "Cozy Lounge": 2,
  Classroom: 3,
};

const generateSpaceCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
};

export const VibeCard = ({ vibe }: VibeCardProps) => {
  const nextStep = useCreateSpaceFormStore((state) => state.nextStep);
  const setCreatedSpace = useCreateSpaceFormStore(
    (state) => state.setCreatedSpace,
  );
  const setCreatedInvite = useCreateSpaceFormStore(
    (state) => state.setCreatedInvite,
  );
  const form = useFormContext<CreateSpaceFormValues>();
  const queryClient = useQueryClient();
  const [, setCategory] = useCategory();
  const [, setSearch] = useSearch();
  const [, setSort] = useSort();
  const [, setTab] = useTab();

  const createSpaceMutation = useMutation({
    mutationFn: async (values: CreateSpaceFormValues) => {
      const requestedPrivacy = values.privacy === "Public" ? "Public" : "Private";
      const createdSpace = await createSpace({
        name: values.name,
        description: values.description,
        code: generateSpaceCode(),
        spaceType: values.vibe ? SPACE_TYPE_BY_VIBE[values.vibe] : 0,
        privacy: requestedPrivacy,
      });

      let resolvedPrivacy = getSpacePrivacy(createdSpace);
      if (resolvedPrivacy.toLowerCase() !== requestedPrivacy.toLowerCase()) {
        const privacyResult = await updateSpacePrivacy(
          createdSpace.id,
          requestedPrivacy,
        );
        resolvedPrivacy = privacyResult.privacy;
      }

      if (
        requestedPrivacy === "Public" &&
        !isPublicSpace({ privacy: resolvedPrivacy })
      ) {
        throw new Error(
          "This space could not be set to public. Please try again or contact support.",
        );
      }

      // Upload thumbnail if one was provided by the user.
      if (values.thumbnail instanceof File) {
        await uploadSpaceThumbnail(createdSpace.id, values.thumbnail).catch(() => {
          // Non-fatal: space is still created even if thumbnail fails.
          toast.warning("Space created, but thumbnail upload failed. You can set it later in settings.");
        });
      }

      const createdInvite = await createInviteCode(createdSpace.id);

      return {
        createdSpace: {
          ...createdSpace,
          spacePrivacy: resolvedPrivacy,
        },
        createdInvite,
        resolvedPrivacy,
      };
    },
    onSuccess: async ({ createdSpace, createdInvite, resolvedPrivacy }) => {
      syncSpacePrivacyInCache(queryClient, createdSpace.id, resolvedPrivacy);
      setCreatedSpace(createdSpace);
      setCreatedInvite(createdInvite);
      await Promise.all([
        setCategory("all-categories"),
        setSearch(""),
        setSort("newest-first"),
        setTab("all"),
        queryClient.invalidateQueries({ queryKey: ["spaces"] }),
        queryClient.invalidateQueries({ queryKey: ["spaces", "infinite"] }),
        queryClient.invalidateQueries({ queryKey: ["spaces", "public"] }),
      ]);
      nextStep();
      toast.success("Space created.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to create space.",
      );
    },
  });

  return (
    <Button
      type="button"
      className="h-auto select-none flex-col items-stretch gap-3 border border-border p-4 text-left transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1"
      variant="ghost"
      disabled={createSpaceMutation.isPending}
      onClick={async () => {
        form.setValue("vibe", vibe.name, { shouldValidate: true });
        const isValid = await form.trigger();

        if (!isValid) {
          return;
        }

        createSpaceMutation.mutate(form.getValues());
      }}
    >
      {vibe.background}
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-sm font-semibold">{vibe.name}</h3>
        <p className="text-xs text-muted-foreground pl-0.5">
          {vibe.category.toUpperCase()}
        </p>
      </div>
    </Button>
  );
};
