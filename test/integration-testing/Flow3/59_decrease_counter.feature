    @1.0
Feature:Feature: Brief About Feature
As a admin, I want to see the image/video/files count decrease by one as I upload

    @create_question
    Scenario: Admin adds the label, help text and placeholder content
        Given I am on the questionnaire management section
        When I add a new question to the page 1 in section 1
        When I click the photos button
        When I add a new question to the page 1 in section 1
        When I click the videos button
        When I add a new question to the page 1 in section 1
        When I click the files button

    Scenario: Admin validates all the data added on to the field settings of the questionnaire
        Given I am on the Questionnaire management sections
        When I click the preview button
        Then I should see the mobile preview
        When I upload "photo" for section 1 page 1 question 1 and check counter
        When I upload "video" for section 1 page 1 question 2 and check counter
        When I upload "file" for section 1 page 1 question 3 and check counter