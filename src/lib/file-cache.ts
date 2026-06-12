const PREFIX = "chat_file_cache_";

export function cacheFileAsDataUrl(fileId: string, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        localStorage.setItem(PREFIX + fileId, reader.result as string);
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function getCachedDataUrl(fileId: string): string | null {
  return localStorage.getItem(PREFIX + fileId);
}

export function removeCachedFile(fileId: string): void {
  localStorage.removeItem(PREFIX + fileId);
}
