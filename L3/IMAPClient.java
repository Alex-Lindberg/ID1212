// package L3;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.security.KeyStore;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.SSLContext;

public class IMAPClient implements AutoCloseable {

    public static final String USERNAME = System.getenv("KTH_USERNAME");
    public static final String PASSWORD = System.getenv("KTH_PASSWORD");
    public static final String HOST = "webmail.kth.se";
    public static final int PORT = 993;
    private int A_num;

    private SSLSocket socket;
    private BufferedReader reader;
    private PrintWriter writer;

    public IMAPClient(SSLSocket socket) throws IOException {
        if (USERNAME == null)
            throw new AssertionError("KTH_USERNAME not set as environment variable");
        if (PASSWORD == null)
            throw new AssertionError("KTH_PASSWORD not set as environment variable");
    
        this.socket = socket;
        this.socket.setUseClientMode(true);
        this.socket.startHandshake();
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new PrintWriter(socket.getOutputStream());
        this.A_num = 0;
    }

    public void exchange(String message) throws IOException, InterruptedException {
        send(message);
        Thread.sleep(200);
        readAll();
    }

    public void send(String command) throws IOException {
        if (reader.ready())
            reader.readLine();
        String req = String.format("A%d %s\r", this.A_num, command);
        if (command.contains("LOGIN")) {
            System.out.println(req.replace(PASSWORD, "[PASSWORD]"));
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
        readAll();
        exchange(String.format("LOGIN %s %s", USERNAME, PASSWORD));
        exchange("EXAMINE INBOX");
        exchange("FETCH 1 BODY[TEXT]");
        exchange("LOGOUT");
    }

    @Override
    public void close() throws IOException {
        if(this.reader != null) this.reader.close();
        if(this.writer != null) this.writer.close();
        if(this.socket != null) this.socket.close();
    }

    private static SSLContext getSSLContext() throws Exception {
        String password = System.getenv("KEYSTORE_PASSWORD");
        if (password == null)
            throw new AssertionError("KEYSTORE_PASSWORD not set as environment variable");
        KeyStore keystore = KeyStore.getInstance("PKCS12");
        try (InputStream in = new FileInputStream("./alex.pfx")) {
            keystore.load(in, password.toCharArray());
        }
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm()); // fel
        keyManagerFactory.init(keystore, password.toCharArray());
        SSLContext sslContext = SSLContext.getInstance("SSL");
        sslContext.init(keyManagerFactory.getKeyManagers(),null, null);

        return sslContext;
    }

    public static void main(String[] args) throws Exception {
        SSLContext context = getSSLContext();
        SSLSocketFactory sf = (SSLSocketFactory) context.getSocketFactory();
        HttpsURLConnection.setDefaultSSLSocketFactory(sf);
        
        try (SSLSocket sslSocket = (SSLSocket) sf.createSocket(HOST, PORT);) {
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
