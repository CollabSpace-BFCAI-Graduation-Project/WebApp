export function parseInviteInput(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return null;
  }

  try {
    const baseUrl = typeof window === "undefined" ? "http://localhost" : window.location.origin;
    const inviteUrl = new URL(trimmedInput, baseUrl);
    
    const pathSegments = inviteUrl.pathname.split("/").filter(Boolean);
    const spacesIndex = pathSegments.indexOf("spaces");
    const spaceId = spacesIndex >= 0 && spacesIndex + 1 < pathSegments.length 
      ? pathSegments[spacesIndex + 1] 
      : undefined;
    const inviteCode = inviteUrl.searchParams.get("invite");

    if (spaceId && inviteCode) {
      return { spaceId, inviteCode };
    }
  } catch {
    // Fall through to the compact spaceId:inviteCode format.
  }

  const parts = trimmedInput.split(":");
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { spaceId: parts[0], inviteCode: parts[1] };
  }

  return { inviteCode: trimmedInput };
}
