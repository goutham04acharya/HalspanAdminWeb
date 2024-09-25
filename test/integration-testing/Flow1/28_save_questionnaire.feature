@1.0
Feature: Halspan - Admin - Save Questionnaire
    As an Admin, I want an option to save the Questionnaires
    Condition of Satisfaction
    There must be an option to save the questionnaire once i have completed filling out the questionnaire
    Once saved, the questionnaire will be in the Draft state.

  @create_question
  Scenario: Admin views all types of field and saves the questionnaire
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    When I add a new question to the page 1 in section 1
    When I click the display button
    Then I should see field settings
    And I should see the display field added to the section 1 page 1 question 1
    When I click the save button
    Then I should read a message stating that "Questionnaire saved successfully"
