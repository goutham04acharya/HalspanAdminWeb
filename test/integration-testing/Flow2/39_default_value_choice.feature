# @1.0
# Feature: Halspan - Admin - Implement deafult values of Choice Fields
#     As an Admin, I want to Implement the default values of choice fields using Conditional logic.
#     Condition of Satisfaction
#     There must be an option to choose the following functions when calculating the default value for the Text Fields contains(String), Startswith(String), Endswith(String) , and ToUpper(), ToLower()
#     When Contains(String) is applied -
#     This function checks if a specific substring exists within a given string.
#     Example If you have a field with the value "Hello World" and you apply contains("World"), it will return true because "World" is a substring of "Hello World".
#     When Startswith(String) is applied - 
#     This function checks if a string starts with a specific substring.
#     Example If you have a field with the value "Hello World" and you apply startsWith("Hello"), it will return true because "Hello World" starts with "Hello".
#     When Endswith(String) is applied -
#     This function checks if a string ends with a specific substring.
#     Example If you have a field with the value "Hello World" and you apply endsWith("World"), it will return true because "Hello World" ends with "World".
#     When ToUpper() is applied -
#     This function converts all characters in a string to uppercase.
#     Example If you have a field with the value "Hello World" and you apply ToUpper(), it will return "HELLO WORLD".
#     When ToLower() is applied - 
#     This function converts all characters in a string to lowercase.
#     Example If you have a field with the value "Hello World" and you apply ToLower(), it will return "hello world".
# 
#   @create_question
#   Scenario: Admin views all types of field to create the form
#     Given I am on the questionnaire management section
#     Then I should see the add field
#     And I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
# 
#   @create_question
#   Scenario: Admin adds choice field from the add field section
#     Given I am on the questionnaire management section
#     Then I should see an add field section
#     When I add a new question to the page 1 in section 1
#     When I click the choice button
#     And I should see the choice field added to the section 1 page 1 question 1
#     When I enter the label name for choice
#     Then I should see the label name for choice updated in the section 1
#     When I enter the help text for choice
#     Then I should see the help text for choice updated in the section 1
#     When I enter the placeholder content for choice
#     Then I should see the placeholder content for choice updated in the section 1
#     When I click the save button for the questionnaire version
# 
#     When I click on add new section
#     Then I should see the new section added
#     When I add a new question to the page 1 in section 2
#     When I click the choice button
#     And I should see the choice field added to the section 2 page 1 question 1
#     When I enter the label name for choice
#     Then I should see the label name for choice updated in the section 2
#     When I enter the help text for choice
#     Then I should see the help text for choice updated in the section 2
#     When I enter the placeholder content for choice
#     Then I should see the placeholder content for choice updated in the section 2
#     When I click the add default value button
#     
#     Then I should see the default value advanced editor for choice field
#     When I select the question from the default value suggestions for choice field
#     When I click the cancel button
#     Then I should see field settings
# 
#     When I click the add default value button
#     Then I should see the default value advanced editor for choice field
#     When I enter the default value correct conditional logic for choice field
#     Then I click the save button for default value
#     And I should see the conditional logic in default value field