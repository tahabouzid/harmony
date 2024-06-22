$(document).ready(function() {
    var songs = [];
    var currentOffset = 0;
    var query = '';
    const genres = [
        'pop', 'rock', 'hip-hop', 'jazz', 'classical', 'country', 'electronic', 'metal', 'heavy metal', 'blues', 'reggae',
        'latin', 'funk', 'soul', 'punk', 'disco', 'house', 'techno', 'trance', 'ambient', 'folk',
        'alternative', 'indie', 'grunge', 'gospel', 'opera', 'ska', 'dubstep', 'drum and bass', 'bluegrass', 'world',
        'afrobeat', 'swing', 'big band', 'new wave', 'electro', 'industrial', 'synthpop', 'k-pop', 'j-pop', 'c-pop',
        'r&b', 'trap', 'emo', 'hardcore', 'lo-fi', 'chillwave', 'vaporwave', 'shoegaze', 'post-punk', 'noise',
        'surf', 'garage', 'psych', 'krautrock', 'post-rock', 'math rock', 'space rock', 'drone', 'dream pop', 'trip hop',
        'breakbeat', 'hardstyle', 'gabber', 'grime', 'jungle', 'moombahton', 'tropical house', 'future bass', 'progressive',
        'deep house', 'nu-disco', 'synthwave', 'eurodance', 'chiptune', 'glitch hop', 'trap', 'twerk', 'reggaeton', 'dancehall',
        'soca', 'calypso', 'samba', 'bossa nova', 'tango', 'flamenco', 'fado', 'kizomba', 'zouk', 'bhangra', 'bollywood',
        'qawwali', 'cumbia', 'vallenato', 'merengue', 'bachata', 'salsa', 'mariachi', 'ranchera', 'norteño', 'tropicalia'
    ];

    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Brazil', 'Mexico',
        'Argentina', 'Chile', 'Colombia', 'Japan', 'South Korea', 'China', 'India', 'Russia', 'Netherlands', 'Sweden',
        'Norway', 'Denmark', 'Finland', 'Iceland', 'Ireland', 'Belgium', 'Switzerland', 'Austria', 'Portugal', 'Greece',
        'Turkey', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Ukraine', 'Israel', 'South Africa', 'Nigeria',
        'Kenya', 'Egypt', 'Morocco', 'New Zealand', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam'
    ];

    $('#moreButton').hide();

    $('#searchButton').click(function() {
        currentOffset = 0;
        songs = [];
        query = $('#searchInput').val().trim();
        searchSpotify(query, isGenre(query), isCountry(query));
    });

    $('#searchInput').keypress(function(event) {
        if (event.which == 13) { // Enter key pressed
            event.preventDefault();
            currentOffset = 0;
            songs = [];
            query = $('#searchInput').val().trim();
            searchSpotify(query, isGenre(query), isCountry(query));
        }
    });

    $('#moreButton').click(function() {
        currentOffset += 5;
        displayResults();
    });

    function searchSpotify(query, isGenre, isCountry) {
        if (query !== '') {
            $.ajax({
                url: '../php/search.php',
                type: 'GET',
                data: { searchQuery: query, isGenre: isGenre, isCountry: isCountry },
                success: function(response) {
                    console.log(response);
                    var results = JSON.parse(response);
                    var items = results.tracks.items;

                    for (var i = 0; i < items.length; i++) {
                        songs.push(items[i]);
                    }

                    displayResults();
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                }
            });
        }
    }

    function isGenre(query) {
        return genres.includes(query.toLowerCase());
    }

    function isCountry(query) {
        return countries.includes(query);
    }



    function displayResults() {
        var resultsDiv = $('#songGrid');
    
        if (currentOffset === 0) {
            resultsDiv.empty();
            $('#moreButton').hide();
        }
    
        for (var i = currentOffset; i < songs.length && i < currentOffset + 5; i++) {
            var item = songs[i];
            var card = $('<div class="song-card"></div>');
            card.append('<h2 class="card-title">' + item.name + ' <button id="likeButton' + i + '" class="like-button"><i class="fa fa-heart"></i></button></h2>');
            card.append('<p class="card-artist">' + item.artists[0].name + '</p>');
            card.append('<img class="card-image" src="' + item.album.images[0].url + '" alt="' + item.name + '">');
            card.append('<audio controls class="audio-controls"><source src="' + item.preview_url + '" type="audio/mpeg">Your browser does not support the audio element.</audio>');
    
            // Handle like button click
            (function(index) {
                var likeButton = $('#likeButton' + index);
                likeButton.click(function() {
                    // Toggle active class on like button
                    $(this).find('i').toggleClass('fa-solid'); // Solid heart
                    $(this).find('i').toggleClass('fa-regular'); // Regular heart

                    $(this).toggleClass('active');
    
                    // Update song popularity or perform other actions here
                    if (songs[index].popularity == 100) {
                        songs[index].popularity = item.popularity;
                    } else {
                        songs[index].popularity = 100;
                    }
    
                    // Call likeSong function to save the like state to server
                    likeSong(item.id, $(this).hasClass('active'));
                });
            })(i);
    
            // Append card to results container
            resultsDiv.append(card);
        }
    
        if (songs.length > currentOffset + 5) {
            $('#moreButton').show();
        } else {
            $('#moreButton').hide();
        }
    }
    

    function likeSong(songId,liked) {
        $.ajax({
            url: '../php/likeSong.php',
            type: 'POST',
            data: { songId: songId },
            success: function(response) {
                console.log('Song liked:', response);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }
    

});





