package App;
import java.util.Arrays;
import java.util.Objects;

public class Question {

    private final String question;

    private final String answer;

    private final String[] options;

    private final String id;

    public Question(String question, String answer, String options, String id) {
        this.question = question;
        this.answer = answer;
        this.options = optionsArray(options);
        this.id = id;
    }

    private String[] optionsArray(String options) {
        String[] optionsArray = options.split(",");
        optionsArray[0] = optionsArray[0].substring(1);
        optionsArray[3] = optionsArray[3].substring(0, optionsArray[3].length() - 1);
        return optionsArray;
    }

    public String getQuestion() {
        return question;
    }

    public String[] getOptions() {
        return options;
    }

    @Override
    public String toString() {
        return "Question{" +
                "question='" + question + '\'' +
                ", answer='" + answer + '\'' +
                ", options='" + Arrays.toString(options) + '\'' +
                ", id='" + id + '\'' +
                '}';
    }

    public boolean isCorrectAnswer(String answer) {
        return Objects.equals(this.answer, answer);
    }
}