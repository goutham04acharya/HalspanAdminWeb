@1.0
Feature: Halspan - Admin - Option to Duplicate the Specific Questionnaire
    As an Admin, I must be able to duplicate the specific questionnaire
    Conditions of Satisfaction
    There must be an option to duplicate the specific questionnaire.
    A confirmation prompt must appear before the Admin tries to duplicate the specific questionnaire.
    There must be an option to choose the type of version the Admin wishes to duplicate and the questionnaire related to the version
    Once the questionnaire is duplicated, the initial questionnaire is set to draft state.
    Once the questionnaire is duplicated then it should be redirected to the version listing screen 
    When duplicating the specific questionnaire only one version can be selected
    There must be an option to enter the public name which is unique
    The unique ID generated must be unique and auto generated
    When the questionnaire which is in draft state is duplicated then the details related to the specific questionnaire must also be duplicated

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin edits the public, intenal name, description, language and asset Type
    Given I am on the questionnaire version listing screen
    When I click the duplicate button
    Then I should see a confirmation modal to select the version
    When I select the version of the questionnaire
    When I click the modal cancel button
    When I click the duplicate button
    Then I should see a confirmation modal to select the version
    When I select the version of the questionnaire
    When I click the modal close button
    When I click the duplicate button
    Then I should see a confirmation modal to select the version
    When I select the version of the questionnaire
    When I click the confirm duplicate button
    Then I should see the new version created
    When I click on back to all questionnaire
    Then I should be redirected to the questionnaire listing screen