@1.0
Feature: Halspan - Admin - Edit the Questionnaire(section name and page)
    Description
    As an Admin, I want to edit the section name and Page name in the Questionnaire
    Conditions of Satisfaction
    There must be an option to edit the section name.
    There must be an option to edit the page name.

    @create_question
    Scenario: Admin edits section name
        Given I am on the questionnaire management section
        When I double click the section 1 name
        When I enter the section 1 name
        When I double click the page 1 name
        When I enter the page 1 name
        Then I should see the updated section 1 name on the sidebar
        Then I should see the updated page 1 name on the sidebar

    Scenario: Admin creates multiple new section
        Given I am on the questionnaire management section
        When I click on add new section 3 times
        Then I should see sections created 
        When I click the section 3 from sidebar
