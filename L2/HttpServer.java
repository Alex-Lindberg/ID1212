package L2;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.UUID;

public class HttpServer {

    public static final String HTTP_200_OK = "HTTP/1.1 200 OK";
    public static final String HTTP_404_NOTFOUND = "HTTP/1.1 404 Not Found\n\r\n\r";
    public static final String PATH = HttpServer.class.getPackageName() + "/public";
    public static final String SESSION_ID_REGEX = "Cookie: .*sessionId=[\\w-]{36}";
    public final ServerSocket server;
    private Map<String, Game> games = Collections.synchronizedMap(new HashMap<>());

    public HttpServer(ServerSocket server) {
        this.server = server;
        System.out.println("Server started");
    }

    public synchronized Game newGame(String key) {
        games.put(key, new Game(key));
        return games.get(key);
    }

    public synchronized Game getGame(String key) {
        return games.get(key);
    }

    /**
     * Controller
     */
    private class ClientHandler extends Thread {
        Socket socket;
        BufferedReader request;
        PrintStream response;

        public ClientHandler(Socket socket) throws IOException {
            this.socket = socket;
            this.request = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            this.response = new PrintStream(socket.getOutputStream());
        }

        @Override
        public void run() {
            try {
                String query = "", sessionId = "", gameResult = "";
                Game game = null;
                // Request
                String str = request.readLine();
                StringTokenizer tokens = new StringTokenizer(str, " ?");
                tokens.nextToken();
                String requestedDocument = tokens.nextToken();
                String token = tokens.nextToken();

                if (token.trim().matches("Guess=\\d+$")) {
                    query = token.substring(6).trim();
                }

                while ((str = request.readLine()) != null && str.length() > 0) {
                    if (sessionId.equals("") && str.matches(SESSION_ID_REGEX)) {
                        sessionId = str.substring(18).trim();
                        game = getGame(sessionId);
                        if (game.finished) {
                            game = newGame(sessionId);
                        }
                    }
                }
                socket.shutdownInput();

                if (game == null) {
                    sessionId = UUID.randomUUID().toString();
                    game = newGame(sessionId);
                }

                // Playing the game
                if (!query.equals("")) {
                    gameResult = game.guess(query);
                }

                // Response
                File file = new File(PATH + requestedDocument);
                if (requestedDocument.equals("/favicon.ico")) {
                    response.println(HTTP_200_OK + "\n\r\n\r");
                } else if (file.exists() && !file.isDirectory()) {
                    response.println(HTTP_200_OK);
                    response.println("Server: NumberGame");
                    if (requestedDocument.indexOf(".html") != -1) {
                        response.println("Content-Type: text/html");
                    }

                    response.println(String.format("Set-Cookie: sessionId=%s", sessionId));
                    response.println();
                    String html = View.createResponseHtml(file, gameResult);
                    response.println(html);

                } else {
                    response.println(HTTP_404_NOTFOUND);
                }
            } catch (FileNotFoundException fe) {
                System.err.println(fe.getMessage());
            } catch (IOException e) {
                System.err.println(e);
            } finally {
                try {
                    socket.shutdownOutput();
                    if (this.response != null) this.response.close();
                    if (this.request != null) this.request.close();
                    this.socket.close();
                } catch (IOException e2) {
                    System.out.format("Closing err: %s%n", e2.getMessage());
                }
            }
        }
    }

    public static void main(String[] args) throws IOException {
        try (ServerSocket server = new ServerSocket()) {
            String ipString = args.length > 0 ? args[0] : "127.0.0.1";
            int port = args.length > 1 ? Integer.parseInt(args[1]) : 8080;
            server.bind(new InetSocketAddress(ipString, port));

            HttpServer httpServer = new HttpServer(server);
            while (true) {
                Socket socket = server.accept();
                System.out.format("Client %s connected%n", socket.getRemoteSocketAddress().toString());
                ClientHandler handler = httpServer.new ClientHandler(socket);
                handler.start();
            }
        } catch(Exception e) {
            System.err.format("Exception: %s%n", e.getMessage());
        }
    }
}