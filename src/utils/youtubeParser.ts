/**
 * Extracts an 11-character YouTube video ID from any common YouTube URL shape:
 * watch?v=, youtu.be/, /v/, /u/{user}/, embed/, or /shorts/.
 * Returns false if no valid ID is found.
 */
export function youtubeParser(url: string): string | false {
  if (!url) return false;

  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}
