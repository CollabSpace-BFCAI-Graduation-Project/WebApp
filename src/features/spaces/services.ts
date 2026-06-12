import { api } from "@/lib/api-client";
import { resolveBackendMediaUrl } from "@/lib/media-url";
import { getSpacePrivacy } from "./space-membership";
import { getPrivacyOverride } from "./space-privacy-sync";
import type {
  BatchInviteResult,
  CreateSpaceRequest,
  CreateSpaceResponse,
  ChatChannel,
  ChatMessage,
  CursorResponse,
  FavoriteSpaceResponse,
  FileItem,
  FolderItem,
  InviteCode,
  JoinRequest,
  LinkItem,
  MemberDto,
  MessageResponse,
  PagedResponse,
  PaginationMeta,
  Profile,
  Space,
  SpacePrivacyResponse,
  SpaceSession,
  StorageContents,
} from "@/lib/types/api-types";

const pagedParams = (page: number, pageSize: number) => ({
  Page: page,
  PageSize: pageSize,
});

function normalizePaginationMeta(
  meta: PaginationMeta | Record<string, unknown> | undefined,
): PaginationMeta | undefined {
  if (!meta) {
    return undefined;
  }

  const record = meta as Record<string, unknown>;

  return {
    pageNumber: Number(record.pageNumber ?? record.PageNumber ?? 1),
    pageSize: Number(record.pageSize ?? record.PageSize ?? 20),
    totalRecords: Number(record.totalRecords ?? record.TotalRecords ?? 0),
    totalPages: Number(record.totalPages ?? record.TotalPages ?? 1),
  };
}

async function getPaged<T>(path: string, params: Record<string, unknown>) {
  const response = await api.get<PagedResponse<T>>(path, { params });
  const meta = normalizePaginationMeta(response.meta);

  return meta ? { ...response, meta } : response;
}

function normalizeSpace(raw: Space & Record<string, unknown>): Space {
  const id = String(raw.id ?? raw.Id ?? "");

  return {
    ...raw,
    id,
    name: String(raw.name ?? raw.Name ?? ""),
    description: String(raw.description ?? raw.Description ?? ""),
    category: String(raw.category ?? raw.Category ?? raw.spaceType ?? raw.SpaceType ?? ""),
    privacy: getPrivacyOverride(id) ?? getSpacePrivacy(raw),
    code: String(raw.code ?? raw.Code ?? ""),
    thumbnailColor: (raw.thumbnailColor ?? raw.ThumbnailColor ?? null) as string | null,
    thumbnailImageUrl: (raw.thumbnailImageUrl ??
      raw.ThumbnailImageUrl ??
      raw.thumbnailImage ??
      raw.ThumbnailImage ??
      null) as string | null,
    isOwner: Boolean(raw.isOwner ?? raw.IsOwner ?? false),
    isFavorite: Boolean(raw.isFavorite ?? raw.IsFavorite ?? false),
    owner: (raw.owner ?? raw.Owner) as Space["owner"],
    members: (raw.members ?? raw.Members ?? []) as Space["members"],
    createdAt: String(raw.createdAt ?? raw.CreatedAt ?? ""),
  };
}

function normalizeSpacePage(response: PagedResponse<Space>) {
  return {
    ...response,
    data: (response.data ?? []).map((space) =>
      normalizeSpace(space as Space & Record<string, unknown>),
    ),
  };
}

function normalizeCreateSpaceResponse(
  raw: CreateSpaceResponse & Record<string, unknown>,
): CreateSpaceResponse {
  return {
    ...raw,
    id: String(raw.id ?? raw.Id ?? ""),
    name: String(raw.name ?? raw.Name ?? ""),
    description: String(raw.description ?? raw.Description ?? ""),
    code: String(raw.code ?? raw.Code ?? ""),
    ownerId: String(raw.ownerId ?? raw.OwnerId ?? ""),
    spacePrivacy: getSpacePrivacy(raw) || "Private",
    spaceType: String(raw.spaceType ?? raw.SpaceType ?? ""),
    createdAt: String(raw.createdAt ?? raw.CreatedAt ?? ""),
    thumbnailColor: (raw.thumbnailColor ?? raw.ThumbnailColor ?? null) as string | null,
    thumbnailImage: (raw.thumbnailImageUrl ??
      raw.ThumbnailImageUrl ??
      raw.thumbnailImage ??
      raw.ThumbnailImage ??
      null) as string | null,
  };
}

export const getSpaces = async (page = 1, pageSize = 100) =>
  normalizeSpacePage(await getPaged<Space>("/spaces", pagedParams(page, pageSize)));

export const getSpaceMembers = (id: string, page = 1, pageSize = 50) =>
  getPaged<MemberDto>(`/spaces/${id}/members`, pagedParams(page, pageSize));

export const getUserProfileById = async (id: string) => {
  const profile = await api.get<Profile & Record<string, unknown>>(`/profile/${id}`);
  return {
    id: String(profile.id ?? profile.Id ?? ""),
    username: String(profile.username ?? profile.Username ?? ""),
    email: String(profile.email ?? profile.Email ?? ""),
    name: String(profile.name ?? profile.Name ?? ""),
    bio: (profile.bio ?? profile.Bio ?? null) as string | null,
    avatarColor: (profile.avatarColor ?? profile.AvatarColor ?? null) as string | null,
    avatarImage: resolveBackendMediaUrl(
      (profile.avatarImage ?? profile.AvatarImage ?? null) as string | null,
    ) ?? null,
    privacy: (String(profile.privacy ?? profile.Privacy ?? "").toLowerCase() || "public"),
    showEmail: Boolean(profile.showEmail ?? profile.ShowEmail ?? false),
  } as Profile;
};

export const getPublicProfiles = async (q?: string, page = 1, pageSize = 100) => {
  const params: Record<string, unknown> = { page, pageSize };
  if (q) params.q = q;
  const result = await api.get<PagedResponse<Profile & Record<string, unknown>>>("/profile", { params });
  return {
    ...result,
    data: (result.data ?? []).map((profile) => ({
      id: String(profile.id ?? profile.Id ?? ""),
      username: String(profile.username ?? profile.Username ?? ""),
      email: String(profile.email ?? profile.Email ?? ""),
      name: String(profile.name ?? profile.Name ?? ""),
      bio: (profile.bio ?? profile.Bio ?? null) as string | null,
      avatarColor: (profile.avatarColor ?? profile.AvatarColor ?? null) as string | null,
      avatarImage: resolveBackendMediaUrl(
        (profile.avatarImage ?? profile.AvatarImage ?? null) as string | null,
      ) ?? null,
      privacy: (String(profile.privacy ?? profile.Privacy ?? "").toLowerCase() || "public"),
      showEmail: Boolean(profile.showEmail ?? profile.ShowEmail ?? false),
    }) as Profile),
  };
};

export const getPublicSpaces = async (
  page = 1,
  pageSize = 20,
  q?: string,
) =>
  normalizeSpacePage(
    await getPaged<Space>("/spaces/public", {
      page,
      pageSize,
      ...(q ? { q } : {}),
    }),
  );

export const createSpace = async (data: CreateSpaceRequest) => {
  const formData = new URLSearchParams();
  formData.append("Name", data.name);
  formData.append("Description", data.description);
  formData.append("Code", data.code);
  formData.append("SpaceType", String(data.spaceType));

  if (data.privacy) {
    formData.append("Privacy", data.privacy);
  }

  const created = await api.post<CreateSpaceResponse>("/spaces", formData.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return normalizeCreateSpaceResponse(
    created as CreateSpaceResponse & Record<string, unknown>,
  );
};

export const getSpaceById = async (id: string) =>
  normalizeSpace(
    (await api.get<Space>(`/spaces/${id}`)) as Space & Record<string, unknown>,
  );

export const updateSpacePrivacy = async (
  id: string,
  privacy: "Private" | "Public",
) => {
  const response = await api.patch<SpacePrivacyResponse>(
    `/spaces/${id}/privacy`,
    { privacy },
  );

  return {
    ...response,
    privacy: getSpacePrivacy(response as SpacePrivacyResponse & Record<string, unknown>),
  };
};

export const getSpaceStorage = (id: string) =>
  api.get<StorageContents>(`/spaces/${id}/storage`);

export const uploadSpaceFile = (
  id: string,
  file: File,
  folderId?: string | null,
) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post<FileItem>(`/spaces/${id}/storage/files`, formData, {
    params: folderId ? { folderId } : undefined,
  });
};

export const createSpaceSession = (
  id: string,
  data: { name?: string; maxParticipants?: number } = {},
) =>
  api.post<SpaceSession>(`/spaces/${id}/sessions`, {
    name: data.name ?? "3D Collaboration Room",
    maxParticipants: data.maxParticipants ?? 16,
  });

export const joinSpace = (id: string) => createSpaceSession(id);

export const createInviteCode = (
  id: string,
  data: { maxUses?: number | null; expiresAt?: string | null } = {},
) =>
  api.post<InviteCode>(`/spaces/${id}/invites/codes`, {
    maxUses: data.maxUses ?? null,
    expiresAt: data.expiresAt ?? null,
  });

export const getInviteCodes = (id: string, page = 1, pageSize = 50) =>
  api.get<PagedResponse<InviteCode>>(`/spaces/${id}/invites/codes`, {
    params: pagedParams(page, pageSize),
  });

export const sendDirectInvites = (spaceId: string, invitedUsers: string[]) =>
  api.post<BatchInviteResult>(`/spaces/${spaceId}/invites/direct`, {
    invitedUsers,
  });

export const getFavoriteSpaces = async (page = 1, pageSize = 100) => {
  const response = await api.get<PagedResponse<Space>>("/spaces/favorites", {
    params: pagedParams(page, pageSize),
  });

  return normalizeSpacePage(response);
};

export const toggleFavorite = (id: string) =>
  api.post<FavoriteSpaceResponse>(`/spaces/${id}/favorite`);

export const joinSpaceWithCode = (code: string) => {
  if (!code || code.trim().length < 4) {
    return Promise.reject(new Error("Invite code is too short"));
  }
  return api.post<MessageResponse>(`/spaces/join-via-code/${encodeURIComponent(code.trim())}`);
};

export const submitJoinRequest = (
  spaceId: string,
  message?: string | null,
) =>
  api.post<JoinRequest>(`/spaces/${spaceId}/invites/join-requests`, {
    message: message ?? null,
  });

export const getMyJoinRequests = (page = 1, pageSize = 50) =>
  api.get<PagedResponse<JoinRequest>>("/spaces/my-join-requests", {
    params: pagedParams(page, pageSize),
  });

export const getSpaceJoinRequests = (id: string, page = 1, pageSize = 50) =>
  api.get<PagedResponse<JoinRequest>>(`/spaces/${id}/invites/join-requests`, {
    params: pagedParams(page, pageSize),
  });

export const respondToJoinRequest = (
  spaceId: string,
  requestId: string,
  accept: boolean,
) =>
  api.put<MessageResponse>(
    `/spaces/${spaceId}/invites/join-requests/${requestId}/respond`,
    { accept },
  );

export const getSpaceSessions = (id: string, page = 1, pageSize = 50) =>
  api.get<PagedResponse<SpaceSession>>(`/spaces/${id}/sessions`, {
    params: pagedParams(page, pageSize),
  });

export const getSpaceChannels = (id: string, page = 1, pageSize = 50) =>
  api.get<PagedResponse<ChatChannel>>(`/spaces/${id}/channels`, {
    params: pagedParams(page, pageSize),
  });

export const createSpaceChannel = (
  id: string,
  data: { name: string; description?: string | null },
) => api.post<ChatChannel>(`/spaces/${id}/channels`, data);

export const updateSpaceChannel = (
  id: string,
  channelId: string,
  data: { name: string; description?: string | null },
) => api.put<ChatChannel>(`/spaces/${id}/channels/${channelId}`, data);

export const deleteSpaceChannel = (id: string, channelId: string) =>
  api.delete<MessageResponse>(`/spaces/${id}/channels/${channelId}`);

export const getChannelMessages = (
  id: string,
  channelId: string,
  limit = 50,
) =>
  api.get<CursorResponse<ChatMessage>>(
    `/spaces/${id}/channels/${channelId}/messages`,
    {
      params: { limit },
    },
  );

export const sendChannelMessage = (
  id: string,
  channelId: string,
  data: { text: string; parentId?: string | null; files?: File[]; mentionedUserIds?: string[] },
) => {
  if (data.files && data.files.length > 0) {
    const formData = new FormData();
    formData.append("Text", data.text);
    if (data.parentId) {
      formData.append("ParentId", data.parentId);
    }
    if (data.mentionedUserIds && data.mentionedUserIds.length > 0) {
      data.mentionedUserIds.forEach((uid) => {
        formData.append("MentionedUserIds", uid);
      });
    }
    data.files.forEach((file) => {
      formData.append("Files", file);
    });
    return api.post<ChatMessage>(`/spaces/${id}/channels/${channelId}/messages`, formData);
  }

  return api.post<ChatMessage>(`/spaces/${id}/channels/${channelId}/messages`, {
    text: data.text,
    parentId: data.parentId ?? null,
    ...(data.mentionedUserIds && data.mentionedUserIds.length > 0
      ? { mentionedUserIds: data.mentionedUserIds }
      : {}),
  });
};

export const getFolderContents = (id: string, folderId: string) =>
  api.get<StorageContents>(`/spaces/${id}/storage/folders/${folderId}`);

export const createFolder = (
  id: string,
  data: { name: string; parentId?: string | null },
) => api.post<FolderItem>(`/spaces/${id}/storage/folders`, data);

export const createLink = (
  id: string,
  data: { name: string; url: string; folderId?: string | null },
) => api.post<LinkItem>(`/spaces/${id}/storage/links`, data);

export const deleteFolder = (id: string, folderId: string) =>
  api.delete<MessageResponse>(`/spaces/${id}/storage/folders/${folderId}`);

export const deleteStorageItem = (id: string, itemId: string) =>
  api.delete<MessageResponse>(`/spaces/${id}/storage/items/${itemId}`);

export const cancelJoinRequest = (requestId: string) =>
  api.delete<MessageResponse>(`/spaces/my-join-requests/${requestId}`);
