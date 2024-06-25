

$(document).ready(function() {



function fetchLikedSongs() {
    $.ajax({
        url: '../php/likedSongs.php',
        type: 'GET',
        data:{ fetchdetails:true,
        },
        success: function(response) {
            console.log(response);
            var results = JSON.parse(response);
            displayResults(results);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
fetchLikedSongs();

function displayResults() {
    var resultsDiv = $('#songGrid');
    if (currentOffset === 0) {
        resultsDiv.empty();
        $('#moreButton').hide();
    }for (var i = currentOffset; i < songs.length && i < currentOffset + 5; i++) {
        var item = songs[i];
        var card = $('<div class="song-card"></div>');
        card.append('<h5 class="card-title">' + item.name + '</h5>');
        card.append('<p class="card-artist">' + item.artists[0].name + '</p>');
        card.append('<img class="card-image" src="' + item.album.images[0].url + '" alt="' + item.name + '">');
        card.append('<audio controls class="audio-controls"><source src="' + item.preview_url + '" type="audio/mpeg">Your browser does not support the audio element.</audio>');
    
        // Create like button
        var likeButton = $('<button class="like-button"><i class="fa-sharp fa-thin fa-star"></i></button>');
        if (item.liked) {
            likeButton.addClass('active');
        }
    
        // Handle like button click
        likeButton.click(function() {
            var index = $(this).closest('.song-card').index();
            songs[index].liked = !songs[index].liked;
            $(this).toggleClass('active');
            console.log('Song ' + songs[index].name + ' is ' + (songs[index].liked ? 'liked' : 'unliked'));
        });
    
        // Append like button to card
        card.append(likeButton);
    
        // Append card to results container
        resultsDiv.append(card);
    }

    if (songs.length > currentOffset + 5) {
        $('#moreButton').show();
    } else {
        $('#moreButton').hide();
    }
}})