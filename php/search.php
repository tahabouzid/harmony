<?php
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $client_id = '8cfda14f90b8409d8531c28b5d753662';
    $client_secret = '11d0f0397fdf46d89de96953e2948d6d';
    $searchQuery = $_GET['searchQuery'];
    $isGenre = $_GET['isGenre'] === 'true';
    $isCountry = $_GET['isCountry'] === 'true';

    // Function to get the access token from Spotify
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

    // Get the access token
    $accessToken = getAccessToken($client_id, $client_secret);

    // Spotify API search endpoint
    if ($isGenre) {
        $searchUrl = "https://api.spotify.com/v1/search?q=genre:" . urlencode($searchQuery) . "&type=track&limit=50";
    } elseif ($isCountry) {
        $searchUrl = "https://api.spotify.com/v1/search?q=market:" . urlencode($searchQuery) . "&type=track&limit=50";
    } else {
        $searchUrl = "https://api.spotify.com/v1/search?q=" . urlencode($searchQuery) . "&type=track&limit=50";
    }

    // Set up cURL to call Spotify API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $searchUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    // Return the response to JavaScript
    echo $response;
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method']);
}
?>
