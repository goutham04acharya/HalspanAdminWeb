@1.0
Feature: Halspan- Admin-Preview responses of questionnaire
    As an Admin, I want to preview the responses of the questionnaire so that I can review and analyze the collected data
    Condition of satisfaction
    There must be an option to view all my responses in the mobile view
    The responses should be displayed in a clear and readable format on mobile screens.
    The preview should reflect the final data format, ensuring that what is seen in the preview matches the finalized responses.

  @create_question
  Scenario: Admin checks the preview response for conditional logic for textfield and choice field 
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the textbox button
    Then I should see field settings
    When I enter the label name for textbox for preview
    Then I should see the label name for textbox updated in the section 1 page 1 question 1
    When I enter the help text for textbox for preview
    Then I should see the help text for textbox updated in the section 1 page 1 question 1
    When I enter the placeholder content for textbox for preview
    Then I should see the placeholder content for textbox updated in the section 1 page 1 question 1
    When I select the type as "single_line"
    * I enter the minimum and maximum number of characters
    When I click the save button for the questionnaire version for section 1

    When I add a new question to the page 1 in section 1
    When I click the choice button
    Then I should see field settings
    When I enter the label name for choice for preview
    Then I should see the label name for choice updated in the section 1 page 1 question 2
    When I enter the help text for choice for preview
    Then I should see the help text for choice updated in the section 1 page 1 question 2
    When I enter the placeholder content for choice for preview
    Then I should see the placeholder content for choice updated in the section 1 page 1 question 2
    When I select the choice type as "single_choice"
    * I enter the text for choices as "Good, Satisfied, Unsatisfied"
    When I click the add conditional logic button
    Then I should see the advanced editor for textfield
    When I enter the conditional logic for textbox field
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
    When I click the save button for the questionnaire version for section 1

    When I click the preview button 
    Then I should see the mobile preview
    When I enter the text as "Inspector" in textbox for section 1 page 1 question 1
    When I select the choice for section 1 page 1 question 2

  @create_question
  Scenario: Admin checks the preview response for conditional logic for date field and text field 
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the date/time button
    Then I should see field settings
    When I enter the label name for date/time for preview
    Then I should see the label name for date/time updated in the section 1 page 1 question 1
    When I enter the help text for date/time for preview
    Then I should see the help text for date/time updated in the section 1 page 1 question 1
    When I enter the placeholder content date/time for preview
    Then I should see the placeholder content for date/time updated in the section 1 page 1 question 1
    When I click the type as "date"
    When I click the save button for the questionnaire version for section 1

    When I add a new question to the page 1 in section 1
    When I click the textbox button
    Then I should see field settings
    When I enter the label name for textbox for preview
    Then I should see the label name for textbox updated in the section 1 page 1 question 2
    When I enter the help text for textbox for preview
    Then I should see the help text for textbox updated in the section 1 page 1 question 2
    When I enter the placeholder content for textbox for preview
    Then I should see the placeholder content for textbox updated in the section 1 page 1 question 2
    When I select the type as "single_line"
    * I enter the minimum and maximum number of characters
    When I click the save button for the questionnaire version for section 1
    When I click the add conditional logic button
    Then I should see the advanced editor for date/time field
    When I enter the conditional logic for date/time field preview
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
    When I click the save button for the questionnaire version for section 1

    When I click the preview button 
    Then I should see the mobile preview
    When I enter the date as "31/10/2024" in date field for section 1 page 1 question 1
    When I enter the text as "Valid" in textbox for section 1 page 1 question 2

  @create_question
  Scenario: Admin checks the preview response for conditional logic for choice field and photo field 
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the choice button
    Then I should see field settings
    When I enter the label name for choice for preview
    Then I should see the label name for choice updated in the section 1 page 1 question 1
    When I enter the help text for choice for preview
    Then I should see the help text for choice updated in the section 1 page 1 question 1
#     When I enter the placeholder content for choice for preview
#     Then I should see the placeholder content for choice updated in the section 1 page 1 question 1
    When I select the choice type as "single_choice"
    * I enter the text for choices as "PAN, AADHAR, OTHER"
    When I click the save button for the questionnaire version for section 1

    When I click on add new page for section 1
    Then I should see the new page added for section 1
    When I add a new question to the page 1 in section 1
    When I click the photos button
    Then I should see field settings
    When I enter the label name for photo for preview
    Then I should see the label name for photo updated in the section 1 page 1 question 2
    When I enter the help text for photo for preview
    Then I should see the help text for photo updated in the section 1 page 1 question 2
    When I click the draw on image for photo as "yes"
    * I click the include metadata as "yes"
    When I click the add conditional logic button
    Then I should see the advanced editor for choice field
    When I enter the conditional logic for choice field preview
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
    When I click the save button for the questionnaire version for section 1

    When I click the preview button 
    Then I should see the mobile preview
    When I select the choice as "PAN" in choice field for section 1 page 1 question 1
    When I upload photo for section 1 page 1 question 2

  @create_question
  Scenario: Admin checks the preview response for conditional logic for number and file field 
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the number button
    Then I should see field settings
    When I enter the label name for number for preview
    Then I should see the label name for number updated in the section 1 page 1 question 1
    When I enter the help text for number for preview
    Then I should see the help text for number updated in the section 1 page 1 question 1
    When I enter the placeholder content for number for preview
    Then I should see the placeholder content for number updated in the section 1 page 1 question 1
    When I select the type for number as "integer"
    When I select the source for number as "both"
    Then I should see the source added to question 1 page 1 section 1
    When I enter the minimum and maximum range
    When I enter the increment by number
    When I enter the pre-field text
    When I enter the post-field text
    When I click the save button for the questionnaire version for section 1

    When I click on add new page for section 1
    Then I should see the new page added for section 1
    When I add a new question to the page 1 in section 1
    When I click the photos button
    Then I should see field settings
    When I enter the label name for photo for preview
    Then I should see the label name for photo updated in the section 1 page 1 question 2
    When I enter the help text for photo for preview
    Then I should see the help text for photo updated in the section 1 page 1 question 2
    When I click the draw on image for photo as "yes"
    * I click the include metadata as "yes"
    When I click the add conditional logic button
    Then I should see the advanced editor for number field
    When I enter the conditional logic for number field preview
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
    When I click the save button for the questionnaire version for section 1

    When I click the preview button 
    Then I should see the mobile preview
    When I enter the number as "10" in number field for section 1 page 1 question 1
    When I upload photo for section 1 page 1 question 2

  @create_question
  Scenario: Admin checks the preview response for conditional logic for number and file field 
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the photos button
    Then I should see field settings
    When I enter the label name for photo for preview
    Then I should see the label name for photo updated in the section 1 page 1 question 1
    When I enter the help text for photo for preview
    Then I should see the help text for photo updated in the section 1 page 1 question 1
    When I click the draw on image for photo as "yes"
    * I click the include metadata as "yes"
    When I click the save button for the questionnaire version for section 1

    When I add a new question to the page 1 in section 1
    When I click the textbox button
    Then I should see field settings
    When I enter the label name for textbox for preview
    Then I should see the label name for textbox updated in the section 1 page 1 question 2
    When I enter the help text for textbox for preview
    Then I should see the help text for textbox updated in the section 1 page 1 question 2
    When I enter the placeholder content for textbox for preview
    Then I should see the placeholder content for textbox updated in the section 1 page 1 question 2
    When I select the type as "single_line"
    * I enter the minimum and maximum number of characters
    When I click the save button for the questionnaire version for section 1
    When I click the add conditional logic button
    Then I should see the advanced editor for files or photos or videos
    When I enter the conditional logic for photos field preview
    Then I click the save button for conditional logic
    And I should read a message stating that "Conditional Logic Added"
    When I click the save button for the questionnaire version for section 1

    When I click the preview button 
    Then I should see the mobile preview
    When I upload "3" photo for section 1 page 1 question 1
    When I enter the text as "Good" in textbox for section 1 page 1 question 2