# Podcast App

Welcome to the Podcast App! This project is designed to provide users with an easy way to discover, listen to, and manage their favorite podcasts. The app allows users to browse a list of available shows, manage favorites, listen to episodes, and track their listening progress seamlessly.

## Features

- **Browse Podcasts**: Discover a variety of podcasts, complete with images, seasons, and episodes.
- **Favorite Management**: Add episodes to your favorites for easy access. Favorites are saved across sessions using local storage.
- **Audio Player**: Play podcast episodes directly from the app using a built-in audio player. The player is accessible throughout the app, even when navigating between different sections.
- **Track Listening Progress**: Episodes listened to all the way through are tracked and indicated within the app.
- **Sorting and Filtering**: Sort and filter shows based on genres and other attributes, ensuring users can easily find the content they are interested in.

## Setup Instructions

To get started with the Podcast App, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd podcast-app
   ```

3. **Install Dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   To start the app locally:
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

- **Browsing Shows**: The homepage displays a list of shows, sortable by genre and updated status.
- **Viewing Show Details**: Click on any show to view its seasons and episodes. You can also favorite episodes directly from the show details view.
- **Playing Episodes**: Click on an episode to open the audio player modal at the bottom of the screen. The player stays open as you navigate the app, ensuring a continuous listening experience.
- **Managing Favorites**: Visit the favorites section to see all the episodes you have favorited. Favorites are grouped by show and season, with the ability to remove items as needed.

## Project Structure

- **AudioPlayer.jsx**: Handles the functionality of playing podcast episodes, tracking listening progress, and maintaining playback across different views.
- **Favourites.jsx**: Displays the user's favorited episodes, grouped by show and season.
- **Loader.jsx**: A simple loading component used to indicate data fetching throughout the app.
- **Modal.jsx**: Used for rendering modals, including the audio player and episode details.
- **ShowList.jsx**: Displays the list of available shows, with sorting and filtering options to enhance discoverability.

## Contact Information

For any questions, suggestions, or issues, feel free to reach out:

- **Name**: David Longmore
- **Email**: [davidlongmore3@gmail.com]

We welcome contributions and feedback to make this project better for everyone!

