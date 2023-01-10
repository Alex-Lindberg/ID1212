/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package db;

import App.Question;
import static db.Statements.*;
import java.sql.*;
import java.util.*;

public class QuizDAO {

    /* Database credentials */
    private final String DATABASE_URL = "jdbc:postgresql://localhost:5432/test?user=alex&password=pass";
    private final String USERNAME = "alex";
    private final String PASSWORD = "pass";

    private Connection connection;

    private PreparedStatement validateUser;
    private PreparedStatement getUserId;
    private PreparedStatement getUserScore;
    private PreparedStatement getQuestions;
    private PreparedStatement updateScore;

    public QuizDAO() throws SQLException {
        try {
            connect();
            initPreparedStatements();
        } catch (SQLException error) {
            throw new SQLException("Connection to database failed", error);
        }
    }

    private void connect() throws SQLException {
        Properties properties = new Properties();
        properties.setProperty(USERNAME, PASSWORD);
        this.connection = DriverManager.getConnection(DATABASE_URL, properties);
        this.connection.setAutoCommit(false);
    }

    public void updateUserScore(int points, int user_id, int quiz_id) throws SQLException {
        try {
            this.updateScore.setInt(1, points);
            this.updateScore.setInt(2, user_id);
            this.updateScore.setInt(3, quiz_id);
            this.updateScore.executeUpdate();
            connection.commit();
        } catch (SQLException e) {
            throw new SQLException("could not update user score", e);
        }
    }

    private void initPreparedStatements() throws SQLException {
        try {
            this.validateUser = connection.prepareStatement(VALIDATE_USER);
            this.getUserId = connection.prepareStatement(GET_USER_ID);
            this.getUserScore = connection.prepareStatement(GET_USER_SCORE);
            this.getQuestions = connection.prepareStatement(GET_QUIZ_QUESTIONS);
            this.updateScore = connection.prepareStatement(UPDATE_SCORE);
        } catch (SQLException error) {
            throw new SQLException("Could not prepare statements", error);
        }
    }

    public boolean userAuthenticated(String username, String password) throws SQLException {
        try {
            this.validateUser.setString(1, username);
            this.validateUser.setString(2, password);
            return this.validateUser.executeQuery().next();
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
            getQuestions.setInt(1, quizId);
            getQuestions.setInt(2, quizId);
            ResultSet queryResults = getQuestions.executeQuery();
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
