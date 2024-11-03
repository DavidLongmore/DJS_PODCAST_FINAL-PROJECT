import React, { useState } from 'react';

function Favourites({ favourites, toggleEpisodeFavourite }) {
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

  return (
    <div>
      <h2>Favourites</h2>
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

      {sortedFavourites.map((showTitle) => {
        const show = groupedFavourites[showTitle];
        const lastUpdated = new Date(show.updated).toLocaleDateString();

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
                    <p>{`Episode ${episode.episode}: ${episode.title}`}</p>
                    <p>{`Added: ${new Date(episode.addedAt).toLocaleDateString()}`}</p>
                    <button onClick={() => toggleEpisodeFavourite(episode)}>
                      Unfavourite
                    </button>
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
