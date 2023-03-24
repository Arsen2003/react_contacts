import React, { useState, useEffect, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/cardList.css';

function Contacts() {
  const [data, setData] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleClose = () => setShowModal(false);
  const handleCardClick = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

   useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        localStorage.setItem('data', JSON.stringify(data));
        setData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();

  }, []);

  useEffect(() => {

    localStorage.setItem('data', JSON.stringify(data));

  }, [data]);

  const handleSaveChanges = (updatedContact) => {
    const updatedData = data.map((contact) =>
      contact.id === updatedContact.id ? updatedContact : contact
    );
    setData(updatedData);
    localStorage.setItem('data', JSON.stringify(updatedData));
    handleClose();
  };



  const memoHandledData = useMemo(() => {
    let dataCopy = [...data]
    dataCopy = data.filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    dataCopy.sort((a, b) => a.name.localeCompare(b.name));
    return dataCopy
  }, [data, searchQuery]);


  return (
    <div>
      <h1>Contact List</h1>

      <div className='card__container'>
      <Form.Group controlId="formBasicSearch"  style={{width:'100%'}}>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>


        {memoHandledData.map((contact) => (
          <Card key={contact.id} style={{ width: '100%' }} onClick={() => handleCardClick(contact)}>
            <Card.Body style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Card.Title>{contact.name}</Card.Title>
              <Card.Text>{contact.phone}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      {selectedContact && (
        <Modal show={showModal} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Name</span>
            <input type='text' value={selectedContact.name} onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })} />
            <span>Phone</span>
            <input type='text' value={selectedContact.phone} onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button variant='primary' onClick={() => handleSaveChanges(selectedContact)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Contacts;
