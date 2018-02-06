/* eslint-env node, mocha */

import _ from "lodash";
import moment from "moment";
import assert from "assert";
import { expect } from "chai";
import sinon from "sinon";

import account from "./fixtures/account.json";
import user from "./fixtures/user.json";

import * as EVENTS from "./fixtures/events";

import {
  PQL,
  CQL,
  MQL,
  GROWTH_CLEARBIT,
  GROWTH_VISIT,
  GROWTH_SIFTERY,
  GROWTH_G2CROWD
} from "./fixtures/attribution";

import computeAttribution from "../../server/processors/attribution/attribute";

const offsetHours = (offset = 0) =>
  moment("2018-01-30T09:00:00+01:00")
    .add(offset, "hours")
    .format();

const last = attr => _.mapKeys(attr, (v, k) => `last_${k}`);

const testAttribution = ({
  existing,
  last_existing,
  event,
  userProfile = user,
  offset = 0,
  expected = {},
  last_expected = {}
}) => {
  const source_date = offsetHours(offset);
  const attribution = computeAttribution(
    {},
    {
      account: {
        ...account,
        attribution: {
          ...existing,
          ...last(last_existing)
        }
      },
      user: {
        ...userProfile,
        attribution: {
          ...existing,
          ...last(last_existing)
        }
      },
      events: [
        {
          ...event,
          created_at: source_date
        }
      ]
    }
  );

  let expectUser = {};
  // let expectAccount = {};
  if (_.size(expected)) {
    expectUser = { ...expected, source_date };
  }
  if (_.size(last_expected)) {
    expectUser = {
      ...expectUser,
      ...last(last_expected),
      last_source_date: source_date
    };
  }

  //
  // if (_.size(expected)) {
  //   expectAccount = { ...expected, source_date };
  // }
  // if (_.size(last_expected)) {
  //   expectAccount = { ...expectUser, ...expected, last_source_date };
  // }
  expect(attribution).to.deep.equal({
    user: expectUser,
    account: expectUser
  });
};

describe("Attribution when no Attribution", () => {
  it("Should do nothing if no attribution", () => {
    testAttribution({
      existing: {},
      event: {},
      offset: 0,
      expected: {},
      last_expected: {}
    });
  });

  it("Should return a PQL when a PQL event is there", () => {
    testAttribution({
      existing: {},
      event: EVENTS.SIGNED_UP,
      offset: 0,
      expected: PQL,
      last_expected: PQL
    });
  });

  it("Should return a MQL when a MQL event is there", () => {
    testAttribution({
      existing: {},
      event: EVENTS.EMAIL_CAPTURE_BLOG,
      offset: 0,
      expected: MQL,
      last_expected: MQL
    });
  });

  it("Should return a CQL when a CQL event is there", () => {
    testAttribution({
      existing: {},
      event: EVENTS.EMAIL_CAPTURE_MAIN,
      offset: 0,
      expected: CQL,
      last_expected: CQL
    });
  });

  it("Should return Growth when a Clearbit event is there", () => {
    testAttribution({
      existing: {},
      event: EVENTS.CLEARBIT_PROSPECT,
      offset: 0,
      expected: GROWTH_CLEARBIT,
      last_expected: GROWTH_CLEARBIT
    });
  });

  it("Should NOT return Growth when a user w/ email does a visit", () => {
    const attribution = computeAttribution(
      {},
      {
        account,
        user,
        events: [EVENTS.ANONYMOUS_VISIT]
      }
    );
    expect(attribution).to.deep.equal({
      user: {},
      account: {}
    });
  });

  it("Should return Growth when a Anonymous Visit is there", () => {
    testAttribution({
      existing: {},
      event: EVENTS.ANONYMOUS_VISIT,
      userProfile: { ...user, email: null },
      offset: 0,
      expected: GROWTH_VISIT,
      last_expected: GROWTH_VISIT
    });
  });

  it("Should return Growth when a Siftery is there", () => {
    testAttribution({
      existing: {},
      event: EVENTS.SEGMENT_SIFTERY,
      userProfile: { ...user, email: null },
      offset: 0,
      expected: GROWTH_SIFTERY,
      last_expected: GROWTH_SIFTERY
    });
  });

  it("Should return Growth when a G2Crowd Segment Visit is there", () => {
    testAttribution({
      existing: {},
      event: EVENTS.SEGMENT_G2CROWD,
      userProfile: { ...user, email: null },
      offset: 0,
      expected: GROWTH_G2CROWD,
      last_expected: GROWTH_G2CROWD
    });
  });
});

describe("Attribution when multiple of different ranks on same day", () => {
  it("Should override MQL when a PQL comes later in on same day", () => {
    testAttribution({
      existing: MQL,
      event: EVENTS.SIGNED_UP,
      offset: 2,
      expected: PQL,
      last_expected: PQL
    });
  });

  it("Should override MQL when a PQL comes earlier on same day", () => {
    testAttribution({
      existing: MQL,
      event: EVENTS.SIGNED_UP,
      offset: -4,
      expected: PQL,
      last_expected: PQL
    });
  });

  it("Should override Growth when a PQL comes later in on same day", () => {
    testAttribution({
      existing: GROWTH_VISIT,
      event: EVENTS.SIGNED_UP,
      offset: 0,
      expected: PQL,
      last_expected: PQL
    });
  });

  it("Should override Growth when a MQL comes later in on same day", () => {
    testAttribution({
      existing: GROWTH_VISIT,
      event: EVENTS.EMAIL_CAPTURE_BLOG,
      offset: 2,
      expected: MQL,
      last_expected: MQL
    });
  });
});

describe("Attribution when higher rank on previous day", () => {
  it("Should override first but not last CQL when a MQL comes in the day before", () => {
    testAttribution({
      existing: CQL,
      last_existing: CQL,
      event: EVENTS.EMAIL_CAPTURE_BLOG,
      offset: -26,
      expected: MQL,
      last_expected: {} // Empty Means "not touched"
    });
  });

  it("Should override first but not last MQL when a PQL comes in the day before", () => {
    testAttribution({
      existing: MQL,
      last_existing: MQL,
      event: EVENTS.SIGNED_UP,
      offset: -26,
      expected: PQL,
      last_expected: {} // Empty Means "not touched"
    });
  });

  it("Should override first but not last GROWTH when a PQL comes in the day before", () => {
    testAttribution({
      existing: GROWTH_CLEARBIT,
      last_existing: GROWTH_CLEARBIT,
      event: EVENTS.SIGNED_UP,
      offset: -26,
      expected: PQL,
      last_expected: {} // Empty Means "not touched"
    });
  });
});

describe("Attribution when lower rank on previous day", () => {
  it("Should override first but not last CQL when a MQL comes in the day before", () => {
    testAttribution({
      existing: CQL,
      last_existing: CQL,
      event: EVENTS.EMAIL_CAPTURE_BLOG,
      offset: -26,
      expected: MQL,
      last_expected: {} // Empty Means "not touched"
    });
  });

  it("Should override first but not last MQL when a PQL comes in the day before", () => {
    testAttribution({
      existing: MQL,
      last_existing: MQL,
      event: EVENTS.SIGNED_UP,
      offset: -26,
      expected: PQL,
      last_expected: {} // Empty Means "not touched"
    });
  });
});

describe("Attribution when lower rank on same day", () => {
  it("Should not override PQL with MQL later on same day", () => {
    testAttribution({
      existing: PQL,
      last_existing: PQL,
      event: EVENTS.EMAIL_CAPTURE_BLOG,
      offset: 2,
      expected: {},
      last_expected: {}
    });
  });

  it("Should NOT override PQL with CQL (same rank) later same day, but should override last", () => {
    testAttribution({
      existing: PQL,
      last_existing: PQL,
      event: EVENTS.EMAIL_CAPTURE_MAIN,
      offset: 2,
      expected: {},
      last_expected: CQL
    });
  });
});

describe("Attribution when lower rank on next day", () => {
  it("Should not override first touch PQL with Growth later on next day", () => {
    testAttribution({
      existing: PQL,
      last_existing: PQL,
      event: EVENTS.EMAIL_CAPTURE_BLOG,
      offset: 2,
      expected: {},
      last_expected: {}
    });
  });

  it("Should override last touch PQL with Growth on next day", () => {
    testAttribution({
      existing: PQL,
      last_existing: PQL,
      event: EVENTS.SEGMENT_SIFTERY,
      offset: 26,
      expected: {}, // Empty Means "not touched"
      last_expected: GROWTH_SIFTERY
    });
  });
});

describe("Account Attribution when multiple users", () => {
  it("Should override cross-user first touch PQL if MQL is earlier day", () => {
    expect(
      computeAttribution(
        {},
        {
          account: {
            ...account,
            attribution: {
              ...PQL,
              ...last(PQL)
            }
          },
          user: {
            ...user,
            attribution: {
              ...PQL,
              ...last(PQL)
            }
          },
          events: [
            {
              ...EVENTS.EMAIL_CAPTURE_BLOG,
              created_at: offsetHours(-26)
            }
          ]
        }
      )
    ).to.deep.equal({
      user: {
        ...MQL,
        source_date: offsetHours(-26)
      },
      account: {
        ...MQL,
        source_date: offsetHours(-26)
      }
    });
  });

  // it("Should override last touch PQL with Growth on next day", () => {
  //   testAttribution({
  //     existing: PQL,
  //     last_existing: PQL,
  //     event: EVENTS.SEGMENT_SIFTERY,
  //     offset: 26,
  //     expected: {}, // Empty Means "not touched"
  //     last_expected: GROWTH_SIFTERY
  //   });
  // });
});

describe("Account attribution when no events", () => {
  it("Should attribute accounts even if no events in User, but not latest one", () => {
    expect(
      computeAttribution(
        {},
        {
          account: {
            ...account,
            attribution: {
              ...MQL,
              ...last(MQL)
            }
          },
          user: {
            ...user,
            attribution: {
              ...PQL,
              source_date: offsetHours(-26),
              ...last(PQL),
              last_source_date: offsetHours(-26)
            }
          },
          events: []
        }
      )
    ).to.deep.equal({
      user: {},
      account: {
        ...PQL,
        source_date: offsetHours(-26)
      }
    });
  });
});
