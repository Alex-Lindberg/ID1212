package L2;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.StringTokenizer;

public class HttpServer {

    public static final String HTTP_OK = "HTTP/1.1 200 OK\r\n\r\n";
    public ServerSocket server;
    public ArrayList<ClientHandler> handlers = new ArrayList<>();

    public HttpServer(ServerSocket server) {
        this.server = server;
        System.out.println("Server started");
    }

    // private class View {
    //     public View(String path) {
    //     }
    // }

    private class ClientHandler extends Thread {
        Socket socket;
        String sessionId;
        BufferedReader request;
        PrintStream response;

        public ClientHandler(Socket socket) throws IOException {
            this.socket = socket;
            this.sessionId = socket.getRemoteSocketAddress().toString();
            this.request = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            this.response = new PrintStream(socket.getOutputStream());
        }

        @Override
        public void run() {
            try{
                String str = request.readLine();
                System.out.println(str);
                StringTokenizer tokens = new StringTokenizer(str, " ?");
                tokens.nextToken(); // The word GET
                String requestedDocument = tokens.nextToken();
                while ((str = request.readLine()) != null && str.length() > 0) {
                    System.out.println(str);
                }
                System.out.println("Request processed.");
                // while(true) {
                // response.println("HTTP/1.1 200 OK");
                // response.println("Server: Trash 0.1 Beta");
                // if (requestedDocument.indexOf(".html") != -1)
                //     response.println("Content-Type: text/html");

                // response.println(String.format("Set-Cookie: clientId=%s", sessionId));


                response.println("HTTP/1.1 200 OK");
                response.println("Server: Trash 0.1 Beta");

                if (requestedDocument.indexOf(".html") != -1)
                    response.println("Content-Type: text/html");

                if (requestedDocument.indexOf(".gif") != -1)
                    response.println("Content-Type: image/gif");

                response.println("Set-Cookie: clientId=" + sessionId);

                response.println();

                System.out.println("Requesting: " + requestedDocument);
                String path = HttpServer.class.getPackageName();
                File f = new File(path + requestedDocument);
                BufferedReader buffReader = new BufferedReader(new FileReader(f.getAbsolutePath()));
                
                String firstHalfHtml = "", secondHalfHtml = "", line = "", answer = "TEST";
                
                // while (((line = buffReader.readLine()) != null && !line.contains("/**"))) {
                //     firstHalfHtml += line + "\n";
                // }

                // while (!((line = buffReader.readLine()).contains("**/"))) {
                //     answer += line + "\n";
                // }

                while (((line = buffReader.readLine()) != null)) {
                    secondHalfHtml += line + "\n";
                }

                response.println(firstHalfHtml + answer + secondHalfHtml);
                buffReader.close();
                socket.shutdownOutput();  
                // }         
            } catch (IOException  e) {
                System.out.println("Giga error");
                System.err.println(e);
            } finally {
                try {
                    if (this.response != null) this.response.close();
                    if (this.request != null) this.request.close();
                    this.socket.close();
                } catch (IOException e2) {
                    System.out.format("Closing err: %s\n", e2.getMessage());
                }
            }
        }
    }

    public void initExitHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            @Override
            public void run() { 
                try {
                    Thread.sleep(30);
                    for (ClientHandler h : handlers) {
                        if ( h != null && h.isAlive())
                            h.interrupt();
                    }
                    System.out.println("\n---\nCleaned up handlers");
                } catch (InterruptedException e) { System.err.println(e); }
             }
        }));
    }

    public static void main(String args[]) throws IOException {
        try (ServerSocket server = new ServerSocket(8090)) {
            HttpServer httpServer = new HttpServer(server);
            httpServer.initExitHook();

            while (true) {
                Socket socket = server.accept();
                System.out.format("\nClient %s connected\n", socket.getRemoteSocketAddress().toString());
                ClientHandler handler = httpServer.new ClientHandler(socket);
                httpServer.handlers.add(handler);
                handler.start();
                // String line = "";
                // while(socket.isConnected()) {
                // if((line = request.readLine()) != null) {
                // System.out.println(line);
                // }
                // }
                // out.close();
                // request.close();
            }
        }
    }
}