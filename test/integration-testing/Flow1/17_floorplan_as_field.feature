@1.0
Feature: Halspan - Admin - Create a Questionnaire using Floor Plan as a Field
    As an Admin, I want an option to create the questionnaire by using Floor Plan
    Conditions of Satisfaction
    There must be an option to enter the label name
    There must be an option to enter the Help text
    There must be an option for the admin to select the Pindrop on the floor or not
    There must be an option for the admin to Draw on image on the floorplan or not
    There must be an option to select if the Floor plan is visible or not.
    There must be an option to enter the Admin field notes
    
  @create_question
  Scenario: Admin views all types of field and adds floorplan field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    When I add a new question to the page 1 in section 1
    When I click the floorplan button
    Then I should see field settings
    And I should see the floorplan field added to the section 1 page 1 question 1

  @create_question
  Scenario: Admin adds the label, help text content
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the floorplan button
    Then I should see field settings
    When I enter the label name for floorplan
    Then I should see the label name for floorplan updated in the section 1
    When I enter the help text for floorplan
    Then I should see the help text for floorplan updated in the section 1
    When I enter the admin field notes

  @create_question
  Scenario Outline: Admin adds the pindrop and draw on image for floorplan
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the floorplan button
    Then I should see field settings
    When I click the pindrop as <pindrop>
    * I click the draw on image as <draw>

    Examples:
      | pindrop     | draw  |
      | "yes"       | "yes" |
      | "no"        | "no"  |
