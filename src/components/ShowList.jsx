// ShowList.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function ShowList({ shows, toggleFavourite, favourites, setSelectedEpisode }) {
  const [selectedShow, setSelectedShow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const [seasonImage, setSeasonImage] = useState(null);
  const [genresMap, setGenresMap] = useState({});
  const [sortOption, setSortOption] = useState('A-Z');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      const genreList = [];
      for (let id = 1; id <= 9; id++) {
        try {
          const response = await fetch(`https://podcast-api.netlify.app/genre/${id}`);
          const data = await response.json();
          if (data.title) {
            genreList.push({ id, title: data.title, shows: data.shows });
          }
        } catch (error) {
          console.error(`Error fetching genre with ID ${id}:`, error);
        }
      }
      // Create a map for genres
      const genresObject = { 'All': 'All', ...Object.fromEntries(genreList.map(genre => [genre.id, genre.title])) };
      setGenresMap(genresObject);
    };
    fetchGenres();
  }, []);

  // Filter and sort shows
  const filteredAndSortedShows = () => {
    return [...shows]
      .filter((show) => selectedGenre === 'All' || show.genres.includes(parseInt(selectedGenre)))
      .sort((a, b) => {
        const sortFunctions = {
          'A-Z': () => a.title.localeCompare(b.title),
          'Z-A': () => b.title.localeCompare(a.title),
          'Most Recently Updated': () => new Date(b.updated) - new Date(a.updated),
          'Furthest Back Updated': () => new Date(a.updated) - new Date(b.updated),
        };
        return sortFunctions[sortOption]();
      });
  };

  const handleShowClick = async (showId) => {
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
      const data = await response.json();
      setSelectedShow(data);
      resetSeasonData();
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const resetSeasonData = () => {
    setSelectedSeason(null);
    setSeasonEpisodes([]);
    setSeasonImage(null);
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setSeasonEpisodes(season.episodes);
    setSeasonImage(season.image);
  };

  const handlePlayEpisode = (episode) => {
    setSelectedEpisode(episode);
  };

  const renderSortAndFilter = () => (
    <div style={styles.navBar}>
      {renderDropdown('Sort By', 'sort-options', sortOption, setSortOption, ['A-Z', 'Z-A', 'Most Recently Updated', 'Furthest Back Updated'])}
      {renderDropdown('Filter by Genre', 'genre-filter', selectedGenre, setSelectedGenre, Object.keys(genresMap).map(genreId => genreId))}
    </div>
  );

  const renderDropdown = (label, id, value, setValue, options) => (
    <div style={styles.dropdown}>
      <label htmlFor={id}>{label}: </label>
      <select id={id} value={value} onChange={(e) => setValue(e.target.value)} style={styles.dropdownSelect}>
        {options.map(option => (
          <option key={option} value={option}>
            {option === 'All' ? 'All' : genresMap[option] || option}
          </option>
        ))}
      </select>
    </div>
  );

  const renderShowCard = (show) => (
    <div key={show.id} style={styles.showCard} onClick={() => handleShowClick(show.id)}>
      <img src={show.image} alt={show.title} style={styles.showImage} />
      <h2 style={styles.showTitle}>{show.title}</h2>
      <p>{show.genres.map(genreId => genresMap[genreId]).filter(Boolean).join(', ') || 'Loading genres...'}</p>
      <p>
        {show.seasons} Season{show.seasons > 1 ? 's' : ''}
      </p>
      <p>Last Updated: {new Date(show.updated).toLocaleDateString()}</p>
    </div>
  );

  const renderModalContent = () => {
    if (!selectedShow) return null;
    return (
      <div>
        <h2>{selectedShow.title}</h2>
        <p>{selectedShow.description}</p>
        <h3>Select a Season:</h3>
        {selectedShow.seasons.map(season => (
          <button
            key={season.season}
            onClick={() => handleSeasonSelect(season)}
            style={{
              margin: '5px',
              padding: '5px',
              backgroundColor: selectedSeason && selectedSeason.season === season.season ? 'lightblue' : 'white',
            }}
          >
            {season.title}
          </button>
        ))}
        {selectedSeason && renderSeasonEpisodes()}
      </div>
    );
  };

  const renderSeasonEpisodes = () => (
    <div style={{ marginTop: '20px' }}>
      {seasonImage && <img src={seasonImage} alt={selectedSeason.title} style={styles.seasonImage} />}
      <h4>{`Episodes for ${selectedSeason.title}`}</h4>
      {seasonEpisodes.length > 0 ? (
        seasonEpisodes.map((episode) => (
          <div key={episode.episode}>
            <h5>
              Episode {episode.episode}: {episode.title}
            </h5>
            <p>{episode.description}</p>
            <p>Last Updated: {new Date(selectedShow.updated).toLocaleDateString()}</p>
            <button onClick={() => toggleFavourite({ ...episode, showTitle: selectedShow.title, seasonTitle: selectedSeason.title, addedAt: new Date().toLocaleString(), updated: selectedShow.updated })}>
              {favourites.some(
                (fav) =>
                  fav.episode === episode.episode &&
                  fav.showTitle === selectedShow.title &&
                  fav.seasonTitle === selectedSeason.title
              )
                ? 'Unfavourite'
                : 'Favourite'}
            </button>
            <button onClick={() => handlePlayEpisode(episode)}>Play Episode</button>
          </div>
        ))
      ) : (
        <p>No episodes available for this season.</p>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      {renderSortAndFilter()}
      {filteredAndSortedShows().map(renderShowCard)}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {renderModalContent()}
      </Modal>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
    padding: '10px 0',
  },
  dropdown: {
    margin: '0 120px',
  },
  dropdownSelect: {
    padding: '5px',
    fontSize: '16px',
  },
  showCard: {
    width: '24%',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    margin: '10px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  showImage: {
    width: '100%',
    borderRadius: '4px',
  },
  showTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  seasonImage: {
    width: '100%',
    borderRadius: '4px',
    marginTop: '10px',
  },
};

export default ShowList;
