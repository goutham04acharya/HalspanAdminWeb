@1.0
Feature: Halspan - Admin -Asset type
    As an Admin, I want to have asset type list , so that questionnaire can be created accordingly
    Condition of Satisfaction
    There should be dropdown of asset type 
    There should be an option to filter based on asset type.
    Information to be display
    Windows
    Fire door
    Fire extinguser
    elevators
    etcs as per API

  # @login
  Scenario Outline: Admin adds all the fields for the questionnaire
    Given I am on the dashboard screen
    When I click the create new questionnaire button
    Then I should see the questionnaire creation screen
    When I enter Unique Public Name in the public name field
    * I enter internal name in the internal name field
    * I enter questionnaire description in the Description field as "test data results"
    * I select the <asset> from the asset type dropdown
    * I select <type> from the questionnaire type options
    * I select british english from the language dropdown
    * I select "FABRICATION" from service record list
    * I click the create questionnaire button
    Then I should read a message stating that "Questionnaire created successfully"

    Examples:
      | asset               | type  |
      | "Fire door"         | "yes" |
      | "Fire extinguisher" | "no"  |
      | "Updated Elevator"  | "yes" |
      | "test create nav"   | "no"  |
      | "create access"     | "no"  |
      | "Asset1"            | "yes" |
      | "Window"            | "no"  |

  Scenario Outline: Filter by asset type
    Given I am in questionnaire listing screen
    When I select asset type as <asset> from the filter dropdown
    Then The results should show questionnaries of the selected asset type

    Examples:
      | asset               |
      | "Fire door"         |
      | "Fire extinguisher" |
      | "Updated Elevator"  |
      | "test create nav"   |
      | "create access"     |
      | "Asset1"            |
      | "Window"            |
