@1.0
Feature: Halspan - Admin - View All Type of Fields to Create the Forms
    As an Admin, I want an option to view all the type of fields to create the forms
    Conditions of Satisfaction
    There must be an option to view all the type of fields to create the forms
    Information to be displayed
    Text fields
    Choice fields
    Number fields
    Date/Time fields
    Floorplans
    Photos
    Videos
    Files
    GPS
    Display Content
    Signature
    Tag Scan
    Add Compliance Logic

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        * I enter valid password as "Auth@123"
        * I click the submit button
        Then I should be redirected to the questionnaire listing screen

    @create_question
    Scenario: Admin views all types of field to create the form
        Given I am on the questionnaire management section
        Then I should see the add field
        * I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'