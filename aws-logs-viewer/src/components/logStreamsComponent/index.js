import { ButtonGroup, Container, Col, Row, ToggleButton } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { DescribeLogStreamsCommand } from "@aws-sdk/client-cloudwatch-logs";
import util from '../../util/util';
import './style.css';

const describeLogStreams = async (client, logGroupName, nextToken) => {
     if(util.isEmpty(logGroupName)) return {
          logStreams: [],
          nextToken: null
     };
     let commandParam = {
          limit:50,
          descending:true,
          logGroupName: logGroupName
     };
     if(nextToken !== null) commandParam['nextToken'] = nextToken;

     const command = new DescribeLogStreamsCommand(commandParam);
     const data = await client.send(command);
     let returnList = [];
     for(let lsi = 0; lsi<data.logStreams.length; lsi++){
          let logStream = data.logStreams[lsi];
          returnList.push({
               arn: logStream.arn,
               logStreamName: logStream.logStreamName,
               lastEventTimestamp: logStream.lastEventTimestamp
          });
     }
     let newNextToken = null;
     if(!util.isEmpty(data.nextToken))newNextToken = data.nextToken;
     return {
          logStreams: returnList,
          nextToken: newNextToken
     };

};

function LogStreamsComponent(props) {
     const listInnerRef = useRef();
     const [logStreams, setLogStreams] = useState({streams:[]});
     const [selectedLogGroup, setSelectedLogGroup] = useState(props.selectedLogGroup)
     const [selectedLogStream, setSelectedLogStream] = useState(props.selectedLogStream);

     const fetchData = async () => {
          let retrievedLogStreams = [];
          let updatedLogStreams = [];
          if(selectedLogGroup !== props.selectedLogGroup){
               // setLogStreams({streams:[]});
               retrievedLogStreams = await describeLogStreams(props.client, props.selectedLogGroup, null);
               updatedLogStreams = retrievedLogStreams.logStreams;
               setSelectedLogGroup(props.selectedLogGroup);
               setLogStreams({streams:updatedLogStreams, nextToken:retrievedLogStreams.nextToken});

               listInnerRef.current.scrollTo(0, 0)

          }else{
               if(logStreams.nextToken === undefined ){
                    retrievedLogStreams = await describeLogStreams(props.client, props.selectedLogGroup, null);
                    updatedLogStreams = retrievedLogStreams.logStreams;
                    setLogStreams({streams:updatedLogStreams, nextToken:retrievedLogStreams.nextToken});
               }else if( logStreams.nextToken !== null){
                    retrievedLogStreams = await describeLogStreams(props.client, props.selectedLogGroup, logStreams.nextToken);
                    updatedLogStreams = [...logStreams.streams].concat(retrievedLogStreams.logStreams);
                    setLogStreams({streams:updatedLogStreams, nextToken:retrievedLogStreams.nextToken});
               }
          }
                          
          
     }
     useEffect(() => {
          
          fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[props.selectedLogGroup, props.selectedLogStream]);

     const handleSetSelectedLogStream = (e) => {
          setSelectedLogStream(e);
          props.setSelectedLogStream(e);

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
          <Container fluid className="LogStreamsComponent" onScroll={() => onScroll()} ref={listInnerRef}>
               <h3>Log Streams</h3>
               { (logStreams.streams && logStreams.streams.length > 0) ?
                    <ButtonGroup className="mb-2">
                         <Container fluid className="d-grid gap-2">
                              {logStreams.streams.map((stream, index) => 
                                   <Row key={index}>
                                        <Col>
                                             <div className="d-grid gap-2">
                                                  <ToggleButton 
                                                  style={{textAlign: "left", fontWeight:'bold'}}
                                                  key={index}
                                                  id={`stream-${index}`}
                                                  type="radio"
                                                  variant="outline-primary"
                                                  name="stream"
                                                  value={stream.logStreamName}
                                                  checked={selectedLogStream === stream.logStreamName}
                                                  onChange={(e) => handleSetSelectedLogStream(e.currentTarget.value)}
                                                  >
                                                       {stream.logStreamName}
                                                  </ToggleButton>
                                             </div>
                                        </Col>
                                        <Col style={{textAlign: "right"}}>
                                             {util.convertTime(stream.lastEventTimestamp)}
                                        </Col>
                                   </Row>
                              )}
                         </Container>
                    </ButtonGroup>
                    :
                    <h6 className="text-muted">Select a log stream to view the logs</h6>
               }
          </Container>
     );
}
export default LogStreamsComponent;