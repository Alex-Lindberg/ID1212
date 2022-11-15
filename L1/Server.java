package L1;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Server
 */
public class Server {

    public int port;
    public static ExecutorService clientPool = Executors.newFixedThreadPool(3);
    public static ArrayList<ClientHandler> clients = new ArrayList<>();

    public Server() { new Server(8080); }
    public Server(int port) {
        this.port = port;
        listen();
    }

    public void broadcast(String msg, String senderId) {
        synchronized(clients) {
            for (ClientHandler client : clients) {
                try {
                    client.out.writeUTF(msg);
                } catch (Exception e) {
                    System.err.format("[Server]->broadcast: Could not send to %s\n", client.handlerId);
                    disconnectClient(client);
                }
            }
        }
    }

    public void disconnectClient(ClientHandler client) {
        try {
            synchronized(clients) {
                client.client.close();
                clients.remove(client);
                System.out.format("[Server]: %s disconnected\n", client.handlerId);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void listen() {
        try (ServerSocket ss = new ServerSocket(this.port)) {
            System.out.println("[Server]: Ready, waiting for clients");
            while(true) {
                Socket client = ss.accept();
                System.out.format("[Server]: %d connected\n", client.getPort());
                ClientHandler clientHandler = new ClientHandler(this, client);
                clients.add(clientHandler);
                clientPool.execute(clientHandler);
                // System.out.format("[Server]: Client Count=%d\n", clients.size());
                // System.out.format("[Server]->Pool:%s\n", clientPool.toString());
            }

        } catch (Exception e) {
            System.err.format("[System]: Error, %s", e.getMessage());
        }
    }

    public static void main(String[] args) {
        new Server();
    }
}