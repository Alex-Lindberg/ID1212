package App;

public class GameModel {
    private boolean finished = false;
    private int guesses = 0;
    private int secret;

    public GameModel() {
        this.secret = (int) (Math.random() * 100);
        System.out.println("Secret number: " + secret);
    }

    public String guess(int guess) {
        guesses++;
        if (guess == this.secret) {
            this.finished = true;
            return String.format("You made it in %d guesses!!!", guesses);
        }
        if (guess < this.secret)
            return String.format("Wrong, Guess higher! You have made %d guess(es)", guesses);
        else
            return String.format("Wrong, Guess lower! You have made %d guess(es)", guesses);
    }

    public int getNumberOfGuesses() {
        return guesses;
    }

    public boolean isGameOver() {
        return this.finished;
    }

    public String getWelcomeMessage() {
        return "Welcome to the guessing game! Guess a number between 0 and 100";
    }
}