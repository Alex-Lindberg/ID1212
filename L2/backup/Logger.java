package L2.backup;

import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class Logger {
    private static String fileName = "Logs.txt";
    private static List<String> logs = new LinkedList<String>();
    private static final SimpleDateFormat sdf = new SimpleDateFormat("[HH:mm:ss]");

    public static void setLogsFile(String name) {
        fileName = name;
    }

    public static void log(String log) {
        log(log, true);
    }

    public static void log(String log, boolean print) {
        String message = sdf.format(new Date()) + " " + log;
        logs.add(message);
        if (print) {
            System.out.println(message);
        }
    }

    public static void save(boolean append) {
        try {
            if (logs != null && logs.size() > 0) {
                FileWriter fileWriterLog = new FileWriter("./L2/logs/" + fileName, append);
                BufferedWriter bufferedWriterLog = new BufferedWriter(fileWriterLog);

                for (String str : logs) {
                    bufferedWriterLog.write(str);
                    bufferedWriterLog.newLine();
                }

                bufferedWriterLog.write("---");
                bufferedWriterLog.newLine();
                bufferedWriterLog.newLine();
                bufferedWriterLog.close();
            }
        } catch (FileNotFoundException e) {
            System.out.println("Unable to open file '" + fileName + "'");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void clear() {
        logs.clear();
    }

    /* Shutdown hook. Will run when we interrupt the server */
    public static void initExitHook(Boolean append) {
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            @Override
            public void run() { Logger.save(append); }
        }));
    }
}
