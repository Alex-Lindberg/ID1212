// package L3;

import java.util.Date;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public class SMTPClient {

    public static final String PASSWORD = System.getenv("KTH_PASSWORD");
    public static final String USERNAME = System.getenv("KTH_USERNAME");
    public static final String HOST = "smtp.kth.se";
    public static final int PORT = 587;
    public String email;

    private Session session;

    public SMTPClient(String email) {
        if (USERNAME == null)
            throw new AssertionError("KTH_USERNAME not set as environment variable");
        if (PASSWORD == null)
            throw new AssertionError("KTH_PASSWORD not set as environment variable");
        this.session = initSession(email);
        this.email = email;
        System.out.println("New session created");
    }

    public MimeMessage constructMessage(Session session, String recipient, String subject, String body)
            throws UnsupportedEncodingException, MessagingException {
        MimeMessage msg = new MimeMessage(session);

        msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
        msg.addHeader("format", "flowed");
        msg.addHeader("Content-Transfer-Encoding", "8bit");

        msg.setFrom(new InternetAddress(this.email));
        msg.setReplyTo(InternetAddress.parse(this.email, false));
        msg.setSubject(subject, "UTF-8");
        msg.setText(body, "UTF-8");
        msg.setSentDate(new Date());
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipient, false));

        return msg;
    }

    private Session initSession(String address) {
        Properties props = new Properties();
        props.put("mail.smtp.host", HOST);
        props.put("mail.smtp.socketFactory.port", PORT);
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", PORT);

        Authenticator auth = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USERNAME, PASSWORD);
            }
        };
        return Session.getDefaultInstance(props, auth);
    }

    public void send(String recipient, String subject, String message) throws UnsupportedEncodingException, MessagingException {
        MimeMessage msg = constructMessage(session, recipient, subject, message);
        Transport.send(msg);
        System.out.println("Successfully sent message");
    }

    public static void main(String[] args) throws Exception {
        try {
            SMTPClient client = new SMTPClient("alex5@kth.se");
            String recipient = "alex.lindberg@nvrmind.se";
            String message = "This is a message using the JavaMail api.";
            String sub = "Smtp mail using JavaMail.";

            client.send(recipient, sub, message);

        } catch (AssertionError | IOException | MessagingException e) {
            System.out.println("(main) Exception caught:");
            System.err.println(e);
        } catch (Exception e) {
            System.out.println("Unexpected exception occured: ");
            throw e;
        }
    }
}