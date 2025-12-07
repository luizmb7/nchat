# Flutter Integration Guide (GetX)

## 1. Setup

Add dependencies to `pubspec.yaml`:

```yaml
dependencies:
  get: ^4.6.5
  socket_io_client: ^2.0.0
```

## 2. WebSocket Controller

Create `lib/app/modules/chat/chat_controller.dart`.

```dart
import 'package:get/get.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class ChatController extends GetxController {
  late IO.Socket socket;
  final messages = <Map<String, dynamic>>[].obs;
  final isTyping = false.obs;

  // User info (mock)
  final userId = "user-123";
  final roomId = "room-general";

  @override
  void onInit() {
    super.onInit();
    connectToServer();
  }

  void connectToServer() {
    socket = IO.io('http://your-server-ip:3000',
      IO.OptionBuilder()
        .setTransports(['websocket'])
        .disableAutoConnect() // Optional
        .build()
    );

    socket.connect();

    socket.onConnect((_) {
      print('Connected');
      joinRoom();
    });

    socket.on('message_received', (data) {
      messages.add(data);
    });

    socket.on('history', (data) {
      if (data != null) {
        messages.value = List<Map<String, dynamic>>.from(data);
      }
    });

    socket.on('user_typing', (data) {
      // Handle typing indicator UI
      // if (data['userId'] != userId) ...
    });
  }

  void joinRoom() {
    socket.emit('join_room', {
      'roomId': roomId,
      'userId': userId,
      'username': 'FlutterUser',
    });
  }

  void sendMessage(String content) {
    socket.emit('send_message', {
      'roomId': roomId,
      'userId': userId,
      'content': content,
      'type': 'text'
    });
  }

  void sendTyping(boolean typing) {
     socket.emit('typing', {
      'roomId': roomId,
      'userId': userId,
      'isTyping': typing
    });
  }

  @override
  void onClose() {
    socket.dispose();
    super.onClose();
  }
}
```

## 3. UI Example

Simple UI using the controller.

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'chat_controller.dart';

class ChatPage extends GetView<ChatController> {
  final TextEditingController msgController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Chat Room")),
      body: Column(
        children: [
          Expanded(
            child: Obx(() => ListView.builder(
              itemCount: controller.messages.length,
              itemBuilder: (ctx, i) {
                final msg = controller.messages[i];
                return ListTile(
                  title: Text(msg['content']),
                  subtitle: Text(msg['user']?['username'] ?? 'Unknown'),
                );
              },
            )),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(child: TextField(
                  controller: msgController,
                  decoration: InputDecoration(hintText: "Type a message..."),
                  onChanged: (val) {
                    controller.sendTyping(val.isNotEmpty);
                  },
                )),
                IconButton(
                  icon: Icon(Icons.send),
                  onPressed: () {
                    if (msgController.text.isNotEmpty) {
                      controller.sendMessage(msgController.text);
                      msgController.clear();
                      controller.sendTyping(false);
                    }
                  },
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
```
