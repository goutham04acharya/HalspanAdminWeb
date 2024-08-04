@1.0
Feature: Halspan - Admin- Lookup data set
    As an Admin, I want to delete the unwanted Lookup dataset.
    Condition of satisfaction
    There must be an option for the Halspan Admin to remove the lookup dataset.
    The confirmation prompt must be displayed to the Halspan Admin before they delete the lookup dataset

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        * I enter valid password as "Auth@123"
        * I click the submit button
        Then I should be redirected to the questionnaire listing screen

    Scenario: Admin navigates to the lookup dataset page
        Given I am in questionnaire listing screen
        When I click the lookup dataset button
        Then I should be redirected to the lookup dataset listing screen

    Scenario: List all lookup dataset
        Given I am on the lookup dataset listing screen
        Then I should see the table header containing '["ID", "NAME", "ACTION"]'

    Scenario: Admin creates the lookup dataset
        Given I am on the lookup dataset listing screen
        When I click the create lookup dataset button
        Then I should see a popup window to create lookup dataset
        When I enter the name of the lookup dataset
        * I enter the choices in csv format
        * I click the create button
        Then I should read a message stating that "Created new lookup dataset successfully"

    Scenario: Admin cancels the lookup dataset deletion
        Given I am on the lookup dataset listing screen
        When I click the delete option for a lookup dataset
        Then I should see a confirmation prompt for deletion
        When I click the cancel button
        Then I should be redirected to the lookup dataset listing screen
        When I click the delete option for a lookup dataset
        Then I should see a confirmation prompt for deletion
        When I click the close button
        Then I should be redirected to the lookup dataset listing screen

    Scenario: Admin deletes the lookup dataset 
        Given I am on the lookup dataset listing screen
        When I click the delete option for a lookup dataset
        Then I should see a confirmation prompt for deletion
        When I click the confirm button
        Then I should read a message stating that "Lookup dataset deleted successfully"


