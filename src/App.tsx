import "bootstrap/dist/css/bootstrap.min.css";
import "mapbox-gl/dist/mapbox-gl.css";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import "./App.css";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";

import React, { ReactElement } from "react";
import { useState, useEffect, useRef, useCallback } from "react";

import mapboxgl, { LngLat, MercatorCoordinate } from "mapbox-gl";
import { Button } from "react-bootstrap";

import useWebSocket, { ReadyState } from "react-use-websocket";

import { MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationHeader, Avatar, MessageSeparator} from '@chatscope/chat-ui-kit-react';
import { JsxElement } from "typescript";

// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

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

async function getNearestBusStop(lat: number, long: number) {
  const response = await fetch(
    "https://ys7aqvqbuflsqez4a2iuhhlfdy0ahmls.lambda-url.ap-northeast-1.on.aws/",
    {
      method: "POST",
      body: JSON.stringify({
        latitude: lat,
        longitude: long,
      }),
    }
  );
  return response.text();
}

async function getIncomingBus(bsCode: string) {
  const response = await fetch(
    "https://d6zocx3vlxmnjvvaycl5n63txy0vnqns.lambda-url.ap-northeast-1.on.aws/",
    {
      method: "POST",
      body: JSON.stringify({
        busStopCode: bsCode,
        timestamp: Date.now()
      }),
    }
  );
  return response.text();
}

// function ble() {
//   const device = navigator.bluetooth.getDevices().then(res => console.log(res));
// }

function makeMessage(msg: string) {
  return (
    <Message model={{
      message: msg,
      sentTime: "15 mins ago",
      sender: "Joe",
      direction: "incoming",
      position: "single"
    }} />
  );
}

async function sendMessage(newMsg:string, chatId:string) {
  return fetch(
    "https://3pe4d2f25bkevpayocs7gdhovi0jivti.lambda-url.ap-northeast-1.on.aws/", {
      method: "POST",
      body: JSON.stringify({
        chatId: chatId, 
        name: "", 
        header: "", 
        content: newMsg, 
        timestamp: Date.now()
      })
    }
  )
}

async function getMessagesForBus(bus: string, chatId:string) {
  const response = await fetch(
    "https://k632xlmt42ftzu7poqwqrimlkm0pqpbs.lambda-url.ap-northeast-1.on.aws/", {
    method: "POST",
    body: JSON.stringify({
      chatId: chatId
    })
  });
  return response.json();
}

function App() {
  // useEffect(() => {
  //   location();
  // });

  // ===================================================
  const [socketUrl, setSocketUrl] = useState("wss://nxbcjwnvqc.execute-api.ap-northeast-1.amazonaws.com/Prod");
  const [messageHistory, setMessageHistory] = useState([]);
  // const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  // ===================================================

  const [locationSet, setLocationSet] = useState(false);
  const [firstLat, setFirstLat] = useState(0);
  const [firstLong, setFirstLong] = useState(0);
  const [firstTime, setFirstTime] = useState(0);
  const [nearestBusStop, setNearest] = useState("");
  const [nearestDes, setNearestDes] = useState("");
  const [incomingBuses, setIncoming] = useState(["10", "69"]);
  const [hasBus, sethasBus] = useState("");
  const [busBtns, setBusBtns] = useState<ReactElement[]>([]);
  const [chatId, setChatId] = useState<string>("");

  interface IMessage {
    content: string;
    timestamp: number;
  }
  
  const [messages, setMessages] = useState<IMessage[]>([]);

  const [speed, setSpeed] = useState(0);
  // const [firstAlt, setFirstAlt] = useState(0);
  const successLoc =
    (setLat: any, setLong: any, setTime: any) => (pos: GeolocationPosition) => {
      console.log(pos);
      // setFirstAlt(pos.coords.altitude);
      setLat(pos.coords.latitude);
      setLong(pos.coords.longitude);
      setTime(pos.timestamp);
      setSpeed(pos.coords.speed ? pos.coords.speed : speed);
      getNearestBusStop(pos.coords.latitude, pos.coords.latitude)
      .then((data:string) =>
      {
        const d = JSON.parse(data);
        setNearest(d.busStopCode); 
        console.log(nearestBusStop);
        console.log(data);
        setNearestDes(d.description); 
        return d.busStopCode;
      });
      // .then(bsCode => getIncomingBus(bsCode))
      // .then((res: any) => {
      //   setIncoming(res);
      // });
      setLocationSet(true);
    };
  const failureLoc = (err: GeolocationPositionError) => {
    setLocationSet(false);
    console.log(err);
  };

  const getLocation = () => {
    // e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      successLoc(setFirstLat, setFirstLong, setFirstTime),
      failureLoc,
      {
        enableHighAccuracy: true,
      }
    );
  };
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);

  // useEffect(() => getLocation(), []);
  useEffect(() => {
    getLocation();
    if (map.current) return; // initialize map only once
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbmNlMDgiLCJhIjoiY2xjdmpwYm9hMGo3eDNwczVkZXJ5ZnF2YyJ9.uRHqwo8pni_HX61dgJQkXw';
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-13, 1], // starting center in [lng, lat]
      zoom: 1.5 // starting zoom
    });
    map.current.addControl(
      new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
      })
    );

  }, [])

  const getChatIdClick = (busNum:string) => (e:React.MouseEvent) => {
    e.preventDefault();
    // ble();
    fetch("https://fj7e6zvssaevc7btyjokyfsrrq0yypos.lambda-url.ap-northeast-1.on.aws/", 
    {
      method: "POST",
      body: JSON.stringify({
        busNumber: busNum,
      }),
    }).then(res => res.json())
    .then(data => {
      setChatId(data.chatId);
      return data.chatId;
    })
    .then(chat => getMessagesForBus(busNum, chat))
    .then(data => console.log(data));
    // fetch()
  }

  return (
    <div className="App">
      {header}

      <Container fluid className="p-4">
        <Row>
          <Col sm={6}>
            {section(
              "My location",
              <div>
                <div>{locationSet 
                ? nearestBusStop + "\n" + nearestDes
                : "Location not found"}</div>
                <div ref={mapContainer} id="map"/>
              </div>
            )}
            <br></br>
            {section(
              "Boarding now?",
              <div>
                {/* {incomingBuses} */}
                {
                  busBtns.length == 0 ?
                <Button onClick={e => {
                  e.preventDefault(); 
                  getIncomingBus(nearestBusStop)
                  .then(buses => {
                    setIncoming([...incomingBuses, ...JSON.parse(buses)]);
                    return incomingBuses;
                  })
                  .then((buses:string[]) => {
                    const busBtns = buses.map(x => {
                      return (
                        <>
                        <Button onClick={getChatIdClick(x)} variant="light" key={x}>{x}</Button>
                        </>
                      )
                    });
                    setBusBtns(busBtns);
                   return (
                    <div>
                      {busBtns}
                    </div>
                   )
                  })
                }}>Boarding</Button>
                :
                busBtns
              }
              </div>
            )}
          </Col>
          <Col sm={6}>
            <div style={{
              height: "500px"
            }}>
              {
                chatId !== "" ?
                          <ChatContainer>
                            <ConversationHeader>
                              <ConversationHeader.Content>
                                          <span style={{
                                  color: "#ec1212",
                                  alignSelf: "flex-center"
                                }}>Bus 188</span>
                                        </ConversationHeader.Content>
                            </ConversationHeader>
                            <MessageList>
                              <MessageSeparator>
                              Saturday, 30 November 2019
                              </MessageSeparator>
                      <Message model={{
                    message: "Hello my friend",
                    sentTime: "15 mins ago",
                    sender: "Joe",
                    direction: "incoming",
                    position: "single"
                  }}>
                      </Message>
                      
                      <Message model={{
                    message: "Hello my friend",
                    sentTime: "15 mins ago",
                    sender: "localSender",
                    direction: "outgoing",
                    position: "single"
                  }} />
                      
                      <Message model={{
                    message: "Hello my friend",
                    sentTime: "15 mins ago",
                    sender: "Joe",
                    direction: "incoming",
                    position: "first"
                  }} avatarSpacer />
                </MessageList>
                <MessageInput placeholder="Type message here" onSend={(msg:string) => {
                  sendMessage(msg, chatId)
                  .then(res => res.json())
                  .then((data:any[]) => 
                  {
                    const msgs = data.map( x => { return {'content': x.content, 'timestamp': x.timestamp}} );
                    setMessages(msgs);
                    console.log(msgs);
                    return true;
                  })
                }}/>
              </ChatContainer>
              : <div></div> }
            </div>
          {/* <div>
            <button onClick={handleClickChangeSocketUrl}>
              Click Me to change Socket Url
            </button>
            <button
              onClick={handleClickSendMessage}
              disabled={readyState !== ReadyState.OPEN}
            >
              Click Me to send 'Hello'
            </button>
            <span>The WebSocket is currently {connectionStatus}</span>
            {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
            <ul>
              {messageHistory.map((message, idx) => (
                <span key={idx}>{message ? message : null}</span>
              ))}
            </ul>
          </div> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
