@1.0
Feature: Halspan - Admin - Create a Questionnaire using Text Box as a Field
    As an Admin, I want an option to create the questionnaire by using a Text box as a Field

    Conditions of Satisfaction:
    - There must be an option to enter the label name.
    - There must be an option to enter the Help text.
    - There must be an option to enter the Placeholder content.
    - There must be an option to enter the Default content.
    - There must be an option to enter the Field type (Single line, Multiline, Lookup).
    - When clicked on Lookup, there must be an option to import the lookup dataset.
    - There must be an option to select the format (Alpha, Numeric, and Alphanumeric).
    - There must be an option for the Admin to enter the minimum and maximum number of characters.
    - There must be an option to select if the data selected must be loaded or not.
    - There must be an option to select if the text field is read-only.
    - There must be an option to select if the text field is visible or not.
    - There must be an option to enable or disable the Remember allowed field.
    - There must be an option to enable or disable the Field mask.
    - There must be an option to enter the Admin field notes.
    - There must be an option to enter a custom regular expression.
    - If the pattern of the regular expression is not met, then an error message must be displayed from the Admin Panel.

    Information to be displayed:
    - Label
    - Help text
    - Placeholder content
    - Default content
    - Type (Single line, Multiline, Lookup)
    - Format (Alpha, Numeric, Alphanumeric)
    - Number of characters
    - Load from previous data
    - Read-only
    - Visible
    - Optional
    - Remember allowed
    - Field mask
    - Admin field notes

  @create_question
  Scenario: Admin views all types of field to create the form
    Given I am on the questionnaire management section
    Then I should see the add field
    And I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'

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
    When I select the type as "lookup"
    And I select a lookup data from the dropdown
    When I select the format as "alphanumeric"
    # Then I should see the format reflected on the text box section 1
    When I enter the minimum and maximum number of characters
    * I enter the admin field notes

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
    When I select the type as <type>
    * I select the format as <format>
    # Then I should see the format reflected on the text box section 1
    * I enter the minimum and maximum number of characters
    * I enter the admin field notes

    Examples:
      | type          | format         |
      | "single_line" | "alpha"        |
      | "multi_line"  | "numeric"      |
      | "multi_line"  | "alphanumeric" |