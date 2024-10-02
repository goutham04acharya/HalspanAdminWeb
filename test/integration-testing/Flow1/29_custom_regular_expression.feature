@1.0
Feature: Halspan - Admin - Regular expression for pattern matching
    As an Admin, I want to validate all the fields utilizing regular expressions for pattern matching.
    Condition of Satisfaction
    Regular expression for numeric field
    Regular expression for alpha numeric field
    Regular expression for alpha field
    Regular expression for customer regular expression.

  @create_question
  Scenario: Admin views all types of field to create the form
    Given I am on the questionnaire management section
    Then I should see the add field
    And I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'

  @create_question
  Scenario Outline: Admin adds the field values
    Given I am on the questionnaire management section
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
    When I check the field validation 
    When I select the type as <type>
    * I select the format as <format>
    When I enter the custom regular expression as "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
    When I enter the format error message as "Invalid PAN format"
    # Then I should see the format reflected on the text box section 1
    * I enter the minimum and maximum number of characters
    * I enter the admin field notes

    Examples:
      | type          | format                      |
      | "single_line" | "custom-regular-expression" |
