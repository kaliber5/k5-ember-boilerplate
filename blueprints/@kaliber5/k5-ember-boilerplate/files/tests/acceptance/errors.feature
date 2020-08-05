@setupApplicationTest
Feature: Errors


Scenario: Page not found when visiting [URL]

  When I visit URL "[URL]"
  Then there should be an Error-Message
  And the Title in the Error-Message should have text "Etwas ist schiefgelaufen!"
  And the Description in the Error-Message should have text "Seite wurde nicht gefunden."
  And the Link in the Error-Message should have text "zurück zur Startseite"
  And the Link in the Error-Message should have HTML attr "href" with value "/"

Where:
    --------
    | URL  |
    | /xxx |
    --------
