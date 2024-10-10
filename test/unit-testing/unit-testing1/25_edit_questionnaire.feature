@1.0
Feature: Halspan - Admin - Edit the Questionnaire
    As an Admin, I want an option to edit the questionnaire created
    Conditions of Satisfaction
    There should be an option to edit the Public name.
    There must be an option to edit the Internal Name
    There must be an option to edit the description
    Once the questionnaire is edited and saved a new version of the questionnaire will be created which is in draft state
    Questionnaires cannot be edited while in ‘Testing’.
    Questionnaire can only be edited when in Draft State
    Each time the questionnaire is edited a new Incremental version will be created 
    There must be an option to display the information on who has edited and the updated time

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  Scenario: Admin navigates to the list of versions in the questionnaire
    Given I am on the dashboard screen
    When I click on the internal name of a questionnaire from the list
    Then I should be redirected to the questionnaire version listing screen
    # * I should see the versions of the questionnaire
    Then I should see the version table header containing '["NAME", "LAST EDITED", "EDITED BY", "STATUS"]'

  @create_question
  Scenario: Admin selects the version
    Given I am on the questionnaire version listing screen
    When I click on edit option
    Then I should see a pop up for selecting the version of the questionnaire
    When I select the version
    # When I click the cancel button
    When I click the modal cancel button
    When I click on edit option
    Then I should see a pop up for selecting the version of the questionnaire
    When I select the version
    When I click the confirm edit button 
    Then I should be redirected to the questionnaire management section of that version