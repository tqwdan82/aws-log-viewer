import {Button, Container, Form} from 'react-bootstrap';

function CredsComponent(props) {

     const handleSubmit = (event) => {
          const form = event.currentTarget;
          if (form.checkValidity() === false) {
               event.preventDefault();
               event.stopPropagation();
          }
          
          props.setCreds({
               key:form.awsKey.value,
               secret: form.awsSecret.value
          });
     };
     return (
               
          <Container fluid className="mt-3">
               <h3> Enter your AWS CLI Credentials </h3>
               <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="awsKey">
                         <Form.Label>AWS Key</Form.Label>
                         <Form.Control required type="text" placeholder="Enter AWS Key" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="awsSecret">
                         <Form.Label>AWS Secret</Form.Label>
                         <Form.Control required type="text" placeholder="Enter AWS Secret" />
                    </Form.Group>
                    <Button type="submit">Submit</Button>
               </Form>
          </Container>

     );
}

export default CredsComponent;
