// package L3;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;
import java.security.KeyStore;
import java.util.Arrays;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

public class SMTPClient implements AutoCloseable {

    public static final String PLAIN = System.getenv("SMTP_PLAIN");
    public static final String EMAIL = System.getenv("KTH_EMAIL");
    public static final String HOST = "smtp.kth.se";
    public static final int PORT = 587;
    private static final String[] stopCodes = { "220 ", "235 ", "250 ", "354 " };

    private Socket socket;
    private SSLSocket sslSocket;
    private BufferedReader reader;
    private PrintWriter writer;

    public SMTPClient(Socket socket) throws IOException {
        if (PLAIN == null)
            throw new AssertionError("PLAIN not set as environment variable");
        if (EMAIL == null)
            throw new AssertionError("EMAIL not set as environment variable");
        this.socket = socket;
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new PrintWriter(socket.getOutputStream());
    }

    public void exchange(String message) throws IOException, InterruptedException {
        send(message);
        Thread.sleep(200);
        readAll();
    }

    public void send(String message) throws IOException {
        if (reader.ready())
            reader.readLine();
        String req = String.format("%s\r", message);
        if (message.contains("PLAIN")) { // obfuscate password
            System.out.println(req.replace(PLAIN, "[B64_PLAIN]"));
        } else
            System.out.println("C: " + req);
        writer.println(req);
        writer.flush();
    }

    public void readAll() throws IOException {
        String str;
        while ((str = reader.readLine()) != null) {
            System.out.println("S: " + str);
            if (Arrays.stream(stopCodes).anyMatch(str::contains)) {
                break;
            }
        }
    }

    public void run() throws Exception {
        Thread.sleep(250);
        exchange(String.format("EHLO %s", HOST));
        exchange("STARTTLS");

        // Encryption step
        SSLContext context = getSSLContext();
        createSSLSocket(socket, context);

        exchange(String.format("HELO %s", HOST));
        exchange(String.format("AUTH PLAIN %s", PLAIN));
        exchange(String.format("MAIL FROM:<%s>", EMAIL));
        exchange("RCPT TO:<alex.lindberg@nvrmind.se>");
        exchange("DATA");
        exchange("From: Alex\r\n" +
            "To: Me\r\n" +
            "Subject: Smtp mail using sockets.\r\n\r\n" +
            "This is a message using smtp.\r\n" +
            ".\r\n");
        exchange("QUIT");
    }

    public void createSSLSocket(Socket socket, SSLContext context)
            throws IOException, UnknownHostException, InterruptedException {
        SSLSocketFactory socketFactory = (SSLSocketFactory) context.getSocketFactory();
        SSLSocket SSLsocket = (SSLSocket) socketFactory.createSocket(socket, socket.getInetAddress().getHostAddress(),
                socket.getPort(), true);
        this.writer = new PrintWriter(SSLsocket.getOutputStream());
        this.reader = new BufferedReader(new InputStreamReader(SSLsocket.getInputStream()));
    }

    private static SSLContext getSSLContext() throws Exception {
        String password = System.getenv("KEYSTORE_PASSWORD");
        if (password == null)
            throw new AssertionError("KEYSTORE_PASSWORD not set as environment variable");
        KeyStore keystore = KeyStore.getInstance("PKCS12");
        try (InputStream in = new FileInputStream("./alex.pfx")) {
            keystore.load(in, password.toCharArray());
        }
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        keyManagerFactory.init(keystore, password.toCharArray());
        SSLContext sslContext = SSLContext.getInstance("SSL");
        sslContext.init(keyManagerFactory.getKeyManagers(), null, null);
        return sslContext;
    }

    @Override
    public void close() throws IOException {
        if (this.reader != null) this.reader.close();
        if (this.writer != null) this.writer.close();
        if (this.socket != null) this.socket.close();
        if (this.sslSocket != null) this.sslSocket.close();
    }

    public static void main(String[] args) throws Exception {
        try (Socket socket = new Socket(HOST, PORT);
                SMTPClient client = new SMTPClient(socket);) {

            System.out.format("Connected with %s%n", socket.getLocalAddress());
            client.run();
        } catch (IOException | InterruptedException e) {
            System.out.println("(main) Exception caught:");
            System.err.println(e);
        }
    }
}