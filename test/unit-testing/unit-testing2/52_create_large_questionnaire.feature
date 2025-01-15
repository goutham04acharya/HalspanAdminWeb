    @1.0
Feature: Create 20 sections with 5 pages each and all the fields.
I want to test the load of mobile submission

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        When I enter valid password as "dApje7-nepnig-vibqyc"
        When I click the submit button
        Then I should be redirected to the questionnaire listing screen

    @create_question
    Scenario: Admin adds 4 pages each
        Given I am on the questionnaire management section
        Then I should see an add field section
        When I add 4 pages to the section 0

    Scenario Outline: Admin adds 20 sections and 5 pages each
        Given I am on the Questionnaire management sections
        Then I should see an add field section
        When I click the add section button for <section>
        When I add 4 pages to the section <section>

        Examples:
        | section |
        | 1  |
        | 2  |
        | 3  |
        | 4  |
        | 5  |
        | 6  |
        | 7  |
        | 8  |
        | 9  |
        | 10 |
        | 11 |
        | 12 |
        | 13 |
        | 14 |
        | 15 |
        | 16 |
        | 17 |
        | 18 |
        | 19 |
        
    Scenario Outline: Add the questions inside the each pages andd sections
        Given I am on the Questionnaire management sections
        When I click on the section <section>
        When I add questions to pages of section <section>

        Examples:
        | section |
        | 0  |
        | 1  |
        | 2  |
        | 3  |
        | 4  |
        | 5  |
        | 6  |
        | 7  |
        | 8  |
        | 9  |
        | 10 |
        | 11 |
        | 12 |
        | 13 |
        | 14 |
        | 15 |
        | 16 |
        | 17 |
        | 18 |
        | 19 |