// Replace 'YOUR_API_KEY' with your actual YouTube API key
const API_KEY = 'AIzaSyCQqvQhNs-lX7KoUCErol_05C5pM15YCRQ';
const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

let isDescriptionVisible = true; // Default to visible
let isCommentVisible = false; // Default to hidden

function searchVideos() {
  const searchInput = document.getElementById('searchInput').value;

  // Clear previous video, search results, and video dropdown
  document.getElementById('videoPlayer').src = '';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('videoDescription').innerText = '';
  document.getElementById('commentContainer').style.display = 'none'; // Hide comment container

  // Make API request to search for videos
  fetch(`${SEARCH_ENDPOINT}?part=snippet&maxResults=10&q=${searchInput}&type=video&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.items.length > 0) {
        // Display search results
        const resultsContainer = document.getElementById('searchResults');
        data.items.forEach(item => {
          const videoId = item.id.videoId;
          const title = item.snippet.title;

          // Create result item
          const resultItem = document.createElement('div');
          resultItem.classList.add('result-item');
          resultItem.innerHTML = `
                        <img src="${item.snippet.thumbnails.medium.url}" alt="Thumbnail">
                        <p>${title}</p>
                    `;
          resultItem.addEventListener('click', () => playVideo(videoId));
          resultsContainer.appendChild(resultItem);
        });
      } else {
        alert('No videos found.');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('An error occurred while fetching data.');
    });
}

// Add this function to your JavaScript code
function hideButtons() {
  const descriptionButton = document.getElementById('toggleDescriptionButton');
  const commentButton = document.getElementById('toggleCommentButton');
  descriptionButton.style.display = 'none';
  commentButton.style.display = 'none';
}

// Call the hideButtons() function initially to hide the buttons when the website loads
hideButtons();

// Adjust the playVideo() function to show buttons when a video is selected
function playVideo(videoId) {
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;
  document.getElementById('videoPlayer').src = videoUrl;
  updateVideoTitle(videoId); // Update the video title
  updateDescription(videoId);
  showButtons(); // Show buttons when video is selected
}

function updateVideoTitle(selectedVideoId) {
  // Make API request to get video details
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${selectedVideoId}&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const title = data.items[0].snippet.title;
      document.getElementById('videoTitle').textContent = title; // Set the video title
    })
    .catch(error => {
      console.error('Error fetching video details:', error);
      alert('An error occurred while fetching video details.');
    });
}

function showButtons() {
  const descriptionButton = document.getElementById('toggleDescriptionButton');
  const commentButton = document.getElementById('toggleCommentButton');
  descriptionButton.style.display = 'block';
  commentButton.style.display = 'block';
}

function updateDescription(selectedVideoId) {
    // Make API request to get video details
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${selectedVideoId}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const description = data.items[0].snippet.description;
            const descriptionContainer = document.getElementById('descriptionContainer');

            
          
            if (description) {
                descriptionContainer.innerHTML = `<h3>Description Box:</h3><p>${description}</p>`;
                descriptionContainer.style.display = 'block'; // Display description container
            } else {
                descriptionContainer.innerHTML = '<p>No description available.</p>';
                descriptionContainer.style.display = 'none'; // Hide description container if no description
            }
        })
        .catch(error => {
            console.error('Error fetching video details:', error);
            alert('An error occurred while fetching video details.');
        });
}

// Function to toggle the visibility of the video description
function toggleDescription() {
  const descriptionElement = document.getElementById('descriptionContainer');

  // Toggle the visibility of the description
  isDescriptionVisible = !isDescriptionVisible;
  descriptionElement.style.display = isDescriptionVisible ? 'block' : 'none';
}

function toggleComments() {
  const commentContainer = document.getElementById('commentContainer');

  // Toggle the visibility of the comments
  isCommentVisible = !isCommentVisible;
  commentContainer.style.display = isCommentVisible ? 'block' : 'none';
}

let isDarkMode = false; // Default to light mode

function toggleDarkMode() {
  const body = document.body;
  const darkModeIcon = document.getElementById('darkModeIcon');

  // Toggle the dark mode state
  isDarkMode = !isDarkMode;

  // Toggle dark mode class on body
  body.classList.toggle("dark-mode");

  // Change icon based on dark mode state
  darkModeIcon.innerText = isDarkMode ? 'light_mode' : 'dark_mode';
}

function getVideoIdFromPlayer() {
  // Implement this function to extract the video ID from the player
  // For example, if the player's src attribute contains the video ID, you can extract it from there
  // Replace this with your actual implementation
  const videoPlayer = document.getElementById('videoPlayer');
  const videoUrl = videoPlayer.src;
  const videoId = videoUrl.split('/').pop(); // Extract video ID from URL
  return videoId;
}

function displayComments(videoId) {
    // Make API request to fetch video comments
    fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const firstComment = data.items[0];
            const commentContainer = document.getElementById('commentContainer');
            if (firstComment) {
                const commentText = firstComment.snippet.topLevelComment.snippet.textDisplay;
                commentContainer.innerHTML = `<h3>Pinned Comment: </h3>
<p>${commentText}</p>`;
                commentContainer.style.display = 'block'; // Display comment container
            } else {
                commentContainer.innerHTML = '<p>No comments found.</p>';
                commentContainer.style.display = 'none'; // Hide comment container if no comments
            }
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            alert('An error occurred while fetching comments.');
        });
}


function showComments() {
    const commentContainer = document.getElementById('commentContainer');
    if (commentContainer.style.display === 'block') {
        commentContainer.style.display = 'none';
    } else {
        const videoId = getVideoIdFromPlayer();
        displayComments(videoId);
        commentContainer.style.display = 'block';
    }
}
