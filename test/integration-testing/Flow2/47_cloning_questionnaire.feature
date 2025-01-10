@1.0
Feature: Halspan - Admin - Cloning questionnaire
    As an Admin, I want to Clone the questionnaire
    Condition of Satisfaction
    There should be an clone option in each questionnaire in the list
    when clicking on clone it should give the option to select the versions
    when selected the version of a new questionnaire is to be amended in the  Public name as questionnaire name -copy
    An success message to be present
    There should be an option to edit the questionnaire newly created.

  @create_question
  Scenario: Admin clones an existing version of a questionnaire
    Given I am on the questionnaire version listing screen
    When I save all the data inside the version about to be duplicated
    When I navigate to the questionnaire listing screen
    When I search for the recently created questionnaire
    When I click the clone button
    Then I should see a confirmation modal to select the version
    When I select the version of the questionnaire
    When I click the modal cancel button
    When I click the clone button
    Then I should see a confirmation modal to select the version
    When I select the version of the questionnaire
    When I click the modal close button
    When I click the clone button
    Then I should see a confirmation modal to select the version
    When I select the version of the questionnaire
    When I click the confirm duplicate button
    # Then I should see the new duplicated questionnaire created
    # Then I should see exact duplication of the selected version of a questionnaire
