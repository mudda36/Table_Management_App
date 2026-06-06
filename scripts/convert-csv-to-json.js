const fs = require('fs');
const path = require('path');

// Sample data generator for Spotify tracks
function generateSpotifyTracks(count = 30000) {
  const genres = ['pop', 'rock', 'hip-hop', 'electronic', 'jazz', 'classical', 'r&b', 'country', 'metal', 'indie'];
  const artists = ['Taylor Swift', 'Drake', 'The Weeknd', 'Billie Eilish', 'Ed Sheeran', 'Ariana Grande', 
                   'Post Malone', 'Bruno Mars', 'Beyoncé', 'Kendrick Lamar', 'Dua Lipa', 'Justin Bieber'];
  const albums = ['Midnights', 'After Hours', 'Future Nostalgia', 'Happier Than Ever', '÷', 'Positions',
                  'Hollywood Bleeding', 'Good Kid Mad City', '24K Magic', 'Lemonade'];
  
  const tracks = [];
  
  for (let i = 1; i <= count; i++) {
    tracks.push({
      id: i.toString(),
      track_name: `Track ${i}`,
      artist: artists[Math.floor(Math.random() * artists.length)],
      album: albums[Math.floor(Math.random() * albums.length)],
      genre: genres[Math.floor(Math.random() * genres.length)],
      popularity: Math.floor(Math.random() * 100),
      tempo: 60 + Math.random() * 140,
      energy: Math.random(),
      danceability: Math.random(),
      duration_ms: Math.floor(120000 + Math.random() * 300000),
      release_date: new Date(2010 + Math.random() * 14, Math.random() * 12, Math.random() * 28).toISOString().split('T')[0],
      explicit_flag: Math.random() > 0.7
    });
  }
  
  return tracks;
}

// Generate data
const tracks = generateSpotifyTracks(30000);

// Create db.json structure
const db = {
  records: tracks
};

// Write to file
const outputPath = path.join(__dirname, '..', 'db.json');
fs.writeFileSync(outputPath, JSON.stringify(db, null, 2));
console.log(`✅ Generated ${tracks.length} tracks in ${outputPath}`);