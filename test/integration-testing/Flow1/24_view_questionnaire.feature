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
    When I click on back to all questionnaire
    Then I should be redirected to the questionnaire listing screen
