package L1;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

public class ClientHandler implements Runnable {

    public final String handlerId;
    public  Socket client;
    private Server server;
    // private DataInputStream in;
    public DataOutputStream out;

    public ClientHandler(Server server, Socket client) {
        this.handlerId = Integer.toString(client.getPort());
        this.server = server;
        this.client = client;
        try {
            this.out = new DataOutputStream(client.getOutputStream());
        } catch (IOException e) {
            System.out.format("[ClientHandler %s]->constructor: IOException\n", this.handlerId);
            try {
                client.close();
            } catch (IOException e2) {
                System.out.format("[ClientHandler %s]->Failed to close handler socket\n", this.handlerId);
            }
        }
    }

    @Override
    public void run() {
        try(DataInputStream in = new DataInputStream(client.getInputStream())) {
            while (!client.isClosed() && !client.isOutputShutdown()) {
                if(in.available() > 0) {
                    String msg = in.readUTF();
                    if(msg.equals("\\q")) break;
                    System.out.print(msg);
                    server.broadcast(msg, this.handlerId);
                }
                Thread.sleep(250);
            }
            System.out.format("[ClientHandler %s]: Shutting down\n", this.handlerId);
        } 
        catch (IOException | InterruptedException e) {
            System.out.format("[ClientHandler %s]->run: Exception\n", this.handlerId);
            e.printStackTrace();
        }
    }
}
