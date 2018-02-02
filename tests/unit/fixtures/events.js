export const EMAIL_CAPTURE_BLOG = {
  context: {
    location: {
      latitude: 52.2093,
      longitude: 0.1482
    },
    page: {
      url:
        "https://www.drift.com/the-secret-to-more-sales-meetings/?utm_source=hs_email&utm_medium=email&utm_content=60270895&_hsenc=p2ANqtz-8fHLrBObG46PNIorb43X0kLdYB5bIrRR10D4yA3aeV80FK3bN94K0kxVu5Soy8l3QL7IBwnrKuJUVXL750nDZembu4-A&_hsmi=60270895"
    }
  },
  created_at: "2018-01-30T12:54:33Z",
  event: "Email Captured",
  event_source: "segment",
  event_type: "track",
  properties: {
    email_value: "lawrence@2simple.com"
  }
};

export const EMAIL_CAPTURE_MAIN = {
  context: {
    location: {
      latitude: 43.4106,
      longitude: -80.5011
    },
    page: {
      url: "https://blog.drift.com/how-to-launch-a-product/"
    }
  },
  created_at: "2018-01-30T11:40:53Z",
  event: "Email Captured",
  event_source: "segment",
  event_type: "track",
  properties: {
    email_value: "cam.davies@gmail.com"
  }
};

export const SIGNED_UP = {
  context: {
    location: {
      latitude: 28.6667,
      longitude: 77.2167
    },
    page: {
      url: "https://app.drift.com/welcome/drift"
    }
  },
  created_at: "2018-01-30T05:11:04Z",
  event: "Signed Up",
  event_source: "segment",
  event_type: "track",
  properties: {
    context: "widget-onboarding",
    email: "kartikey.porwa@gmail.com",
    org_id: 94193,
    via: "getstarted"
  }
};

export const CLEARBIT_PROSPECT = {
  context: {
    location: {},
    page: {}
  },
  created_at: "2018-02-01T16:38:00Z",
  event: "User created",
  event_source: "Clearbit",
  event_type: "user_created",
  properties: {
    "clearbit/employment_role": "marketing",
    "clearbit/employment_seniority": "executive",
    "clearbit/employment_title":
      "VP, Marketing Strategy, Analysis, Programmatic Media Buying",
    "clearbit/full_name": "Louisa Wee",
    "clearbit/prospect_id": "e_ed3349d9-053b-43d3-9951-93b147a8132b",
    "clearbit/prospected_at": "2018-02-01T16:37:23Z",
    "clearbit/prospected_from": "5a680c04850dc3cc310039c4",
    "clearbit/source": "prospector",
    "clearbit/verified": true,
    created_at: "2018-02-01T16:38:00Z",
    email: "lwee@netflix.com",
    first_name: "Louisa",
    last_name: "Wee"
  }
};

export const G2CROWD = {
  context: {
    location: {},
    page: {}
  },
  created_at: "2018-02-02T10:15:31Z",
  event: "Visited G2Crowd Page",
  event_source: "scheduled-calls",
  event_type: "track",
  properties: {
    "At Time": "February 01, 2018 06:27 PM CST",
    Country: "Canada (CA)",
    "First User Visited": "/products/drift/reviews",
    "First Visit": "G2 Crowd",
    Industry: "unknown",
    Organization: "unknown",
    "Then User Visited": "https://www.drift.com/",
    "Time Between Events": "42 minutes"
  }
};
