@1.0
Feature: Halspan - Admin - Implement default values of Text Fields(Conditional Logic)
    As an Admin, I want to Implement the default values of Text fields using Conditional logic.
    Condition of Satisfaction
    There must be an option to choose the following functions when calculating the default value for the Text Fields contains(String), Startswith(String), Endswith(String) , and ToUpper(), ToLower()
    When Contains(String) is applied -
    This function checks if a specific substring exists within a given string.
    Example If you have a field with the value "Hello World" and you apply contains("World"), it will return true because "World" is a substring of "Hello World".
    When Startswith(String) is applied - 
    This function checks if a string starts with a specific substring.
    Example If you have a field with the value "Hello World" and you apply startsWith("Hello"), it will return true because "Hello World" starts with "Hello".
    When Endswith(String) is applied -
    This function checks if a string ends with a specific substring.
    Example If you have a field with the value "Hello World" and you apply endsWith("World"), it will return true because "Hello World" ends with "World".
    When ToUpper() is applied -
    This function converts all characters in a string to uppercase.
    Example If you have a field with the value "Hello World" and you apply ToUpper(), it will return "HELLO WORLD".
    When ToLower() is applied - 
    This function converts all characters in a string to lowercase.
    Example If you have a field with the value "Hello World" and you apply ToLower(), it will return "hello world".
    There must be an option for the user to include the constant values.
    There must be an option to include the Concatenation
    There must be an option to include If-then-else.
    There must be an option to include "contains" "Make Lowercase" 
    There must be an option to include various String Manipulation like - toUpperCase(), toLowerCase(), trim()
    Text fields can be combined using the OR and & Operator
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
  Scenario: Admin adds textbox field from the add field section
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the textbox button
    And I should see the textbox field added to the section 1 page 1 question 1
    When I enter the label name for textbox
    Then I should see the label name updated in the section 1
    When I enter the help text for textbox
    Then I should see the help text updated in the section 1
    When I enter the placeholder content for textbox
    Then I should see the placeholder content updated in the section 1
    When I click the save button for the questionnaire version

    When I click on add new section
    Then I should see the new section added
    When I add a new question to the page 1 in section 2
    When I click the textbox button
    And I should see the textbox field added to the section 2 page 1 question 1
    When I enter the label name for textbox
    Then I should see the label name updated in the section 2
    When I enter the help text for textbox
    Then I should see the help text updated in the section 2
    When I enter the placeholder content for textbox
    Then I should see the placeholder content updated in the section 2
    When I click the add default value button
    Then I should see the default value advanced editor for textbox field
    Then I should see the default value suggestions for questions for textbox
    When I enter the incorrect default value conditional logic for textbox field
    Then I should read a message stating that "No items found"
    Then I click the save button for default value
    Then I should read a error message 
    When I click the cancel button
    Then I should see field settings
    
    When I click the add default value button
    Then I should see the default value advanced editor for textbox field
    When I select the question from the default value suggestions for textbox field
    When I click the cancel button
    Then I should see field settings

    When I click the add default value button
    Then I should see the default value advanced editor for textbox field
    When I enter the default value correct conditional logic for textbox field
    Then I click the save button for default value
    And I should see the conditional logic in default value field for textbox