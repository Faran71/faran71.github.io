/**
 * Brand icon registry.
 *
 * Keys are referenced from `STACK` in content.js. `color` in the data wins;
 * the fallbacks here are only used if a colour is missing.
 */
import {
  SiTypescript,
  SiPython,
  SiJavascript,
  SiCplusplus,
  SiRuby,
  SiReact,
  SiAngular,
  SiSvelte,
  SiHtml5,
  SiNestjs,
  SiFastapi,
  SiRubyonrails,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiTwilio,
  SiDeepgram,
  SiMarkdown,
  SiGithub,
  SiGmail,
} from 'react-icons/si';
import { FaJava, FaLinkedin, FaAws } from 'react-icons/fa';
import { IoLogoCss3 } from 'react-icons/io5';
import { TbMath } from 'react-icons/tb';
import { VscJson } from 'react-icons/vsc';

export const SKILL_ICONS = {
  typescript: SiTypescript,
  python: SiPython,
  javascript: SiJavascript,
  java: FaJava,
  cpp: SiCplusplus,
  matlab: TbMath,
  ruby: SiRuby,

  react: SiReact,
  angular: SiAngular,
  svelte: SiSvelte,
  html: SiHtml5,
  css: IoLogoCss3,

  nestjs: SiNestjs,
  fastapi: SiFastapi,
  express: SiExpress,
  rails: SiRubyonrails,

  postgres: SiPostgresql,
  mongodb: SiMongodb,
  aws: FaAws,
  twilio: SiTwilio,
  deepgram: SiDeepgram,

  markdown: SiMarkdown,
  json: VscJson,
};

/** Icons used by the titlebar / contact panel. */
export const UI_ICONS = {
  github: SiGithub,
  linkedin: FaLinkedin,
  email: SiGmail,
};

export function getSkillIcon(key) {
  return SKILL_ICONS[key] || VscJson;
}

const clamp01 = (n) => Math.min(1, Math.max(0, n));

function rgbToHsl([r, g, b]) {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return [0, 0, l];

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6;
  else if (max === G) h = ((B - R) / d + 2) / 6;
  else h = ((R - G) / d + 4) / 6;

  return [h, s, l];
}

function hslToRgb([h, s, l]) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t) => {
    let T = t;
    if (T < 0) T += 1;
    if (T > 1) T -= 1;
    if (T < 1 / 6) return p + (q - p) * 6 * T;
    if (T < 1 / 2) return q;
    if (T < 2 / 3) return p + (q - p) * (2 / 3 - T) * 6;
    return p;
  };
  return [
    Math.round(channel(h + 1 / 3) * 255),
    Math.round(channel(h) * 255),
    Math.round(channel(h - 1 / 3) * 255),
  ];
}

const luminance = (rgb) => {
  const [R, G, B] = rgb
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Recolour a brand hue so it is identifiable but recessive on a dark surface.
 *
 * Blending toward the background alone is not enough - dark brands like
 * Angular red (#dd0031) and Rails red (#cc0000) collapse into the card fill and
 * the grid reads as a row of grey blobs. Lifting toward white instead
 * desaturates them into pastel mush. So we blend, then raise HSL lightness
 * (holding hue and saturation) until a luminance floor is met. The icon stays
 * recognisably the brand colour at a glance.
 *
 * @param {string} hex     brand colour, e.g. '#61dafb'
 * @param {number} amount  0 = unchanged, 1 = fully background
 * @param {number} minLum  relative-luminance floor (0.123 clears 3:1 on #11141d)
 * @param {string} bg      the surface it sits on
 */
export function dimColor(hex, amount = 0.32, minLum = 0.123, bg = '#11141d') {
  const parse = (h) => {
    const s = h.replace('#', '');
    const full = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
    const v = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    return v.some(Number.isNaN) ? null : v;
  };
  const toHex = (rgb) => '#' + rgb.map((n) => n.toString(16).padStart(2, '0')).join('');

  const brand = parse(hex);
  const back = parse(bg);
  if (!brand || !back) return hex;

  let rgb = brand.map((c, i) => Math.round(c + (back[i] - c) * amount));

  if (luminance(rgb) < minLum) {
    const [h, s, l] = rgbToHsl(rgb);
    let lo = l;
    let hi = 1;
    // Smallest lightness that clears the floor - bisection keeps this exact.
    for (let i = 0; i < 18; i += 1) {
      const mid = (lo + hi) / 2;
      if (luminance(hslToRgb([h, s, mid])) >= minLum) hi = mid;
      else lo = mid;
    }
    rgb = hslToRgb([h, s, clamp01(hi)]);
  }

  return toHex(rgb);
}
