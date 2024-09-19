@1.0
Feature: Halspan - Admin - Create a Questionnaire using Photos as a Field
    As an Admin, I want an option to create the questionnaire by using Photos
    Conditions of Satisfaction
    There must be an option to upload the image in the PNG,JPEG,JPG format
    There must be an option to enter the Help text
    There must be an option to add maximum and minimum number of photos
    There must be an option for the admin to select if he wants to Draw on image or not
    There must be an option to select if the text field is visible or not.
    There must be an option to enter the Admin field notes
    There must be an option for the admin to restrict the size of the Photos
    Resolution for upload should be 5MP (2592 x 1936) Compressed JPG 60% 24bit/pixel
    There must be an option to include the metadata

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin views all types of field and adds photos field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the photos button
    Then I should see field settings
    And I should see the photos field added to the section 1 page 1 question 1

  @create_question
  Scenario: Admin adds the label, help text and placeholder content
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the photos button
    Then I should see field settings
    When I enter the label name for photos
    Then I should see the label name for photos updated in the section 1
    When I enter the help text for photos
    Then I should see the help text for photos updated in the section 1
    When I enter the minimum and maximum number of photos
    When I enter the admin field notes

  @create_question
  Scenario Outline: Admin adds the type for photos
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the photos button
    Then I should see field settings
    When I click the draw on image for photo as <draw>
    * I click the include metadata as <metadata>

    Examples:
      | draw  | metadata |
      | "yes" | "yes"    |
      | "no"  | "no"     |
