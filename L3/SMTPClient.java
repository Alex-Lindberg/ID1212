import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.UnknownHostException;
import java.security.KeyStore;
import java.util.Arrays;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

public class SMTPClient implements AutoCloseable {


    public static final String USERNAME = System.getenv("SMTP_USERNAME");
    public static final String PASSWORD = System.getenv("SMTP_PASSWORD");
    public static final String PLAIN = System.getenv("SMTP_PLAIN");
    public static final String HOST = "smtp.kth.se";
    public static final int PORT = 587;
    private static final String _OK = "250 ";
    private static final String _READY = "220 ";
    private static final String _AUTH = "235";
    private static final String _END_DATA = "354 ";

    private Socket socket;
    private SSLSocket sslSocket;
    private BufferedReader reader;
    private PrintWriter writer;

    public SMTPClient(Socket socket) throws IOException {
        // socket.setUseClientMode(true);
        this.socket = socket;
        // this.socket.setNeedClientAuth(false);
        this.reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        this.writer = new PrintWriter(socket.getOutputStream());
    }

    public void send(String command) throws IOException, InterruptedException {
        Thread.sleep(500);
        if(reader.ready())
            reader.readLine();
        String req = String.format("%s\r", command);
        System.out.println("C: " + req);
        writer.println(req);
        writer.flush();
    }

    public void readAll() throws IOException {
        String str;
        while ((str = reader.readLine()) != null) {
            System.out.println("S: " + str);
            if (str.contains(_OK) || str.contains(_READY)|| str.contains(_AUTH) || str.contains(_END_DATA)) {
                break;
            }
        }
    }

    public void run() throws Exception {
        Thread.sleep(250);
        // readAll();
        send(String.format("EHLO %s", HOST));
        readAll();
        
        send("STARTTLS");
        readAll();
        SSLContext context = sslContext("password");
        startTLS(socket, context);
        
        send(String.format("EHLO %s", HOST));
        readAll();
        send(String.format("AUTH PLAIN %s", PLAIN));
        readAll();
        
        send("MAIL FROM:<alex5@kth.se>");
        readAll();
        send("RCPT TO:<alex.lindberg@nvrmind.se>");
        readAll();
        send("DATA");
        readAll();
        send("From: Alex\r\nTo: Me\r\nSubject: Smtp mail using sockets.\r\n\r\nThis is a message using smtp.\r\n.\r\n");
        readAll();
        send("QUIT");
        readAll();
    }

    @Override
    public void close() throws IOException {
        this.reader.close();
        this.writer.close();
        this.socket.close();
        this.sslSocket.close();
    }

    public void startTLS(Socket socket, SSLContext context) throws IOException, UnknownHostException, InterruptedException {
        // String[] cipher = { "TLS_DHE_RSA_WITH_AES_128_CBC_SHA256" };
        SSLSocketFactory socketFactory = (SSLSocketFactory) context.getSocketFactory();
        SSLSocket SSLsocket = (SSLSocket) socketFactory.createSocket(socket, socket.getInetAddress().getHostAddress(),
        socket.getPort(), true);
        this.writer = new PrintWriter(SSLsocket.getOutputStream());
        this.reader = new BufferedReader(new InputStreamReader(SSLsocket.getInputStream()));
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
        // SSLContext context = sslContext("password");
        // // String[] cipher = { "TLS_DHE_RSA_WITH_AES_128_CBC_SHA256" };
        // System.out.println(context.getProtocol());
        // SSLSocketFactory sf = (SSLSocketFactory) SSLSocketFactory.getDefault();
        // HttpURLConnection.setDefaultSocketFactory(sf);
        // try (SSLSocket sslSocket = (SSLSocket) sf.createSocket(HOST, PORT);
        try(Socket socket = new Socket(HOST, PORT);
            SMTPClient client = new SMTPClient(socket);) {

            System.out.format("Connected with %s%n", socket.getLocalAddress());
            client.run();
        } catch (IOException | InterruptedException e) {
            System.out.println("(main) Exception caught:");
            System.err.println(e);
        }
    }
}
