@1.0
Feature: Halspan - Admin - Create a Questionnaire using Choice Box as a Field
    As an Admin, I want an option to create the questionnaire by using a Choice Field

    Conditions of Satisfaction:
    - There must be an option to enter the label name.
    - There must be an option to enter the Help text.
    - There must be an option to enter the Placeholder content.
    - There must be an option to enter the Default content.
    - There must be an option to enter the Field type (Single Choice, Multichoice, Dropdown).
    - There must be an option to select a choice when Dropdown is selected.
    - There must be an option to select a choice when Single Choice is selected.
    - There must be an option to select multiple choices when Multichoice is selected.
    - When clicked on Lookup, there must be an option to import the lookup dataset.
    - There must be an option to add the choices.
    - There must be an option for the Admin to enter the minimum and maximum number of characters.
    - There must be an option to select if the data selected must be loaded or not.
    - There must be an option to select if the text field is read-only.
    - There must be an option to select if the text field is visible or not.
    - There must be an option to enable or disable the Remember allowed field.
    - There must be an option to enable or disable the Field mask.
    - There must be an option to enter the Admin field notes.

    Information to be displayed:
    - Label
    - Help text
    - Placeholder content
    - Default content
    - Type (Single Choice, Multichoice, Dropdown)
    - Choices
    - Load from previous data
    - Read-only
    - Visible
    - Optional
    - Remember allowed
    - Field mask
    - Admin field notes

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "Auth@123"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin views all types of field and adds choice field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I click the choice button
    Then I should see field settings
    And I should see the choice field added to the section 1

  @create_question
  Scenario: Admin adds the label, help text and placeholder content
    Given I am on the questionnaire management section
    When I click the choice button
    Then I should see field settings
    When I enter the label name for choice
    Then I should see the label name updated in the section 1
    When I enter the help text for choice
    Then I should see the help text updated in the section 1
    When I enter the placeholder content for choice
    Then I should see the placeholder content updated in the section 1

  @create_question
  Scenario: Admin adds and deletes thes choices
    Given I am on the questionnaire management section
    When I click the choice button
    Then I should see field settings
    When I select the type as "single_choice"
    * I add the 4th choice field
    Then I should see the choice 4 added
    When I delete the 4th choice field
    Then I should see the 4th choice deleted

  @create_question
  Scenario Outline: Admin selects the type of choice
    Given I am on the questionnaire management section
    When I click the choice button
    Then I should see field settings
    When I select the type as <type>
    * I enter the text for choices as <choices>
    * I click on the choices based on <type>
    Then I should see the choices updated on the section 1

    Examples:
      | type            | choices                        |
      | "single_choice" | "Option 1, option 2, option 3" |
      | "multi_choice"  | "Choice 1, Choice 2, choice 3" |
      | "dropdown"      | "Item 1, Item 2, Item 3"       |

  @create_question
  Scenario: Admin saves the section with the changes
    Given I am on the questionnaire management section
    When I click the choice button
    Then I should see field settings
    When I enter the admin field notes
    * I click on save button for field settings
    Then I should read a message stating that "Field settings data updated successfully"
