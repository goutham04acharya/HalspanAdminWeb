@1.0
Feature: Halspan Admin Web Published Questionnaire to be in list
    As a admin, I want to see the status of the questionnaire to be in published state if any one of the questionnaire is in published state

    Scenario Outline: Admin adds all the fields for the questionnaire
        Given I am on the dashboard screen
        When I click the create new questionnaire button
        Then I should see the questionnaire creation screen
        When I enter Unique Public Name in the public name field
        * I enter internal name in the internal name field
        * I enter questionnaire description in the Description field as "test data results"
        * I select door from the asset type dropdown
        * I select <type> from the questionnaire type options
        * I select british english from the language dropdown
        * I select "FABRICATION" from service record list
        * I click the create questionnaire button
        Then I should read a message stating that "Questionnaire created successfully"

        Examples:
        | type  |
        | "yes" |

    Scenario: Admin changes the status of the questionnaire
        Given I am on the Questionnaire management sections for versions
        When I add a new question to the page 1 in section 1
        When I click the textbox button
        When I click on save button for section 1
        Then I should read a message stating that "1 sections saved successfully"
        When I click the cancel button
        Then I should be redirected to questionnaire version listing screen
        Then I should see the version table header containing '["NAME", "LAST EDITED", "EDITED BY", "STATUS"]'
        When I change the status of the version to testing
        When I click on back to all questionnaire
        Then I should be redirected to the questionnaire listing screen
        When I search by public name in questionnaire listing
        Then I should see the status as "Testing"
        When I click on the questionnaire
        When I change the status of the version to publish
        When I click on back to all questionnaire
        Then I should be redirected to the questionnaire listing screen
        When I search by public name in questionnaire listing
        Then I should see the status as "Published"
        When I click on the questionnaire
        When I click the duplicate button
        Then I should see a confirmation modal to select the version
        When I select the version of the questionnaire
        When I click the confirm duplicate button
        Then I should see the new version created
        When I change the status of the version to publish
        When I click the cancel button
        When I change the status of the version to publish
        When I click the publish button
        When I click on back to all questionnaire
        Then I should be redirected to the questionnaire listing screen
        When I search by public name in questionnaire listing
        Then I should see the status as "Published"
