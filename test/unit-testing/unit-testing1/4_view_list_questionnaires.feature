Feature: Halspan - Admin - View List of All Available Questionnaire
    As an Admin, I want to view list of all available questionnaires.
    Conditions of Satisfaction
    The homepage should display a paginated list of Questionnaires (Sorted Alphabetically).
    There should be a search box (allowing search on Questionnaires name) and a filter for asset type (Drop down list of asset types).
    Search and filters option should be available by Non-Tag/Ad-hoc
    There must be an option to  create a questionnaire
    If there are no questionnaires then an empty screen must be displayed
    Users should be able to perform a search and apply filters at the same time to refine their results.

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        * I enter valid password as "Auth@123"
        * I click the submit button
        Then I should be redirected to the questionnaire listing screen

    Scenario: Display an empty screen with an appropriate message if no questionnaires exist
        Given I am on the main dashboard
        And no questionnaires exist
        Then I should receive a message stating that 'No questionnaires available.'

    Scenario: Admin adds all the fields for the questionnaire
        Given I am on the main dashboard
        When I click the create new questionnaire button
        Then I should see the questionnaire creation screen
        When I enter Unique Public Name in the public name field
        * I enter internal name in the internal name field
        * I enter questionnaire description in the Description field
        * I select door from the asset type dropdown
        * I select "yes" from the questionnaire type options
        * I select british english from the language dropdown
        * I click the create questionnaire button
        Then I should receive a message stating that "Questionnaire created successfully"

    Scenario: Display a message if no matching questionnaires are found for searched internal name
        Given I am on the main dashboard
        When I enter internal name as "random1212" in the search box
        Then I should receive a message stating that 'No questionnaires match your search criteria'

    Scenario: Display a message if no matching questionnaires are found for searched public name
        Given I am on the main dashboard
        When I enter public name as "random817281" in the search box
        Then I should receive a message stating that 'No questionnaires match your search criteria'

    Scenario: Display a message if no matching questionnaires are found for searched description
        Given I am on the main dashboard
        When I enter description as "random817281" in the search box
        Then I should receive a message stating that 'No questionnaires match your search criteria'

    Scenario: Display a message if no matching questionnaires are found after filtering
        Given I am on the main dashboard
        When I select asset type as window from the filter dropdown
        Then I should receive a message stating that 'No questionnaires match the selected asset type'

    Scenario: Display a message if no matching questionnaires are found after searching and filtering
        Given I am on the main dashboard
        When I enter a questionnaire name in the search box
        And I select an asset type from the filter dropdown
        Then I should receive a message stating that 'No questionnaires match your search and filter criteria'

    Scenario: Admin see's a paginated list of questionnaires sorted alphabetically
        Given I am on the main dashboard
        Then I should see a paginated list of questionnaires sorted alphabetically

    Scenario: Search box for querying by internal name
        Given I am on the main dashboard
        When I enter a internal name in the search box
        Then the results should display questionnaires matching the internal name

    Scenario: Search box for querying by public name
        Given I am on the main dashboard
        When I enter a public name in the search box
        Then the results should display questionnaires matching the public name

    Scenario: Search box for querying by description
        Given I am on the main dashboard
        When I enter description in the search box
        Then the results should display questionnaires matching the description

    Scenario: Filter dropdown for asset types to refine results
        Given I am on the main dashboard
        When I select an asset type from the filter dropdown
        Then the results should be refined to show questionnaires of the selected asset type

    Scenario: Search and filter simultaneously to refine results accurately
        Given I am on the main dashboard
        When I enter a questionnaire name in the search box
        And I select an asset type from the filter dropdown
        Then the results should display questionnaires matching the entered name and asset type
