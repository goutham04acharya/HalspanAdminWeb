@1.0
Feature: Halspan- Admin-Show/Hide entire sections/page for Date/Time Fields(Advanced Editor Conditional Logic)
    As an Admin, I want an option to set conditional logic for Date/Time Fields to show or hide entire sections or pages in Advanced Editor
    Conditional of satisfaction
    In the Date/Time field it should allow the following Conditions
    a) Date is before today: Returns true if the date field value is before the current date.
    b) Date is before or equal to today: Returns true if the date field value is on or before the current date.
    c) Date is after today: Returns true if the date field value is after the current date.
    d) Date is after or equal to today: Returns true if the date field value is on or after the current date.
    e) Date is within "X" days of set date: Returns true if the date field value is within a specified number of days before or after the set date.
    There must be an option for the system to support the use of logical operators AND, and OR to combine multiple conditions.
    The brackets must be handled correctly when writing the conditional logic, ensuring that the number of opening brackets equals the number of closing brackets.
    The conditions applied once cannot be duplicated
    An error message must be displayed if an invalid value was provided for the field in the input data.
    when starting a conditional logic it should be started with an equal to sign

  @create_question
  Scenario: Admin views all types of field to create the form
    Given I am on the questionnaire management section
    Then I should see the add field
    And I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'

  @create_question
  Scenario: Admin adds date/time field from the add field section
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the date/time button
    And I should see the date/time field added to the section 1 page 1 question 1
    When I enter the label name for date/time
    Then I should see the label name for date/time updated in the section 1
    When I enter the help text for date/time
    Then I should see the help text for date/time updated in the section 1
    When I enter the placeholder content for date/time
    Then I should see the placeholder content for date/time updated in the section 1
    When I click the save button for the questionnaire version

    When I click on add new section
    Then I should see the new section added
    # When I click on add new page
    # Then I should see the new pages added
    When I add a new question to the page 1 in section 2
    When I click the date/time button
    And I should see the date/time field added to the section 2 page 1 question 1
    When I enter the label name for date/time
    Then I should see the label name for date/time updated in the section 2
    When I enter the help text for date/time
    Then I should see the help text for date/time updated in the section 2
    When I enter the placeholder content for date/time
    Then I should see the placeholder content for date/time updated in the section 2
    When I click the add conditional logic button
    Then I should see the advanced editor for date/time field
    Then I should see the suggestions for questions
    When I enter the incorrect conditional logic for date/time field
    Then I should read a message stating that "No items found"
    Then I click the save button for conditional logic
    Then I should read a error message 
    When I click the cancel button
    Then I should see field settings
    
    When I click the add conditional logic button
    Then I should see the advanced editor for date/time field
    When I select the question from the suggestions for date/time field
    When I click the cancel button
    Then I should see field settings

    When I click the add conditional logic button
    Then I should see the advanced editor for date/time field
    When I enter the correct conditional logic for date/time field
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
