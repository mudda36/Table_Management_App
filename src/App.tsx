import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { tracksApi } from './services/api';
import { VirtualizedTable } from './components/Table/VirtualizedTable';
import { FilterPanel } from './components/Filters/FilterPanel';
import { Pagination } from './components/Pagination/Pagination';
import { ColumnManager } from './components/ColumnManager/ColumnManager';
import { EditModal } from './components/EditModal/EditModal';
import { useTableState } from './hooks/useTableState';
import { useDebounce } from './hooks/useDebounce';
import { Track } from './types';
import './App.css';

function App() {
  const { tableState, updateTableState, columns, updateColumns, resetFilters } = useTableState();
  const [data, setData] = useState<Track[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [bulkEditValue, setBulkEditValue] = useState<Partial<Track>>({});

  const debouncedSearch = useDebounce(tableState.searchQuery, 300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tracksApi.getTracks(
        tableState.page,
        tableState.pageSize,
        tableState.sortBy,
        tableState.sortOrder,
        tableState.filters,
        debouncedSearch
      );
      setData(response.data);
      setTotal(response.total);
    } catch (err) {
      setError('Failed to load tracks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tableState, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = useCallback((column: string) => {
    updateTableState({
      sortBy: column,
      sortOrder: tableState.sortBy === column && tableState.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    });
  }, [tableState.sortBy, tableState.sortOrder, updateTableState]);

  const handleFilterChange = useCallback((column: string, value: any) => {
    updateTableState({
      filters: { ...tableState.filters, [column]: value },
      page: 1,
    });
  }, [tableState.filters, updateTableState]);

  const handleSearch = useCallback((query: string) => {
    updateTableState({ searchQuery: query, page: 1 });
  }, [updateTableState]);

  const handlePageChange = useCallback((page: number) => {
    updateTableState({ page });
    setSelectedRows(new Set());
  }, [updateTableState]);

  const handlePageSizeChange = useCallback((size: number) => {
    updateTableState({ pageSize: size, page: 1 });
    setSelectedRows(new Set());
  }, [updateTableState]);

  const handleSelectRow = useCallback((id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map(track => track.id)));
    }
  }, [selectedRows, data]);

  const handleEditTrack = useCallback((track: Track) => {
    setEditingTrack(track);
  }, []);

  const handleSaveEdit = useCallback(async (updatedTrack: Track) => {
    try {
      await tracksApi.updateTrack(updatedTrack.id, updatedTrack);
      setData(prev => prev.map(t => t.id === updatedTrack.id ? updatedTrack : t));
      setEditingTrack(null);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    }
  }, []);

  const handleBulkEdit = useCallback(async () => {
    if (selectedRows.size === 0 || Object.keys(bulkEditValue).length === 0) return;
    
    try {
      const selectedIds = Array.from(selectedRows);
      await tracksApi.bulkUpdateTracks(selectedIds, bulkEditValue);
      await fetchData();
      setSelectedRows(new Set());
      setBulkEditValue({});
    } catch (err) {
      setError('Failed to perform bulk edit. Please try again.');
    }
  }, [selectedRows, bulkEditValue, fetchData]);

  const handleExportCSV = useCallback(async () => {
    try {
      const allData = await tracksApi.getAllFilteredTracks(
        tableState.filters,
        debouncedSearch,
        tableState.sortBy,
        tableState.sortOrder
      );
      
      const headers = columns.filter(c => c.visible).map(c => c.label);
      const csvRows = [headers];
      
      for (const track of allData) {
        const row = columns.filter(c => c.visible).map(column => {
          let value = track[column.id as keyof Track];
          
          // Format values for CSV
          if (column.id === 'duration_ms') {
            const minutes = Math.floor((value as number) / 60000);
            const seconds = Math.floor(((value as number) % 60000) / 1000);
            value = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          } else if (column.id === 'energy' || column.id === 'danceability') {
            value = `${((value as number) * 100).toFixed(0)}%`;
          } else if (column.id === 'explicit_flag') {
            value = value ? 'Yes' : 'No';
          } else if (column.id === 'release_date') {
            value = new Date(value as string).toLocaleDateString();
          }
          
          // Escape CSV special characters
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
        csvRows.push(row);
      }
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', 'spotify_tracks_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data. Please try again.');
    }
  }, [tableState, debouncedSearch, columns]);

  const clearSearch = useCallback(() => {
    updateTableState({ searchQuery: '' });
  }, [updateTableState]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎵 Spotify Tracks Explorer</h1>
        <p>{total.toLocaleString()} tracks available</p>
      </header>
      
      <div className="app-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search across all fields..."
            value={tableState.searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="global-search"
          />
          {tableState.searchQuery && (
            <button onClick={clearSearch} className="clear-search-btn">
              Clear
            </button>
          )}
        </div>
        
        <div className="action-buttons">
          <ColumnManager columns={columns} onUpdateColumns={updateColumns} />
          
          {selectedRows.size > 0 && (
            <div className="bulk-actions">
              <select
                onChange={(e) => {
                  const [field, value] = e.target.value.split(':');
                  if (field && value) {
                    setBulkEditValue({ [field]: value });
                  }
                }}
                className="bulk-select"
              >
                <option value="">Bulk Edit Selected ({selectedRows.size})</option>
                <option value="explicit_flag:true">Mark as Explicit</option>
                <option value="explicit_flag:false">Mark as Not Explicit</option>
                <option value="genre:pop">Set Genre to Pop</option>
                <option value="genre:rock">Set Genre to Rock</option>
                <option value="genre:hip-hop">Set Genre to Hip-Hop</option>
              </select>
              <button onClick={handleBulkEdit} className="apply-bulk-btn">
                Apply
              </button>
            </div>
          )}
          
          <button onClick={handleExportCSV} className="export-btn">
            📥 Export to CSV
          </button>
        </div>
      </div>
      
      <div className="app-layout">
        <aside className="filters-sidebar">
          <FilterPanel
            filters={tableState.filters}
            onFilterChange={handleFilterChange}
            onClearFilters={resetFilters}
          />
        </aside>
        
        <main className="table-main">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading tracks...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <p>⚠️ {error}</p>
              <button onClick={fetchData} className="retry-btn">Retry</button>
            </div>
          )}
          
          {!loading && !error && data.length === 0 && (
            <div className="empty-state">
              <p>📭 No tracks match your filters</p>
              <button onClick={resetFilters} className="reset-btn">Reset Filters</button>
            </div>
          )}
          
          {!loading && !error && data.length > 0 && (
            <>
              <VirtualizedTable
                data={data}
                columns={columns}
                sortBy={tableState.sortBy}
                sortOrder={tableState.sortOrder}
                onSort={handleSort}
                selectedRows={selectedRows}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                onEdit={handleEditTrack}
              />
              
              <Pagination
                currentPage={tableState.page}
                totalItems={total}
                pageSize={tableState.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </main>
      </div>
      
      {editingTrack && (
        <EditModal
          track={editingTrack}
          onSave={handleSaveEdit}
          onClose={() => setEditingTrack(null)}
        />
      )}
    </div>
  );
}

export default App;