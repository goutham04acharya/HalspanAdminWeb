    @1.0
Feature: This is for testing purpose only
Testing purpose only

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        When I enter valid password as "dApje7-nepnig-vibqyc"
        When I click the submit button
        Then I should be redirected to the questionnaire listing screen

    @create_question
    Scenario: Admin views all types of field and adds date/time field from the add field section
        Given I am on the questionnaire management section
        Then I should see the add field
        Then I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        # When I click the date/time button
        # Then I should see field settings
        # And I should see the date/time field added to the section 1 page 1 question 1
        # When I click the save button
        # Then I should read a message stating that "2 sections saved successfully"
        #
        # Scenario: Admin validates all the data added on to the field settings of the questionnaire
        # Given I am on the Questionnaire management sections
        # When I click the preview button
        # Then I should see the mobile preview
        # When I click the date/time for section 1 page 1 question 1
        # When I click the signature button
        # Then I should see field settings
        # And I should see the signature field added to the section 1 page 1 question 1
        When I click the photos button
        Then I should see field settings
        When I click the draw on image for photo as "yes"
        When I click the include metadata as "yes" 
        When I click the save button

    Scenario: Admin checks the preview for signature field
        Given I am on the Questionnaire management sections
        When I click the preview button
        Then I should see the mobile preview
        # When I enter the signature for section 1 page 1 question 1
        When I upload a invalid image to section 1 page 1 question 1
