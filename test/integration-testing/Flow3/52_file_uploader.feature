@1.0
Feature: Halspan - Admin uploads the file in mobile preview
    As a admin, I want to upload a file in the preview

    @create_question
    Scenario: Admin views all types of field and adds file field from the add field section
        Given I am on the questionnaire management section
        Then I should see the add field
        Then I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the files button
        Then I should see field settings
        And I should see the files field added to the section 1 page 1 question 1
        When I add a new question to the page 1 in section 1
        When I click the videos button
        Then I should see field settings
        And I should see the videos field added to the section 1 page 1 question 2
        When I click the save button for the questionnaire version for section 1

    Scenario: Admin uploads the video from multichoice in preview
        Given I am on the Questionnaire management sections
        When I click the preview button
        Then I should see the mobile preview
        When I click the next button
        Then I should read a message stating that "This is a mandatory field"
        When I upload file for section 1 page 1 question 1
        When I upload file for section 1 page 1 question 1
        When I remove an uploaded file
        When I upload video for section 1 page 1 question 2
        When I upload video for section 1 page 1 question 2
        When I remove an uploaded video

