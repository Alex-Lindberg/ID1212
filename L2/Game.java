package L2;

import java.util.Random;

public class Game {

    public String id;
    public boolean finished = false;
    private int guesses = 0;
    private int secret;

    public Game(String id) {
        this.id = id;
        this.secret = new Random().nextInt(100);
    }

    public String guess(String g) {
        int guess = Integer.parseInt(g);
        guesses++;
        if (guess == this.secret) {
            this.finished = true;
            return String.format("You made it in %d guesses!!!", guesses);
        }
        if (guess < this.secret)
            return String.format("Nope, guess higher%nYou have made %d guess(es)", guesses);
        else
            return String.format("Nope, guess lower%nYou have made %d guess(es)", guesses);
    }
}
