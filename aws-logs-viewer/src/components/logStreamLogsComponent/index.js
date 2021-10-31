import { Button, Container, Col, Row } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { GetLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import util from '../../util/util';
import './style.css';

const getLogEvents = async (client, logGroupName, logStreamName, nextToken) => {
     if(util.isEmpty(logStreamName) || util.isEmpty(logGroupName) ) return {
          logEvents: [],
          nextToken: null
     };
     let commandParam = {
          limit:50,
          startFromHead:true,
          logGroupName: logGroupName,
          logStreamName: logStreamName
     };
     if(nextToken !== null) commandParam['nextToken'] = nextToken;
     const command = new GetLogEventsCommand(commandParam);
     const data = await client.send(command);
     let returnList = [];
     for(let ei = 0; ei<data.events.length; ei++){
          let logEvent = data.events[ei];
          returnList.push({
               timestamp: logEvent.timestamp,
               message: logEvent.message,
          });
     }
     let newNextToken = null;
     if(!util.isEmpty(data.nextForwardToken))newNextToken = data.nextForwardToken;
     return {
          logEvents: returnList,
          nextToken: newNextToken
     };

};

function LogStreamsComponent(props) {
     const listInnerRef = useRef();
     const [logEvents, setlogEvents] = useState({events:[]});
     const [selectedLogGroup, setSelectedLogGroup] = useState(props.selectedLogGroup)
     const [selectedLogStream, setSelectedLogStream] = useState(props.selectedLogStream);

     const fetchData = async () => {
          let retrievedLogEvents = [];
          let updatedLogEvents = [];
          if(selectedLogGroup !== props.selectedLogGroup || selectedLogStream !== props.selectedLogStream ){
               retrievedLogEvents = await getLogEvents(props.client, props.selectedLogGroup, props.selectedLogStream,  null);
               setSelectedLogGroup(props.selectedLogGroup);
               setSelectedLogStream(props.selectedLogStream);
               updatedLogEvents = retrievedLogEvents.logEvents;
               setlogEvents({events:updatedLogEvents, nextToken:retrievedLogEvents.nextToken});
          }else{
               if(logEvents.nextToken === undefined ){
                    retrievedLogEvents = await getLogEvents(props.client, props.selectedLogGroup,  props.selectedLogStream, null);
                    updatedLogEvents = retrievedLogEvents.logEvents;
                    setlogEvents({events:updatedLogEvents, nextToken:retrievedLogEvents.nextToken});

               }else if( logEvents.nextToken !== null){
                    retrievedLogEvents = await getLogEvents(props.client, props.selectedLogGroup,  props.selectedLogStream, logEvents.nextToken);
                    updatedLogEvents = [...logEvents.events].concat(retrievedLogEvents.logEvents);
                    setlogEvents({events:updatedLogEvents, nextToken:retrievedLogEvents.nextToken});

               }
          }
                          
          
     }
     useEffect(() => {
          
          fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[props.selectedLogGroup, props.selectedLogStream]);

     const handleReturn = () => {
          props.returnCallback();
     };

     const onScroll = () => {
          if (listInnerRef.current) {
               const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
               if (scrollTop + clientHeight === scrollHeight) {
                    fetchData();
               }
          }
     };

     return (
          
          <Container fluid className="LogStreamLogsComponent" onScroll={() => onScroll()} ref={listInnerRef}>
               <Row key='header'>
                    <Col xs={11}>
                         <h3>Log Stream</h3>
                    </Col>
                    <Col xs={1} style={{textAlign:'right'}}>
                         <Button variant="light" onClick={handleReturn}> X </Button>
                    </Col>
               </Row>
               <Row key='logDesc'>
                    <Col xs={5}>
                         <h6 className="text-muted">{props.selectedLogGroup}</h6>
                    </Col>
                    <Col xs={7}>
                         <h6 className="text-muted">{props.selectedLogStream}</h6>
                    </Col>
               </Row>
               {logEvents.events.map((event, index) => 
                    <Row key={index}>
                         <Col xs={3}>
                              {util.convertTime(event.timestamp)}
                         </Col>
                         <Col xs={9}>
                              {event.message}
                         </Col>
                    </Row>
               )}
          </Container>
     );
}
export default LogStreamsComponent;