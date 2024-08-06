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

 
  @create_question
  Scenario: Admin adds multiple section
    Given I am on the questionnaire management section
    When I click on add new section
    Then I should read a message stating that "Section 1 saved successfully"
    Then I should see the new section added

  @create_question
  Scenario: Admin adds multiple pages
    Given I am on the questionnaire management section
    When I click on add new page
    Then I should see the new pages added

  @create_question
  Scenario: Admin saves added section
    Given I am on the questionnaire management section
    When I click on add new section
    Then I should read a message stating that "Section 1 saved successfully"
    When I click on save button for section 2
    Then I should read a message stating that "Section 2 saved successfully"

  @create_question
  Scenario: Admin deletes addeded pages from the section
    Given I am on the questionnaire management section
    When I click on add new page
    Then I should see the new pages added
    When I click on delete page from section 1
    Then The page should be deleted from section

  @create_question
  Scenario: Admin deletes added section
    Given I am on the questionnaire management section
    When I click on delete section 1
    Then I should read a message stating that "Section 1 deleted successfully"
