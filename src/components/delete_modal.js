import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useRef } from 'react';
import { SPINNERS_BORDER_HTML } from './utilities';
const DeleteModal = ({obj, deleteBank, hideModal}) => {
    const buttonRef = useRef(null);
    const handleDelete = (id) => {
        const text = buttonRef?.current?.textContent;
        buttonRef.current.innerHTML = SPINNERS_BORDER_HTML;
        const callback = () => {
            buttonRef.current.textContent = text;
        }
        deleteBank(id, callback);
    }
    return ( 
        <>
            <Modal show={obj.show} onHide={() => hideModal('delete')}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete (ID : {obj.id})</Modal.Title>
                </Modal.Header>
                <Modal.Body>{"Are you sure you want to delete this item?"}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"  onClick={() => hideModal('delete')}>Cancel</Button>
                    <Button variant="danger" ref={buttonRef}  onClick={() => handleDelete(obj.id)}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
        
     );
}

export default DeleteModal;
