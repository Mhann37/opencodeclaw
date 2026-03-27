import { PrintSize, FontStyle } from './types';

// Dimensions in Pixels at 300 DPI
export const PRINT_DIMENSIONS: Record<PrintSize, { width: number; height: number; label: string }> = {
  [PrintSize.A4]: { width: 2480, height: 3508, label: 'A4 (210×297mm)' },
  [PrintSize.A3]: { width: 3508, height: 4961, label: 'A3 (297×420mm)' },
  [PrintSize.Poster11x14]: { width: 3300, height: 4200, label: 'Poster (11×14")' },
  [PrintSize.Photo6x8]: { width: 1800, height: 2400, label: 'Photo (6×8")' },
};


export const FONT_MAP: Record<FontStyle, string> = {
  [FontStyle.MODERN]: 'Inter, sans-serif',
  [FontStyle.BOLD]: 'Oswald, sans-serif',
  [FontStyle.CLASSIC]: 'Playfair Display, serif',
  [FontStyle.MONO]: 'Roboto Mono, monospace',
};

export const ACCENT_COLORS = [
  '#000000', // Black/White default
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
];

export const MOCK_SETLISTS: Record<string, string[]> = {
  'radiohead': ['15 Step', 'Bodysnatchers', 'Nude', 'Weird Fishes/Arpeggi', 'All I Need', 'Faust Arp', 'Reckoner', 'House of Cards', 'Jigsaw Falling into Place', 'Videotape', 'Paranoid Android', 'Karma Police'],
  'taylor swift': ['Lavender Haze', 'Maroon', 'Anti-Hero', 'Snow on the Beach', 'You\'re On Your Own, Kid', 'Midnight Rain', 'Question...?', 'Vigilante Shit', 'Bejeweled', 'Labyrinth', 'Karma', 'Mastermind', 'Cruel Summer', 'Shake It Off'],
  'metallica': ['Creeping Death', 'For Whom the Bell Tolls', 'Ride the Lightning', 'Fade to Black', 'Seek & Destroy', 'Master of Puppets', 'One', 'Enter Sandman', 'Nothing Else Matters'],
};
