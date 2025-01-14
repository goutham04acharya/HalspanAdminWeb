    @1.0
Feature: Halspan - Admin selects the time
As a Admin, I want to select to select the time format

    @create_question
    Scenario Outline: Admin views all types of field and adds file field from the add field section
        Given I am on the questionnaire management section
        Then I should see the add field
        Then I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the date/time button
        When I click the type as <type>
        When I click the time format as <time>
        When I click the save button for the questionnaire version for section 1

        Examples:
        | type   | time |
        | "time" | "12" |

    Scenario: Admin check the time in preview
        Given I am on the Questionnaire management sections
        When I click the preview button
        Then I should see the mobile preview
        When I select the time in the field
        Then I should see the time added to the section 1 page 1 question 1