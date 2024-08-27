Feature: Halspan - Admin - Create a Questionnaire using Date/Time as a Field
  As an Admin, I want an option to create a Question/Field by using a Date/Time field
  Conditions of Satisfaction
  There must be an option to enter the label name
  There must be an option to enter the Help text
  There must be an option to enter the Placeholder content
  There must be an option to enter the Default content.
  There must be an option to choose the type ( Date, Time, Date and Time)
  There must be an option to display the default date field
  There must be an option for the Admin to choose the time format
  There must be an option to select if the data selected must be loaded or not
  There must be an option to select if the Date/Time is read only
  There must be an option to select if the Date/Time is visible or not.
  There must be an option to enable or disable the Remember allowed field
  There must be an option to enable or disable the Field mask
  There must be an option to enter the Admin field notes

  @create_question
  Scenario: Admin views all types of field and adds date/time field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I click the date/time button
    Then I should see field settings
    And I should see the date/time field added to the section 1

  @create_question
  Scenario: Admin adds the label, help text and placeholder content
    Given I am on the questionnaire management section
    When I click the date/time button
    Then I should see field settings
    When I enter the label name for date/time
    Then I should see the label name for date/time updated in the section 1
    When I enter the help text for date/time
    Then I should see the help text for date/time updated in the section 1
    When I enter the placeholder content for date/time
    Then I should see the placeholder content for date/time updated in the section 1

  @create_question
  Scenario Outline: Admin adds the type for date / time
    Given I am on the questionnaire management section
    When I click the type as <type>
    * I click the time format as <time>
    * I click on save button for field settings
    Then I should read a message stating that "Field settings data updated successfully"

    Examples:
      | type          | time |
      | "date"        | ""   |
      | "time"        | "12" |
      | "date_&_time" | "24" |

  @create_question
  Scenario: Admin saves the section with the changes
    Given I am on the questionnaire management section
    When I click the date/time button
    Then I should see field settings
    When I enter the admin field notes
    * I click on save button for field settings
    Then I should read a message stating that "Field settings data updated successfully"
