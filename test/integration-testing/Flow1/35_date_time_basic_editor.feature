@1.0
Feature: Halspan- Admin - Show/Hide entire Section/Pages for Date/Time fields(Basic Editor Conditional Logic)
    As an Admin, I want an option to set conditional logic to show or hide entire sections or pages in Basic Editor for Date Fields
    Condition of Satisfaction
    There must be an option to select the Identifier
    There must be an option for the system to allow setting conditions based on date and time fields with operators: Date is before Today, Date is before or equal to Today, Date is after Today, Date is after or equal to Today, Date is within "X" days of Set date.
    The default value for the following condition - Date is before Today, Date is before or equal to Today, Date is after Today, Date is after equal or Today will be today (Current Date)
    When I select the Date is within "X" days of set days then they can be able to add value if Date is within "X" days of Set date
    There must be an option for the system to support the use of logical operators AND, and OR to combine multiple conditions.
    There must be an option to delete the condition that was added

  @create_question
  Scenario: Admin adds date/time from the add field section
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
    Then I should see the basic editor for textfield
    When I enter the correct date/time conditional logic for basic editor
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"