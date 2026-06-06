import React from 'react';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: Record<string, any>;
  onFilterChange: (column: string, value: any) => void;
  onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const genres = ['pop', 'rock', 'hip-hop', 'electronic', 'jazz', 'classical', 'r&b', 'country', 'metal', 'indie'];

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3>Filters</h3>
        <button onClick={onClearFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label>Track Name</label>
          <input
            type="text"
            value={filters.track_name || ''}
            onChange={(e) => onFilterChange('track_name', e.target.value)}
            placeholder="Contains..."
          />
        </div>

        <div className="filter-group">
          <label>Artist</label>
          <input
            type="text"
            value={filters.artist || ''}
            onChange={(e) => onFilterChange('artist', e.target.value)}
            placeholder="Contains..."
          />
        </div>

        <div className="filter-group">
          <label>Genre</label>
          <select
            value={filters.genre || ''}
            onChange={(e) => onFilterChange('genre', e.target.value)}
          >
            <option value="">All</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Popularity Range</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.popularity?.gte || ''}
              onChange={(e) => onFilterChange('popularity', {
                ...filters.popularity,
                gte: e.target.value ? Number(e.target.value) : undefined
              })}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.popularity?.lte || ''}
              onChange={(e) => onFilterChange('popularity', {
                ...filters.popularity,
                lte: e.target.value ? Number(e.target.value) : undefined
              })}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Tempo Range</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="Min BPM"
              value={filters.tempo?.gte || ''}
              onChange={(e) => onFilterChange('tempo', {
                ...filters.tempo,
                gte: e.target.value ? Number(e.target.value) : undefined
              })}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max BPM"
              value={filters.tempo?.lte || ''}
              onChange={(e) => onFilterChange('tempo', {
                ...filters.tempo,
                lte: e.target.value ? Number(e.target.value) : undefined
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};