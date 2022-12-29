// package L3;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Enumeration;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLSessionContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.SSLContext;

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
        if (reader.ready())
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
                "FETCH 1 BODY[TEXT]",
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

    private static SSLContext sslContext(String password) throws Exception {
        KeyStore keystore = KeyStore.getInstance("PKCS12"); // rätt
        try (InputStream in = new FileInputStream("./alex.pfx")) {
            keystore.load(in, password.toCharArray());
        }

        // System.out.println(java.util.Arrays.asList(keystore.));
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm()); // fel
        keyManagerFactory.init(keystore, password.toCharArray());

        SSLContext sslContext = SSLContext.getInstance("SSL");
        sslContext.init(
                keyManagerFactory.getKeyManagers(),null, null);

        return sslContext;
    }

    public static void main(String[] args) throws Exception {
        
        SSLContext context = sslContext("password");
        // String[] cipher = { "TLS_DHE_RSA_WITH_AES_128_CBC_SHA256" };
        System.out.println(context.getProtocol());
        SSLSocketFactory sf = (SSLSocketFactory) context.getSocketFactory();
        HttpsURLConnection.setDefaultSSLSocketFactory(sf);
        String[] scs = sf.getSupportedCipherSuites();
        for (int i = 0; i < scs.length; i++) {
            System.out.println(scs[i]);
        }
        
        try (SSLSocket sslSocket = (SSLSocket) sf.createSocket(HOST, PORT);) {
            // sslSocket.setEnabledCipherSuites(scs);
            IMAPClient client = new IMAPClient(sslSocket);
            System.out.format("Connected with %s%n", sslSocket.getLocalAddress());
            client.run();
            client.close();
        } catch (IOException | InterruptedException e) {
            System.out.println("(main) Exception caught:");
            System.err.println(e);
        }
    }
}
