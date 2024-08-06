Feature: Halspan - Admin - Organizing into Multiple Section, Pages
    As an Admin, I want to create a questionnaire form by organizing it into multiple sections, pages
    Conditions of Satisfaction
    The Questionnaire should have a hierarchical configuration for organising Questions such as Questionnaire -> Section -> Page ->Question.
    Any pages without fields will be ignored when published.
    There must be an option to add a page in the Questionnaire.
    There must be an option to add the sections in the Questionnaire.
    There must be an option to add the fields in the Questionnaire.
    There can be multiple pages under the sections in the Questionnaire
    There can be multiple questions in a single page.
    There can be multiple section in a questionnaire

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "Auth@123"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

#   @create_question
#   Scenario: Admin adds multiple section
#     Given I am on the questionnaire management section
#     When I click on add new section
#     Then I should read a message stating that "Section 1 saved successfully"
#     Then I should see the new section added

#   @create_question
#   Scenario: Admin adds multiple pages
#     Given I am on the questionnaire management section
#     When I click on add new page
#     Then I should see the new pages added

#   @create_question
#   Scenario: Admin saves added section
#     Given I am on the questionnaire management section
#     When I click on add new section
#     Then I should read a message stating that "Section 1 saved successfully"
#     When I click on save button for section 2
#     Then I should read a message stating that "Section 2 saved successfully"

#   @create_question
#   Scenario: Admin deletes addeded pages from the section
#     Given I am on the questionnaire management section
#     When I click on add new page
#     Then I should see the new pages added
#     When I click on delete page from section 1
#     Then The page should be deleted from section

  @create_question
  Scenario: Admin deletes added section
    Given I am on the questionnaire management section
    When I click on delete section 1
    Then I should read a message stating that "Section 1 deleted successfully"

    # Scenario: Admin dynamically adds and deletes a page
    #     Given I am on the questionnaire management section
    #     When I click the add page button inside section with name "Section 1"
    #     Then I should see a new page with the name "Page 2" added in "Section 1"
    #     When I click the delete icon for the page with the name "Page 2" in "Section 1"
    #     Then I should not see the page with the name "Page 2" in "Section 1"
    # Scenario: Admin adds a page to the section
    #     Given I am on the questionnaire management section
    #     When I click the add page button inside section with name "Section 1"
    #     Then I should see a new page with the name "Page 2" added in "Section 1"
    #     When I add a new question to the page 2 in section 1
    #     And I enter the question in the page 2 in section 1
    #     Then I should see the question added in page 2 of section 1
    # Scenario: Admin saves the section
    #     Given I am on the questionnaire management section
    #     When I click the save button for section 1
    #     Then I should see the section 1 saved
    # Scenario: Admin dynamically adds and deletes a section
    #     Given I am on the questionnaire management section
    #     When I click the add section button
    #     Then I should see a new section with the name "Section 2" added
    #     And the new section should contain a page with the name "Page 1"
    #     When I click the delete icon for the section with the name "Section 2"
    #     Then I should not see the section with the name "Section 2" in the questionnaire
    # Scenario: Admin dynamically adds a section
    #     Given I am on the questionnaire management section
    #     When I click the add section button
    #     Then I should see a new section with the name "Section 2" added
    # Scenario: Admin adds a questions to the page in section 2
    #     Given I am on the questionnaire management section
    #     When I add a new question to the page 1 in section 2
    #     And I enter the question in the page 1 in section 2
    #     Then I should see the question added in page 1 of section 2
    # Scenario: Admin dynamically adds and deletes a page
    #     Given I am on the questionnaire management section
    #     When I click the add page button inside section with name "Section 2"
    #     Then I should see a new page with the name "Page 2" added in "Section 2"
    #     When I click the delete icon for the page with the name "Page 2" in "Section 2"
    #     Then I should not see the page with the name "Page 2" in "Section 2"
    # Scenario: Admin adds a page to the section
    #     Given I am on the questionnaire management section
    #     When I click the add page button inside section with name "Section 2"
    #     Then I should see a new page with the name "Page 2" added in "Section 2"
    #     When I add a new question to the page 2 in section 2
    #     And I enter the question in the page 2 in section 2
    #     Then I should see the question added in page 2 of section 2
    # Scenario: Admin saves the section
    #     Given I am on the questionnaire management section
    #     When I click the save button for section 2
    #     Then I should see the section 2 saved
    # Scenario: Admin saves the questionnaire vesion
    #     Given I am on the questionnaire management section
    #     When I click the save button for the questionnaire version
    #     Then I should read a message stating that "Questionnaire saved successfully"
