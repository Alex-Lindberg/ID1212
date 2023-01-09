/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package db;

import App.Question;
import java.sql.*;
import java.util.*;

public class QuizDAO {

    private final String DATABASE_URL = "jdbc:postgresql://localhost:5432/test?user=alex&password=pass";
    private final String USERNAME = "alex";
    private final String PASSWORD = "pass";

    private Connection connection;

    private PreparedStatement validateUser;
    private PreparedStatement getUserId;
    private PreparedStatement getUserScore;
    private PreparedStatement getQuizQuestions;
    private PreparedStatement updateScore;

    public QuizDAO() throws SQLException {
        try {
            connect();
        } catch (SQLException error) {
            throw new SQLException("Connection to database failed", error);
        }
    }

    private void connect() throws SQLException {
        Properties properties = new Properties();
        properties.setProperty(USERNAME, PASSWORD);
        connection = DriverManager.getConnection(DATABASE_URL, properties);
        connection.setAutoCommit(false);
        preparedStatements();
    }

    public void updateUserScore(int points, int user_id, int quiz_id) throws SQLException {
        try {
            updateScore.setInt(1, points);
            updateScore.setInt(2, user_id);
            updateScore.setInt(3, quiz_id);
            updateScore.executeUpdate();
            connection.commit();
        } catch (SQLException e) {
            throw new SQLException("could not update user score", e);
        }
    }

    private void preparedStatements() throws SQLException {
        try {
            validateUser = connection.prepareStatement(
                    "SELECT * FROM users WHERE username = ? AND password = ?");

            getUserId = connection.prepareStatement(
                    "SELECT id FROM users WHERE username = ?");

            getUserScore = connection.prepareStatement(
                    "SELECT * FROM results WHERE user_id = ?");

            // need to be tested
            getQuizQuestions = connection.prepareStatement(
                    "SELECT questions.*\n" +
                            "FROM quizzes\n" +
                            "JOIN selector ON ? = selector.quiz_id\n" +
                            "JOIN questions ON selector.question_id = questions.id\n" +
                            "WHERE quizzes.id = ?");

            updateScore = connection.prepareStatement(
                    "UPDATE results " +
                            "SET score =  ? " +
                            "WHERE user_id = ? AND quiz_id = ?");

        } catch (SQLException error) {
            throw new SQLException("Could not prepare statements", error);
        }
    }

    public boolean userAuthenticated(String username, String password) throws SQLException {
        try {
            validateUser.setString(1, username);
            validateUser.setString(2, password);
            return validateUser.executeQuery().next();
        } catch (SQLException error) {
            throw new SQLException("Could not check if user exists", error);
        }
    }

    // Getters

    public HashMap<String, Integer> getUserScores(int userId) throws SQLException {
        HashMap<String, Integer> userScores = new HashMap<>();
        try {
            getUserScore.setInt(1, userId);
            ResultSet queryResults = getUserScore.executeQuery();
            while (queryResults.next()) {
                userScores.put(queryResults.getString("quiz_id"), queryResults.getInt("score"));
            }
            return userScores;
        } catch (SQLException error) {
            throw new SQLException("Could not get user score", error);
        }
    }

    public ArrayList<Question> getQuizQuestions(int quizId) throws SQLException {
        ArrayList<Question> questions = new ArrayList<>();
        try {
            getQuizQuestions.setInt(1, quizId);
            getQuizQuestions.setInt(2, quizId);
            ResultSet queryResults = getQuizQuestions.executeQuery();
            while (queryResults.next()) {
                questions.add(new Question(
                        queryResults.getString("text"),
                        queryResults.getString("answer"),
                        queryResults.getString("options"),
                        queryResults.getString("id")));
            }
            return questions;
        } catch (SQLException error) {
            throw new SQLException("Could not get quiz questions", error);
        }
    }

    public int getUserId(String username) throws SQLException {
        try {
            getUserId.setString(1, username);
            ResultSet queryResults = getUserId.executeQuery();
            if (queryResults.next()) {
                return queryResults.getInt("id");
            }
            return 0;
        } catch (SQLException error) {
            throw new SQLException("Could not get user id", error);
        }
    }

}