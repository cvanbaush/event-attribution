/* eslint-env node, mocha */

import moment from "moment";
import assert from "assert";
import _ from "lodash";
import { expect } from "chai";
import sinon from "sinon";

import account from "./fixtures/account";
import user from "./fixtures/user";
import {
  EMAIL_CAPTURE_BLOG,
  EMAIL_CAPTURE_MAIN,
  SIGNED_UP,
  CLEARBIT_PROSPECT,
  G2CROWD,
  ANONYMOUS_VISIT
} from "./fixtures/events";

import {
  PQL,
  CQL,
  MQL,
  GROWTH_CLEARBIT,
  GROWTH_VISIT
} from "./fixtures/attribution";

import computeAttribution from "../../server/processors/attribution";

const offsetHours = (offset = 0) =>
  moment()
    .add(offset, "hours")
    .format();
const last = attr => _.mapKeys(attr, (v, k) => `last_${k}`);

describe("Attribution when no Attribution", () => {
  it("Should return a PQL when a PQL event is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [SIGNED_UP]
    });
    expect(attribution).to.deep.equal({
      user: { ...PQL, ...last(PQL) },
      account: { ...PQL, ...last(PQL) }
    });
  });

  it("Should return a MQL when a MQL event is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [EMAIL_CAPTURE_BLOG]
    });
    expect(attribution).to.deep.equal({
      user: { ...MQL, ...last(MQL) },
      account: { ...MQL, ...last(MQL) }
    });
  });

  it("Should return a CQL when a CQL event is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [EMAIL_CAPTURE_MAIN]
    });
    expect(attribution).to.deep.equal({
      user: { ...CQL, ...last(CQL) },
      account: { ...CQL, ...last(CQL) }
    });
  });

  it("Should return Growth when a Clearbit event is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [CLEARBIT_PROSPECT]
    });
    expect(attribution).to.deep.equal({
      user: { ...GROWTH_CLEARBIT, ...last(GROWTH_CLEARBIT) },
      account: { ...GROWTH_CLEARBIT, ...last(GROWTH_CLEARBIT) }
    });
  });

  it("Should NOT return Growth when a user w/ email does a visit", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [ANONYMOUS_VISIT]
    });
    console.log(attribution);
    expect(attribution).to.deep.equal({
      user: {},
      account: {}
    });
  });

  it("Should return Growth when a Anonymous Visit is there", () => {
    const attribution = computeAttribution({
      account,
      user: {
        ...user,
        email: null
      },
      events: [ANONYMOUS_VISIT]
    });
    expect(attribution).to.deep.equal({
      user: { ...GROWTH_VISIT, ...last(GROWTH_VISIT) },
      account: { ...GROWTH_VISIT, ...last(GROWTH_VISIT) }
    });
  });
});

describe("Attribution when multiple of different ranks on same day", () => {
  it("Should override MQL when a PQL comes in", () => {
    const attribution = computeAttribution({
      account,
      user: {
        ...user,
        attribution: {
          ...MQL,
          source_date: offsetHours(0)
        }
      },
      events: [
        {
          ...PQL,
          created_at: offsetHours(2)
        }
      ]
    });
    expect(attribution).to.deep.equal({
      user: {
        ...PQL,
        ...last(PQL),
        source_date: offsetHours(2),
        last_source_date: offsetHours(2),
      },
      account: { ...PQL, ...last(PQL) }
    });
  });

  // it("Should override CQL when a PQL comes in", () => {
  //   const attribution = computeAttribution({
  //     account,
  //     user: {
  //       ...user,
  //       attribution: CQL
  //     },
  //     events: [PQL]
  //   });
  //   expect(attribution).to.deep.equal({ user: PQL, account: PQL });
  // });
  //
  //
  // it("Should override CQL when a MQL comes in", () => {
  //   const attribution = computeAttribution({
  //     account,
  //     user: {
  //       ...user,
  //       attribution: CQL
  //     },
  //     events: [MQL]
  //   });
  //   expect(attribution).to.deep.equal({ user: PQL, account: PQL });
  // });
  //
  //
  // it("Should override GROWTH when a PQL comes in", () => {
  //   const attribution = computeAttribution({
  //     account,
  //     user: {
  //       ...user,
  //       attribution: GROWTH_CLEARBIT
  //     },
  //     events: [PQL]
  //   });
  //   expect(attribution).to.deep.equal({ user: PQL, account: PQL });
  // });
  //
  //
  // it("Should override GROWTH when a MQL comes in", () => {
  //   const attribution = computeAttribution({
  //     account,
  //     user: {
  //       ...user,
  //       attribution: GROWTH_CLEARBIT
  //     },
  //     events: [MQL]
  //   });
  //   expect(attribution).to.deep.equal({ user: MQL, account: MQL });
  // });
  //
  //
  // it("Should override GROWTH when a CQL comes in", () => {
  //   const attribution = computeAttribution({
  //     account,
  //     user: {
  //       ...user,
  //       attribution: GROWTH_CLEARBIT
  //     },
  //     events: [CQL]
  //   });
  //   expect(attribution).to.deep.equal({ user: CQL, account: CQL });
  // });
});

// describe("Attribution when multiple of different ranks on multiple days", () => {
//   it("Should PQL with a more recent PQL when a PQL comes in", () => {});
//   it("Should CQL with a more recent CQL when a CQL comes in", () => {});
//   it("Should MQL with a more recent MQL when a MQL comes in", () => {});
//   it("Should GROWTH with a more recent GROWTH when a GRORWTH comes in", () => {});
// });
