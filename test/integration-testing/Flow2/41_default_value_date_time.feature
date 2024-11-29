@1.0
Feature: Halspan - Admin - Implement default values of Date Fields
    As an Admin, I want to implement the default values of Date fields based on the values
    Condition of Satisfaction
    There must be an option to choose the following functions when calculating the default value for the Date and Time FieldsAddDays(Number), AddHours(Number), AddMinutes(Number), AddMonths(Number), Date, Day, Day of week, DayofYear, Hour, Millisecond, Minute,Month, Second
    AddDays(Number): Adds a specified number of days to the current date.
    Example If today is June 18, 2024, and you apply AddDays(5), it will return June 23, 2024
    AddHours(Number): Adds a specified number of hours to the current date and time.
    Example If the current date and time is June 18, 2024, 12:00 PM, and you apply AddHours(5), it will return June 18, 2024, 5:00 PM.
    AddMinutes(Number): Adds a specified number of minutes to the current date and time.
    Example If the current date and time is June 18, 2024, 12:00 PM, and you apply AddMinutes(30), it will return June 18, 2024, 12:30 PM.
    AddMonths(Number): Adds a specified number of months to the current date.
    Example If today is June 18, 2024, and you apply AddMonths(2), it will return August 18, 2024.
    Date: Returns the current date.
    Default Value: If today is June 18, 2024, it will return June 18, 2024.
    Day: Returns the day of the month from a date.
    Example If the date is June 18, 2024, it will return 18.
    Day of week: Returns the day of the week for a date.
    Example If the date is June 18, 2024, which is a Tuesday, it will return Tuesday.
    DayOfYear: Returns the day of the year for a date.
    Example If the date is June 18, 2024, it will return 170 (as June 18 is the 170th day of the year in a non-leap year).
    Hour: Returns the hour from a date and time.
    Example If the time is 5:30 PM, it will return 17.
    Millisecond: Returns the milliseconds from a date and time.
    Example If the time is 5:30:15.123 PM, it will return 123.
    Minute: Returns the minute from a date and time.
    Example If the time is 5:30 PM, it will return 30.
    Month: Returns the month from a date.
    Example If the date is June 18, 2024, it will return 6.
    Second: Returns the second from a date and time.
    Example If the time is 5:30:15 PM, it will return 15.
    There must be an option for the user to include the constant values.
    There must be an option to include the Today.
    There must be an option to include the if-then-else condition
    There must be an option to include Add Days
    There must be an option to include Year of Date
    Date fields can be combined using the OR and & Operator

  @create_question
  Scenario: Admin views all types of field to create the form
    Given I am on the questionnaire management section
    Then I should see the add field
    And I should see types of field '["Textbox", "Choice", "Date / Time", "Tag Scan", "Floorplan", "Photo", "Video", "File", "GPS", "Number", "Display", "Signature", "Asset Location", "Compliance"]'

  @create_question
  Scenario: Admin adds date/time field from the add field section
    Given I am on the questionnaire management section
    Then I should see an add field section
    When I add a new question to the page 1 in section 1
    When I click the date/time button
    And I should see the date/time field added to the section 1 page 1 question 1
    When I enter the label name for date/time
    Then I should see the label name for date/time updated in the section 1
    When I enter the help text for date/time
    Then I should see the help text for date/time updated in the section 1
    When I enter the placeholder content for date/time
    Then I should see the placeholder content for date/time updated in the section 1
    When I click the save button for the questionnaire version

    When I click on add new section
    Then I should see the new section added
    When I add a new question to the page 1 in section 2
    When I click the date/time button
    And I should see the date/time field added to the section 2 page 1 question 1
    When I enter the label name for date/time
    Then I should see the label name for date/time updated in the section 2
    When I enter the help text for date/time
    Then I should see the help text for date/time updated in the section 2
    When I enter the placeholder content for date/time
    Then I should see the placeholder content for date/time updated in the section 2
    
    # When I click the add default value button
    # Then I should see the default value advanced editor for date/time field
    # When I select the question from the default value suggestions for date/time field
    # When I click the cancel button
    # Then I should see field settings

    When I click the add default value button
    Then I should see the default value advanced editor for date/time field
    When I enter the default value correct conditional logic for date/time field
    Then I click the save button for default value
    And I should see the conditional logic in default value field for date/time