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
  G2CROWD
} from "./fixtures/events";

import {
  PQL,
  MQL,
  GROWTH_CLEARBIT,
  GROWTH_VISIT
} from "./fixtures/attribution";

import computeAttribution from "../../server/processors/attribution";

describe("Attribution when no Attribution", () => {
  it("Should return PQL when a PQL event is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [SIGNED_UP]
    });
    expect(attribution).to.deep.equal({
      user: PQL,
      account: PQL
    });
  });

  it("Should return MQL when a MQL event is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [EMAIL_CAPTURE_BLOG]
    });
    expect(attribution).to.deep.equal({
      user: MQL,
      account: MQL
    });
  });

  it("Should return CQL when a CQL event is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [EMAIL_CAPTURE_MAIN]
    });
    expect(attribution).to.deep.equal({
      user: CQL,
      account: CQL
    });
  });

  it("Should return Growth when a Clearbit event is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [CLEARBIT_PROSPECT]
    });
    expect(attribution).to.deep.equal({
      user: GROWTH_CLEARBIT,
      account: GROWTH_CLEARBIT
    });
  });

  it("Should return Growth when a Anonymous Visit is there", () => {
    const attribution = computeAttribution({
      account,
      user,
      events: [GROWTH_VISIT]
    });
    expect(attribution).to.deep.equal({
      user: GROWTH_VISIT,
      account: GROWTH_VISIT
    });
  });


});
