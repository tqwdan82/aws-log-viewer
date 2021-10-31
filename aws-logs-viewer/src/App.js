import './App.css';
import CredsComponent from './components/credsComponent';
import LandingComponent from './components/landingComponent';
import {useState} from 'react';
import util from './util/util';
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";

function App() {
  const [creds, setCreds] = useState({});
  const [client, setClient] = useState({});

  const handleSetCreds = (creds) => {
    setCreds(creds);
    const newClient = new CloudWatchLogsClient({ 
      region: 'ap-southeast-1',
      credentials: {
          accessKeyId: creds.key,
          secretAccessKey: creds.secret
      }
    });
    setClient(newClient);
  }

  return (
    <div className="App">

      {util.isEmpty(creds) ?
        <CredsComponent setCreds={handleSetCreds}/>
        :
        <LandingComponent client={client}/>
      }
    </div>
  );
}

export default App;
