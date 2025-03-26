import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './readbook.css';

export function ReadBook() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookTitle, bookCover} = location.state || {};
  const [ bookReview, setReview] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [friends, setFriends] = React.useState([]); 

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserName(data.username);
        setFriends(data.friends || []);
        const currentReview = data.reviews.find(
          (review) => review.bookTitle === bookTitle
        );
        setReview(currentReview ? currentReview.review : '');
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
  
    fetchUserData();
  }, []); 

  const submitReview = async () => {
    const newReview = { username: userName, bookTitle: bookTitle, review: bookReview };

    try {
      const response = await fetch('/api/user/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const updatedReview = data.find(
          (review) => review.username === userName && review.bookTitle === bookTitle
        )
        setReview(updatedReview ? updatedReview.review : '');
        navigate('/home');
      } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  };

  const warningMessage = () => {
    setShowModal(true);
  };

  const sendReccomendation = (friend) => {!
    console.log(`Sending recommendation to ${friend.username}`);
    //PLACEHOLDER FOR SENDING RECCOMENDATIONS
  }

  const removeBookFromReadBooksList = async () => {
    try {
      const response = await fetch('/api/user/readbooks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book: {title: bookTitle, cover: bookCover } }),
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/home');
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error removing book from readBooks:", error);
    }
    setShowModal(false);
  };

  return (
    <div>
    <main>
        <h2>{bookTitle}</h2>
        <p className="info">{userName}</p>
        <p><img alt={bookTitle} src={bookCover} width="200" className="imgformat" /></p>
        
        <section>
          <div className="form-group">
            <label htmlFor="review" className="reviewlabel">Review:</label>
            <textarea className="form-control bg-primary text-light" style={{ height: '100px' }} placeholder="Write Your Review Here!" 
            id="review" name="review" value={bookReview} onChange={(e) => setReview(e.target.value)}></textarea>         
          </div>
        </section>

        <br />

        <section>
          <Button variant='primary' className="me-1" onClick={submitReview}>Submit!</Button>
          <Button variant='primary' className="me-1" onClick={warningMessage}>Change Book Status?</Button>
        </section>

        <br />

        <section>
          <h2>Recommend to a Friend?</h2>
          <div className="friend-container">
            {friends.length === 0 ? (
              <p>You Have No Friends...</p>
            ) : (
              friends.map((friend, index) => (
                <div key={index} className="friendbubble" onClick={sendReccomendation(friend)}>{friend.username}</div>
              ))
            )}
          </div>
        </section>
    </main>

    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>WARNING!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="warning-message">
          <h3>Changing This Books Status Will Permanently Delete Your Review</h3>
          <p>Do You Want to Continue?</p>
          <Button variant='primary' className="me-1" onClick={ removeBookFromReadBooksList }>Yes, Remove Book From My Read Books List</Button>
          <Button variant='primary' className="me-1" onClick={() => setShowModal(false)}>No, Do Not Change Book Status</Button>
        </div>
      </Modal.Body>
    </Modal>
    </div>
  );
}