package L2.backup;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.Semaphore;

public class Server {

    public ArrayList<Handler> handlers;
    public Semaphore lock;
    public View view;

    public Server() {
        this.handlers = new ArrayList<>();
        this.lock = new Semaphore(1, true);
        this.view = new View();
    }

    public void connect(Handler c) {
        try {
            lock.acquire();
            handlers.add(c);
        } catch (InterruptedException e) {
            Logger.log(e.getMessage());
        } finally {
            lock.release();
        }
    }

    /* View */
    private class View {
        File index;
        public View() {
            this.index = new File("./index.html");            
        }
        public void serve(Handler client) throws IOException {
            client.out.write("GET /" + index + "?guess=1"+" HTTP/1.1");
            client.out.write("User-Agent: Mozilla");
            client.out.flush();
        }
    }

    /* Model */
    private class Game {
    
        public String id;
        private int guesses = 0;
        private int secret;
    
        public Game(String id) {
            this.id = id;
            this.secret = new Random().nextInt(10 - 0) + 0;
        }
    
        public String guess(String g) {
            int guess = Integer.parseInt(g);
            if(guess == this.secret) 
                return "You made it!!!";
            if(guess < this.secret) 
                return String.format("Nope, guess higher\nYou have made %d guess(es)",guesses);
            else 
                return String.format("Nope, guess lower\nYou have made %d guess(es)",guesses);
        }
    }

    /* Controller */
    private class Handler extends Thread {
        public BufferedWriter out;
        public BufferedReader in;
        public String id;
        private Socket socket;
        public boolean connected;
        private Game game;

        public Handler(Socket socket) {
            this.socket = socket;
            this.id = Integer.toString(socket.getPort());
            this.game = new Game(this.id);
            try {
                this.out = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
                this.in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            } catch (IOException e) {
                System.out.format("[H %s]->constructor: IOException\n", this.id);
            }
            this.connected = true;
        }

        public void close() throws IOException, InterruptedException {
            this.out.close();
            this.socket.close();
            System.out.format("[H %s] closed\n", this.id);
        }

        @Override
        public void run() {
            try {
                String msg;
                view.serve(this);
                while (connected) {
                    if ((msg = in.readLine()) != null) {
                        System.out.print(msg); // prints msg on server
                        // Game logic stuf
                        // out.write("Crinkey");
                    }
                    Thread.sleep(50);
                }
                System.out.format("[H %s]: Shutting down\n", this.id);
                this.close();
            } catch (IOException | InterruptedException e) {
                System.out.format("[H %s]->run: Exception\n", this.id);
                e.printStackTrace();
                this.interrupt();
            }
        }
    }

    public static void main(String[] args) {
        try (ServerSocket ss = new ServerSocket()) {
            String ipString = args.length > 0 ? args[0] : "127.0.0.1";
            int port = args.length > 1 ? Integer.parseInt(args[1]) : 8080;
            ss.bind(new InetSocketAddress(ipString, port));
            
            Logger.setLogsFile("ServerLogs.txt");
            Logger.initExitHook(true);
            Logger.log(String.format("[S]: Host address %s\n", ss.getInetAddress().getHostName()));
            Server server = new Server();
            Logger.log("[S]: Ready, waiting for clients");

            while (true) {
                Socket client = ss.accept();
                Logger.log(String.format("[S]: %d connected\n", client.getPort()));
                Handler handler = server.new Handler(client);
                server.connect(handler);
                handler.start();
                Logger.log(String.format("[S]: Client Count=%d\n", server.handlers.size()));
            }
        } catch (Exception e) {
            Logger.log(String.format("[S]: Error, %s", e.getMessage()));
        }
    }
}