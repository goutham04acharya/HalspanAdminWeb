    @1.0
Feature: Show Question Before Saving in Editors
As a admin, I want to see the questions inside the editor before saving.

    @create_question
    Scenario: Admin adds textbox from the add field section
        Given I am on the questionnaire management section
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the textbox button
        Then I should see field settings
        And I should see the text box added to the section 1
        When I enter the label name for textbox
        Then I should see the label name updated in the section 1
        When I enter the help text for textbox
        Then I should see the help text updated in the section 1
        When I enter the placeholder content for textbox
        Then I should see the placeholder content updated in the section 1

        When I click on add new section
        Then I should see the new section added
        When I add a new question to the page 1 in section 2
        When I click the textbox button
        Then I should see field settings
        And I should see the text box added to the section 2
        When I enter the label name for textbox
        Then I should see the label name updated in the section 2
        When I enter the help text for textbox
        Then I should see the help text updated in the section 2
        When I enter the placeholder content for textbox
        Then I should see the placeholder content updated in the section 2
        When I click the add conditional logic button
        Then I should see the advanced editor for textfield
        Then I should see the suggestions for questions
# 
  @create_question
  Scenario: Admin adds textbox from the add field section
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the textbox button
    Then I should see field settings
    And I should see the text box added to the section 1
    When I enter the label name for textbox
    Then I should see the label name updated in the section 1
    When I enter the help text for textbox
    Then I should see the help text updated in the section 1
    When I enter the placeholder content for textbox
    Then I should see the placeholder content updated in the section 1

    When I click on add new section
    Then I should see the new section added
    When I add a new question to the page 1 in section 2
    When I click the textbox button
    Then I should see field settings
    And I should see the text box added to the section 2
    When I enter the label name for textbox
    Then I should see the label name updated in the section 2
    When I enter the help text for textbox
    Then I should see the help text updated in the section 2
    When I enter the placeholder content for textbox
    Then I should see the placeholder content updated in the section 2

    When I click the add conditional logic button
    Then I should see the basic editor for textfield
    And I should see the questions in editor