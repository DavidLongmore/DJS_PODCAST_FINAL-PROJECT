// Favourites.js
import React, { useState } from 'react';
import './Favourites.css';

function Favourites({ favourites, toggleEpisodeFavourite, resetFavourites, setSelectedEpisode }) {
  const [sortOption, setSortOption] = useState('A-Z');

  // Group favorites by show, then by season
  const groupedFavourites = favourites.reduce((acc, fav) => {
    if (!acc[fav.showTitle]) acc[fav.showTitle] = { updated: fav.updated, seasons: {} };
    if (!acc[fav.showTitle].seasons[fav.seasonTitle]) acc[fav.showTitle].seasons[fav.seasonTitle] = [];
    acc[fav.showTitle].seasons[fav.seasonTitle].push(fav);
    return acc;
  }, {});

  // Sort favorites based on the chosen option
  const sortedFavourites = Object.keys(groupedFavourites).sort((a, b) => {
    if (sortOption === 'A-Z') return a.localeCompare(b);
    if (sortOption === 'Z-A') return b.localeCompare(a);

    if (sortOption === 'Most Recently Updated') {
      const updatedA = new Date(groupedFavourites[a].updated);
      const updatedB = new Date(groupedFavourites[b].updated);
      return updatedB - updatedA;
    }

    if (sortOption === 'Least Recently Updated') {
      const updatedA = new Date(groupedFavourites[a].updated);
      const updatedB = new Date(groupedFavourites[b].updated);
      return updatedA - updatedB;
    }

    return 0;
  });

  const handleResetFavourites = () => {
    if (window.confirm("Are you sure you want to reset all favorites? This action cannot be undone.")) {
      resetFavourites(); // Call the function to reset favorites
    }
  };

  const handlePlayEpisode = (episode) => {
    setSelectedEpisode(episode);
  };

  return (
    <div className="favourites-container">
      <h2>Favourite Episodes</h2>
      <div style={styles.dropdown}>
        <label htmlFor="sort-options">Sort By: </label>
        <select
          id="sort-options"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={styles.dropdownSelect}
        >
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Most Recently Updated">Most Recently Updated</option>
          <option value="Least Recently Updated">Least Recently Updated</option>
        </select>
      </div>

      <button onClick={handleResetFavourites} style={styles.resetButton}>
        Reset All Favourites
      </button>

      {sortedFavourites.map((showTitle) => {
        const show = groupedFavourites[showTitle];
        const lastUpdated = new Date(show.updated).toLocaleString();

        return (
          <div key={showTitle} style={styles.showSection}>
            <h3>
              {showTitle} <span style={styles.updatedDate}>(Last updated: {lastUpdated})</span>
            </h3>
            {Object.keys(show.seasons).map((seasonTitle) => (
              <div key={seasonTitle} style={styles.seasonSection}>
                <h4>{seasonTitle}</h4>
                {show.seasons[seasonTitle].map((episode) => (
                  <div key={episode.episode} style={styles.episode}>
                    <div>
                      <p>{`Episode ${episode.episode}: ${episode.title}`}</p>
                      <p>{`Added: ${new Date(episode.addedAt).toLocaleString()}`}</p>
                    </div>
                    <div>
                      <button onClick={() => toggleEpisodeFavourite(episode)} className="unfavourite-button">
                        Unfavourite
                      </button>
                      <button onClick={() => handlePlayEpisode(episode)} className="play-button">
                        Play Episode
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Styles
const styles = {
  dropdown: {
    marginBottom: '20px',
  },
  dropdownSelect: {
    padding: '5px',
    fontSize: '16px',
  },
  resetButton: {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#d9534f', // Bootstrap danger color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  showSection: {
    marginBottom: '20px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
  },
  seasonSection: {
    marginLeft: '20px',
    marginBottom: '10px',
  },
  episode: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
  },
  updatedDate: {
    fontSize: '14px',
    color: '#666',
    marginLeft: '10px',
  },
};

export default Favourites;
