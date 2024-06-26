import './css/App.css';
import { Container, Button, Modal, Form, Dimmer, Loader } from 'semantic-ui-react';
// import GraphImage from './Images/graph.png';
// import Slider from 'react-slick';
import { useSubstrate } from './substrate-lib';
import React, { useState, useReducer } from 'react';
import { formatBalance } from '@polkadot/util';
import { useGlobalState, setCrowdLoanRunning } from './state';
import { BN, bnToBn } from '@polkadot/util/bn/index.js';

// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import emailjs from 'emailjs-com';
// import { toast } from 'react-toastify';
import config from './config';

function toUnit(balance, decimals, unit = 'KSM') {
  balance = bnToBn(balance).toString();
  var base = new BN(10).pow(new BN(decimals));
  var dm = new BN(balance).divmod(base); // decimals, don't use them atm
  let x = parseFloat(dm.div.toString());
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'") + ' ' + unit;
}
export default function Main (props) {
  const { api } = useSubstrate();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const paraId = config.PARACHAIN_ID;
  let [crowdLoan, setCrowdLoan] = useState(true);
  const [crowdLoanRunning] = useGlobalState('crowdLoanRunning');

  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      email: ''
    }
  );
  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };
  const sendEmail = () => {
    const templateParams = {
      from_email: formInput.email
    };
    emailjs.send('service_gdzprbp', 'template_4htuvy9', templateParams, 'user_8LztNfOboIaSThE1Xj3TN')
      .then((result) => {
        console.log(result.text);
        toast.success('Email Send Successfully!');
      }, (error) => {
        console.log(error.text);
        toast.error('Email not send. Something went wrong. Please try later!');
      });
    setFormInput({ email: '' });
    setOpen(false);
  };

  const queryResHandler = result => {
    const toHumanData = result.toJSON();
    setCrowdLoan(crowdLoan = (toHumanData));
    if( toHumanData != null ) {
      setCrowdLoanRunning(true);
    }
    console.log('**set-----------------------');
    setLoading(false);
  };

  const transformed = [paraId];
  const palletRpc = 'crowdloan';
  const callable = 'funds';

  const getCrowdLoanData = async () => {
    if (
      api &&
      api.query &&
      api.query[palletRpc] &&
      api.query[palletRpc][callable]
    ) {
      await api.query[palletRpc][callable](...transformed, queryResHandler);
    }
  };

  if (crowdLoan && Object.keys(crowdLoan).length === 0) {
    getCrowdLoanData().then(() =>
      console.log('**data---------------------------')
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    vertical: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1
  };

  const options = {
    animationEnabled: true,
    chart: {
      height: 320,
      renderTo: 'container',
      backgroundColor: 'transparent',
      type: 'spline'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      month: '%e. %b',
      year: '%b',
      tickWidth: 0,
      lineWidth: 0,
      crosshair: {
        width: 1,
        color: '#fff',
        dashStyle: 'solid'
      },
      labels: {
        style: {
          color: '#70e6da',
          textTransform: 'uppercase',
          fontWeight: '600',
          fontFamily: 'Gotham Rounded',
          paddingTop: '20px'
        }
      }
    },
    yAxis: {
      gridLineColor: '#fff',
      gridLineDashStyle: 'solid',
      title: {
        text: ''
      },
      labels: {
        enabled: false,
        style: {
          color: '#70e6da',
          textTransform: 'uppercase',
          fontWeight: '600',
          fontFamily: 'Gotham Rounded',
          paddingTop: '20px'
        }
      }
    },
    tooltip: {
      shadow: false,
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderColor: 'none',
      padding: 10,
      borderRadius: '8px',
      className: 'chart-tooltip'
    },
    noData: {
      attr: null,
      position: { x: 0, y: 0, align: 'center', verticalAlign: 'middle' },
      style: { fontSize: '12px', fontWeight: 'bold', color: '#60606a' }
    },
    plotOptions: {
      series: {
        marker: {
          fillColor: '#70e6da',
          shadow: false,
          lineWidth: 0,
          width: 20,
          height: 20,
          lineColor: '#fff',
          enabled: false
        }
      }
    },
    series: [
      {
        showInLegend: false,
        type: 'area',
        lineWidth: 1,
        lineColor: '#70e6da',
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'rgba(105, 216, 205, 0.95)'], // start
            [0.5, 'rgba(105, 216, 205, 0.8)'], // middle
            [1, 'rgba(105, 216, 205, 0.1)'] // end
          ]
        },
        data: [
          { x: Date.UTC(2021, 0, 1), y: 1 },
          { x: Date.UTC(2021, 1, 1), y: 7 },
          { x: Date.UTC(2021, 2, 1), y: 6 },
          { x: Date.UTC(2021, 3, 1), y: 6 }
        ]
      }
    ]
  };
  return (
    <div className="why">
      <Container>
        <div className="text">
          <span>WHY OUR PARACHAIN?</span>
          <h1>Support Integritee’s Parachain Bids</h1>
          <p>
            Integritee enables developers and firms to process sensitive data,
            without compromising on privacy. Our platform combines the trust of
            blockchain with the confidentiality of off-chain, trusted execution
            environments (TEEs). This enables developers and firms to create
            decentralized data-driven apps and services that can securely
            process sensitive data, without revealing it on chain.
          </p>
          <p>
            The Integritee ecosystem, across all instances on Kusama, Polkadot
            and elsewhere, will be powered by our native token, TEER. Backers
            who support our parachain bids by temporarily locking in KSM will be
            rewarded in TEER.
          </p>
          <p>
            We all know the problems with centralized data services. Integritee
            is the solution. Help us build a new internet where privacy comes as
            standard and earn TEER in the process.
          </p>
          {!crowdLoanRunning &&
          <a className="ui primary gradient-btn button" href="https://mailchi.mp/integritee/get-notified">Get Notified!</a>
          }
          
          {crowdLoanRunning &&
          <a className='ui primary gradient-btn button' href='#participate' >
            Participate Now!
          </a>
          }
            {/* <Modal
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              size="mini"
              open={open}
              className="notify-modal"
              trigger={<Button className="outline-btn with-icon">
              Get Notified
              </Button>}
            >
              <Modal.Header>Notify Me</Modal.Header>
              <Modal.Content image>
                <Modal.Description>
                  <Form>
                    <Form.Field>
                      <label>Email address</label>
                      <input name="email" placeholder='Enter your email address' value={formInput.email}
                onChange={handleInput} />
                    </Form.Field>
                  </Form>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button color="grey" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button
                  color="green"
                  content="Send"

                  onClick={() => sendEmail()}
                />
              </Modal.Actions>
            </Modal> */}
        </div>
<br></br>
<br></br>

        {/* <div className="NewsLetter1">

        <p>

          Crowdlending will start soon – sign up to hear when it’s time to join in.
          </p>
          <div className="child">
          <a href="https://mailchi.mp/integritee/get-notified">
          <Button className="outline-btn with-icon">
              Get Notified
              </Button>
            </a>
          </div>

        </div> */}

        {crowdLoan && (
        <ul className="counter">
          <li>
            <span>KSM CONTRIBUTED</span>
            {toUnit(crowdLoan.raised, 12 )}<br/>
            {/* {formatBalance(crowdLoan.raised,
              { withSi: true, forceUnit: '-' }
            )} */}
            {loading && (
              <Dimmer active>
                <Loader size='mini' inline='centered'>
                  Loading
                </Loader>
              </Dimmer>
            )}
          </li>
        </ul>)}

        {/* <div className="graph">
          <HighchartsReact
              highcharts={Highcharts}
              options={options}
            />
        </div> */}

      </Container>
    </div>
  );
}
