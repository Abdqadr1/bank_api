import { Modal, Button } from "react-bootstrap";
const MessageModal = ({ obj, hideModal }) => {
    return ( 
        <Modal show={obj.show} onHide={()=>hideModal('message')}>
            <Modal.Header closeButton={false}>
                    <Modal.Title>{obj.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p>{obj.message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={()=>hideModal('message')}> Close </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default MessageModal;