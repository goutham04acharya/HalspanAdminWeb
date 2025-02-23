    @1.0
Feature: Halspan - Admin adds the condition in basic editor for number
As a admin I want to test the compliance logic basic editor for number

    @create_question
    Scenario: Admin adds date/time from the add field section
        Given I am on the questionnaire management section
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the number button
        And I should see the number field added to the section 1 page 1 question 1
        When I enter the label name for number
        Then I should see the label name for number updated in the section 1
        When I enter the help text for number
        Then I should see the help text for number updated in the section 1
        When I enter the placeholder content for number
        Then I should see the placeholder content for number updated in the section 1
        When I click the save button for the questionnaire version

    Scenario: Admin adds the basic editor includes compliance logic to the questionnaire
        Given I am on the Questionnaire management sections
        When I add a new question to the page 1 in section 1
        When I click the add compliance button
        When I enter the label name for compliance status
        When I click add default value button for compliance logic
        Then I click the save button for default value
        Then I should read a message stating that "This field is mandatory"
        When I set the compliance condition for number "equals"
        Then I click the save button for default value
        And I should see the number basic editor compliance logic for "equals" in default value field

        When I click the preview button
        Then I should see the mobile preview
        When I enter the number for compliance in number field for section 1 page 1 question 1 with condition "equals"
        When I click the next button
        Then I should see the compliance status as "compliant"
        When I close the preview
        When I click the preview button
        Then I should see the mobile preview
        When I enter invalid number for compliance for section 1 page 1 question 1 with condition "equals"
        When I click the next button
        Then I should see the compliance status as "non-compliant"
        And I should see the actions and reason for basic condition
        When I refresh the page
