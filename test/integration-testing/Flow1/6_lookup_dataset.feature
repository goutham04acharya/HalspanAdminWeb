@1.0
Feature: Halspan - Admin- Lookup data set
        As an Admin, I want to create and view the lookup dataset within the system so that I can refer it later.
        Condition of Satisfaction
        There must be an option to enter the label name
        There must be an option to enter the Help text
        There must be an option to enter the Placeholder content
        There must be an option to enter the Default content.
        There must be an option to enter the Field type ( Single Choice, Multichoice, Dropdown)
        When clicked on lookup, there must be an option to import the lookup dataset
        There must be an option to add the choices
        There must be an option to select the source ( Fixed list, Lookup)
        There must be an option for the Admin to enter the minimum and maximum number of choice
        There must be an option to select if the data selected must be loaded or not
        There must be an option to select if the text field is read only
        There must be an option to select if the text field is visible or not.
        There must be an option to enable or disable the Remember allowed field
        There must be an option to enable or disable the Field mask
        There must be an option to enter the Admin field notes
        Lookup Datasets can be created or edited by a Halspan Admin through the Admin Area.
        Each Lookup Dataset will have a unique name and will either be of text or number type.

        The Items within the Dataset will each have:
        An ID number, this will be automatically assigned when the Item is first created.
        A value, this is the value that will display to the User.
        The Items within the Dataset can be populated by:
        Manually entering them in the Admin Area either individually or in bulk (comma separated list).
        When saved any alteration will be immediately reflected throughout the system. (Excluding offline Questionnaires which will be updated when next connected).
        Deleting an item will not remove it from a previously completed Questionnaires data but will remove it as an option in the future. (It will only remove from offline when the next sync is performed)
        Lookup dataset is applicable for Single line, Multi line and Dropdown.
        There must be an option to view and select the previously added lookup dataset.
        
        Information to display
        Lookup Dataset ID
        Lookup Dataset Name
        Section

        page 1
        Questionnaire 1
        Questionnaire 2
        Section

        page 1
        Questionnaire 1

    Scenario: Admin navigates to the lookup dataset page
        Given I am in questionnaire listing screen
        When I click the lookup dataset button
        Then I should be redirected to the lookup dataset listing screen

    @create_lookup_dataset
    Scenario: List all lookup dataset
        Given I am on the lookup dataset listing screen
        Then I should see the table header containing '["ID", "NAME", "ACTION"]'

    Scenario: Admin cancels the create lookup dataset
        Given I am on the lookup dataset listing screen
        When I click the create lookup dataset button
        Then I should see a popup window to create lookup dataset
        When I enter the name of the lookup dataset
        * I enter the choices in csv format
        * I click the close button
        Then I should be redirected to the lookup dataset listing screen

    Scenario: Import Invalid file with 600 data for lookup dataset
        Given I am on the lookup dataset listing screen
        When I click the create lookup dataset button
        Then I should see a popup window to create lookup dataset
        When I upload the valid file csv as "600.csv"
        Then I should read a message stating that "Only 500 data entries are accepted."

    Scenario: Import the valid lookup dataset
        Given I am on the lookup dataset listing screen
        When I click the create lookup dataset button
        Then I should see a popup window to create lookup dataset
        When I upload the valid file csv as "bddtest-lookup-data.csv"
        Then I should read a message stating that "Created new lookup dataset successfully"

    Scenario: Delete the uploaded dataset
        Given I am on the lookup dataset listing screen
        When I search by the name "bddtest-lookup-data"
        When I click the delete option for a searched lookup dataset
        Then I should see a confirmation prompt for deletion
        When I click the confirm button
        Then I should read success message for delete user

    Scenario: Admin tries to create the lookup dataset with empty fields
        Given I am on the lookup dataset listing screen
        When I click the create lookup dataset button
        When I click the create button
        Then I should read a message stating that "This field is mandatory"
        When I enter the name of the lookup dataset
        When I enter the invalid choices in csv format 
        When I click the create button
        Then I should read a message stating that "All values are mandatory"

    Scenario: Admin creates the lookup dataset
        Given I am on the lookup dataset listing screen
        When I click the create lookup dataset button
        Then I should see a popup window to create lookup dataset
        When I enter the name of the lookup dataset
        * I enter the choices in csv format
        * I click the create button
        Then I should read a message stating that "Created new lookup dataset successfully"

    Scenario: Invalid search attempt
        Given I am on the lookup dataset listing screen
        When I search by the name "random12321"
        Then I should read a message stating that "We're sorry, but we couldn't find any results matching your search query."

    Scenario: Searching by lookup dataset name
        Given I am on the lookup dataset listing screen
        When I search by the name
        Then The results should display lookup dataset matching the name

    Scenario: View and edit the lookup dataset
        Given I am on the lookup dataset listing screen
        Then I should see the table header containing '["ID", "NAME", "ACTION"]'
        When I search recently created lookup dataset by bddtest
        # When I click on the view dataset
        # When I click on cancel button
        When I click on the view dataset
        When I click on close button
        When I click on the view dataset
        Then I should see a popup window to view lookup dataset
        When I edit the lookup data set name
        # When I edit the values in lookup dataset
        When I delete the values in lookup dataset
        When I add the values to lookup dataset
        When I click on update button
        Then I should read a message stating that the lookup dataset has been updated