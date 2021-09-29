@setupApplicationTest
Feature: Errors


Scenario: Page not found when visiting [URL]

  When I visit URL "[URL]"
  Then there should be an Error-Message
  And the Title in the Error-Message should have text "Something went wrong!"
  And the Description in the Error-Message should have text "Page not found."
  And the Link in the Error-Message should have text "Back to homepage"
  And the Link in the Error-Message should have HTML attr "href" with value "/"

Where:
    --------
    | URL  |
    | /xxx |
    --------
