import axios from 'axios';
// import { Track, PaginatedResponse, FilterConfig } from '../types';
import { Track, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tracksApi = {
  getTracks: async (
    page: number = 1,
    pageSize: number = 50,
    sortBy: string = 'track_name',
    sortOrder: 'asc' | 'desc' = 'asc',
    filters: Record<string, any> = {},
    searchQuery: string = ''
  ): Promise<PaginatedResponse<Track>> => {
    const params: any = {
      _page: page,
      _limit: pageSize,
      _sort: sortBy,
      _order: sortOrder,
    };

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string') {
          params[`${key}_like`] = value;
        } else if (typeof value === 'object') {
          if (value.gte !== undefined) params[`${key}_gte`] = value.gte;
          if (value.lte !== undefined) params[`${key}_lte`] = value.lte;
        } else {
          params[key] = value;
        }
      }
    });

    // Global search
    if (searchQuery) {
      params.q = searchQuery;
    }

    const response = await api.get('/records', { params });
    
    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count'] || '0', 10),
      page,
      pageSize,
    };
  },

  updateTrack: async (id: string, updates: Partial<Track>): Promise<Track> => {
    const response = await api.patch(`/records/${id}`, updates);
    return response.data;
  },

  bulkUpdateTracks: async (ids: string[], updates: Partial<Track>): Promise<Track[]> => {
    const promises = ids.map(id => api.patch(`/records/${id}`, updates));
    const responses = await Promise.all(promises);
    return responses.map(r => r.data);
  },

  getAllFilteredTracks: async (
    filters: Record<string, any> = {},
    searchQuery: string = '',
    sortBy: string = 'track_name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<Track[]> => {
    const params: any = {
      _sort: sortBy,
      _order: sortOrder,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string') {
          params[`${key}_like`] = value;
        } else if (typeof value === 'object') {
          if (value.gte !== undefined) params[`${key}_gte`] = value.gte;
          if (value.lte !== undefined) params[`${key}_lte`] = value.lte;
        } else {
          params[key] = value;
        }
      }
    });

    if (searchQuery) {
      params.q = searchQuery;
    }

    const response = await api.get('/records', { params });
    return response.data;
  },
};