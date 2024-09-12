@1.0
Feature: Halspan - Admin - View Specific Questionnaire
  As an Admin, I want to View specific Questionnaires
  Conditions of Satisfaction
  There must be an option to view the version of the specific questionnaires that has been selected.
  There must be an option to view the Name, Last Edited, Edited by and the Status.
  There must be an option to view  the public name. 
  There must be an option to view the Internal name.
  There must be an option to view the description.
  There must be an option to view the Questionnaire ID.
  There must be an option to view the Asset Type.
  There must be an option to view the Language.
  There must be an option to view if the particular questionnaire selected is a Non-Tag Questionnaire

  Scenario: Admin navigates to the list of versions in the questionnaire
    Given I am on the dashboard screen
    When I click on the internal name of a questionnaire from the list
    Then I should be redirected to the questionnaire version listing screen
    # * I should see the versions of the questionnaire
    Then I should see the version table header containing '["NAME", "LAST EDITED", "EDITED BY", "STATUS"]'

  @create_question
  Scenario: Admin edits the public, intenal name, description, language and asset Type
    Given I am on the questionnaire version listing screen
    When I enter Unique Public Name in the public name field
    * I enter internal name in the internal name field
    * I enter questionnaire description in the Description field as "test data results"
    * I select door from the asset type dropdown
    * I select "yes" from the questionnaire type options
    * I select british english from the language dropdown
    * I click the save settings button
    Then I should read a message stating that "Questionnaire updated successfully"
    When I click on back to all questionnaire
    Then I should be redirected to the questionnaire listing screen
