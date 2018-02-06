export const PQL = {
  rank: 1,
  event: "Signed Up",
  source: "PQL",
  source_date: "2018-01-30T09:00:00+01:00",
  details: "https://app.drift.com/welcome/drift",
  user_id: "5a706afbea630f61d107fa72"
};

export const MQL = {
  rank: 2,
  event: "Email Captured",
  source: "MQL",
  source_date: "2018-01-30T09:00:00+01:00",
  details: "https://blog.drift.com/how-to-launch-a-product/",
  user_id: "5a706afbea630f61d107fa72"
};

export const CQL = {
  rank: 1,
  source: "CQL",
  event: "Email Captured",
  source_date: "2018-01-30T09:00:00+01:00",
  details: "https://www.drift.com/the-secret-to-more-sales-meetings/?utm_source=hs_email&utm_medium=email&utm_content=60270895&_hsenc=p2ANqtz-8fHLrBObG46PNIorb43X0kLdYB5bIrRR10D4yA3aeV80FK3bN94K0kxVu5Soy8l3QL7IBwnrKuJUVXL750nDZembu4-A&_hsmi=60270895",
  user_id: "5a706afbea630f61d107fa72"
};

const GROWTH = {
  rank: 3,
  source: "Growth",
  source_date: "2018-01-30T09:00:00+01:00",
  user_id: "5a706afbea630f61d107fa72"
};

export const GROWTH_CLEARBIT = {
  ...GROWTH,
  event: "User created",
  details: "Anonymous Drift Visit"
};

export const GROWTH_VISIT = {
  ...GROWTH,
  event: "page",
  details: "Anonymous Drift Visit",
  utm_source: "www.thelonelypixel.co.uk",
  utm_campaign: "widget-referral"
};

export const GROWTH_SIFTERY = {
  ...GROWTH,
  event: "Siftery",
  details: "Siftery"
};

export const GROWTH_G2CROWD = {
  ...GROWTH,
  event: "G2Crowd",
  details: "G2Crowd"
};
