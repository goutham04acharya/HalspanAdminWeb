Feature: Halspan - Admin - View List of All Available Questionnaire
    As an Admin, I want to view list of all available questionnaries.
    Conditions of Satisfaction
    The homepage should display a paginated list of questionnaries (Sorted Alphabetically).
    There should be a search box (allowing search on questionnaries name) and a filter for asset type (Drop down list of asset types).
    Search and filters option should be available by Non-Tag/Ad-hoc
    There must be an option to  create a questionnaire
    If there are no questionnaries then an empty screen must be displayed
    Users should be able to perform a search and apply filters at the same time to refine their results.

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "Auth@123"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_questionnaire
  Scenario: Invalid search attempt
    Given I am in questionnaire listing screen
    When I enter search term as <search_term>
    Then I should read a message stating that "We couldn't find any items matching your filter criteria."

    Examples:
      | search_term  |
      | "suggwh"     |
      | "562563576g" |
      | "!@#$%^&*"   |

  Scenario: Searching by internal name
    Given I am in questionnaire listing screen
    When I search by internal name
    Then The results should display questionnaries matching the internal name

  Scenario: Searching by public name
    Given I am in questionnaire listing screen
    When I search by public name
    Then The results should display questionnaries matching the public name

  Scenario: Searching by description
    Given I am in questionnaire listing screen
    When I search by description
    Then The results should display questionnaries matching the description

  Scenario: Filter by asset type
    Given I am in questionnaire listing screen
    When I select asset type from the filter dropdown
    Then The results should be refined to show questionnaries of the selected asset type


