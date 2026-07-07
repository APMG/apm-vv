import React, { useEffect, useState } from 'react';
import { youtubeParser } from './utils/youtubeParser';

/** A single video entry, as commonly sourced from a CMS/API. */
export interface VerticalVideoConfig {
  video_url: string;
  title: string;
  image_url?: string;
  /** "Learn more" destination. Omit it and the bar renders empty (no text/link). */
  link_url?: string;
}

export interface VerticalVideoCarouselProps {
  videos: VerticalVideoConfig[];
  /** Section heading, e.g. "Watch". Omit to render no heading. */
  heading?: string;
  /** Link target for the channel label. Omit to hide the link entirely. */
  channelUrl?: string;
  /** Text for the channel link. Only rendered when channelUrl is set. */
  channelLabel?: string;
  /** Color the right-edge scroll fade blends into. Defaults to #fff. */
  fadeColor?: string;
  /**
   * Height of each video card (any CSS length, e.g. "480px"). Defaults to 572px.
   * Card width is derived from this via the fixed 9:16 aspect ratio, so a
   * shorter card is also narrower and more fit in view.
   */
  cardHeight?: string;
  /** Corner radius of each video card (any CSS length, e.g. "4px"). Defaults to 4px. */
  cardRadius?: string;
  /** Focus-outline color for keyboard navigation. Defaults to #005fcc. */
  accentColor?: string;
  /** Color of the heading text. Defaults to inherit. */
  headingColor?: string;
  /** Background color of the "Learn More" bar. Defaults to #000. */
  ctaBackground?: string;
  /** Text color of the "Learn More" bar. Defaults to #fff. */
  ctaTextColor?: string;
  /** Font stack for all text in the component. Defaults to inherit. */
  fontFamily?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'apm-vertical-video-carousel': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          videos?: string;
          heading?: string;
          'channel-url'?: string;
          'channel-label'?: string;
          'fade-color'?: string;
          'card-height'?: string;
          'card-radius'?: string;
          'accent-color'?: string;
          'heading-color'?: string;
          'cta-background'?: string;
          'cta-text-color'?: string;
          'font-family'?: string;
        },
        HTMLElement
      >;
    }
  }
}

// Extract a YouTube ID — handles Shorts (/shorts/{id}), watch?v=, youtu.be/, embed/
const extractId = (url: string): string | false => youtubeParser(url);

const VerticalVideoCarousel = ({
  videos,
  heading,
  channelUrl,
  channelLabel,
  fadeColor,
  cardHeight,
  cardRadius,
  accentColor,
  headingColor,
  ctaBackground,
  ctaTextColor,
  fontFamily,
}: VerticalVideoCarouselProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    import('./element').then(() => setMounted(true));
  }, []);

  if (!videos?.length || !mounted) return null;

  // Map incoming video_url shape -> youtube_id the Web Component expects
  const normalized = videos
    .map((v) => ({
      youtube_id: extractId(v.video_url),
      title: v.title,
      image_url: v.image_url || undefined, // treat empty string as missing
      link_url: v.link_url || undefined,
    }))
    .filter((v) => v.youtube_id); // drop any URLs that didn't parse

  if (!normalized.length) return null;

  return (
    <apm-vertical-video-carousel
      videos={JSON.stringify(normalized)}
      heading={heading}
      channel-url={channelUrl}
      channel-label={channelLabel}
      fade-color={fadeColor}
      card-height={cardHeight}
      card-radius={cardRadius}
      accent-color={accentColor}
      heading-color={headingColor}
      cta-background={ctaBackground}
      cta-text-color={ctaTextColor}
      font-family={fontFamily}
    />
  );
};

export default VerticalVideoCarousel;
