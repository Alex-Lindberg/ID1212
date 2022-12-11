package L3;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Arrays;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

public class IMAPClient implements AutoCloseable {

    public static final String USERNAME = System.getenv("IMAP_USERNAME");
    public static final String PASSWORD = System.getenv("IMAP_PASSWORD");
    public static final String HOST = "webmail.kth.se";
    public static final int PORT = 993;
    private int A_num;

    private SSLSocket socket;
    private BufferedReader reader;
    private PrintWriter writer;

    public IMAPClient(SSLSocket socket) throws IOException {
        try {
            socket.setUseClientMode(true);
            socket.startHandshake();
        } catch (IOException e) {
            System.out.println("Handshake error");
            throw e;
        }
        System.out.println("Handshake Completed");
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new PrintWriter(socket.getOutputStream());
        this.A_num = 0;
    }

    public void send(String command) throws IOException, InterruptedException {
        Thread.sleep(250);
        if(reader.ready())
            reader.readLine();
        String req = String.format("A%d %s\r", this.A_num, command);
        if (command.contains("LOGIN")) { // dont print password
            String[] t = Arrays.copyOf(req.split(" "), req.split(" ").length - 1);
            System.out.println(String.join(" ", t) + " [myPassword]");
        } else
            System.out.println(req);
        writer.println(req);
        writer.flush();
    }

    public void readAll() throws IOException {
        String str;
        while ((str = reader.readLine()) != null) {
            System.out.println(str);
            if (str.contains(String.format("A%d OK", A_num)) || str.contains("* OK")) {
                break;
            }
        }
        this.A_num++;
    }

    public void run() throws IOException, InterruptedException {
        String[] commands = {
            String.format("LOGIN %s %s", USERNAME, PASSWORD),
            "EXAMINE INBOX",
            "FETCH 1:1 BODY[TEXT]",
            "LOGOUT"
        };
        readAll();
        for (String command : commands) {
            send(command);
            readAll();
        }
    }

    @Override
    public void close() throws IOException {
        this.reader.close();
        this.writer.close();
        this.socket.close();
    }

    public static void main(String[] args) {
        SSLSocketFactory sf = (SSLSocketFactory) SSLSocketFactory.getDefault();
        HttpsURLConnection.setDefaultSSLSocketFactory(sf);
        try (SSLSocket sslSocket = (SSLSocket) sf.createSocket(HOST, PORT);
                IMAPClient client = new IMAPClient(sslSocket);) {

            System.out.format("Connected with %s%n", sslSocket.getLocalAddress());
            client.run();
        } catch (IOException | InterruptedException e) {
            System.out.println("(main) Exception caught:");
            System.err.println(e);
        }
    }
}
