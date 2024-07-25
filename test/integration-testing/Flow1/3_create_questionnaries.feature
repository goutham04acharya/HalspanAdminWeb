@1.0
Feature: Halspan - Admin - Create the Questionnaire

        As an Admin, I want an option to create the questionnaire
        Conditions of Satisfaction
        There must be an option to add a Public name and it should be unique
        There must be an option to add an Internal name
        There must be an option to add a description.
        There must be an option to choose the Asset Type (door).
        There must be an option to choose if it is a non-tag questionnaire/ Ad-hoc or tag questionnaire
        There must be an option to choose the language (British English).
        The questionnaire must be in a draft state when the questionnaire is created initially
        The questionnaire ID must be auto-generated once created.
        When the questionnaire is created a version must be created for that questionnaire

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
        * I click the create questionnaire button
        Then I should read a message stating that "Questionnaire created successfully"

        Examples:
            | type  |
            | "yes" |
            | "no"  |