@1.0
Feature: Halspan - Admin - Load from Previous Data for all the Fields
    As an Admin, I want to load previous data from an asset's attributes or service records when filling out a new questionnaire,
    Conditions of Satisfaction
    The system should allow users to load basic property data (e.g., width, height, color) for an asset.
    The system should allow Admin users to load the most recent data from service records or questionnaires related to an asset.
    When the Admin selects "Load from previous data," they should be presented with the option to choose either "Attributes" or "Service Records."
    The Admin should be able to load data from one source (either attributes or service records) as needed, without being forced to load data from both sources.

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
    When I check the options "Load from previously entered data"
    When I select the attribute data
    When I select the attribute type
    When I click the service record
    When I select the service record list 
    When I click the save button for the questionnaire version for section 1



