import React, { useState } from 'react';
import { useSubstrate } from './substrate-lib';
// to flatten nested JSON
// var flatten = require('flat')
import config from './config';

export default function Main (props) {
  const { api } = useSubstrate();
  const [loading, setLoading] = useState(true);
  let [crowdLoan, setCrowdLoan] = useState({
    raised: 0,
    end: null,
    cap: null,
    lastContribution: { preEnding: null },
    firstPeriod: null,
    lastPeriod: null,
  });

  const paraId = config.PARACHAIN_ID;

  const queryResHandler = result => {
    const toHumanData = result.toHuman();
    setCrowdLoan(crowdLoan = (toHumanData));
    // to flatten nested JSON
    // setcrowdLoan(crowdLoan = flatten(data));
    setLoading(false);
  };
  const transformed = [paraId];
  const palletRpc = 'crowdloan';
  const callable = 'funds';

  const getCrowdLoanData = async () => {
    await api.query[palletRpc][callable](...transformed, queryResHandler);
  };

  if (Object.keys(crowdLoan).length === 0) {
    getCrowdLoanData();
  }

  return (
        <div>
            <h1>Crowdloan Funds</h1>
            {loading
              ? (
                    <div>loading...</div>
                )
              : (
                    <div>
                        {/* dynamic rendering of key, value pair of json: needs to be flattened! */}
                        {/* {Object.keys(crowdLoan).map((key, i) => (
                            <p key={i}>
                                <span>{key}: </span>
                                <span>{crowdLoan[key]}</span>
                            </p>
                        ))} */}
                        <div>raised: {(crowdLoan.raised)}</div>
                        <div>end: {crowdLoan.end}</div>
                        <div>cap: {(crowdLoan.cap)}</div>
                        <div>last_contribution.preEnding: {crowdLoan.lastContribution.PreEnding}</div>
                        <div>first_period: {crowdLoan.firstPeriod}</div>
                        <div>last_period: {crowdLoan.lastPeriod}</div>
                    </div>
                )}
        </div >
  );
}
