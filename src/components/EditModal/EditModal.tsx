import React, { useState } from 'react';
import { Track } from '../../types';
import './EditModal.css';

interface EditModalProps {
  track: Track | null;
  onSave: (track: Track) => void;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ track, onSave, onClose }) => {
  const [editedTrack, setEditedTrack] = useState<Track | null>(track);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!track || !editedTrack) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!editedTrack.track_name.trim()) {
      newErrors.track_name = 'Track name is required';
    }
    if (!editedTrack.artist.trim()) {
      newErrors.artist = 'Artist name is required';
    }
    if (editedTrack.popularity < 0 || editedTrack.popularity > 100) {
      newErrors.popularity = 'Popularity must be between 0 and 100';
    }
    if (editedTrack.tempo < 0 || editedTrack.tempo > 300) {
      newErrors.tempo = 'Tempo must be between 0 and 300 BPM';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(editedTrack);
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={e => e.stopPropagation()}>
        <h2>Edit Track</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Track Name *</label>
            <input
              type="text"
              value={editedTrack.track_name}
              onChange={e => setEditedTrack({ ...editedTrack, track_name: e.target.value })}
            />
            {errors.track_name && <span className="error">{errors.track_name}</span>}
          </div>
          
          <div className="form-group">
            <label>Artist *</label>
            <input
              type="text"
              value={editedTrack.artist}
              onChange={e => setEditedTrack({ ...editedTrack, artist: e.target.value })}
            />
            {errors.artist && <span className="error">{errors.artist}</span>}
          </div>
          
          <div className="form-group">
            <label>Album</label>
            <input
              type="text"
              value={editedTrack.album}
              onChange={e => setEditedTrack({ ...editedTrack, album: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Genre</label>
            <select
              value={editedTrack.genre}
              onChange={e => setEditedTrack({ ...editedTrack, genre: e.target.value })}
            >
              <option value="pop">Pop</option>
              <option value="rock">Rock</option>
              <option value="hip-hop">Hip-Hop</option>
              <option value="electronic">Electronic</option>
              <option value="jazz">Jazz</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Popularity (0-100)</label>
            <input
              type="number"
              value={editedTrack.popularity}
              onChange={e => setEditedTrack({ ...editedTrack, popularity: Number(e.target.value) })}
              min="0"
              max="100"
            />
            {errors.popularity && <span className="error">{errors.popularity}</span>}
          </div>
          
          <div className="form-group">
            <label>Tempo (BPM)</label>
            <input
              type="number"
              value={editedTrack.tempo}
              onChange={e => setEditedTrack({ ...editedTrack, tempo: Number(e.target.value) })}
              step="0.1"
            />
            {errors.tempo && <span className="error">{errors.tempo}</span>}
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={editedTrack.explicit_flag}
                onChange={e => setEditedTrack({ ...editedTrack, explicit_flag: e.target.checked })}
              />
              Explicit
            </label>
          </div>
          
          <div className="modal-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};