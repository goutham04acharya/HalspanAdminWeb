    @1.0
Feature: Choice field choices should be shown in the advanced editor
Choice field choices should be shown in the advanced editor

    @create_question
    Scenario: Admin checks the preview response for conditional logic for textfield and choice field
        Given I am on the questionnaire management section
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the choice button
        Then I should see field settings
        When I enter the label name for choice for preview
        Then I should see the label name for choice updated in the section 1 page 1 question 1
        When I enter the help text for choice for preview
        Then I should see the help text for choice updated in the section 1 page 1 question 1
        When I enter the placeholder content for choice for preview
        Then I should see the placeholder content for choice updated in the section 1 page 1 question 1
        When I select the choice type as "single_choice"
        * I enter the text for choices as "Good, Satisfied, Unsatisfied"

        When I add a new question to the page 1 in section 1
        When I click the textbox button
        Then I should see field settings
        When I enter the label name for textbox for preview
        Then I should see the label name for textbox updated in the section 1 page 1 question 2
        When I enter the help text for textbox for preview
        Then I should see the help text for textbox updated in the section 1 page 1 question 2
        When I enter the placeholder content for textbox for preview
        Then I should see the placeholder content for textbox updated in the section 1 page 1 question 2
        When I select the type as "single_line"
        * I enter the minimum and maximum number of characters

        When I click the add conditional logic button
        Then I should see the advanced editor for textfield
        When I enter the conditional logic for choice field