// package L3;

import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.Folder;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.internet.MimeMultipart;
import javax.mail.Message;
import javax.mail.MessagingException;

import java.io.IOException;

public class IMAPClient {

    public static final String USERNAME = System.getenv("KTH_USERNAME");
    public static final String PASSWORD = System.getenv("KTH_PASSWORD");
    public static final String HOST = "webmail.kth.se";
    public static final int PORT = 993;

    private Session session;

    public IMAPClient(String email) throws IOException {
        if (USERNAME == null)
            throw new AssertionError("KTH_USERNAME not set as environment variable");
        if (PASSWORD == null)
            throw new AssertionError("KTH_PASSWORD not set as environment variable");
        this.session = initSession(email);
    }

    private Session initSession(String address) {
        Properties props = new Properties();
        props.put("mail.imap.host", HOST);
        props.put("mail.imap.socketFactory.port", PORT);
        props.put("mail.imap.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.imap.ssl.enable", "true");
        props.put("mail.imap.auth", "true");
        props.put("mail.imap.port", PORT);

        Authenticator auth = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USERNAME, PASSWORD);
            }
        };
        return Session.getDefaultInstance(props, auth);
    }

    public void readFirst() throws MessagingException, IOException {
        Store store = session.getStore("imap");
        store.connect(HOST, USERNAME, PASSWORD);

        Folder inbox = store.getFolder("INBOX");
        inbox.open(Folder.READ_ONLY);
        Message msg = inbox.getMessage(1);
        printMessage(msg);

        inbox.close(false);
        store.close();
    }

    private void printMessage(Message msg) throws MessagingException, IOException {
        System.out.format("Subject:  %s%n", msg.getSubject());
        System.out.format("From:  %s%n", msg.getFrom()[0]);
        Object content = msg.getContent();
        if(content instanceof MimeMultipart) {
            MimeMultipart mp = (MimeMultipart)content;
            mp.writeTo(System.out);
        } else 
            System.out.format("Text: %s%n", content);
    }

    public static void main(String[] args) {
        try {
            IMAPClient client = new IMAPClient("alex5@kth.se");
            client.readFirst();
        } catch (IOException | MessagingException e) {
            System.out.println("(main) Exception caught:");
            System.err.println(e);
        }
    }
}
