@1.0
Feature: Halspan - Admin - Log in to the Application
        As an admin, I want an option to log in so that I can access the application.
        Conditions of Satisfaction
        I should be able to log in using my registered email address and password.
        If the admin enters an invalid email address or password, an appropriate error message should be displayed.
        Once the admin enters the valid email address and password he gets access to the application.
        There must be an option to choose the Remember me so that the user will be able to get the details when clicking on it
        When Admin clicks the Forgot Password it must be redirected to the portal and then they will be able to change the password
        Once the admin is logged in then he must be redirected to the questionnaire listing screen

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        * I enter valid password as "Auth@123"
        * I click the submit button
        Then I should be redirected to the questionnaire listing screen