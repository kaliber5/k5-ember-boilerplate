@setupApplicationTest
Feature: Index page


Scenario: Homepage renders
  When I visit URL "/"
  Then the Welcome-Title should have text "Willkommen"
