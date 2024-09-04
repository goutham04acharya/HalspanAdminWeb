@1.0
Feature: Halspan - Admin - Create a Questionnaire using Signature as a Field
    As  an Admin, I want an option to create the questionnaire by using Signature
    Conditions of Satisfaction
    There must be an option to enter the Help text.
    There must be an option to view the Longitude which is filled automatically based on phone location
    There must be an option to view the Longitude which is filled automatically based on phone location.
    There must be an option to enter the label name.
    There must be an option for the admin to enter the date and time with the Signature
    There must be an option to   enter the Admin field notes
    There must be an option for the user to sign or adopt a signature generated in an appropriate font.

  @create_question
  Scenario: Admin views all types of field and adds field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the signature button
    Then I should see field settings
    And I should see the signature field added to the section 1 page 1 question 1

  @create_question
  Scenario: Admin adds the label, help text content
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the signature button
    Then I should see field settings
    When I enter the label name for signature
    Then I should see the label name for signature updated in the section 1
    When I enter the help text for signature
    Then I should see the help text for signature updated in the section 1
    When I enter the admin field notes