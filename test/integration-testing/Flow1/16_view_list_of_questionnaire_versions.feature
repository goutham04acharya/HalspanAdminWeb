@1.0
Feature: Halspan - Admin - View the List of Version in the Questionnaire
    As an Admin, I must be able to view the list of Version in the questionnaire
    Conditions of Satisfaction
    There must be an option to sort by created at on descending fields in the listing screen 
    When click on a particular version i must be able to view the questionnaire associated.
    Infromation to be displayed
    Name
    Edited by
    Status
    Last Edited

  Scenario: Admin navigates to the list of versions in the questionnaire
    Given I am on the dashboard screen
    When I click on the internal name of a questionnaire from the list
    Then I should be redirected to the questionnaire version listing screen
    # * I should see the versions of the questionnaire
    Then I should see the version table header containing '["NAME", "LAST EDITED", "EDITED BY", "STATUS"]'
    When I click on back to all questionnaire
    Then I should be redirected to the questionnaire listing screen
