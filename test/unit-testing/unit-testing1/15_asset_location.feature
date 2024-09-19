@1.0
Feature: Halspan - Admin - Create a Questionnaire using Asset Location as a Field
    As an Admin, I want an option to create a Question/Field by using a Asset Location
    Conditions of Satisfaction
    There must be an option for the system to retrieve the data associated with an asset which has the TAG with it and i must be able to view it  (Site name, Building name, Floors)
    If asset data is not available, the system provides the user to select from the -
    Site: A list of sites.
    Buildings: A list of buildings within the selected site.
    Floors: A list of floors within the selected building. 
    There must be an option to enter the label
    There must be an option to enter the Help Text
    There must be an option to enter the Admin Field Notes

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin views all types of field and adds choice field from the add field section
    Given I am on the questionnaire management section
    Then I should see the add field
    * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
    * I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the asset location button
    Then I should see field settings
    And I should see the asset location field added to the section 1 page 1 question 1
    When I enter the label name for choice
    Then I should see the label name for choice updated in the section 1
    When I enter the help text for choice
    Then I should see the help text for choice updated in the section 1
    When I enter the admin field notes
