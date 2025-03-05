    @1.0
Feature: Show Question Before Saving in Preview
As a admin, I want to see the questions inside the preview before saving.

    # @login
    @create_question
    Scenario: Admin adds textbox from the add field section
        Given I am on the questionnaire management section
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the textbox button
        Then I should see field settings
        And I should see the text box added to the section 1
        When I enter the label name for textbox as "Textbox."
        Then I should see the label name as "Textbox" updated in the section 1
        # When I enter the help text for textbox
        # Then I should see the help text updated in the section 1
        # When I enter the placeholder content for textbox
        # Then I should see the placeholder content updated in the section 1

        When I add a new question to the page 1 in section 1
        When I click the choice button
        Then I should see field settings
        # And I should see the choice field added to the section 1 page 1 question 2
        # When I enter the label name for choice
        # Then I should see the label name for choice updated in the section 1
        # When I enter the help text for choice
        # Then I should see the help text for choice updated in the section 1
        # When I enter the placeholder content for choice
        # Then I should see the placeholder content for choice updated in the section 1

    Scenario: Admin checks the question without saving
        Given I am on the Questionnaire management sections
        When I click the preview button
        Then I should see the mobile preview
        When I enter the text in textbox for section 1 page 1 question 1
        When I try the choice for section 1 page 1 question 2
        Then I should read a message stating that "No data found"