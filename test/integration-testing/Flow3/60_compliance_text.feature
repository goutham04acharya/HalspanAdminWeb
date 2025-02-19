    @1.0
Feature: Halspan - Admin adds the condition in basic editor
As a admin I want to test the compliance logic basic editor

    @create_question
    Scenario Outline: Admin views all types of field and adds choice field from the add field section
        Given I am on the questionnaire management section
        Then I should see the add field
        Then I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the textbox button
        Then I should see field settings
        When I enter the label name for textbox
        Then I should see the label name updated in the section 1
        When I enter the help text for textbox
        Then I should see the help text updated in the section 1
        When I enter the placeholder content for textbox
        Then I should see the placeholder content updated in the section 1
        When I select the type as <type>
        When I select the format as <format>
        When I enter the minimum and maximum number of characters
        When I enter the admin field notes
        When I click the save button for the questionnaire version

        Examples:
        | type          | format  |
        | "single_line" | "alpha" |

    Scenario: Admin adds the basic editor includes compliance logic to the questionnaire
        Given I am on the Questionnaire management sections
        When I add a new question to the page 1 in section 1
        When I click the add compliance button
        When I enter the label name for compliance status
        When I click add default value button for compliance logic
        Then I click the save button for default value
        Then I should read a message stating that "This field is mandatory"
        When I set the compliance condition for "includes"
        Then I click the save button for default value
        And I should see the text basic editor compliance logic for "includes" in default value field

        When I click the preview button
        Then I should see the mobile preview
        When I enter the text for compliance in textbox for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "compliant"
        When I close the preview
        When I click the preview button
        Then I should see the mobile preview
        When I enter invalid text for compliance custom regular expression for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "non-compliant"
        And I should see the actions and reason for basic condition
        When I refresh the page
# 
        Scenario: Admin adds the basic editor does not includes compliance logic to the questionnaire
        Given I am on the Questionnaire management sections
        When I add a new question to the page 1 in section 1
        When I click the add compliance button
        When I enter the label name for compliance status
        When I click add default value button for compliance logic
        Then I click the save button for default value
        Then I should read a message stating that "This field is mandatory"
        When I set the compliance condition for "does not include"
        Then I click the save button for default value
        And I should see the text basic editor compliance logic for "does not include" in default value field

        When I click the preview button
        Then I should see the mobile preview
        When I enter the text for compliance in textbox for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "non-compliant"
        And I should see the actions and reason for basic condition
        When I close the preview
        When I click the preview button
        Then I should see the mobile preview
        When I enter invalid text for compliance custom regular expression for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "compliant"
        When I refresh the page

    Scenario: Admin adds the basic editor equal compliance logic to the questionnaire
        Given I am on the Questionnaire management sections
        When I add a new question to the page 1 in section 1
        When I click the add compliance button
        When I enter the label name for compliance status
        When I click add default value button for compliance logic
        Then I click the save button for default value
        Then I should read a message stating that "This field is mandatory"
        When I set the compliance condition for "equals"
        Then I click the save button for default value
        And I should see the text basic editor compliance logic for "equals" in default value field

        When I click the preview button
        Then I should see the mobile preview
        When I enter the text for compliance in textbox for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "compliant"
        When I close the preview
        When I click the preview button
        Then I should see the mobile preview
        When I enter invalid text for compliance custom regular expression for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "non-compliant"
        And I should see the actions and reason for basic condition
        When I refresh the page

    Scenario: Admin adds the basic editor not equal to compliance logic to the questionnaire
        Given I am on the Questionnaire management sections
        When I add a new question to the page 1 in section 1
        When I click the add compliance button
        When I enter the label name for compliance status
        When I click add default value button for compliance logic
        Then I click the save button for default value
        Then I should read a message stating that "This field is mandatory"
        When I set the compliance condition for "not equal to"
        Then I click the save button for default value
        And I should see the text basic editor compliance logic for "not equal to" in default value field

        When I click the preview button
        Then I should see the mobile preview
        When I enter the text for compliance in textbox for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "non-compliant"
        And I should see the actions and reason for basic condition
        When I close the preview
        When I click the preview button
        Then I should see the mobile preview
        When I enter invalid text for compliance custom regular expression for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "compliant"
        When I refresh the page


