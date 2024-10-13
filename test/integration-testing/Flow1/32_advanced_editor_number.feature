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

  @create_question
  Scenario: Admin views all types of field to create the form
    Given I am on the questionnaire management section
    Then I should see the add field
    And I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'

  @create_question
  Scenario: Admin adds number from the add field section
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
    # When I click on add new page
    # Then I should see the new pages added
    When I add a new question to the page 1 in section 2
    When I click the number button
    And I should see the number field added to the section 2 page 1 question 1
    When I enter the label name for number
    Then I should see the label name for number updated in the section 2
    When I enter the help text for number
    Then I should see the help text for number updated in the section 2
    When I enter the placeholder content for number
    Then I should see the placeholder content for number updated in the section 2
    When I click the add conditional logic button
    Then I should see the advanced editor for number field
    When I enter the correct conditional logic for number field
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
