@1.0
Feature: Halspan - Admin - Change the Status of the Questionnaire version
    As an Admin, I want to Change the status of the questionnaire version
    Conditions of Satisfaction
    In the "Testing" state, only Halspan Admins should have access to view and review it. 
    When there is a change in the status to “Published” the existing Published version is moved to ‘Retired’. 
    After publishing, the version becomes unchangeable. (Once a Questionnaire has been published this will be the status unless it is fully retired.) 
    Once the status of the questionnaire is in "publish" the questionnaire will be published to the customer user. 
    There should be STATUS column with a drop down for each item showing its current status. 
    Once Published, the version can no longer be amended. 
    For a Questionnaire that is in testing there should be the option for a user to stop testing

  Scenario: Admin logs in with valid credentials
    Given I am on the login page
    When I enter valid email address as "nayana.sk@7edge.com"
    * I enter valid password as "dApje7-nepnig-vibqyc"
    * I click the submit button
    Then I should be redirected to the questionnaire listing screen

  @create_question
  Scenario: Admin edits the public, intenal name, description, language and asset Type
    Given I am on the questionnaire version listing screen
    Then I should see the version table header containing '["NAME", "LAST EDITED", "EDITED BY", "STATUS"]'
    When I change the status of the version to testing
    When I change the status of the version to publish
    When I click on back to all questionnaire
    Then I should be redirected to the questionnaire listing screen
