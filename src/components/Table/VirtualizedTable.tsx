// import React, { useMemo, useRef, useEffect } from 'react';
import React, { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Track, ColumnConfig } from '../../types';
import './VirtualizedTable.css';

interface VirtualizedTableProps {
  data: Track[];
  columns: ColumnConfig[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
  selectedRows: Set<string>;
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (track: Track) => void;
}

export const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  columns,
  sortBy,
  sortOrder,
  onSort,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onEdit,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  const visibleColumns = useMemo(() => columns.filter(col => col.visible), [columns]);

  const formatValue = (track: Track, columnId: string): string => {
    const value = track[columnId as keyof Track];
    if (columnId === 'duration_ms') {
      const minutes = Math.floor((value as number) / 60000);
      const seconds = Math.floor(((value as number) % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    if (columnId === 'energy' || columnId === 'danceability') {
      return `${((value as number) * 100).toFixed(0)}%`;
    }
    if (columnId === 'explicit_flag') {
      return value ? '🔞 Yes' : '✓ No';
    }
    if (columnId === 'release_date') {
      return new Date(value as string).toLocaleDateString();
    }
    return String(value);
  };

  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <div className="virtualized-table-container" ref={tableContainerRef}>
      <div className="virtualized-table-header">
        <div className="virtualized-table-header-row">
          <div className="virtualized-table-checkbox-cell">
            <input
              type="checkbox"
              checked={allSelected}
              ref={input => {
                if (input) {
                  input.indeterminate = someSelected && !allSelected;
                }
              }}
              onChange={onSelectAll}
              aria-label="Select all rows"
            />
          </div>
          {visibleColumns.map(column => (
            <div
              key={column.id}
              className="virtualized-table-header-cell"
              style={{ width: column.width || 150 }}
              onClick={() => onSort(column.id)}
              role="button"
              tabIndex={0}
              aria-label={`Sort by ${column.label}`}
            >
              {column.label}
              {sortBy === column.id && (
                <span className="sort-indicator">{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        className="virtualized-table-body"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const track = data[virtualRow.index];
          return (
            <div
              key={track.id}
              className={`virtualized-table-row ${selectedRows.has(track.id) ? 'selected' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="virtualized-table-row-content">
                <div className="virtualized-table-checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(track.id)}
                    onChange={() => onSelectRow(track.id)}
                    aria-label={`Select row ${track.track_name}`}
                  />
                </div>
                {visibleColumns.map(column => (
                  <div
                    key={column.id}
                    className="virtualized-table-cell"
                    style={{ width: column.width || 150 }}
                    onDoubleClick={() => onEdit(track)}
                  >
                    {formatValue(track, column.id)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};