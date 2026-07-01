import React from 'react';
import { render, waitFor } from '@testing-library/react';
import VerticalVideoCarousel from '../VerticalVideoCarousel';

describe('VerticalVideoCarousel', () => {
  it('renders nothing when there are no videos', () => {
    const { container } = render(<VerticalVideoCarousel videos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when no video URLs can be parsed', async () => {
    const { container } = render(
      <VerticalVideoCarousel
        videos={[{ video_url: 'https://example.com/not-youtube', title: 'x' }]}
      />
    );
    await waitFor(() =>
      expect(
        container.querySelector('apm-vertical-video-carousel')
      ).not.toBeInTheDocument()
    );
  });

  it('renders the custom element with normalized videos once mounted', async () => {
    const { container } = render(
      <VerticalVideoCarousel
        videos={[
          {
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            title: 'Test video',
            link_url: '/story/test',
          },
        ]}
        heading="Watch"
        channelUrl="https://www.youtube.com/@example"
      />
    );

    const el = await waitFor(() => {
      const found = container.querySelector('apm-vertical-video-carousel');
      expect(found).toBeInTheDocument();
      return found as HTMLElement;
    });

    expect(el.getAttribute('heading')).toBe('Watch');
    expect(el.getAttribute('channel-url')).toBe(
      'https://www.youtube.com/@example'
    );
    const videos = JSON.parse(el.getAttribute('videos') || '[]');
    expect(videos).toEqual([
      {
        youtube_id: 'dQw4w9WgXcQ',
        title: 'Test video',
        link_url: '/story/test',
      },
    ]);
  });
});
