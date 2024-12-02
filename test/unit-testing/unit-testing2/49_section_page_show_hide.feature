@1.0
Feature: Halspan - Admin - Show/hide sections and page
    Show/hide of sections and page

    Scenario: Admin logs in with valid credentials
        Given I am on the login page
        When I enter valid email address as "nayana.sk@7edge.com"
        * I enter valid password as "dApje7-nepnig-vibqyc"
        * I click the submit button
        Then I should be redirected to the questionnaire listing screen

    @create_question
    Scenario: Admin adds the questions and adds the condition to show and hide sections
        Given I am on the questionnaire management section
        Then I should see an add field section
        When I add a new question to the page 1 in section 1
        When I click the textbox button
        Then I should see field settings
        When I enter the label name for textbox for preview
        Then I should see the label name for textbox updated in the section 1 page 1 question 1
        When I enter the help text for textbox for preview
        Then I should see the help text for textbox updated in the section 1 page 1 question 1
        When I enter the placeholder content for textbox for preview
        Then I should see the placeholder content for textbox updated in the section 1 page 1 question 1
        When I select the type as "single_line"
        * I enter the minimum and maximum number of characters
        When I click the save button for the questionnaire version for section 1

        When I click on add new page for section 1
        When I add a new question to the page 2 in section 1
        When I click the choice button
        Then I should see field settings
        When I enter the label name for choice for preview
        Then I should see the label name for choice updated in the section 1 page 2 question 1
        When I enter the help text for choice for preview
        Then I should see the help text for choice updated in the section 1 page 2 question 1
        When I enter the placeholder content for choice for preview
        Then I should see the placeholder content for choice updated in the section 1 page 2 question 1
        When I select the choice type as "single_choice"
        * I enter the text for choices as "Good, Satisfied, Unsatisfied"
        When I click the add conditional logic button for page 2
        Then I should see the advanced editor for page
        When I enter the conditional logic for page
        Then I click the save button for conditional logic
        And I should see the updated condition logic button for page 2
        When I click the save button for the questionnaire version for section 1

        When I click the preview button
        Then I should see the mobile preview
        # Then I validate the data entered exists in the mobile preview for section 1 page 1
        When I enter the text as "random" in textbox for section 1 page 1 question 1
        When I click the next button
        Then I should not see the page 2 at section 1
        When I click the back button
        When I enter the text as "Inspector" in textbox for section 1 page 1 question 1
        Then I should see the page 2 at section 1
        When I select the choice as "Good" in choice field for section 1 page 2 question 1

        When I click on add new section
        When I add a new question to the page 1 in section 2
        When I click the textbox button
        Then I should see field settings
        When I enter the label name for textbox for preview
        Then I should see the label name for textbox updated in the section 2 page 1 question 1
        When I enter the help text for textbox for preview
        Then I should see the help text for textbox updated in the section 2 page 1 question 1
        When I enter the placeholder content for textbox for preview
        Then I should see the placeholder content for textbox updated in the section 2 page 1 question 1
        When I select the type as "single_line"
        * I enter the minimum and maximum number of characters
        When I click the add conditional logic button for section 2
        Then I should see the advanced editor for section
        When I enter the conditional logic for section
        Then I click the save button for conditional logic
        And I should see the updated condition logic button for section 2
        When I click the save button for the questionnaire version for section 2

        When I click the preview button
        Then I should see the mobile preview
        When I enter the text as "random" in textbox for section 1 page 1 question 1
        When I click the next button
        Then I should not see the page 2 at section 1
        When I click the back button
        When I enter the text as "Inspector" in textbox for section 1 page 1 question 1
        When I click the next button
        Then I should see the page 2 at section 1
        When I select the choice as "Unsatisfied" in choice field for section 1 page 2 question 1
        When I click the next button
        Then I should not see the section 2
        When I click the back button
        When I select the choice as "Good" in choice field for section 1 page 2 question 1
        When I click the next button
        Then I should see the page 1 at section 2
        When I enter the text as "Test" in textbox for section 2 page 1 question 1

