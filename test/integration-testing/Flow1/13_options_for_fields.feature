Feature: Halspan - Admin - Variety of options available for each Field Type
    As an Admin, I want to have a variety of options available for each field type when creating questionnaires.
    Conditions of Satisfaction
    There must be an option to add the compulsory fields and it cannot be skipped.
    Title of questionnaire cannot be repeated.
    It should abide to these conditions,
    - Attribute data – If the field is to display current attribute data and/or collect asset attribute data then it must have this field checked.
    - Load from previously entered data (Yes/No) - indicates that a field should load data from the system where possible. (If loaded) Read only (Yes/No) - restricts loaded data to read only.
    - Visible / Not Visible – the field is included in the Questionnaire but not displayed to the user.
    - Placeholder content (optional) - displayed in the field but is removed when the user selects the field - i.e. if no text entered placeholder text does not save.
    - default content populates the field with entered value and is used as value if form is submitted.
    - Remember allowed (Yes/No) – this allows a user to set a value as their own personal default, which is entered into this field in future Questionnaires.
    - Optional / Mandatory field indicators i.e., 
    - Help text (optional) – help text for users.
    - Field Validation (Yes/No)

  @create_question
  Scenario: Admin views all types of field to create the form
    Given I am on the questionnaire management section
    Then I should see an add field section
    And I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'

  @create_question
  Scenario Outline: Admin toggle the options for field type
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the textbox button
    Then I should see field settings
    And I should see the text box added to the section 1
    When I toggle the options <options>

    Examples:
      | options                             |
      | "Load from previously entered data" |
      | "Read only"                         |
      | "Visible"                           |
      | "Optional"                          |
      | "Remember allowed"                  |
      | "Field validation"                  |
