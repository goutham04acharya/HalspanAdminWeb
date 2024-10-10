@1.0
Feature: Halspan- Admin-Show/Hide entire Sections/Pages for Files,Video,Photo (Advanced Editor Conditional Logic)
    As an Admin, I want an option to set conditional logic for Files, Video, Photo, Image to show or hide entire sections or pages in Advanced Editor
    Condition of Satisfaction
    In the Files, Video, Photo, Image field it should allow the following Conditions
    a) Has at least one file: Returns true if there is at least one file uploaded in the field.
    b) Has no files: Returns true if there are no files uploaded in the field.
    c)Number of files is: Returns true if the number of files uploaded matches the specified number.
    There must be an option for the system to support the use of logical operators AND, and OR to combine multiple conditions.
    The brackets must be handled correctly when writing the conditional logic, ensuring that the number of opening brackets equals the number of closing brackets.
    An error message must be displayed if an invalid value was provided for the field in the input data.
    when starting a conditional logic it should be started with an equal sign

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
    When I click the files button
    Then I should see field settings
    And I should see the files field added to the section 1 page 1 question 1
    When I enter the label name for files
    Then I should see the label name updated in the section 1
    When I enter the help text for files
    Then I should see the help text updated in the section 1
    When I click the save button for the questionnaire version

    When I click on add new section
    Then I should see the new section added
    # When I click on add new page
    # Then I should see the new pages added
    When I add a new question to the page 1 in section 2
    When I click the files button
    Then I should see field settings
    And I should see the files field added to the section 1 page 1 question 1
    When I enter the label name for files
    Then I should see the label name updated in the section 2
    When I enter the help text for files
    Then I should see the help text updated in the section 2

    When I click the add conditional logic button
    Then I should see the advanced editor for files or photos or videos
    When I enter the incorrect conditional logic for files or photos or videos
    Then I should read a message stating that "No items found"
    When I click the cancel button
    Then I should see field settings

    When I click the add conditional logic button
    When I enter the correct conditional logic for files or photos or videos
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
