export interface Track {
  id: string;
  track_name: string;
  artist: string;
  album: string;
  genre: string;
  popularity: number;
  tempo: number;
  energy: number;
  danceability: number;
  duration_ms: number;
  release_date: string;
  explicit_flag: boolean;
}

export interface TableState {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, any>;
  searchQuery: string;
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterConfig {
  column: string;
  type: 'text' | 'categorical' | 'numeric' | 'date';
  value: any;
}