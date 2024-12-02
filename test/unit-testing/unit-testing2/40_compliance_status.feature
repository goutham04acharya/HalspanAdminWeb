@1.0
Feature: Halspan - Admin- Compliant status and Sub status of questionnaire response
    As an Admin, I want to determine the Compliant status and Sub status of the questionnaire responses so that I can ensure all necessary compliance requirements are met
    Condition of satisfaction
    There must be an option to include the label name
    There must be an option to include the default content
    There must be an option for the user to include the constant values.
    The compliance logic and the sub status must be ready only
    Once the compliance and sub-status field is added then there should not be an option to include any further fields
    The system should clearly display the Compliant status based each response.
    The Sub status should be detailed and provide specific reasons or categories for the compliance status.

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario Outline: Admin views all types of field and adds choice field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the choice button
    Then I should see field settings
    And I should see the choice field added to the section 1 page 1 question 1
    When I enter the label name for choice
    Then I should see the label name for choice updated in the section 1
    When I enter the help text for choice
    Then I should see the help text for choice updated in the section 1
    When I enter the placeholder content for choice
    Then I should see the placeholder content for choice updated in the section 1
    When I select the choice type as <type>
    * I enter the text for choices as <choices>
    Then I should see the choices updated on the section 1
    When I click the save button for the questionnaire version

    Examples:
      | type            | choices          |
      | "single_choice" | "Yes, No, Maybe" |

  Scenario: Admin adds the compliance logic to the questionnaire
    Given I am on the Questionnaire management sections
    When I add a new question to the page 1 in section 1
    When I click the add compliance button 
    When I enter the label name for compliance status
    When I click the add default value button for compliance logic
    Then I should see the compliance logic advanced editor for choice field
    Then I should see the compliance logic suggestions for questions for choice
    When I enter the incorrect compliance logic for choice field
    Then I should read a message stating that "No items found"
    Then I click the save button for compliance logic
    Then I should read a error message 
    When I click the cancel button
    Then I should see field settings
    
    When I click the add default value button for compliance logic
    Then I should see the compliance logic advanced editor for choice field
    When I select the question from the compliance logic suggestions for choice field
    When I click the cancel button
    Then I should see field settings

    When I click the add default value button for compliance logic
    Then I should see the compliance logic advanced editor for choice field
    When I enter the correct compliance logic for choice field
    Then I click the save button for default value
    And I should see the compliance logic in default value field 