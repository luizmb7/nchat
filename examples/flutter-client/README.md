# Flutter Client Example

Este diretório contém um exemplo de implementação de cliente Flutter para o servidor WebSocket nchat.

## Instalação

Consulte o guia completo em `/docs/FLUTTER_GUIDE.md` para instruções detalhadas de integração.

## Exemplo Básico

```dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

class ChatService {
  late IO.Socket socket;

  void connect(String serverUrl) {
    socket = IO.io(serverUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.on('connect', (_) {
      print('Connected to server');
    });

    socket.on('message_received', (data) {
      print('New message: $data');
    });
  }

  void joinRoom(String roomId, String userId, String username) {
    socket.emit('join_room', {
      'roomId': roomId,
      'userId': userId,
      'username': username,
    });
  }

  void sendMessage(String roomId, String userId, String content) {
    socket.emit('send_message', {
      'roomId': roomId,
      'userId': userId,
      'content': content,
    });
  }

  void disconnect() {
    socket.disconnect();
  }
}
```

## Dependências Necessárias

Adicione ao seu `pubspec.yaml`:

```yaml
dependencies:
  socket_io_client: ^2.0.3+1
```

## Próximos Passos

1. Consulte `/docs/FLUTTER_GUIDE.md` para implementação completa
2. Veja `/docs/API_DOCUMENTATION.md` para detalhes dos eventos disponíveis
