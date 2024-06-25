<?php
session_start();
require 'db_connect.php';

$userId = $_SESSION['user_id'];

    $sql = "SELECT Preferences FROM Users WHERE user_id='$userId'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $likedSongs = json_decode($row['Preferences'], true);
        
        if (!empty($likedSongs)) {
            $client_id = '8cfda14f90b8409d8531c28b5d753662';
            $client_secret = '11d0f0397fdf46d89de96953e2948d6d';

            function getAccessToken($client_id, $client_secret) {
                $tokenUrl = 'https://accounts.spotify.com/api/token';
                $headers = [
                    'Authorization: Basic ' . base64_encode($client_id . ':' . $client_secret)
                ];
                $data = [
                    'grant_type' => 'client_credentials'
                ];

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $tokenUrl);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

                $response = curl_exec($ch);
                curl_close($ch);

                $response = json_decode($response, true);
                return $response['access_token'];
            }

            $accessToken = getAccessToken($client_id, $client_secret);
            $tracks = [];

            foreach ($likedSongs as $songId) {
                $trackUrl = "https://api.spotify.com/v1/tracks/$songId";
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $trackUrl);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Authorization: Bearer ' . $accessToken
                ]);

                $response = curl_exec($ch);
                curl_close($ch);

                $track = json_decode($response, true);
                if (isset($track['id'])) {
                    $tracks[] = $track;
                }
            }
        

            if ($_SERVER['REQUEST_METHOD'] == 'GET') {

          




            echo json_encode($tracks);
        }
    


      
else if 
($_SERVER['REQUEST_METHOD'] == 'POST') {
if($POST[ 'like']){
  $indexx = array_search($POST['songid'], $tracks);

// If the element is found, remove it
if ($indexx !== false) {
    unset($tracks[$indexx]);
}

}
else{
    array_push($tracks, $POST[$POST['songid']]);
}
$sql = "INSERT INTO Users (Preferences) VALUES ($tracks) WHERE user_id='$userId " ;
    $result = $conn->query($sql);

    $sql = "INSERT INTO tracks (name, artist, album_cover, preview_url) VALUES (?, ?, ?, ?)";
  
}


else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method']);
}




    
        }
    
    
    
    
    
    
    
    }

    
    
    else {

        echo json_encode(['status' => 'error', 'message' => 'No liked songs found']);
    }





 
?>
