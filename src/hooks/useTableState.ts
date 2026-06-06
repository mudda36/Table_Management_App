import { useState, useCallback } from 'react';
import { TableState, ColumnConfig } from '../types';

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'track_name', label: 'Track Name', visible: true, width: 200 },
  { id: 'artist', label: 'Artist', visible: true, width: 150 },
  { id: 'album', label: 'Album', visible: true, width: 150 },
  { id: 'genre', label: 'Genre', visible: true, width: 120 },
  { id: 'popularity', label: 'Popularity', visible: true, width: 100 },
  { id: 'tempo', label: 'Tempo', visible: true, width: 100 },
  { id: 'energy', label: 'Energy', visible: true, width: 100 },
  { id: 'danceability', label: 'Danceability', visible: true, width: 120 },
  { id: 'release_date', label: 'Release Date', visible: true, width: 120 },
  { id: 'explicit_flag', label: 'Explicit', visible: true, width: 80 },
];

export function useTableState() {
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    pageSize: 50,
    sortBy: 'track_name',
    sortOrder: 'asc',
    filters: {},
    searchQuery: '',
  });

  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const saved = localStorage.getItem('table-columns');
    return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
  });

  const updateTableState = useCallback((updates: Partial<TableState>) => {
    setTableState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateColumns = useCallback((newColumns: ColumnConfig[]) => {
    setColumns(newColumns);
    localStorage.setItem('table-columns', JSON.stringify(newColumns));
  }, []);

  const resetFilters = useCallback(() => {
    setTableState(prev => ({ ...prev, filters: {}, searchQuery: '' }));
  }, []);

  return {
    tableState,
    updateTableState,
    columns,
    updateColumns,
    resetFilters,
  };
}