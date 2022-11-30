package Misc.L2;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class View {
    public static byte[] createResponseHtml(File requestedDocument, String guess) {
        try (BufferedReader buffReader = new BufferedReader(new FileReader(requestedDocument.getAbsolutePath()));) {
            String line = "";
            String answer = guess.equals("") ? guess.toString() : "";
            StringBuilder sb = new StringBuilder();
            while (((line = buffReader.readLine()) != null)) {
                if (line.contains("<!--GUESS-->") && !answer.equals("")) {
                    sb.append(String.format("Previous guess: %s%n", answer));
                } else
                    sb.append(line + "\n");
            }
            return sb.toString().getBytes(StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
        return "".getBytes(StandardCharsets.UTF_8);
    }
}
