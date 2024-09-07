@1.0
Feature: Halspan - Admin - Create a Questionnaire by using Number Field
    Description
    As an Admin, I want an option to create a Question/Field by using a Number Field.
    Conditions of Satisfaction
    There must be an option to enter the label name
    There must be an option to enter the Help text
    There must be an option to enter the Placeholder content
    There must be an option to enter the Default content.
    There must be an option to choose the type of number field ( Integer, Float, Decimal, Rating)
    There must be an option to choose the source type (Entry Field, Slider, both)
    There must be an option to for the Admin to enter the Increment by value
    There must be an option for the Admin to choose the Pre-field text and the post-field text
    There must be an option to select if the data selected must be loaded or not
    There must be an option to select if the Number field is read only
    There must be an option to select if the Number field is visible or not.
    There must be an option to enable or disable the Remember allowed field
    There must be an option to enable or disable the Field mask
    There must be an option to enter the Admin field notes
    There must be an option to enter the minimum and maxmum number of characters

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "Auth@123"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin views all types of field and adds number field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the number button
    Then I should see field settings
    And I should see the number field added to the section 1 page 1 question 1
    When I enter the label name for number
    Then I should see the label name for number updated in the section 1
    When I enter the help text for number
    Then I should see the help text for number updated in the section 1
    When I enter the placeholder content for number
    Then I should see the placeholder content for number updated in the section 1

  @create_question
  Scenario: Admin selects the type, source and options
    Given I am on the questionnaire management section
    Then I should see the add field
    When I add a new question to the page 1 in section 1
    When I click the number button
    Then I should see field settings
    When I select the type for number as <type>
    When I select the source for number as <source>
    Then I should see the source added to question 1 page 1 section 1
    When I enter the minimum and maximum range
    When I enter the increment by number
    When I enter the pre-field text
    When I enter the post-field text
    When I enter the admin field notes

    Examples:
      | type      | source        |
      | "Integer" | "Both"        |
      | "Float"   | "Both"        |
      | "Rating"  | "Entry Field" |
      | "Rating"  | "Slider"      |