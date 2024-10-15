@1.0
Feature: Halspan - Admin - Preview the Questionnaire
  As an Admin, I must be able to Preview the Questionnaire
  Conditions of Satisfaction
  There must be an option to view the specific questionnaire that has been completed
  There must be an option to submit the questionnaire once the preview is completed.
  There must be a pop up displayed when clicked on preview so that i can get the visual representation of the questionnaire 
  Information to be displayed
  Preview

  @create_question
  Scenario: Admin adds all the fields from the add field section
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the textbox button
    Then I should see field settings
    When I enter the label name for textbox for preview
    Then I should see the label name updated in the section 1 page 1 question 1
    When I enter the help text for textbox for preview
    Then I should see the help text updated in the section 1 page 1 question 1
    When I enter the placeholder content for textbox for preview
    Then I should see the placeholder content updated in the section 1 page 1 question 1
    When I click the save button for the questionnaire version

    When I add a new question to the page 1 in section 1
    When I click the choice button
    Then I should see field settings
    When I enter the label name for choice for preview
    Then I should see the label name updated in the section 1 page 1 question 2
    When I enter the help text for choice for preview
    Then I should see the help text updated in the section 1 page 1 question 2
    When I enter the placeholder content for choice for preview
    Then I should see the placeholder content updated in the section 1 page 1 question 2
    When I click the save button for the questionnaire version

    # When I add a new question to the page 1 in section 1
    # When I click the choice button
    # Then I should see field settings
    # When I enter the label name for choice for preview
    # Then I should see the label name updated in the section 1 page 1 question 2
    # When I enter the help text for choice for preview
    # Then I should see the help text updated in the section 1 page 1 question 2
    # When I enter the placeholder content for choice for preview
    # Then I should see the placeholder content updated in the section 1 page 1 question 2
    # When I click the save button for the questionnaire version

    When I click on add new page for section 1
    Then I should see the new page added 
    When I add a new question to the page 2 in section 1
    When I click the choice button
    Then I should see field settings
    When I enter the label name for choice for preview
    Then I should see the label name updated in the section 1 page 2 question 1
    When I enter the help text for choice for preview
    Then I should see the help text updated in the section 1 page 2 question 1
    When I enter the placeholder content for choice for preview
    Then I should see the placeholder content updated in the section 1 page 2 question 1
    When I click the save button for the questionnaire version

    When I add a new question to the page 2 in section 1
    When I click the date/time button
    And I should see the date/time field added to the section 1 page 2 question 2
    When I enter the label name for date/time for preview
    Then I should see the label name for date/time updated in the section 1 page 2 question 1
    When I enter the help text for date/time for preview
    Then I should see the help text for date/time updated in the section 1 page 2 question 1
    When I enter the placeholder content for date/time for preview
    Then I should see the placeholder content for date/time updated in the section 1 page 2 question 1
    
    # When I click on add new section
    # Then I should see the new section added

