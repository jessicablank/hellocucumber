Feature: Replicator Specifications 
As a Star Fleet Engineer, I want to test replicator setting
so that I know the replicator is working properly

# Background:
# Given the replicator is turned on
# And I am giving voice commands in range

@ID-1
Scenario: Earl Grey Tea
Given I say <order>
When I check the replicator
Then I should see <product>

@ID-2
Scenario: Pasta al Fiorella
Given I say <order>
When I check the replicator
Then I should see <product>

Examples:
| order               | product            |
| "Earl Grey Hot"     | "a hot cup of tea" |
| "Pasta al Fiorella" | "a pasta bowl"     |