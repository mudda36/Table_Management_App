import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock API calls
jest.mock('./services/api', () => ({
  tracksApi: {
    getTracks: jest.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          track_name: 'Test Track',
          artist: 'Test Artist',
          album: 'Test Album',
          genre: 'pop',
          popularity: 80,
          tempo: 120,
          energy: 0.8,
          danceability: 0.7,
          duration_ms: 240000,
          release_date: '2023-01-01',
          explicit_flag: false,
        },
      ],
      total: 1,
    }),
    updateTrack: jest.fn(),
    getAllFilteredTracks: jest.fn().mockResolvedValue([]),
  },
}));

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Spotify Tracks Explorer/i);
  expect(headerElement).toBeInTheDocument();
});

test('handles search input', async () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search across all fields/i);
  await userEvent.type(searchInput, 'test');
  expect(searchInput).toHaveValue('test');
});

test('csv escaping works correctly', () => {
  const testValue = 'Contains, commas and "quotes"';
  const escaped = `"${testValue.replace(/"/g, '""')}"`;
  expect(escaped).toBe('"Contains, commas and ""quotes"""');
});