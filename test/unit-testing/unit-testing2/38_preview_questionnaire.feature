@1.0
Feature: Halspan - Admin - Preview the Questionnaire
  As an Admin, I must be able to Preview the Questionnaire
  Conditions of Satisfaction
  There must be an option to view the specific questionnaire that has been completed
  There must be an option to submit the questionnaire once the preview is completed.
  There must be a pop up displayed when clicked on preview so that i can get the visual representation of the questionnaire 
  Information to be displayed
  Preview
  
  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin adds all the fields from the add field section
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
    When I select the type as "multi_line"
    When I check the field validation 
    * I select the format as "custom-regular-expression"
    When I enter the custom regular expression as "^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
    When I enter the format error message as "Invalid PAN format"
    * I enter the minimum and maximum number of characters
    When I click the save button for the questionnaire version for section 1

    When I add a new question to the page 1 in section 1
    When I click the choice button
    Then I should see field settings
    When I enter the label name for choice for preview
    Then I should see the label name for choice updated in the section 1 page 1 question 2
    When I enter the help text for choice for preview
    Then I should see the help text for choice updated in the section 1 page 1 question 2
#     When I enter the placeholder content for choice for preview
#     Then I should see the placeholder content for choice updated in the section 1 page 1 question 2
    When I select the choice type as "single_choice"
    * I enter the text for choices as "Option 1, option 2, option 3"
    When I click the save button for the questionnaire version for section 1

    When I add a new question to the page 1 in section 1
    When I click the date/time button
    Then I should see field settings
    When I enter the label name for date/time for preview
    Then I should see the label name for date/time updated in the section 1 page 1 question 3
    When I enter the help text for date/time for preview
    Then I should see the help text for date/time updated in the section 1 page 1 question 3
    When I enter the placeholder content date/time for preview
    Then I should see the placeholder content for date/time updated in the section 1 page 1 question 3
    When I click the type as "date"
    When I click the save button for the questionnaire version for section 1

    When I click on add new page for section 1
    Then I should see the new page added for section 1
    When I add a new question to the page 2 in section 1
    When I click the photos button
    Then I should see field settings
    When I enter the label name for photo for preview
    Then I should see the label name for photo updated in the section 1 page 2 question 1
    When I enter the help text for photo for preview
    Then I should see the help text for photo updated in the section 1 page 2 question 1
    When I click the draw on image for photo as "yes"
    * I click the include metadata as "yes"
    When I click the save button for the questionnaire version for section 1

    When I add a new question to the page 2 in section 1
    When I click the floorplan button
    And I should see the floorplan field added to the section 1 page 2 question 2
    When I enter the label name for floorplan for preview
    Then I should see the label name for floorplan updated in the section 1 page 2 question 2
    When I enter the help text for floorplan for preview
    Then I should see the help text updated in the section 1 page 2 question 2
    When I click the pindrop as "yes"
    * I click the draw on image as "yes"
    When I click the save button for the questionnaire version for section 1

  Scenario: Admin adds all the fields from the add field section
    Given I am on the Questionnaire management sections
    When I click on add new section 2
    Then I should see the new section added
    When I add a new question to the page 1 in section 2
    When I click the number button
    Then I should see field settings
    When I enter the label name for number for preview
    Then I should see the label name for number updated in the section 2 page 1 question 1
    When I enter the help text for number for preview
    Then I should see the help text for number updated in the section 2 page 1 question 1
    When I enter the placeholder content for number for preview
    Then I should see the placeholder content for number updated in the section 2 page 1 question 1
    When I select the type for number as "integer"
    When I select the source for number as "both"
    Then I should see the source added to question 1 page 1 section 2
    When I enter the minimum and maximum range
    When I enter the increment by number
    When I enter the pre-field text
    When I enter the post-field text
    When I click the save button for the questionnaire version for section 2

    When I add a new question to the page 1 in section 2
    When I click the signature button
    Then I should see field settings
    When I enter the label name for signature for preview
    Then I should see the label name for signature updated in the section 2 page 1 question 2
    When I enter the help text for signature for preview
    Then I should see the help text for signature updated in the section 2 page 1 question 2
    When I click the save button for the questionnaire version for section 2

    When I add a new question to the page 1 in section 2
    When I click the asset location button
    Then I should see field settings
    When I enter the label name for asset location for preview
    Then I should see the label name for asset location updated in the section 2 page 1 question 3
    When I enter the help text for asset location for preview
    Then I should see the help text for asset location updated in the section 2 page 1 question 3
    When I click the save button for the questionnaire version for section 2

    When I click on add new page for section 2
    Then I should see the new page added for section 2
    When I add a new question to the page 2 in section 2
    When I click the display button
    Then I should see field settings
    When I click the type as headings
    When I enter the heading
    Then I should be able see heading updated in question 1 page 2 section 2
    When I click the save button for the questionnaire version for section 2

    When I add a new question to the page 2 in section 2
    When I click the gps button
    Then I should see field settings
    When I enter the label name for gps for preview
    Then I should see the label name for gps updated in the section 2 page 2 question 2
    When I enter the help text for gps for preview
    Then I should see the help text for gps updated in the section 2 page 2 question 2
    When I click the save button for the questionnaire version for section 2

  Scenario: Admin validates all the data added on to the field settings of the questionnaire
    Given I am on the Questionnaire management sections
    When I click the preview button 
    Then I should see the mobile preview
    When I click the next button
    # Then I should read a message stating that "This is a mandatory field"
    Then I validate the data entered exists in the mobile preview for section 1 page 1
    When I enter invalid text for custom regular expression for section 1 page 1 question 1
    When I click the next button
    # Then I should read a message stating that "Invalid PAN format"
    When I enter the text in textbox for section 1 page 1 question 1
    When I select the choice for section 1 page 1 question 2
    When I enter the date/time for section 1 page 1 question 3
    When I click the next button
    Then I validate the data entered exists in the mobile preview for section 1 page 2
    When I upload a invalid image to section 1 page 2 question 1
    Then I should read a message stating that "Only .png, .jpg, and .svg files are allowed"
    When I upload photo for section 1 page 2 question 1
    When I see the floorplan for section 1 page 2 question 2
    When I place the pin and draw on the floorplan 
    When I click the next button
    Then I validate the data entered exists in the mobile preview for section 2 page 1
    When I enter the number for section 2 page 1 question 1
    When I choose the number by sliding for section 2 page 1 question 1
    When I enter the signature for section 2 page 1 question 2
    When I select the location in asset location for section 2 page 1 question 3
    When I click the next button
    Then I validate the data entered exists in the mobile preview for section 2 page 2
    When I see the display for section 2 page 2 question 1
    When I see the gps for section 2 page 2 question 2
    When I click the back button