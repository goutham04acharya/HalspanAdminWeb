@1.0
Feature: Halspan - Admin - Implement default values of Number Fields(Conditional Login)
    As an Admin, I want to Implement the default values of Number fields using Conditional logic.
    Condition of Satisfaction
    There must be an option to choose the following functions when calculating the default value for the Number Fields AssetNumber, AssetQuantity, 
    AssetNumber:
    Typically, AssetNumber is used to refer to a unique identifier for an asset, often a string or text value rather than a numeric value.
    AssetQuantity represents the quantity of assets, which is usually a numeric value. and returns the quantity as a number. For example, if AssetQuantity is 10, the default value will be 10.
    There must be an option to include Addition, Subtraction, Multiplication and Division.
    There must be an option to include "if-Then-else"
    There must be an option to include Minimum, Maximum and Round.
    Number fields can be combined using the OR and & Operator
    The brackets must be handled correctly when writing the conditional logic, ensuring that the number of opening brackets equals the number of closing brackets. 
    The conditions applied once cannot be duplicated 
    An error message must be displayed if an invalid value was provided for the field in the input data. 
    when starting a conditional logic it should be started with an equal to sign

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin views all types of field to create the form
    Given I am on the questionnaire management section
    Then I should see the add field
    And I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'

  @create_question
  Scenario: Admin adds number field from the add field section
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the number button
    And I should see the number field added to the section 1 page 1 question 1
    When I enter the label name for number
    Then I should see the label name for number updated in the section 1
    When I enter the help text for number
    Then I should see the help text for number updated in the section 1
    When I enter the placeholder content for number
    Then I should see the placeholder content for number updated in the section 1
    When I click the save button for the questionnaire version

    When I click on add new section
    Then I should see the new section added
    When I add a new question to the page 1 in section 2
    When I click the number button
    And I should see the number field added to the section 2 page 1 question 1
    When I enter the label name for number
    Then I should see the label name for number updated in the section 2
    When I enter the help text for number
    Then I should see the help text for number updated in the section 2
    When I enter the placeholder content for number
    Then I should see the placeholder content for number updated in the section 2

    When I click the add default value button
    Then I should see the default value advanced editor for number field
    Then I should see the default value suggestions for questions for number
    When I enter the incorrect default value conditional logic for number field
    Then I should read a message stating that "No items found"
    Then I click the save button for default value
    Then I should read a error message
    When I click the cancel button
    Then I should see field settings

    When I click the add default value button
    Then I should see the default value advanced editor for number field
    When I select the question from the default value suggestions for number field
    When I click the cancel button
    Then I should see field settings
    When I click the add default value button
    Then I should see the default value advanced editor for number field
    When I enter the default value correct conditional logic for number field
    Then I click the save button for default value
    And I should see the conditional logic in default value field for number
    When I delete the default value condition
    Then I should not see the condition