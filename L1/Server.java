package L1;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.concurrent.Semaphore;

public class Server {

    public ArrayList<Handler> handlers;
    public Semaphore lock;

    public Server() {
        this.handlers = new ArrayList<>();
        this.lock = new Semaphore(1, true);
    }

    public void broadcast(String msg) {
        try {
            lock.acquire();
            for (Handler handler : this.handlers) {
                try {
                    handler.out.writeUTF(msg);
                } catch (IOException ioe) {
                    System.out.format("[S] Failed to broadcast to %s\n", handler.id);
                    handler.connected = false;
                }
            }
        } catch (InterruptedException ie) {
            System.out.println("[S] Broadcast interrupted");
        } finally {
            lock.release();
        }
    }

    public void connect(Handler c) {
        try {
            lock.acquire();
            handlers.add(c);
        } catch (InterruptedException e) {
            System.out.format("[S, H:%s] connect interrupted: %s\n", c.id, e.getMessage());
        } finally {
            lock.release();
        }
    }

    public void disconnect(Handler c) {
        try {
            lock.acquire();
            c.close();
            handlers.remove(c);
            System.out.format("[S]: Client Count=%d\n", handlers.size());
        } catch (InterruptedException | IOException e) {
            System.out.format("[S, H:%s] disconnect interrupted: %s\n", c.id, e.getMessage());
        } finally {
            lock.release();
        }
    }

    private class Handler extends Thread {
        public DataOutputStream out;
        public DataInputStream in;
        public String id;
        private Socket socket;
        public boolean connected;

        public Handler(Socket socket) {
            this.socket = socket;
            this.id = Integer.toString(socket.getPort());
            try {
                this.out = new DataOutputStream(socket.getOutputStream());
                this.in = new DataInputStream(socket.getInputStream());
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
                while (connected) {
                    if (in.available() > 0) {
                        String msg = in.readUTF();
                        if (msg.equals("\\q")) {
                            break;
                        }
                        System.out.print(msg); // prints msg on server
                        broadcast(msg);
                    }
                    Thread.sleep(250);
                }
                System.out.format("[H %s]: Shutting down\n", this.id);
                disconnect(this);
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

            System.out.format("[S]: Host address %s\n", ss.getInetAddress().getHostAddress());
            Server server = new Server();
            System.out.println("[S]: Ready, waiting for clients");
            while (true) {
                Socket client = ss.accept();
                System.out.format("[S]: %d connected\n", client.getPort());
                Handler handler = server.new Handler(client);
                server.connect(handler);
                handler.start();
                System.out.format("[S]: Client Count=%d\n", server.handlers.size());
            }
        } catch (Exception e) {
            System.err.format("[S]: Error, %s", e.getMessage());
        }
    }
}
