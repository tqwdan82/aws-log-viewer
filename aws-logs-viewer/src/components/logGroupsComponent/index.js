import { ButtonGroup, Container, ListGroup, ToggleButton } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { DescribeLogGroupsCommand } from "@aws-sdk/client-cloudwatch-logs";
import './style.css';
import util from '../../util/util';

const describeLogGroups = async (client, nextToken) => {
     let commandParam = {
          limit:50
     };
     if(nextToken !== null) commandParam['nextToken'] = nextToken;

     const command = new DescribeLogGroupsCommand(commandParam);
     const data = await client.send(command);
     let returnList = [];
     for(let lgi = 0; lgi<data.logGroups.length; lgi++){
          let logGroup = data.logGroups[lgi];
          returnList.push({
               arn: logGroup.arn,
               logGroupName: logGroup.logGroupName
          });
     }
     let newNextToken = null;
     if(!util.isEmpty(data.nextToken))newNextToken = data.nextToken;
     return {
          logGroups: returnList,
          nextToken: newNextToken
     };

};

function LogGroupsComponent(props) {
     const listInnerRef = useRef();
     const [logGroups, setLogGroups] = useState({groups:[]});
     const [selectedLogGroup, setSelectedLogGroup] = useState(props.selectedLogGroup);

     const fetchData = async () => {
          let retrievedLogGroups = [];
          let updatedLogGroups = [];
          if(logGroups.nextToken === undefined ){

               retrievedLogGroups = await describeLogGroups(props.client, null);
               updatedLogGroups = retrievedLogGroups.logGroups;
               setLogGroups({groups:updatedLogGroups, nextToken:retrievedLogGroups.nextToken});

          }else if( logGroups.nextToken !== null){
               retrievedLogGroups = await describeLogGroups(props.client, logGroups.nextToken);
               updatedLogGroups = [...logGroups.groups].concat(retrievedLogGroups.logGroups);
               setLogGroups({groups:updatedLogGroups, nextToken:retrievedLogGroups.nextToken});
          }
          
     }

     useEffect(() => {
          fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[props.selectedLogGroup]);

     const handleSetSelectedLogGroup = (e) => {
          setSelectedLogGroup(e);
          props.setSelectedlogGroup(e);

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
          // <div className="list-inner" onScroll={() => onScroll()} ref={listInnerRef} >
               <Container fluid className="LogGroupsComponent" onScroll={() => onScroll()} ref={listInnerRef}>
                    <h3>Log Groups</h3>
                    
                    <ButtonGroup className="mb-2">
                    <ListGroup>
                         {logGroups.groups.map((group, index) => 
                              <ListGroup.Item key={index} style={{border:'none'}}>
                                   <div className="d-grid gap-2">
                                        <ToggleButton 
                                        style={{textAlign: "left", fontWeight:'bold'}}
                                        key={index}
                                        id={`group-${index}`}
                                        type="radio"
                                        variant="outline-primary"
                                        name="group"
                                        value={group.logGroupName}
                                        checked={selectedLogGroup === group.logGroupName}
                                        onChange={(e) => handleSetSelectedLogGroup(e.currentTarget.value)}
                                        >
                                             {group.logGroupName}
                                        </ToggleButton>
                                   </div>
                              </ListGroup.Item>
                         )}
                         </ListGroup>
                    </ButtonGroup>
                    
               </Container>
          // </div>
     );
}
export default LogGroupsComponent;