package L2;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class View {
    public static String createResponseHtml(File requestedDocument, String answer) {
        try (BufferedReader buffReader = new BufferedReader(new FileReader(requestedDocument.getAbsolutePath()));) {
            String line = "";
            StringBuilder sb = new StringBuilder();
            while (((line = buffReader.readLine()) != null)) {
                if (line.contains("<!--GUESS-->") && !answer.equals("")) {
                    sb.append(String.format("%s%n", answer));
                } else
                    sb.append(line + "\n");
            }
            return sb.toString();
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
        return "";
    }
}

