package App;


public class GameModel {
    private final int secretNumber;
    private int numberOfGuesses;
    private boolean isGameOver = false;

    public GameModel() {
        secretNumber = (int) (Math.random() * 100);
        numberOfGuesses = 0;
        System.out.println("Secret number: " + secretNumber);
    }

    public String guess(int guess) {
        numberOfGuesses++;
        if (guess == secretNumber) {
            this.isGameOver = true;
            return "You made it!!! \n The secret number was " + secretNumber + " and you guessed it in "
                    + numberOfGuesses + " guesses";
        } else if (guess > secretNumber) {
            return "Nope, guess lower";
        } else {
            return "Nope, guess higher";
        }
    }

    public int getNumberOfGuesses() {
        return numberOfGuesses;
    }

    public boolean isGameOver() {
        return this.isGameOver;
    }

    public String getWelcomeMessage() {
        return "Welcome to the guessing game! Guess a number between 0 and 100";
    }
}