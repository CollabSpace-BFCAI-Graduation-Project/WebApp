import type { ChatChannel, Space } from "@/lib/types/api-types";

/**
 * Mentions and channel references are stored on the backend as opaque tokens
 * like `@{8f3c...}` or `#{c1a2...}`. Before rendering notification text we
 * replace those tokens with human-readable labels (`@Youssef`, `#general`).
 *
 * The resolver is synchronous once built — callers aggregate the id→label
 * maps up front so rendering many notifications stays cheap.
 */

export interface MentionResolverMaps {
  /** user id → display label (username or name) */
  usersById: Map<string, string>;
  /** channel id → channel name */
  channelsById: Map<string, string>;
}

const TOKEN_PATTERN = /([@#])\{([0-9a-fA-F-]{8,})\}/g;
const SHORT_ID_LENGTH = 8;

function shortId(id: string): string {
  return id.slice(0, SHORT_ID_LENGTH);
}

/** Replace `@{id}` / `#{id}` tokens in a string with readable labels. */
export function resolveMentionTokens(
  text: string | null | undefined,
  maps: MentionResolverMaps,
): string {
  if (!text) return "";

  return text.replace(TOKEN_PATTERN, (full, prefix: string, id: string) => {
    if (prefix === "@") {
      const username = maps.usersById.get(id);
      return username ? `@${username}` : `@${shortId(id)}`;
    }
    if (prefix === "#") {
      const channelName = maps.channelsById.get(id);
      return channelName ? `#${channelName}` : `#${shortId(id)}`;
    }
    return full;
  });
}

/**
 * Build resolver maps from the spaces the user already belongs to.
 *
 * - Users come from each space's embedded `members[]` + `owner` (id → username).
 * - Channels are fetched per space (id → name).
 *
 * Channels require an extra request per space, so this is best-effort: any
 * space whose channels fail to load is skipped rather than rejecting the whole
 * build. The result degrades gracefully to short-id fallbacks for unknown ids.
 */
export async function buildMentionResolver(
  spaces: Space[],
  channelsProvider: (spaceId: string) => Promise<ChatChannel[]>,
): Promise<MentionResolverMaps> {
  const usersById = new Map<string, string>();
  const channelsById = new Map<string, string>();

  for (const space of spaces) {
    if (space.owner?.id && space.owner.username) {
      usersById.set(space.owner.id, space.owner.username);
    }
    for (const member of space.members ?? []) {
      if (member.id && member.username) {
        usersById.set(member.id, member.username);
      }
    }
  }

  await Promise.all(
    spaces.map(async (space) => {
      try {
        const channels = await channelsProvider(space.id);
        for (const channel of channels) {
          if (channel.id && channel.name) {
            channelsById.set(channel.id, channel.name);
          }
        }
      } catch {
        // Skip spaces whose channels we can't read (e.g. not a member).
      }
    }),
  );

  return { usersById, channelsById };
}
