@1.0

Feature:Halspan - Admin - Log out of the Application

    Description

    As an Admin I want an option to Log out of the Application

    Conditions of Satisfaction

    There must be an option to log out from the Application.
    Once the Admin is logged out from the Application, it should be redirected to the log in screen
    Confirmation prompt should be displayed.

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        * I enter valid password as "dApje7-nepnig-vibqyc"
        * I click the submit button
        Then I should be redirected to the questionnaire listing screen

    Scenario: Admin cancels and close the logout
        Given I am on the dashboard screen
        When I click the log out button
        Then I should see a confirmation prompt stating to logout
        When I click the cancel button
        Then I should be on the dashboard screen
        When I click the log out button
        Then I should see a confirmation prompt stating to logout
        When I click the close button
        Then I should be on the dashboard screen

    Scenario: Admin successfully logs out and is redirected to the login screen
        Given I am on the dashboard screen
        When I click the log out button
        Then I should see a confirmation prompt stating to logout
        When I click the confirm button
        Then I should be redirected to the login screen
