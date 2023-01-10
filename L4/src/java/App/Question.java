package App;

import java.util.Arrays;

public class Question {

    private final String question;
    private final String answer;
    private final String[] options;
    private final String id;

    public Question(String question, String answer, String options, String id) {
        this.question = question;
        this.answer = answer;
        this.options = parseArray(options);
        this.id = id;
    }

    private String[] parseArray(String options) {
        System.out.println("Options :>>" + options);
        String[] a = options.split(",");
        a[0] = a[0].substring(1);
        a[a.length - 1] = a[a.length - 1].substring(0, a[a.length - 1].length() - 1);
        return a;
    }

    @Override
    public String toString() {
        return String.format("Question { question='%s', answer='%s', options='%s', id='%s' }",
                question,
                answer,
                Arrays.toString(options),
                id);
    }

    public boolean isCorrectAnswer(String answer) {
        return this.answer.equals(answer);
    }

    // Getters
    
    public String getQuestion() {
        return question;
    }

    public String[] getOptions() {
        return options;
    }
}