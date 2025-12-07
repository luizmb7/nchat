<?php

require __DIR__ . '/vendor/autoload.php';

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version2X;

// NOTE: You need to install elephant.io:
// composer require wisembly/elephant.io

$url = 'http://localhost:3000';

$client = new Client(new Version2X($url));

try {
    $client->initialize();
    
    // Join Room
    $client->emit('join_room', [
        'roomId' => 'room-php-test',
        'userId' => 'php-user-1',
        'username' => 'PHPClient'
    ]);

    // Send Message
    $client->emit('send_message', [
        'roomId' => 'room-php-test',
        'userId' => 'php-user-1',
        'content' => 'Hello from PHP!',
        'type' => 'text'
    ]);

    $client->close();
    
    echo "Message sent successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
