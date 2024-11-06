// App.jsx
import React, { useState, useEffect } from 'react';
import ShowList from './components/ShowList';
import Favourites from './components/Favourites';
import AudioPlayer from './components/AudioPlayer';
import Modal from './components/Modal';
import Loader from './components/Loader'; // Import the loader component

function App() {
  const [shows, setShows] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [view, setView] = useState('shows');
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  // Fetch shows from API when the component mounts
  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch('https://podcast-api.netlify.app/');
        const data = await response.json();

        // Sort shows alphabetically by title before setting state
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
        setShows(sortedData);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchShows();
  }, []);

  const toggleEpisodeFavourite = (episode) => {
    if (favourites.some(fav => fav.episode === episode.episode && fav.showTitle === episode.showTitle)) {
      setFavourites(favourites.filter(fav => !(fav.episode === episode.episode && fav.showTitle === episode.showTitle)));
    } else {
      setFavourites([...favourites, { ...episode, showTitle: episode.showTitle }]);
    }
  };

  const resetFavourites = () => {
    if (window.confirm('Are you sure you want to reset all favourites?')) {
      setFavourites([]);
    }
  };

  return (
    <div className="App">
      <nav style={styles.nav}>
        <h1 style={styles.title}>Podcast App</h1>
        <div style={styles.navLinks}>
          <button onClick={() => setView('shows')}>Shows</button>
          <button onClick={() => setView('favourites')}>Favourites</button>
        </div>
      </nav>

      {/* Conditionally render Loader or the main content */}
      {loading ? (
        <Loader /> // Display loader if loading is true
      ) : (
        <>
          {view === 'shows' && (
            <ShowList
              shows={shows}
              toggleFavourite={toggleEpisodeFavourite}
              favourites={favourites}
              setSelectedEpisode={setSelectedEpisode}
            />
          )}
          {view === 'favourites' && (
            <Favourites
              favourites={favourites}
              toggleEpisodeFavourite={toggleEpisodeFavourite}
              setSelectedEpisode={setSelectedEpisode}
              resetFavourites={resetFavourites}
            />
          )}
        </>
      )}

      {selectedEpisode && (
        <AudioPlayer
          episode={selectedEpisode}
          onClose={() => setSelectedEpisode(null)}
        />
      )}
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: '10px',
    color: 'limegreen',
  },
  title: {
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default App;