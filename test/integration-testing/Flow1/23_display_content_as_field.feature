@1.0
Feature: Halspan - Admin - Create a Questionnaire using Display Content as a Field
    As an Admin, I want an option to create the questionnaire by using Display Content
    Conditions of Satisfaction
    There must be an option to enter the Help text
    There must be an option to enter the label name.
    There must be an option to select the Display Content (Heading, Text, Image, URL)
    There must be an option for the admin to select the Pindrop on the floor or not
    There must be an option for the admin to Draw on image on the floorplan or not
    A text field must be enabled when clicked on Heading in the Field setting
    A text field must be enabled when clicked on Text in the Field setting
    A text field must be enabled when clicked on URL in the Field setting
    There must be an option to select if the data selected must be loaded or not
    There must be an option to select if the text field is read only
    There must be an option to select if the text field is visible or not.
    There must be an option to enable or disable the Remember allowed field
    There must be an option to enable or disable the Field mask
    There must be an option to enter the Admin field notes

  @create_question
  Scenario: Admin views all types of field and adds display content field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    When I add a new question to the page 1 in section 1
    When I click the display button
    Then I should see field settings
    And I should see the display field added to the section 1 page 1 question 1

  @create_question
  Scenario: Admin adds the label, help text content
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the display button
    Then I should see field settings
    When I click the type as headings
    When I enter the heading
    Then I should be able see heading updated in question 1 page 1 section 1
    When I click the type as text
    When I enter the text
    Then I should be able see text updated in question 1 page 1 section 1
    When I enter the admin field notes

  @create_question
  Scenario Outline: Admin replaces the added image
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the display button
    Then I should see field settings
    When I click the type as image
    When I upload the image from disk
    When I click the add image
    Then I should see a confirmation prompt stating to replace image
    When I click the cancel button
    When I upload the image from disk
    Then I should be able see image updated in question 1 page 1 section 1

  @create_question
  Scenario Outline: Admin adds the pindrop and draw on image for display
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the display button
    Then I should see field settings
    When I click the type as image
    When I upload the image from disk
    Then I should be able see image updated in question 1 page 1 section 1
    When I click the pindrop as <pindrop>
    * I click the draw on image as <draw>

    Examples:
      | pindrop | draw  |
      | "yes"   | "yes" |
      | "no"    | "no"  |

  @create_question
  Scenario Outline: Admin adds the pindrop and draw on image for display
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the display button
    Then I should see field settings
    When I click the type as url
    When I click the url type as <url>
    * I enter the url as <url-text>
    Then I should be able see url updated in question 1 page 1 section 1

    Examples:
      | url      | url-text                      |
      | "http"   | "http://halspan.com"          |
      | "https"  | "https://halspan.com"         |
      | "mailto" | "halspan.support@halspan.com" |
      | "tel"    | "7911123456"                  |
