import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";

// import React from 'react';

const header = (
  <header className="App-header">
    <span className="App-title px-4">Bus Buddies</span>
    <span className="App-subtitle">
      See how your bus buddies are doing in life.
    </span>
  </header>
);

const section = (title: string, children: any) => (
  <div>
    <div className="section-title">{title}</div>
    <Container className="shadow-lg rounded py-3">{children}</Container>
  </div>
);

const buddies = [
  { username: "chence08", status: "yo @josuaaah i am doing some math" },
  { username: "wangyuchen", status: "trying to figure out RestAPI" },
  { username: "some-old-guy", status: "Where am I? What bus is this? This bus go Jurong Point one right" },
];

const buddyDisplay = (
  <ListGroup variant="flush">
    {buddies.map(({ username, status }) => (
      <ListGroup.Item>
        <div><b>{username}</b></div>
        <div className="font-italic">{status}</div>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

function App() {
  // useEffect(() => {
  //   location();
  // });

  const [locationSet, setLocationSet] = useState(false);
  const [firstLat, setFirstLat] = useState(0);
  const [firstLong, setFirstLong] = useState(0);
  const [firstTime, setFirstTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  // const [firstAlt, setFirstAlt] = useState(0);
  const successLoc = (setLat: any, setLong: any, setTime: any) => (pos: GeolocationPosition) => {
    console.log(pos);
    setLocationSet(true);
    // setFirstAlt(pos.coords.altitude);
    setLat(pos.coords.latitude);
    setLong(pos.coords.longitude);
    setTime(pos.timestamp);
    setSpeed(pos.coords.speed ? pos.coords.speed : speed);
  }
  const failureLoc = (err: GeolocationPositionError) => {
    setLocationSet(false);
    console.log(err);
  }

  const getLocation = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(successLoc(setFirstLat, setFirstLong, setFirstTime), failureLoc, {
      enableHighAccuracy: true,
    });
  };

  return (
    <div className="App">
      {header}

      <Container fluid className="p-4">
        <Row>
          <Col xs={6}>
            {section(
              "My location",
              <div>
                You are on bus <b>187</b>, heading towards <b>Pulau Tekong</b>{" "}
                because you are a chao recruit.
              </div>
            )}
            <br></br>
            {section(
              "My display",
              <div>
                <InputGroup size="lg" className="mb-3">
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                  <Form.Control
                    placeholder="I am called..."
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>How are you</InputGroup.Text>
                  <Form.Control as="textarea" aria-label="With textarea" />
                </InputGroup>
              </div>
            )}
          </Col>
          <Col>{section("My Bus Buddies", <div>{buddyDisplay}</div>)}</Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
