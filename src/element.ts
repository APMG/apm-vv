// @ts-nocheck

/**
 * apm-vertical-video-carousel
 * Portable vanilla Web Component — no framework dependencies.
 *
 * Usage:
 *   <apm-vertical-video-carousel
 *     videos='[{"youtube_id":"...","title":"...","image_url":"...","link_url":"/story/slug"}]'
 *     heading="Watch"
 *     channel-url="https://www.youtube.com/@YourChannel"
 *     channel-label="Our Channel"
 *     fade-color="#f2f2f2"
 *     card-height="480px"
 *     accent-color="#0057b8"
 *     heading-color="#111"
 *     cta-background="#0057b8"
 *     cta-text-color="#fff"
 *     font-family="Georgia, serif"
 *   ></apm-vertical-video-carousel>
 *
 * All attributes below are optional — omitting any of them keeps the
 * built-in default, so this element can be dropped into other sites and
 * re-themed entirely through attributes, no CSS overrides required.
 *
 * image_url:      editorial/CMS image (preferred). Falls back to YouTube maxresdefault,
 *                 stepping down through sddefault/hqdefault if a resolution is unavailable.
 * link_url:       destination URL for the "Learn More" link. Omit it and the bar
 *                 still renders (for consistent card heights) but empty, with
 *                 no text and no link.
 * heading:        section title. Defaults to "Watch".
 * channel-url:    link target for the channel label. Omit to hide the link entirely.
 * channel-label:  text for the channel link. Defaults to "Our Channel".
 * fade-color:     color the right-edge scroll fade blends into. Defaults to #fff;
 *                 set to match the surrounding page background.
 * card-height:    height of each video card (any CSS length). Defaults to 572px.
 *                 Card width is derived from this via the fixed 9:16 aspect ratio,
 *                 so a shorter card is also narrower and more fit in view.
 * card-radius:    corner radius of each video card (any CSS length). Defaults to 4px.
 * accent-color:   focus-outline color for keyboard navigation. Defaults to #005fcc.
 * heading-color:  color of the heading text. Defaults to inherit.
 * cta-background: background color of the "Learn More" bar. Defaults to #000.
 * cta-text-color: text color of the "Learn More" bar. Defaults to #fff.
 * font-family:    font stack for all text in the component. Defaults to inherit.
 */

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

class ApmVerticalVideoCarousel extends HTMLElement {
  static get observedAttributes() {
    return [
      'videos',
      'heading',
      'channel-url',
      'channel-label',
      'full-bleed',
      'fade-color',
      'card-height',
      'card-radius',
      'accent-color',
      'heading-color',
      'cta-background',
      'cta-text-color',
      'font-family',
    ];
  }

  // Maps attribute name -> CSS custom property applied on the host element,
  // so theming cascades to every part of the component (header included)
  // without needing per-element style attributes.
  static get _cssVarAttrs() {
    return {
      'fade-color': '--apm-vvc-bg',
      'card-height': '--apm-vvc-card-height',
      'card-radius': '--apm-vvc-card-radius',
      'accent-color': '--apm-vvc-accent',
      'heading-color': '--apm-vvc-heading-color',
      'cta-background': '--apm-vvc-cta-bg',
      'cta-text-color': '--apm-vvc-cta-color',
      'font-family': '--apm-vvc-font',
    };
  }

  _applyThemeVars() {
    Object.entries(ApmVerticalVideoCarousel._cssVarAttrs).forEach(
      ([attr, cssVar]) => {
        const value = this.getAttribute(attr);
        if (value) {
          this.style.setProperty(cssVar, value);
        } else {
          this.style.removeProperty(cssVar);
        }
      }
    );
  }

  connectedCallback() {
    this._injectStyles();
    this._render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  get _videos() {
    try {
      return JSON.parse(this.getAttribute('videos') || '[]');
    } catch {
      return [];
    }
  }

  _render() {
    const videos = this._videos;
    if (!videos.length) {
      this.innerHTML = '';
      return;
    }

    const heading = this.getAttribute('heading') || 'Watch';
    const channelUrl = this.getAttribute('channel-url') || '';
    const channelLabel = this.getAttribute('channel-label') || 'Our Channel';
    const fullBleed = this.hasAttribute('full-bleed');
    this._applyThemeVars();

    this.innerHTML = `
      <div class="apm-vvc__header">
        <h2 class="apm-vvc__heading">${escapeHtml(heading)}</h2>
        ${
          channelUrl
            ? `<a class="apm-vvc__channel-link" href="${escapeHtml(
                channelUrl
              )}" target="_blank" rel="noopener noreferrer">${escapeHtml(
                channelLabel
              )}</a>`
            : ''
        }
      </div>
      <div class="apm-vvc__outer${
        fullBleed ? ' apm-vvc__outer--full-bleed' : ''
      }">
        <div class="apm-vvc__track" role="list" aria-label="${escapeHtml(
          heading
        )}">
          ${videos.map((v, i) => this._slideTemplate(v, i)).join('')}
        </div>
        <button class="apm-vvc__nav apm-vvc__nav--prev" aria-label="Previous videos"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button class="apm-vvc__nav apm-vvc__nav--next" aria-label="Next videos"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>
    `;

    const track = this.querySelector('.apm-vvc__track');
    const outer = this.querySelector('.apm-vvc__outer');
    const prevBtn = this.querySelector('.apm-vvc__nav--prev');
    const nextBtn = this.querySelector('.apm-vvc__nav--next');
    const canHover = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;

    track.addEventListener('click', (e) => {
      const playBtn = e.target.closest('.apm-vvc__play-btn');
      if (!playBtn) return;
      this._activatePlayer(playBtn);
    });

    track.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const playBtn = e.target.closest('.apm-vvc__play-btn');
      if (!playBtn) return;
      e.preventDefault();
      this._activatePlayer(playBtn);
    });

    if (canHover) {
      this.querySelectorAll('.apm-vvc__aspect').forEach((aspect) => {
        this._setupHoverPreview(aspect);
      });
    }

    this.querySelectorAll('[data-yt-fallback]').forEach((img) => {
      this._setupThumbnailFallback(img);
    });

    const slideWidth = () =>
      track.querySelector('.apm-vvc__slide')?.offsetWidth || 230;

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -(slideWidth() + 20), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: slideWidth() + 20, behavior: 'smooth' });
    });

    // Tolerances account for the track's own left/right padding, which some
    // browsers bake into the resting scrollLeft under scroll-snap-type.
    const trackStyle = window.getComputedStyle(track);
    const startTolerance = parseFloat(trackStyle.paddingLeft || '0') + 4;
    const endTolerance = parseFloat(trackStyle.paddingRight || '0') + 4;

    const updateNav = () => {
      const atStart = track.scrollLeft <= startTolerance;
      const atEnd =
        track.scrollLeft + track.clientWidth >=
        track.scrollWidth - endTolerance;
      prevBtn.style.opacity = atStart ? '0' : '1';
      prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
      nextBtn.style.opacity = atEnd ? '0' : '1';
      nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
      outer.classList.toggle('apm-vvc__outer--at-end', atEnd);
    };
    track.addEventListener('scroll', updateNav);
    updateNav();
  }

  _setupHoverPreview(aspect) {
    const playBtn = aspect.querySelector('.apm-vvc__play-btn');
    if (!playBtn) return;
    const ytId = playBtn.dataset.ytid;
    let hoverTimer = null;
    let previewIframe = null;

    aspect.addEventListener('mouseenter', () => {
      if (aspect.dataset.activated) return;
      hoverTimer = setTimeout(() => {
        if (aspect.dataset.activated) return;
        previewIframe = document.createElement('iframe');
        previewIframe.src = `https://www.youtube.com/embed/${encodeURIComponent(
          ytId
        )}?autoplay=1&mute=1&controls=0&loop=1&playlist=${encodeURIComponent(
          ytId
        )}&rel=0`;
        previewIframe.allow = 'autoplay';
        previewIframe.style.cssText =
          'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:0;';
        previewIframe.className = 'apm-vvc__preview';
        aspect.insertBefore(previewIframe, aspect.firstChild);
        aspect.classList.add('apm-vvc__aspect--previewing');
        const img = aspect.querySelector('.apm-vvc__img');
        if (img) img.style.transition = 'opacity 0.4s';
        if (img) img.style.opacity = '0';
      }, 300);
    });

    aspect.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      if (aspect.dataset.activated) return;
      if (previewIframe) {
        previewIframe.remove();
        previewIframe = null;
      }
      aspect.classList.remove('apm-vvc__aspect--previewing');
      const img = aspect.querySelector('.apm-vvc__img');
      if (img) img.style.opacity = '1';
    });
  }

  // YouTube serves a 120x90 grey placeholder (not a 404) when a given
  // thumbnail resolution doesn't exist for a video, so we detect that by
  // image size and step down through progressively safer resolutions.
  _setupThumbnailFallback(img) {
    const ytId = img.dataset.ytFallback;
    const qualities = ['sddefault', 'hqdefault'];
    let qi = 0;

    const tryNext = () => {
      if (qi >= qualities.length) return;
      img.src = `https://img.youtube.com/vi/${encodeURIComponent(ytId)}/${
        qualities[qi]
      }.jpg`;
      qi++;
    };

    img.addEventListener('load', () => {
      if (img.naturalWidth === 120 && img.naturalHeight === 90) tryNext();
    });
    img.addEventListener('error', tryNext);
  }

  _activatePlayer(btn) {
    const aspect = btn.closest('.apm-vvc__aspect');
    const id = btn.dataset.ytid;
    const title = btn.dataset.title || 'YouTube video player';

    // Stop any other currently-playing video in this carousel
    this.querySelectorAll('.apm-vvc__aspect[data-activated]').forEach(
      (other) => {
        if (other === aspect) return;
        other.querySelector('.apm-vvc__active-player')?.remove();
        delete other.dataset.activated;
        other.classList.remove('apm-vvc__aspect--previewing');
        const img = other.querySelector('.apm-vvc__img');
        if (img) img.style.opacity = '1';
      }
    );

    // Remove any muted hover-preview, mark as activated
    aspect.querySelector('.apm-vvc__preview')?.remove();
    aspect.dataset.activated = 'true';

    const iframe = document.createElement('iframe');
    iframe.className = 'apm-vvc__active-player';
    iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(
      id
    )}?autoplay=1`;
    iframe.title = title;
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:3;';
    aspect.appendChild(iframe);
    iframe.focus();
  }

  _slideTemplate(video, index) {
    const ytId = escapeHtml(video.youtube_id || video.id || '');
    const title = escapeHtml(video.title || '');
    const hasCustomImage = Boolean(video.image_url);
    const imageUrl = escapeHtml(
      video.image_url || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
    );
    // link_url is optional — videos without one still get the bar (for consistent
    // card heights across a row) but it renders empty, with no text and no link
    const hasLink = Boolean(video.link_url);
    const linkUrl = hasLink ? escapeHtml(video.link_url) : '';

    return `
      <div class="apm-vvc__slide" role="listitem">
        <div class="apm-vvc__aspect">
          <button
            class="apm-vvc__play-btn"
            data-ytid="${ytId}"
            data-title="${title}"
            aria-label="Play video${title ? ': ' + title : ''}"
          >
            <img
              src="${imageUrl}"
              alt=""
              loading="${index === 0 ? 'eager' : 'lazy'}"
              class="apm-vvc__img"
              ${hasCustomImage ? '' : `data-yt-fallback="${ytId}"`}
            />
            <span class="apm-vvc__play-icon" aria-hidden="true">
              <svg viewBox="0 0 60 60" width="52" height="52">
                <circle cx="30" cy="30" r="29" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/>
                <polygon points="24,18 45,30 24,42" fill="#fff"/>
              </svg>
            </span>
          </button>
          <div class="apm-vvc__overlay" aria-hidden="true">
            ${title ? `<p class="apm-vvc__title">${title}</p>` : ''}
          </div>
        </div>
        ${
          hasLink
            ? `<a class="apm-vvc__cta" href="${linkUrl}" aria-label="Learn more${
                title ? ': ' + title : ''
              }">
          <span aria-hidden="true">&#8594;</span> Learn more
        </a>`
            : `<div class="apm-vvc__cta" aria-hidden="true"></div>`
        }
      </div>
    `;
  }

  _injectStyles() {
    if (document.getElementById('apm-vvc-styles')) return;
    const style = document.createElement('style');
    style.id = 'apm-vvc-styles';
    style.textContent = [
      // min-width: 0 keeps this out of the "grid blowout" trap — without it, a flex/grid
      // ancestor sizing itself to fit content will size to the un-shrunk width of every
      // slide side-by-side (flex children below use flex-shrink: 0) instead of letting
      // .apm-vvc__track's own overflow-x: auto handle the excess via scrolling.
      'apm-vertical-video-carousel { display: block; min-width: 0; font-family: var(--apm-vvc-font, inherit); --apm-vvc-card-height: 572px; --apm-vvc-card-radius: 4px; }',

      /* Header */
      '.apm-vvc__header { display: flex; align-items: baseline; justify-content: space-between; padding: 1.5rem 1rem 0.875rem; }',
      '.apm-vvc__heading { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 900; margin: 0; line-height: 1; letter-spacing: -0.01em; color: var(--apm-vvc-heading-color, inherit); }',
      '.apm-vvc__channel-link { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: inherit; text-decoration: none; opacity: 0.65; transition: opacity 0.15s; white-space: nowrap; }',
      '.apm-vvc__channel-link:hover { opacity: 1; }',

      /* Outer — reserves bottom strip for the scroll buttons; full-bleed variant breaks out of container */
      '.apm-vvc__outer { position: relative; padding-bottom: 2.75rem; }',
      '.apm-vvc__outer--full-bleed { width: 100vw; margin-left: calc(50% - 50vw); }',

      /* Right-edge fade — hides when scrolled to end, and below 640px where nav arrows are hidden too; stops above the button strip */
      '.apm-vvc__outer::after { content: ""; position: absolute; top: 0; right: 0; bottom: 2.75rem; width: 8rem; background: linear-gradient(to right, transparent, var(--apm-vvc-bg, #fff)); pointer-events: none; z-index: 4; transition: opacity 0.3s; }',
      '.apm-vvc__outer--at-end::after { opacity: 0; }',

      /* Track */
      '.apm-vvc__track { display: flex; gap: 1.25rem; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 0.5rem 1rem 1.5rem; }',
      '.apm-vvc__track::-webkit-scrollbar { display: none; }',

      /* Slide — width is derived from the 9:16 aspect ratio so --apm-vvc-card-height controls the visible video height directly */
      '.apm-vvc__slide { flex: 0 0 auto; width: clamp(200px, 50vw, calc(var(--apm-vvc-card-height, 572px) * 9 / 16)); scroll-snap-align: start; display: flex; flex-direction: column; }',
      '.apm-vvc__aspect { position: relative; aspect-ratio: 9 / 16; border-radius: var(--apm-vvc-card-radius, 4px) var(--apm-vvc-card-radius, 4px) 0 0; overflow: hidden; background: #111; }',

      /* Play button — covers full aspect area */
      '.apm-vvc__play-btn { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; padding: 0; background: none; cursor: pointer; display: block; z-index: 1; }',
      '.apm-vvc__play-btn:focus-visible { outline: 3px solid var(--apm-vvc-accent, #005fcc); outline-offset: 2px; }',

      /* Image */
      '.apm-vvc__img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.35s ease; }',
      '.apm-vvc__play-btn:hover .apm-vvc__img { transform: scale(1.04); }',

      /* Play icon — visible on hover */
      '.apm-vvc__play-icon { position: absolute; top: 40%; left: 50%; transform: translate(-50%, calc(-50% + 50px)); pointer-events: none; opacity: 0; transition: opacity 0.2s; }',
      '.apm-vvc__play-btn:hover .apm-vvc__play-icon, .apm-vvc__play-btn:focus-visible .apm-vvc__play-icon { opacity: 1; }',
      '.apm-vvc__aspect--previewing .apm-vvc__play-icon { opacity: 0 !important; }',

      /* Bottom gradient overlay (title) */
      '.apm-vvc__overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 50%, transparent 100%); padding: 2rem 0.875rem 0.5rem; pointer-events: none; z-index: 1; opacity: 1; transition: opacity 1.2s ease; }',
      '.apm-vvc__title { color: #fff; font-size: clamp(0.85rem, 2.2vw, 1rem); font-weight: 700; line-height: 1.25; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }',
      '.apm-vvc__slide:hover .apm-vvc__overlay { opacity: 0; }',
      '.apm-vvc__aspect[data-activated] .apm-vvc__overlay { opacity: 0; transition: none; }',

      /* Learn More CTA — solid, themeable via --apm-vvc-cta-bg / --apm-vvc-cta-color */
      /* Shared bar styling applies to both the link (<a>, has a destination) and the
         empty placeholder (<div>, rendered when link_url is omitted) so card heights
         stay consistent across a row of mixed videos; hover/focus are <a>-only since
         the placeholder is not interactive. */
      '.apm-vvc__cta { display: flex; align-items: center; gap: 0.375rem; height: 3rem; flex-shrink: 0; padding: 0 0.875rem; color: var(--apm-vvc-cta-color, #fff); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; text-decoration: none; background: var(--apm-vvc-cta-bg, #000); border-top: 1px solid rgba(255,255,255,0.12); transition: filter 0.15s; border-radius: 0 0 var(--apm-vvc-card-radius, 4px) var(--apm-vvc-card-radius, 4px); }',
      'a.apm-vvc__cta:hover { filter: brightness(1.25); }',
      'a.apm-vvc__cta:focus-visible { outline: 3px solid var(--apm-vvc-accent, #005fcc); outline-offset: -3px; }',

      /* Prev/next arrows — small circular buttons in the bottom-right strip */
      '.apm-vvc__nav { display: none; position: absolute; bottom: 0; z-index: 5; width: 32px; height: 32px; align-items: center; justify-content: center; background: rgba(255,255,255,0.92); border: none; border-radius: 50%; cursor: pointer; color: #444; box-shadow: 0 2px 8px rgba(0,0,0,0.16); padding: 0; transition: opacity 0.2s, color 0.15s, background 0.15s; }',
      '.apm-vvc__nav:hover { color: #111; background: #fff; }',
      '.apm-vvc__nav--prev { right: 3rem; }',
      '.apm-vvc__nav--next { right: 0.5rem; }',
      '@media (min-width: 640px) { .apm-vvc__nav { display: flex; } }',
      '@media (max-width: 639px) { .apm-vvc__outer::after { display: none; } }',

      /* A touch of breathing room around the track on phone/tablet widths */
      '@media (max-width: 1024px) { .apm-vvc__track { margin-left: 1rem; margin-right: 1rem; } }',
    ].join('\n');
    document.head.appendChild(style);
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('apm-vertical-video-carousel')
) {
  customElements.define(
    'apm-vertical-video-carousel',
    ApmVerticalVideoCarousel
  );
}

export {};
