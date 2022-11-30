package Misc.L2;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.sun.net.httpserver.*;

public class TestServer {
    
    private static Map<String, Game> games = Collections.synchronizedMap(new HashMap<>());

    public static synchronized Game newGame(String key) {
        games.put(key, new Game(key));
        return games.get(key);
    }

    public static synchronized Game getGame(String key) {
        return games.get(key);
    }

    public static String readInStream(InputStream inputStream) throws IOException {
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        for (int length; (length = inputStream.read(buffer)) != -1; ) {
            result.write(buffer, 0, length);
        }
        return result.toString("UTF-8");
    }

    private static class Controller implements HttpHandler {
        public void handle(HttpExchange t) throws IOException {
            Headers headers = t.getRequestHeaders();

            // Session cookie
            String sessionId;
            String res = "";
            List<String> sHeaders;
            Game game;
            if((sHeaders = headers.get("Cookie")) != null) {
                sessionId = sHeaders.get(0).substring(10);
                game = getGame(sessionId);
                if(game.finished) {
                    game = newGame(sessionId);
                }
            } else {
                sessionId = UUID.randomUUID().toString();
                game = newGame(sessionId);
            }
            System.out.println(game.id);

            // Guess
            String query = t.getRequestURI().getQuery();
            System.out.println(query);
            if(query != null) {
                res = game.guess(query.substring(6));
                System.out.println(res);
            }

            // List<String> lines = Files.readAllLines(Paths.get("./index.html"), StandardCharsets.UTF_8);
            File file = new File("index.html");
            byte[] body = View.createResponseHtml(file, res);
            Headers resHeaders = t.getResponseHeaders();
            resHeaders.set("Server", "NumberGame");
            resHeaders.set("Content-Type", "text/html");
            resHeaders.set(("Set-Cookie"), "sessionId="+sessionId);
            t.sendResponseHeaders(200, 0);
            try (OutputStream os = t.getResponseBody()) {
                os.write(body);
            }
        }
    }

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8090), 0);
        // Filter Favicon
        server.createContext("/favicon.ico", t -> t.sendResponseHeaders(200, 0));
        server.createContext("/index.html", new Controller());
        server.createContext("/", new Controller());

        server.setExecutor(null);
        server.start();
        System.out.println("Server started");
    }
}