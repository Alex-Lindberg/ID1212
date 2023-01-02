package com.kth.assignment_4.assignment_4;

public class Model {
    private int secretNumber;
    private int numberOfGuesses = 0;
    private String session = null;
    private boolean isGameOver = false;

    public Model(String session) {
        this.session = session;
        secretNumber = (int) (Math.random() * 100);
        numberOfGuesses = 0;
        System.out.println("Secret number: " + secretNumber);
    }

    public String guess(int guess) {
        numberOfGuesses++;
        if (guess == secretNumber) {
            this.isGameOver = true;
            return "You made it!!!";
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
    public String getSession() {
        return session;
    }
}