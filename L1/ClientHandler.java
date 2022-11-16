package L1;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.util.ArrayList;

public class ClientHandler implements Runnable {

    public final String handlerId;
    public Socket client;
    public DataOutputStream out;
    public DataInputStream in;
    private Server server;
    private ArrayList<ClientHandler> clients;

    public ClientHandler(Server server, Socket client, ArrayList<ClientHandler> clients) {
        this.handlerId = Integer.toString(client.getPort());
        this.server = server;
        this.clients = clients;
        this.client = client;
        try {
            this.out = new DataOutputStream(client.getOutputStream());
            this.in = new DataInputStream(client.getInputStream());
        } catch (IOException e) {
            System.out.format("[ClientHandler %s]->constructor: IOException\n", this.handlerId);
            server.disconnectClient(this);
        }
    }

    public void broadcast(String msg) {
        synchronized (this.clients) {
            for (ClientHandler client : this.clients) {
                try {
                    client.out.writeUTF(msg);
                } catch (Exception e) {
                    System.err.format("[ClientHandler %s]: Could not send to %s\n", this.handlerId, client.handlerId);
                    server.disconnectClient(client);
                }
            }
        }
    }

    @Override
    public void run() {
        try {
            while (!client.isClosed()) {
                if (in.available() > 0) {
                    String msg = in.readUTF();
                    if (msg.equals("\\q")) {
                        break;
                    }
                    System.out.print(msg);
                    broadcast(msg);
                }
                Thread.sleep(250);
            }
            System.out.format("[ClientHandler %s]: Shutting down\n", this.handlerId);
        } catch (IOException | InterruptedException e) {
            System.out.format("[ClientHandler %s]->run: Exception\n", this.handlerId);
            e.printStackTrace();
        }
    }
}
