# `@apmg/vertical-video-carousel`

[![NPM Stable Release](https://badgen.net/npm/v/@apmg/vertical-video-carousel)](https://www.npmjs.com/package/@apmg/vertical-video-carousel)
[![MIT License](https://badgen.net/badge/license/MIT/blue)](https://github.com/APMG/apm-vertical-video-carousel/blob/main/LICENSE.md)

A themeable, horizontally-scrolling carousel for short-form (9:16) YouTube video — Shorts, TikTok-style clips, etc. Built as a framework-free Web Component under the hood, with a thin React/TypeScript wrapper on top, so it can be dropped into any APM site or app: Next.js, plain React, or neither.

- **Click-to-play, not autoplay.** Videos load as a poster image; clicking (or hovering, on pointer devices) embeds the YouTube player.
- **Zero required CSS.** All styling ships with the component and is re-themed entirely through props/attributes, backed by CSS custom properties.
- **Two entry points.** A React component for React/Next.js apps, and a raw custom element (`<apm-vertical-video-carousel>`) for everything else.

## Installation

```bash
yarn add @apmg/vertical-video-carousel
# or
npm i @apmg/vertical-video-carousel
```

`react` and `react-dom` (17 or 18) are peer dependencies of the main entry point only — the `/element` entry point has no dependencies at all.

## React / Next.js usage

```tsx
import VerticalVideoCarousel from '@apmg/vertical-video-carousel';
// or: import { VerticalVideoCarousel } from '@apmg/vertical-video-carousel';

const videos = [
  {
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'How we cover the state fair',
    image_url: 'https://img.example.com/state-fair-poster.jpg',
    link_url: '/news/2026/07/01/state-fair-coverage',
  },
  {
    video_url: 'https://www.youtube.com/shorts/9bZkp7q19f0',
    title: 'Behind the scenes with our newsroom',
  },
];

export default function WatchSection() {
  return (
    <VerticalVideoCarousel
      videos={videos}
      heading="Watch"
      channelUrl="https://www.youtube.com/@YourChannel"
      channelLabel="Our Channel"
    />
  );
}
```

The component renders `null` until it has mounted on the client and has at least one video with a parseable YouTube URL, so it's safe to render unconditionally during SSR.

### Props

| Prop            | Type                    | Required | Description                                                                                                 |
| --------------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `videos`        | `VerticalVideoConfig[]` | yes      | See [Video data shape](#video-data-shape) below.                                                               |
| `heading`       | `string`                | no       | Section heading. Falls back to the element's own default (`"Watch"`) if omitted.                               |
| `channelUrl`    | `string`                | no       | Link target for the channel label. Omit to hide the channel link entirely.                                     |
| `channelLabel`  | `string`                | no       | Text for the channel link. Only rendered when `channelUrl` is set.                                              |
| `fadeColor`     | `string`                | no       | Color the right-edge scroll fade blends into (any CSS color). Defaults to `#fff`; set to match the page background. |
| `cardHeight`    | `string`                | no       | Height of each card (any CSS length, e.g. `"480px"`). Defaults to `572px`. Width is derived via the fixed 9:16 aspect ratio, so this also controls how many cards fit on screen. |
| `accentColor`   | `string`                | no       | Focus-outline color for keyboard navigation. Defaults to `#005fcc`.                                             |
| `headingColor`  | `string`                | no       | Color of the heading text. Defaults to `inherit`.                                                               |
| `ctaBackground` | `string`                | no       | Background color of the "Learn more" bar. Defaults to `#000`.                                                  |
| `ctaTextColor`  | `string`                | no       | Text color of the "Learn more" bar. Defaults to `#fff`.                                                         |
| `fontFamily`    | `string`                | no       | Font stack for all text in the component. Defaults to `inherit`.                                                |

### Video data shape

```ts
interface VerticalVideoConfig {
  video_url: string; // any YouTube URL shape: watch?v=, youtu.be/, /shorts/, embed/
  title: string;
  image_url?: string; // custom poster image; falls back to a YouTube thumbnail
  link_url?: string; // "Learn more" destination; falls back to the YouTube watch URL
}
```

Entries whose `video_url` can't be parsed into a YouTube ID are silently dropped. If every entry is dropped, the component renders `null`.

## Vanilla / non-React usage

For sites that aren't React (or a different framework entirely), import the `/element` entry point instead — it registers the `<apm-vertical-video-carousel>` custom element as a side effect and has no dependencies:

```js
import '@apmg/vertical-video-carousel/element';
```

```html
<apm-vertical-video-carousel
  videos='[{"youtube_id":"dQw4w9WgXcQ","title":"How we cover the state fair","link_url":"/news/2026/07/01/state-fair-coverage"}]'
  heading="Watch"
  channel-url="https://www.youtube.com/@YourChannel"
  channel-label="Our Channel"
></apm-vertical-video-carousel>
```

Note the element's `videos` attribute expects `youtube_id` (already extracted), not `video_url` — the React wrapper does that extraction for you via `youtubeParser`; vanilla consumers need to resolve the ID themselves before setting the attribute.

### Element attributes

All attributes are optional and map 1:1 to the React props above, kebab-cased: `channel-url`, `channel-label`, `fade-color`, `card-height`, `accent-color`, `heading-color`, `cta-background`, `cta-text-color`, `font-family`. There's also a boolean `full-bleed` attribute (no React prop yet) that breaks the carousel out of its container to span the full viewport width.

## Theming via CSS custom properties

Every color/size prop is backed by a CSS custom property set on the host element, so you can also theme the component with plain CSS instead of props:

```css
apm-vertical-video-carousel {
  --apm-vvc-bg: #f2f2f2;
  --apm-vvc-card-height: 480px;
  --apm-vvc-accent: #0057b8;
  --apm-vvc-heading-color: #111;
  --apm-vvc-cta-bg: #0057b8;
  --apm-vvc-cta-color: #fff;
  --apm-vvc-font: Georgia, serif;
}
```

## Local development against a consuming app (e.g. v2-mpr-news)

```bash
# in this repo
yarn install
yarn build
yarn link

# in the consuming app
yarn link "@apmg/vertical-video-carousel"
```

Run `yarn dev` in this repo to rebuild `dist/` on change while iterating against a linked app. When you're done, `yarn unlink "@apmg/vertical-video-carousel"` in the consuming app and reinstall from the registry.

## Scripts

- `yarn build` — type-check, emit declarations, and bundle CJS + ESM output to `dist/`
- `yarn dev` — rebuild on change
- `yarn test` / `yarn test:ci` — run the Jest suite
- `yarn eslint` / `yarn prettier` — lint and format checks

## License

MIT
