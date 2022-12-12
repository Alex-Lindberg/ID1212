/** 
 * SMTP Client.
 * RFC3207 -> https://www.rfc-editor.org/rfc/rfc3207#section-5 
 * 
 * @author Alex Lindberg
 * */
package L3;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Arrays;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

public class SMTPClient implements AutoCloseable {


    public static final String USERNAME = System.getenv("SMTP_USERNAME");
    public static final String PASSWORD = System.getenv("SMTP_PASSWORD");
    public static final String HOST = "smtp.kth.se";
    public static final int PORT = 587;
    private static final String _OK = "250 ";
    private static final String _READY = "220 ";

    private SSLSocket socket;
    private BufferedReader reader;
    private PrintWriter writer;

    public SMTPClient(SSLSocket socket) throws IOException {
        socket.setUseClientMode(true);
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new PrintWriter(socket.getOutputStream());
    }

    public void send(String command) throws IOException, InterruptedException {
        Thread.sleep(250);
        if(reader.ready())
            reader.readLine();
        String req = String.format("%s\r", command);
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
            if (str.contains(_OK) || str.contains(_READY)) {
                break;
            }
        }
    }

    public void run() throws IOException, InterruptedException {
        Thread.sleep(250);
        readAll();
        send(String.format("EHLO %s", HOST));
        readAll();
        send("STARTTLS");
        readAll();
        try {
            socket.startHandshake();
            System.out.println("Handshake Completed");
        } catch (IOException e) {
            System.out.println("Handshake error");
            throw e;
        }
        send(String.format("EHLO %s", HOST));
        readAll();
        send(String.format("AUTH LOGIN %s %s", USERNAME, PASSWORD));
        readAll();
        send("QUIT");
        readAll();
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
                SMTPClient client = new SMTPClient(sslSocket);) {

            System.out.format("Connected with %s%n", sslSocket.getLocalAddress());
            client.run();
        } catch (IOException | InterruptedException e) {
            System.out.println("(main) Exception caught:");
            System.err.println(e);
        }
    }
}
