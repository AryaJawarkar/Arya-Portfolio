import {
  siFlask,
  siGit,
  siMongodb,
  siNextdotjs,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siTypescript,
} from 'simple-icons';

/**
 * Brand marks for the orbiting nodes, rasterised from simple-icons' path data
 * into inline SVG data URIs so they can be used as three.js textures. Nothing
 * is fetched at runtime.
 */

// AWS is not in simple-icons (Amazon had its marks removed), so the cloud
// platform gets a neutral cloud glyph instead of a brand mark.
const CLOUD_PATH =
  'M19.35 10.04A7.49 7.49 0 0 0 12 4a7.48 7.48 0 0 0-6.71 4.14A5.994 5.994 0 0 0 0 14a6 6 0 0 0 6 6h13a5 5 0 0 0 .35-9.96z';

export type TechLogo = {
  label: string;
  path: string;
  /** Display colour. Brand hex by default, overridden where it is too dark to
   *  read against the near-black hero background. */
  color: string;
};

export const TECH: Record<string, TechLogo> = {
  react: { label: 'React', path: siReact.path, color: `#${siReact.hex}` },
  typescript: {
    label: 'TypeScript',
    path: siTypescript.path,
    color: '#6CA9E8', // brand #3178C6 lightened for contrast
  },
  next: {
    label: 'Next.js',
    path: siNextdotjs.path,
    color: '#FFFFFF', // brand mark is pure black
  },
  python: {
    label: 'Python',
    path: siPython.path,
    color: '#6CB2E4', // brand #3776AB lightened for contrast
  },
  flask: { label: 'Flask', path: siFlask.path, color: `#${siFlask.hex}` },
  postgres: {
    label: 'PostgreSQL',
    path: siPostgresql.path,
    color: '#7C9BF0', // brand #4169E1 lightened for contrast
  },
  mongo: { label: 'MongoDB', path: siMongodb.path, color: `#${siMongodb.hex}` },
  aws: { label: 'AWS', path: CLOUD_PATH, color: '#FF9900' },
  git: { label: 'Git', path: siGit.path, color: `#${siGit.hex}` },
  postman: {
    label: 'Postman',
    path: siPostman.path,
    color: `#${siPostman.hex}`,
  },
};

/** Inline SVG data URI for a logo, sized for use as a texture. */
export function logoDataUri({ path, color }: TechLogo, size = 128): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
    `width="${size}" height="${size}"><path d="${path}" fill="${color}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
