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
      <div className="dropdown">
        <label htmlFor="sort-options">Sort By: </label>
        <select
          id="sort-options"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="dropdownSelect"
        >
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Most Recently Updated">Most Recently Updated</option>
          <option value="Least Recently Updated">Least Recently Updated</option>
        </select>
      </div>

      <button onClick={handleResetFavourites} className="resetButton">
        Reset All Favourites
      </button>

      {sortedFavourites.map((showTitle) => {
        const show = groupedFavourites[showTitle];
        const lastUpdated = new Date(show.updated).toLocaleString();

        return (
          <div key={showTitle} className="showSection">
            <h3>
              {showTitle} <span className="updatedDate">(Last updated: {lastUpdated})</span>
            </h3>
            {Object.keys(show.seasons).map((seasonTitle) => (
              <div key={seasonTitle} className="seasonSection">
                <h4>{seasonTitle}</h4>
                {show.seasons[seasonTitle].map((episode) => (
                  <div key={episode.episode} className="episode">
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

export default Favourites;
