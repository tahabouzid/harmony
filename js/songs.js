const songs = [
    {
        name: "Shape of You",
        genre: "Pop",
        artist: "Ed Sheeran",
        language: "English",
        country: "UK"
    },
    {
        name: "Despacito",
        genre: "Reggaeton",
        artist: "Luis Fonsi",
        language: "Spanish",
        country: "Puerto Rico"
    },
    {
        name: "Blinding Lights",
        genre: "Synthwave",
        artist: "The Weeknd",
        language: "English",
        country: "Canada"
    },
    {
        name: "Bad Guy",
        genre: "Electropop",
        artist: "Billie Eilish",
        language: "English",
        country: "USA"
    },
    {
        name: "Believer",
        genre: "Rock",
        artist: "Imagine Dragons",
        language: "English",
        country: "USA"
    },
    {
        name: "Gangnam Style",
        genre: "K-pop",
        artist: "PSY",
        language: "Korean",
        country: "South Korea"
    },
    {
        name: "Señorita",
        genre: "Pop",
        artist: "Shawn Mendes & Camila Cabello",
        language: "English",
        country: "Canada/USA"
    },
    {
        name: "Someone Like You",
        genre: "Soul",
        artist: "Adele",
        language: "English",
        country: "UK"
    },
    {
        name: "Shape of My Heart",
        genre: "Pop",
        artist: "Backstreet Boys",
        language: "English",
        country: "USA"
    },
    {
        name: "Hips Don't Lie",
        genre: "Latin Pop",
        artist: "Shakira",
        language: "Spanish/English",
        country: "Colombia"
    },
    {
        name: "Perfect",
        genre: "Pop",
        artist: "Ed Sheeran",
        language: "English",
        country: "UK"
    },
    {
        name: "Bohemian Rhapsody",
        genre: "Rock",
        artist: "Queen",
        language: "English",
        country: "UK"
    },
    {
        name: "Hello",
        genre: "Pop",
        artist: "Adele",
        language: "English",
        country: "UK"
    },
    {
        name: "Levitating",
        genre: "Disco",
        artist: "Dua Lipa",
        language: "English",
        country: "UK"
    },
    {
        name: "Savage Love",
        genre: "Pop",
        artist: "Jason Derulo",
        language: "English",
        country: "USA"
    },
    {
        name: "Montero (Call Me By Your Name)",
        genre: "Pop",
        artist: "Lil Nas X",
        language: "English",
        country: "USA"
    },
    {
        name: "La Vie en Rose",
        genre: "Chanson",
        artist: "Édith Piaf",
        language: "French",
        country: "France"
    },
    {
        name: "Rolling in the Deep",
        genre: "Soul",
        artist: "Adele",
        language: "English",
        country: "UK"
    },
    {
        name: "Dance Monkey",
        genre: "Electropop",
        artist: "Tones and I",
        language: "English",
        country: "Australia"
    },
    {
        name: "Numb",
        genre: "Rock",
        artist: "Linkin Park",
        language: "English",
        country: "USA"
    }
];

$(document).ready(function() {
    const songGrid = $('#songGrid');
    songs.forEach(song => {
        const songCard = `
            <div class="col-md-3 song-card">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${song.name}</h5>
                        <p class="card-text"><strong>Artist:</strong> ${song.artist}</p>
                        <p class="card-text"><strong>Genre:</strong> ${song.genre}</p>
                        <p class="card-text"><strong>Language:</strong> ${song.language}</p>
                        <p class="card-text"><strong>Country:</strong> ${song.country}</p>
                    </div>
                </div>
            </div>
        `;
        songGrid.append(songCard);
    });
});

$(document).ready(function() {
    const songGrid = $('#songGrid');

    function displaySongs(songs) {
        songGrid.empty();
        songs.forEach(song => {
            const songCard = `
                <div class="col-md-3 song-card">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${song.name}</h5>
                            <p class="card-text"><strong>Artist:</strong> ${song.artist}</p>
                            <p class="card-text"><strong>Genre:</strong> ${song.genre}</p>
                            <p class="card-text"><strong>Language:</strong> ${song.language}</p>
                            <p class="card-text"><strong>Country:</strong> ${song.country}</p>
                        </div>
                    </div>
                </div>
            `;
            songGrid.append(songCard);
        });
    }

    async function fetchSpotifyToken() {
        try {
            const response = await $.ajax({
                url: '../php/get_spotify_token.php', // Path to your PHP script
                method: 'POST',
                dataType: 'json'
            });
            return response.access_token;
        } catch (error) {
            console.error('Error fetching Spotify token:', error);
        }
    }

    async function fetchSongs(query) {
        const token = await fetchSpotifyToken();
        if (!token) return;

        try {
            const response = await $.ajax({
                url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET',
                dataType: 'json'
            });

            const songs = response.tracks.items.map(item => ({
                name: item.name,
                genre: item.album.genres.join(', '), // Assuming genres are available in album object
                artist: item.artists.map(artist => artist.name).join(', '),
                language: 'Unknown', // Spotify API does not provide language information directly
                country: 'Unknown' // Spotify API does not provide country information directly
            }));

            displaySongs(songs);
        } catch (error) {
            console.error('Error fetching songs from Spotify:', error);
        }
    }

    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        if (searchTerm.length > 0) {
            fetchSongs(searchTerm);
        } else {
            songGrid.empty();
        }
    });
});

