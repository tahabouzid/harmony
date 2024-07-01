
$(document).ready(function() {
    
    function fetchLikedSongs() {
        $.ajax({
            url: '../php/likedSongs.php',
            type: 'GET',
            data: { fetchdetails: true },
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

    function displayResults(songs) {
        var resultsDiv = $('#songGrid');
        
     

        for (var i = 0; i <  songs.length; i++) {
            var item = songs[i];
            var card = $('<div class="song-card"></div>');
            card.append('<h2 class="card-title">' + item.name + ' <button id="likeButton' + i + '" class="like-button"><i class="fa fa-solid fa-heart"></i></button></h2>');
            card.append('<p class="card-artist">' + item.artists[0].name + '</p>');
            card.append('<img class="card-image" src="' + item.album.images[0].url + '" alt="' + item.name + '">');
            card.append('<audio controls class="audio-controls"><source src="' + item.preview_url + '" type="audio/mpeg">Your browser does not support the audio element.</audio>');


            // Append card to results container
            resultsDiv.append(card);
            resultsDiv.on('click', '.like-button', function() {
                // Toggle active class on like button
                $(this).find('i').toggleClass('fa-solid'); // Regular heart
                var card = $(this).closest('.song-card');
                card.toggleClass('gone');
        
                var itemIndex = $(this).attr('id').replace('likeButton', '');
                var item = songs[itemIndex];
                removeSongFromLiked(songs,item.id);
            });
    



        }

    }
  
    function removeSongFromLiked(songs, songId) {
      likedsongs=[]
      for(var i =0 ;i<songs.length;i++ ){
        likedsongs.push(songs.id)
      }

      var index = likedsongs.indexOf(songId);
      if (index !== -1) {
          songs.splice(index, 1);
      }


   var jsonData = {
            songIds: likedsongs
        };

      $.ajax({
        url: '../php/likedSongs.php',
        type: 'POST',
        contentType: 'application/json', // Specify content type as JSON
        data: JSON.stringify(jsonData), // Convert JSON object to string
        success: function(response) {
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });


    }

    fetchLikedSongs();
});
