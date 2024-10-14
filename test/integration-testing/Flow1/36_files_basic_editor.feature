@1.0
Feature: Halspan- Admin-Show/Hide entire section/pages for Files Field(Basic Editor Conditional Logic)
    As an Admin, I want an option to set conditional logic to show or hide entire sections or pages in Basic Editor for Files Fields
    Condition of Satisfaction
    There must be an option to select the Operators
    Operators for text fields include: Includes, Equals, Does not include, Not equal to.
    There must be an option to enter the value which would be a string
    There must be an option to handle the multiple conditions using AND or OR
    There must be an option to delete the condition that was added
    For the identifier, they will be able to add or enter the fields based on the section or the page which they have added which creating the questionnaire
    Once the condition is applied, and when i click on AND or OR there must be an option to choose any fields (Text Fields, Files Fields etc)

  @create_question
  Scenario: Admin adds files from the add field section
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the photos button
    Then I should see field settings
    When I enter the label name for photos
    When I enter the help text for photos
    When I enter the minimum and maximum number of photos
    When I enter the admin field notes
    When I click the save button for the questionnaire version

    When I click on add new section
    Then I should see the new section added
    When I add a new question to the page 1 in section 2
    When I click the photos button
    Then I should see field settings
    When I enter the label name for photos
    When I enter the help text for photos
    When I enter the minimum and maximum number of photos
    When I enter the admin field notes
    When I click the add conditional logic button
    Then I should see the basic editor for number
    When I enter the correct files conditional logic for basic editor
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"