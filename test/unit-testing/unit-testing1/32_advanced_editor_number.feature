@1.0
Feature: Halspan- Admin-Show/Hide entire sections/pages for Number field(Advanced Editor Conditional Logic)
    As an Admin, I want an option to set conditional logic for Number Fields to show or hide entire sections or pages in Advanced Editor
    Condition of satisfaction
    In the Number field it should allow the following Conditions
    a) Equals - It will return true if the text field value exactly matches the specified value.
    b) Not Equals: Returns true if the number field value does not match the specified number.
    c) Smaller: Returns true if the number field value is less than the specified number.
    d) Larger: Returns true if the number field value is greater than the specified number.
    e) Smaller or Equal: Returns true if the number field value is less than or equal to the specified number.
    f) Larger or Equal: Returns true if the number field value is greater than or equal to the specified number.

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
    Then I should see field settings
    And I should see the number field added to the section 1 page 1 question 1
    When I enter the label name for number
    Then I should see the label name updated in the section 1
    When I enter the help text for number
    Then I should see the help text updated in the section 1
    When I enter the placeholder content for number
    Then I should see the placeholder content updated in the section 1
    When I click the save button for the questionnaire version

    When I click on add new section
    Then I should see the new section added
    When I add a new question to the page 1 in section 2
    When I click the number button
    Then I should see field settings
    And I should see the number field added to the section 2 page 1 question 1
    When I enter the label name for number
    Then I should see the label name updated in the section 2
    When I enter the help text for number
    Then I should see the help text updated in the section 2
    When I enter the placeholder content for number
    Then I should see the placeholder content updated in the section 2


  Scenario: Admin adds the conditional logic for textfield
    Given I am on the Questionnaire management sections
    When I click the add conditional logic button
    Then I should see the advanced editor for number field
    Then I should see the suggestions for questions
    When I enter the incorrect conditional logic for number field
    Then I should read a message stating that "No items found"
    Then I click the save button for conditional logic
    Then I should read a error message 
    When I click the cancel button
    Then I should see field settings
    
    When I click the add conditional logic button
    When I select the question from the suggestions for number field
    When I click the cancel button
    Then I should see field settings

    When I click the add conditional logic button
    When I enter the correct conditional logic for number field
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
