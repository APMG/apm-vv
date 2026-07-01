import { youtubeParser } from '../utils/youtubeParser';

describe('youtubeParser', () => {
  it('extracts the ID from a watch URL', () => {
    expect(youtubeParser('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    );
  });

  it('extracts the ID from a youtu.be short link', () => {
    expect(youtubeParser('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts the ID from an embed URL', () => {
    expect(youtubeParser('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    );
  });

  it('extracts the ID from a Shorts URL', () => {
    expect(youtubeParser('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    );
  });

  it('returns false for a non-YouTube URL', () => {
    expect(youtubeParser('https://example.com/video/123')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(youtubeParser('')).toBe(false);
  });
});
