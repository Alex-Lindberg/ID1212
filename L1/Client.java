package L1;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.util.Scanner;

/**
 * Client for message server
 */
public class Client implements AutoCloseable {

    private Socket socket;
    public String addr;
    public Thread outThread;

    public Client(Socket socket) {
        this.socket = socket;
        this.addr = socket.getLocalAddress().toString();
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
                            out.writeUTF(String.format("[Client %s]: %s\n", addr, msg));
                        }
                        Thread.sleep(50);
                    }
                } catch (Exception e) {
                    System.out.println("[Client]->send: Exception");
                    e.printStackTrace();
                }
            }
        };
    }

    public Boolean isActive() {
        return !socket.isClosed();
    }

    @Override
    public void close() throws Exception {
        this.outThread.join();
        this.socket.close();
    }

    public static void main(String[] args) {
        String host = "";
        int port = 0;
        try {
            host = args[0];
            port = Integer.parseInt(args[1]);
        } catch (Exception _e) {
            System.out.println("Failed to parse args, java L1.Client [host] [port]");
            System.exit(0);
        }
        try (Socket socket = new Socket(host, port);
                DataInputStream in = new DataInputStream(socket.getInputStream());
                Client client = new Client(socket);) {
            System.out.format("[Client %s]: Connected, type \"\\q\" to exit\n", client.addr);

            while (client.isActive()) {
                if (in.available() > 0) {
                    String msg = in.readUTF();
                    System.out.format("%s", msg);
                }
                Thread.sleep(50);
            }
            Thread.sleep(100);
        } catch (Exception e) {
            System.out.println("[Client]->main: Exception");
        }
    }
}