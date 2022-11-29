package L2;

import java.util.Random;

public class Game {

    public String id;
    private int guesses = 0;
    private int secret;

    public Game(String id) {
        this.id = id;
        this.secret = new Random().nextInt(10 - 0) + 0;
    }

    public String guess(String g) {
        int guess = Integer.parseInt(g);
        if (guess == this.secret)
            return "You made it!!!";
        if (guess < this.secret)
            return String.format("Nope, guess higher\nYou have made %d guess(es)", guesses);
        else
            return String.format("Nope, guess lower\nYou have made %d guess(es)", guesses);
    }
}
