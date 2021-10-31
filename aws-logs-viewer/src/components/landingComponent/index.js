import LogGroupsComponent from '../logGroupsComponent';
import LogStreamsComponent from '../logStreamsComponent';
import LogStreamLogsComponent from '../logStreamLogsComponent';
import {Container, Col, Row} from 'react-bootstrap';
import {useState} from 'react';
import './style.css';
import util from '../../util/util';

function LandingComponent(props) {
  const [selected, setSelected] = useState({
       logGroup: null,
       logStream: null,
       viewingLogStream: null
  });

  const setSelectedLogGroup = (logGroup) => {
     let tempSelected = {...selected};
     tempSelected.logGroup = logGroup;
     setSelected(tempSelected);
  };

  const setSelectedLogStream = (logStream) => {
     let tempSelected = {...selected};
     tempSelected.logStream = logStream;
     tempSelected.viewingLogStream = logStream;
     setSelected(tempSelected);
  }

  const resetViewingLogStream = () => {
     let tempSelected = {...selected};
     tempSelected.viewingLogStream = null;
     setSelected(tempSelected);
  }

  return (
    <div className="LandingComponent">

     {util.isEmpty(selected.viewingLogStream) ?
          <Container fluid>
               <Row>
                    <Col xs={5}>
                         <LogGroupsComponent 
                         selectedLogGroup={selected.logGroup} 
                         setSelectedlogGroup={setSelectedLogGroup} 
                         client={props.client}/>
                    </Col>
                    <Col xs={7}>
                         <LogStreamsComponent 
                         setSelectedLogStream={setSelectedLogStream} 
                         selectedLogGroup={selected.logGroup} 
                         selectedLogStream={selected.logStream} 
                         client={props.client}
                         />
                    </Col>
                    {/* <Col xs={4}><LogGroupsComponent client={props.client}/></Col> */}
               </Row>
          </Container>
          :
          <LogStreamLogsComponent 
          returnCallback={resetViewingLogStream}
          selectedLogGroup={selected.logGroup}
          selectedLogStream={selected.logStream} 
          client={props.client}
          />
     }
    </div>
  );
}

export default LandingComponent;
