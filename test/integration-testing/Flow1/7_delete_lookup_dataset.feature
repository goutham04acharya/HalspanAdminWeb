@1.0
Feature: Halspan - Admin- Lookup data set
    As an Admin, I want to delete the unwanted Lookup dataset.
    Condition of satisfaction
    There must be an option for the Halspan Admin to remove the lookup dataset.
    The confirmation prompt must be displayed to the Halspan Admin before they delete the lookup dataset

  Scenario: Admin navigates to the lookup dataset page
    Given I am in questionnaire listing screen
    When I click the lookup dataset button
    Then I should be redirected to the lookup dataset listing screen

  Scenario: List all lookup dataset
    Given I am on the lookup dataset listing screen
    Then I should see the table header containing '["ID", "NAME", "ACTION"]'

  Scenario: Admin deletes the lookup dataset
    Given I am on the lookup dataset listing screen
    When I click the delete option for a lookup dataset
    Then I should see a confirmation prompt for deletion
    When I click the confirm button
    Then I should read success message for delete user
