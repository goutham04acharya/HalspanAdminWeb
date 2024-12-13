@1.0
Feature: My Account - UVIK Portal
    As an Admin, I want to navigate to my account uvik portal
    Condition of satisfaction
    There must be an option to navigate to my account

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        * I enter valid password as "dApje7-nepnig-vibqyc"
        * I click the submit button
        Then I should be redirected to the questionnaire listing screen

    Scenario Outline: Admin adds invalid fields for the questionnaire
        Given I am on the dashboard screen
        When I click the my account button
        Then I should be redirected to my account 