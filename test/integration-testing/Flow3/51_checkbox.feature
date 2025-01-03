@1.0
Feature: Halspan - Admin - Checkbox / Choice Box as a Field
    As an Admin, I want an option to create the questionnaire by using a Choice Field

  @create_question
  Scenario: Admin views all types of field and adds choice field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the choice button
    Then I should see field settings
    And I should see the choice field added to the section 1 page 1 question 1
    When I select the choice type as <type>
    * I enter the text for choices as <choices>
    Then I should see the choices updated on the section 1

    Examples:
      | type            | choices                        |
      | "multi_choice"  | "Choice 1, Choice 2, choice 3" |
