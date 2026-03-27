import { DesignConfig, Song, ConcertDetails, PrintSize, FontStyle } from '../types';
import { PRINT_DIMENSIONS, FONT_MAP } from '../constants';

interface LayoutResult {
  titleFontSize: number;
  metaFontSize: number;
  songFontSize: number;
  songLineHeight: number;
  contentStartY: number;
  contentHeight: number;
  titleY: number;
  metaY: number;
  footerY: number;
  footerFontSize: number;
}

/**
 * setlist.fm commonly returns DD-MM-YYYY. If not, return as-is.
 */
const formatEventDate = (d?: string): string => {
  const s = String(d ?? '').trim();
  if (!s) return '';

  const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return s;

  const [, dd, mm, yyyy] = m;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const calculateLayout = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  songs: Song[],
  details: ConcertDetails,
  config: DesignConfig
): LayoutResult => {

  const margin = width * 0.08;
  const printableWidth = width - margin * 2;

  const artist = String(details?.artist ?? '').trim();

  const fontFamily = FONT_MAP[config.fontStyle];

  /* ---------------- HEADER ---------------- */

  let titleFontSize = width * 0.12;

  ctx.font = `900 ${titleFontSize}px ${fontFamily}`;

  if (artist) {
    while (ctx.measureText(artist.toUpperCase()).width > printableWidth && titleFontSize > 20) {
      titleFontSize -= 5;
      ctx.font = `900 ${titleFontSize}px ${fontFamily}`;
    }
  }

  const titleY = margin + titleFontSize;

  /* ---------------- METADATA ---------------- */

  // ↓↓↓ Reduced size (2 font steps lower visually)
  let metaFontSize = titleFontSize * 0.18;

  const venue = String((details as any)?.venue ?? '').trim();
  const city = String(details?.city ?? '').trim();
  const year = String(details?.year ?? '').trim();
  const eventDateRaw = String((details as any)?.eventDate ?? '').trim();
  const eventDate = formatEventDate(eventDateRaw) || year;

  const metaParts = [venue, city, eventDate].filter(p => p.length > 0);
  const metaString = metaParts.join(' • ').toUpperCase();

  // Width safety check
  ctx.font = `500 ${metaFontSize}px ${fontFamily}`;

  while (metaString && ctx.measureText(metaString).width > printableWidth && metaFontSize > 12) {
    metaFontSize -= 2;
    ctx.font = `500 ${metaFontSize}px ${fontFamily}`;
  }

  const metaY = titleY + metaFontSize * 2;

  /* ---------------- FOOTER ---------------- */

  const footerFontSize = Math.max(24, width * 0.015);
  const footerY = height - margin;

  /* ---------------- SONGS ---------------- */

  const startY = metaY + height * 0.05;
  const endY = footerY - footerFontSize * 2 - height * 0.05;
  const availableHeight = Math.max(0, endY - startY);

  const lineHeightRatio = 1.3;
  const songCount = Math.max(1, songs.length);

  let minFs = 12;
  let maxFs = 400;
  let optimalFs = minFs;

  while (minFs <= maxFs) {
    const midFs = Math.floor((minFs + maxFs) / 2);
    const totalHeight = midFs * lineHeightRatio * songCount;

    if (totalHeight <= availableHeight) {
      optimalFs = midFs;
      minFs = midFs + 1;
    } else {
      maxFs = midFs - 1;
    }
  }

  ctx.font = `${config.fontStyle === FontStyle.BOLD ? '700' : '500'} ${optimalFs}px ${fontFamily}`;

  let maxSongWidth = 0;
  songs.forEach(s => {
    const w = ctx.measureText(String(s.title).toUpperCase()).width;
    if (w > maxSongWidth) maxSongWidth = w;
  });

  if (maxSongWidth > printableWidth) {
    const ratio = printableWidth / maxSongWidth;
    optimalFs = Math.floor(optimalFs * ratio);
  }

  if (optimalFs < 12) optimalFs = 12;

  const finalTotalHeight = optimalFs * lineHeightRatio * songCount;
  const verticalCorrection = (availableHeight - finalTotalHeight) / 2;
  const adjustedStartY = startY + (verticalCorrection > 0 ? verticalCorrection : 0);

  return {
    titleFontSize,
    metaFontSize,
    songFontSize: optimalFs,
    songLineHeight: optimalFs * lineHeightRatio,
    contentStartY: adjustedStartY,
    contentHeight: availableHeight,
    titleY,
    metaY,
    footerY,
    footerFontSize
  };
};

export const renderSetlistToCanvas = (
  canvas: HTMLCanvasElement,
  songs: Song[],
  details: ConcertDetails,
  config: DesignConfig
) => {

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dims = PRINT_DIMENSIONS[config.size];

  canvas.width = dims.width;
  canvas.height = dims.height;

  ctx.fillStyle = config.isDarkMode ? '#0f172a' : '#ffffff';
  ctx.fillRect(0, 0, dims.width, dims.height);

  const baseColor = config.isDarkMode ? '#ffffff' : '#0f172a';
  const accentColor = config.accentColor;

  const layout = calculateLayout(ctx, dims.width, dims.height, songs, details, config);
  const fontFamily = FONT_MAP[config.fontStyle];

  /* HEADER */
  ctx.textAlign = 'center';
  ctx.fillStyle = accentColor;
  ctx.font = `900 ${layout.titleFontSize}px ${fontFamily}`;

  if (details.artist) {
    ctx.fillText(details.artist.toUpperCase(), dims.width / 2, layout.titleY);
  }

  /* METADATA */
  const venue = String((details as any)?.venue ?? '').trim();
  const city = String(details?.city ?? '').trim();
  const year = String(details?.year ?? '').trim();
  const eventDateRaw = String((details as any)?.eventDate ?? '').trim();
  const eventDate = formatEventDate(eventDateRaw) || year;

  const metaParts = [venue, city, eventDate].filter(p => p.length > 0);
  const metaString = metaParts.join(' • ').toUpperCase();

  ctx.fillStyle = baseColor;
  ctx.font = `500 ${layout.metaFontSize}px ${fontFamily}`;

  if (metaString) {
    ctx.fillText(metaString, dims.width / 2, layout.metaY);

    ctx.beginPath();
    ctx.moveTo(dims.width * 0.4, layout.metaY + layout.metaFontSize);
    ctx.lineTo(dims.width * 0.6, layout.metaY + layout.metaFontSize);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = dims.width * 0.002;
    ctx.stroke();
  }

  /* SONGS */
  ctx.textAlign = 'center';
  ctx.fillStyle = baseColor;
  ctx.font = `${config.fontStyle === FontStyle.BOLD ? '700' : '400'} ${layout.songFontSize}px ${fontFamily}`;

  songs.forEach((song, index) => {
    const yPos = layout.contentStartY + index * layout.songLineHeight + layout.songFontSize;
    ctx.fillText(song.title.toUpperCase(), dims.width / 2, yPos);
  });

  /* BORDER */
  if (config.showBorder) {
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = dims.width * 0.005;
    const borderM = dims.width * 0.03;
    ctx.strokeRect(borderM, borderM, dims.width - borderM * 2, dims.height - borderM * 2);
  }

  /* FOOTER */
  ctx.font = `400 ${layout.footerFontSize}px sans-serif`;
  ctx.fillStyle = config.isDarkMode ? '#64748b' : '#94a3b8';
  ctx.fillText(
    'No affiliation with the artist  ·  setlistart.ink',
    dims.width / 2,
    layout.footerY
  );
};
