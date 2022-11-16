package L1;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.net.SocketException;
import java.util.Scanner;

/**
 * Client for message server
 */
public class Client implements AutoCloseable {

    private Socket socket;
    public String name;
    public Thread outThread;

    public Client(Socket socket) {
        this.socket = socket;
        this.name = socket.getLocalSocketAddress().toString();
        this.outThread = new Thread(send());
        this.outThread.start();
    }

    private Runnable send() {
        return new Runnable() {
            @Override
            public void run() {
                try (DataOutputStream out = new DataOutputStream(socket.getOutputStream());
                        Scanner sc = new Scanner(System.in);) {
                    while (isActive()) {
                        if (sc.hasNext()) {
                            String msg = sc.nextLine();
                            if (msg.equals("\\q")) {
                                break;
                            }
                            out.writeUTF(String.format("[C %s]: %s\n", name, msg));
                        }
                    }
                } catch (SocketException se) {
                    System.err.println("[C] Server shut down, exiting");
                } catch (Exception e) {
                    System.out.format("[C]->send: Exception: %s\n", e.getMessage());
                    e.printStackTrace();
                } finally {
                    close();
                }
            }
        };
    }

    public Boolean isActive() {
        return !socket.isClosed();
    }

    @Override
    public void close() {
        try {
            this.socket.close();
        } catch ( IOException e) {
            System.err.format("[C]: Failed to close: %s\n", e.getMessage());
        }
    }

    public static void main(String[] args) {
        String host = "";
        int port = 0;
        try {
            host = args[0];
            port = Integer.parseInt(args[1]);
        } catch (Exception _e) {
            System.err.println("Failed to parse args, java L1.Client [host] [port]");
            System.exit(0);
        }
        try (Socket socket = new Socket(host, port);
                DataInputStream in = new DataInputStream(socket.getInputStream());
                Client client = new Client(socket);) {
            System.out.format("[C %s]: Connected, type \"\\q\" to exit\n", client.name);

            while (client.isActive()) {
                if (in.available() > 0) {
                    String msg = in.readUTF();
                    System.out.format("%s", msg);
                }
                Thread.sleep(10);
            }
        } catch (Exception e) {
            System.err.format("[C]->main: %s\n", e.getMessage());
        }
    }
}