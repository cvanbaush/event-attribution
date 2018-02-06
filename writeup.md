## Purpose:
  We'd like to be able to track where leads are coming from. We want to know there first action and their latest action with Drift.

## New Traits on both the Account and User -
  Original Source Fields:
      lead_details
      lead_source
      source_timestamp
  Latest Source Fields:
      last_lead_source
      last_lead_details
      last_source_timestamp

## Sources, Details and how to determine an event ranked by priority:
- 1 Source: PQL

    Details:
    ```
    properties.billing_plan, context.page.url, properties.type [first non null]
    ```

    Event:
    ```
    event == "Signed Up" OR event == "Started Subscription"
    ```

- 1 Source: CQL
    Details:
    ```
    page.url
    ```
    Event:
    ```
    event == "Email Captured" AND context.page.url is a drift.com page (exclude blog)
    ```

- 2 Source: MQL
    Details:
    ```
    page.url
    ```
    Event:
    ```
    event == "page" AND context.page.url is a blog.drift.com page
    ```

- 3 Source: Growth
    Details: Growlabs
    Event:
    ```
    user.salesforce_contact.lead_source == "Growlabs"
    ```

- 3 Source: Growth
    Details: G2Crowd
    Event:
    ```
    (event_source == "segment" AND propertiest.name == "G2Crowd")
    OR
    (event_source == "scheduled-calls" AND event contains "G2Crowd")
    ```

- 3 Source: Growth
    Details: Siftery
    Event:
    ```
    (event_source == "segment" AND properties.name == "Siftery")
    ```

- 4 Source: Growth
    Details: Anonymous Drift Visit
    Event:
    ```
    (event == "page" AND context.page.url is any drift page AND email is unknown)
    OR
    (event == "User created" AND event_source == "Clearbit")
    ```

### More Explanation:

For the original source fields, we'd like the highest ranking source & details on the oldest date that any of these events occurred. If two events of the same rank occur, we want the earliest in the day.

For the latest source fields, we'd like the highest ranking source & details on the most recent date that any of these events occurred. If two events of the same rank occur, we want the last in the day.

Everything has the same logic on the account level, but we of course want the oldest source across all users on that account for the original source and the latest across all for the latest.
