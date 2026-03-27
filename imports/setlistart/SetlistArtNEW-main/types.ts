export enum AppStep {
  LANDING = 'LANDING',
  DETAILS = 'DETAILS',
  SONGS = 'SONGS',
  VISUALIZE = 'VISUALIZE',
}

export interface ConcertDetails {
  artist: string;
  city: string;
  year: string;

  venue?: string;
  eventDate?: string; // exact date from setlist.fm (e.g. "24-02-2013")
}


export interface Song {
  id: string;
  title: string;
  type?: 'cover' | 'encore' | 'original';
  originalArtist?: string;
}

export enum PrintSize {
  A4 = 'A4',
  A3 = 'A3',
  Poster11x14 = '11x14',
  Photo6x8 = '6x8',
}


export enum FontStyle {
  MODERN = 'Modern',   // Inter/Helvetica style
  BOLD = 'Bold',       // Oswald/Impact style
  CLASSIC = 'Classic', // Serif
  MONO = 'Mono'        // Typewriter
}

export interface DesignConfig {
  size: PrintSize;
  fontStyle: FontStyle;
  isDarkMode: boolean;
  accentColor: string;
  showBorder: boolean;
}

export interface LayoutMetrics {
  width: number;
  height: number;
  dpi: number;
  margin: number;
}
