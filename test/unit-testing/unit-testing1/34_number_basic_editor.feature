@1.0
Feature: Halspan- Admin-Show/Hide entire section/pages for Number Field(Basic Editor Conditional Logic)
    As an Admin, I want an option to set conditional logic to show or hide entire sections or pages in Basic Editor for Number Fields
    Condition of Satisfaction
    There must be an option to select the Operators
    Operators for text fields include: Includes, Equals, Does not include, Not equal to.
    There must be an option to enter the value which would be a string
    There must be an option to handle the multiple conditions using AND or OR
    There must be an option to delete the condition that was added
    For the identifier, they will be able to add or enter the fields based on the section or the page which they have added which creating the questionnaire
    Once the condition is applied, and when i click on AND or OR there must be an option to choose any fields (Text Fields, Number Fields etc

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin adds textbox from the add field section
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
    Then I should see the basic editor for textfield
    When I click the cancel button
    Then I should see field settings

    When I click the add conditional logic button
    Then I should see the basic editor for textfield
    When I enter the correct number conditional logic for basic editor
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"