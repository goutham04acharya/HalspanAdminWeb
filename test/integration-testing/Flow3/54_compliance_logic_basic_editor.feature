@1.0
Feature: Halspan - Admin adds the condition in basic editor
    As a admin I want to test the compliance logic basic editor

   @create_question
    Scenario Outline: Admin views all types of field and adds choice field from the add field section
        Given I am on the questionnaire management section
        Then I should see the add field
        * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
        * I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the choice button
        Then I should see field settings
        And I should see the choice field added to the section 1 page 1 question 1
        When I enter the label name for choice
        Then I should see the label name for choice updated in the section 1
        When I enter the help text for choice
        Then I should see the help text for choice updated in the section 1
        When I enter the placeholder content for choice
        Then I should see the placeholder content for choice updated in the section 1
        When I select the choice type as <type>
        * I enter the text for choices as <choices>
        Then I should see the choices updated on the section 1
        When I click the save button for the questionnaire version

        Examples:
            | type            | choices          |
            | "single_choice" | "Yes, No, Maybe" |

    Scenario: Admin adds the basic editor compliance logic to the questionnaire
        Given I am on the Questionnaire management sections
        # When I add a new question to the page 1 in section 1
        When I click the add compliance button
        When I enter the label name for compliance status
        When I click add default value button for compliance logic
        Then I click the save button for default value
        Then I should read a message stating that "This field is mandatory"
        When I add more then ten or conditions
        Then I should read a message stating that "Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor."
        When I remove the added or the conditions 
        When I click the cancel button
        When I click add default value button for compliance logic
        When I add more then ten add conditions
        Then I should read a message stating that "Oh no! To use the basic editor you'll have to use a simpler expression. Please go back to the advanced editor."
        When I remove the added and the conditions 
        When I click the cancel button
        When I click add default value button for compliance logic
        When I add more then ten else if conditions
        When I remove the added else if the conditions 
        When I click the cancel button
        When I click add default value button for compliance logic
        When I select the condition from basic editor
        Then I click the save button for default value
        And I should see the basic editor compliance logic in default value field
        When I click the save button for the questionnaire version

        When I click the preview button
        Then I should see the mobile preview
        When I select the choice as "Yes" in choice field for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "compliant"
        When I close the preview
        When I click the preview button
        Then I should see the mobile preview
        When I select the choice as "No" in choice field for section 1 page 1 question 1
        When I click the next button
        Then I should see the compliance status as "non-compliant"
        And I should see the actions and reason for basic condition
