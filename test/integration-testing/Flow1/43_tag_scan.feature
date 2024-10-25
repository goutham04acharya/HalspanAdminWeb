@1.0
Feature: Halspan - Admin - Tag Scan
    As a Admin, I want to add additional Tag Scan fields to a Questionnaire so that I can capture various types of tag data
    Condition of Satisfaction
    The system must support adding multiple Tag Scan fields to a Questionnaire for different tag types: NFC, RFID, QR, or Barcode (with specific barcode types defined).
    Each Tag Scan field should be configurable to capture either the UID (14-digit hexadecimal format, e.g., 04E9F112E27280), the Payload, or both.
    Users should be able to specify the tag type (NFC, RFID, QR, or a particular Barcode type) for each Tag Scan field.
    The system must validate and save the captured data from each Tag Scan field.

  @create_question
  Scenario: Admin selects the type as tag scan
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the tag scan button
    Then I should see field settings
    And I should see the photos field added to the section 1 page 1 question 1

  @create_question
  Scenario: Admin adds the label, help text and placeholder content
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the tag scan button
    Then I should see field settings
    When I enter the label name for photos
    Then I should see the label name for photos updated in the section 1
    When I enter the help text for photos
    Then I should see the help text for photos updated in the section 1
    When I enter the admin field notes

  @create_question
  Scenario Outline: Admin adds the type for photos
    Given I am on the questionnaire management section
    When I add a new question to the page 1 in section 1
    When I click the tag scan button
    Then I should see field settings
    When I click the type for tag as <type>
    * I click the source for tag as <source>

    Examples:
      | type      | source    |
      | "NFC"     | "uid"     |
      | "RFiD"    | "Payload" |
      | "QR"      | "both"    |
      | "Barcode" | "uid"     |
