export interface PaginationMeta {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  baseRole?: string;
  joinedAt?: string;
}

export interface UserSummaryDto {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface MemberDto {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  baseRole: string;
  roles: RoleResponseDto[];
  joinedAt: string;
}

export interface RoleResponseDto {
  id: string;
  name: string;
  key: string;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  emailConfirmed?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresInMinutes?: number;
  user: AuthUser;
}

export interface LoginResponseDto {
  id: string;
  email: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  expiresInMinutes: number;
  emailConfirmed: boolean;
}

export type RegisterResponseDto = LoginResponseDto;

export interface Space {
  id: string;
  name: string;
  description: string;
  category: string;
  privacy: string;
  code: string;
  thumbnailColor: string | null;
  thumbnailImageUrl: string | null;
  isOwner: boolean;
  isFavorite: boolean;
  owner: MemberDto;
  members: MemberDto[];
  createdAt: string;
}

export interface CreateSpaceRequest {
  name: string;
  description: string;
  code: string;
  spaceType: number;
  privacy?: "Private" | "Public";
}

export interface CreateSpaceResponse {
  id: string;
  name: string;
  description: string;
  code: string;
  ownerId: string;
  spacePrivacy: string;
  spaceType: string;
  createdAt: string;
  thumbnailColor: string | null;
  thumbnailImage: string | null;
}

export interface FileItem {
  id: string;
  name: string;
  folderId: string | null;
  spaceId: string;
  mimeType: string;
  fileType: string;
  sizeInBytes: number;
  downloadUrl: string;
  uploadedById: string | null;
  createdAt: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  spaceId: string;
  createdById: string | null;
  itemCount: number;
  createdAt: string;
}

export interface LinkItem {
  id: string;
  name: string;
  url: string;
  folderId: string | null;
  spaceId: string;
  createdById: string | null;
  createdAt: string;
}

export interface StorageContents {
  folders: FolderItem[];
  files: FileItem[];
  links: LinkItem[];
}

export interface InviteCode {
  id: string;
  code: string;
  maxUses: number | null;
  uses: number;
  expiresAt: string | null;
  creatorId: string;
  createdAt: string;
}

export interface SpaceSession {
  id: string;
  spaceId: string;
  hostId: string;
  code: string;
  name: string | null;
  status: string;
  maxParticipants: number;
  currentParticipants: number;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
}

export interface FavoriteSpaceResponse {
  spaceId: string;
  isFavorite: boolean;
}

export interface SpacePrivacyResponse {
  spaceId: string;
  privacy: string;
}

export interface MessageResponse {
  message: string;
}

export interface CursorMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CursorResponse<T> {
  data: T[];
  meta: CursorMeta;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string | null;
  spaceId: string;
  creatorId: string | null;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  text: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  editedAt: string | null;
  parentMessage: ParentMessageResponseDto | null;
  sender: UserSummaryDto;
  deletedBy: UserSummaryDto | null;
  mentions: UserSummaryDto[];
  attachments: ChatMessageAttachmentDto[];
}

export interface ParentMessageResponseDto {
  id: string;
  channelId: string;
  sender: UserSummaryDto;
  text: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface ChatMessageAttachmentDto {
  id: string;
  fileId: string | null;
  url: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isDeleted: boolean;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface DirectInvite {
  id: string;
  inviter: UserSummaryDto;
  invitedUser: UserSummaryDto;
  spaceId: string;
  spaceName: string;
  status: string;
  createdAt: string;
  respondedAt: string | null;
}

export interface JoinRequest {
  id: string;
  user: UserSummaryDto;
  spaceId: string;
  status: string;
  message: string | null;
  createdAt: string;
  respondedAt: string | null;
}

export interface BatchInviteResult {
  successfulInvites?: DirectInvite[];
  failedInvites?: {
    identifier?: string | null;
    errorMessage?: string | null;
  }[];
}

export interface UnreadCount {
  count: number;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  name: string;
  bio: string | null;
  avatarColor: string | null;
  avatarImage: string | null;
  privacy: string;
  showEmail: boolean;
}

export interface EditProfileResponse {
  id: string;
  username: string;
  name: string;
  bio: string | null;
  avatarColor: string | null;
  avatarImage: string | null;
  privacy: string;
  showEmail: boolean;
}

export interface PrivacySettingsResponse {
  profileVisibility: string;
  showEmail: boolean;
}

export interface UploadAvatarResponse {
  id: string;
  avatarImage: string | null;
}

export interface SearchResultDto {
  id: string;
  type: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  spaceId?: string | null;
  url?: string | null;
}
