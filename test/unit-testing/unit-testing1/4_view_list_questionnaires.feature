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
        Given I am on the dashboard screen
        And no questionnaires exist
        Then I should read a message stating that 'No questionnaires available.'

    @create_questionnaire
    Scenario: Display a message if no matching questionnaires are found for searched internal name
        Given I am on the dashboard screen
        When I enter internal name as "random1212" in the search box
        Then I should read a message stating that 'No questionnaires match your search criteria'

    Scenario: Display a message if no matching questionnaires are found for searched public name
        Given I am on the dashboard screen
        When I enter public name as "random817281" in the search box
        Then I should read a message stating that 'No questionnaires match your search criteria'

    Scenario: Display a message if no matching questionnaires are found for searched description
        Given I am on the dashboard screen
        When I enter description as "random817281" in the search box
        Then I should read a message stating that 'No questionnaires match your search criteria'

    Scenario: Display a message if no matching questionnaires are found after filtering
        Given I am on the dashboard screen
        When I select asset type as window from the filter dropdown
        Then I should read a message stating that 'No questionnaires match the selected asset type'

    Scenario: Display a message if no matching questionnaires are found after searching internal name and filtering
        Given I am on the dashboard screen
        When I enter internal name as "random1212" in the search box
        And I select asset type as window from the filter dropdown
        Then I should read a message stating that 'No questionnaires match your search and filter criteria'

    Scenario: Display a message if no matching questionnaires are found after searching public name and filtering
        Given I am on the dashboard screen
        When I enter public name as "random817281" in the search box
        And I select asset type as window from the filter dropdown
        Then I should read a message stating that 'No questionnaires match your search and filter criteria'

    Scenario: Display a message if no matching questionnaires are found after searching description and filtering
        Given I am on the dashboard screen
        When I enter description as "random817281" in the search box
        And I select asset type as window from the filter dropdown
        Then I should read a message stating that 'No questionnaires match your search and filter criteria'

    # Updated based on the chronological order
    Scenario: Admin sees a paginated list of questionnaires sorted by recently created
        Given I am on the dashboard screen
        Then I should see a paginated list of questionnaires sorted by recently created

    Scenario: Search box for querying by internal name
        Given I am on the dashboard screen
        When I enter a internal name in the search box
        Then the results should display questionnaires matching the internal name

    Scenario: Search box for querying by public name
        Given I am on the dashboard screen
        When I enter a public name in the search box
        Then the results should display questionnaires matching the public name

    Scenario: Search box for querying by description
        Given I am on the dashboard screen
        When I enter description in the search box
        Then the results should display questionnaires matching the description

    Scenario: Filter dropdown for asset types to refine results
        Given I am on the dashboard screen
        When I select an asset type from the filter dropdown
        Then the results should be refined to show questionnaires of the selected asset type

    Scenario: Search internal name and filter simultaneously to refine results accurately
        Given I am on the dashboard screen
        When I enter a internal name in the search box
        And I select an asset type from the filter dropdown
        Then the results should display questionnaires matching the entered internal name and asset type

    Scenario: Search public name and filter simultaneously to refine results accurately
        Given I am on the dashboard screen
        When I enter a public name in the search box
        And I select an asset type from the filter dropdown
        Then the results should display questionnaires matching the entered public name and asset type

    Scenario: Search description and filter simultaneously to refine results accurately
        Given I am on the dashboard screen
        When I enter description in the search box
        And I select an asset type from the filter dropdown
        Then the results should display questionnaires matching the entered description and asset type
