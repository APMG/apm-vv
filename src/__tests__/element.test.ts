import '../element';

describe('apm-vertical-video-carousel: "Learn more" CTA', () => {
  const mount = (videos: unknown[]) => {
    const el = document.createElement('apm-vertical-video-carousel');
    el.setAttribute('videos', JSON.stringify(videos));
    document.body.appendChild(el);
    return el;
  };

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders an empty, non-interactive bar when link_url is not set', () => {
    const el = mount([{ youtube_id: 'dQw4w9WgXcQ', title: 'No link' }]);
    const cta = el.querySelector('.apm-vvc__cta');
    expect(cta).toBeInTheDocument();
    expect(cta?.tagName).toBe('DIV');
    expect(cta).not.toHaveAttribute('href');
    expect(cta?.textContent?.trim()).toBe('');
  });

  it('renders the bar as a link with "Learn more" text when link_url is set', () => {
    const el = mount([
      {
        youtube_id: 'dQw4w9WgXcQ',
        title: 'Has link',
        link_url: '/story/slug',
      },
    ]);
    const cta = el.querySelector('.apm-vvc__cta');
    expect(cta?.tagName).toBe('A');
    expect(cta).toHaveAttribute('href', '/story/slug');
    expect(cta?.textContent).toContain('Learn more');
  });
});
