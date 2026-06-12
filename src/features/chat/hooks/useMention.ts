import { useCallback, useMemo, useState } from "react";

interface UseMentionReturn {
  isMentioning: boolean;
  query: string;
  mentionIndex: number;
  replaceMention: (username: string) => string;
  setCursorPosition: (pos: number) => void;
}

export function useMention(draft: string): UseMentionReturn {
  const [cursorPosition, setCursorPosition] = useState(0);

  const { isMentioning, query, mentionIndex } = useMemo(() => {
    if (cursorPosition <= 0) {
      return { isMentioning: false, query: "", mentionIndex: -1 };
    }

    const textBeforeCursor = draft.slice(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf("@");

    if (atIndex === -1) {
      return { isMentioning: false, query: "", mentionIndex: -1 };
    }

    const beforeAt = textBeforeCursor[atIndex - 1];
    if (beforeAt !== undefined && beforeAt !== " " && beforeAt !== "\n") {
      return { isMentioning: false, query: "", mentionIndex: -1 };
    }

    const queryText = textBeforeCursor.slice(atIndex + 1);

    const hasSpace = /\s/.test(queryText);
    if (hasSpace) {
      return { isMentioning: false, query: "", mentionIndex: -1 };
    }

    return { isMentioning: true, query: queryText, mentionIndex: atIndex };
  }, [draft, cursorPosition]);

  const replaceMention = useCallback(
    (username: string): string => {
      if (mentionIndex === -1) return draft;
      const before = draft.slice(0, mentionIndex);
      const after = draft.slice(cursorPosition);
      return `${before}@${username} ${after}`;
    },
    [draft, mentionIndex, cursorPosition],
  );

  return {
    isMentioning,
    query,
    mentionIndex,
    replaceMention,
    setCursorPosition,
  };
}
