@1.0
Feature: Halspan- Admin- Show/Hide for entire Section/Pages for Text Fields(Advance editor Conditional Logic)
    As an Admin, I want an option to set conditional logic for Text Fields to show or hide entire sections or pages in Advanced Editor
    Condition of satisfaction
    The form must allow the creation of custom validation rules using a flexible rule builder or scripting language.
    Validation rules must support comparisons and conditions involving multiple fields within the form.
    The form must allow for clear and customizable error messages that guide users to correct their input when validation fails.
    There must be an option to Test once the Conditions and Validations have been applied.
    There must be an option to save once the Conditions and Validations have been applied
    An Appropriate error message to be displayed if the query in the Advance Editor as syntax errors.
    Once I apply the conditional logic, I must be able to preview the same so that i will be able to view all my responses in advance.

  @create_question
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the textbox button
    Then I should see field settings
    And I should see the text box added to the section 1
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
    Then I should see field settings
    And I should see the text box added to the section 2
    When I enter the label name for textbox
    Then I should see the label name updated in the section 2
    When I enter the help text for textbox
    Then I should see the help text updated in the section 2
    When I enter the placeholder content for textbox
    Then I should see the placeholder content updated in the section 2
    When I click the add conditional logic button
    Then I should see the advanced editor for textfield
    Then I should see the suggestions for questions
    When I enter the correct conditional logic 
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"