import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './readbook.css';

export function ReadBook() {
  const location = useLocation();
  const { bookTitle, bookCover} = location.state || {};
  const [ bookReview, setReview] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [friends, setFriends] = React.useState([]); 

  React.useEffect(() => {
    fetchUserProfile();
    fetchReviewForBook();
    fetchFreindList();
  }, []);

  const submitReview = async () => {
    const newReview = { user: userName, book: bookTitle, review: bookReview };

    try {
      const response = await fetch('api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        console.log("Review Submitted!");
      }
      else {
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

  const sendReccomendation = () => {
    console.log(`Sending recommendation to ${friendName}`);
    //PLACEHOLDER FOR SENDING RECCOMENDATIONS MAYBE DELETE WHO KNOWS
  }

  const fetchUserProfile = async () => {
    const response = await fetch(`/api/user/profile`);
    const data = await response.json();
    setUserName(data.username);
  };

  const fetchFreindList = async () => {
    const response = await fetch(`/api/user/friends`);
    const data = await response.json();
    setFriends(data);
  }

  const fetchReviewForBook = async () => {
    const response = await fetch(`/api/reviews`);
    const reviews = await response.json();
    const userReview = reviews.find(
      (review) => review.user === userName && review.book === bookTitle
    );

    setReview(userReview ? userReview.review : '');
  }

  return (
    <form>
    <main>
        <h2>{bookTitle}</h2>
        <p className="info">{userName}</p>
        <p><img alt={bookTitle} src={bookCover} width="200" className="imgformat" /></p>
        
        <section>
          <div className="form-group">
            <label for="review" className="reviewlabel">Review: </label>
            <textarea className="form-control bg-primary text-light" style={{ height: '100px' }} placeholder="Write Your Review Here!" 
            id="review" name="review" value={bookReview} onChange={(e) => setReview(e.target.value)}></textarea>         
          </div>
        </section>

        <br />

        <section>
          <Link to="/home"><Button variant='primary' className="me-1" onClick={submitReview}>Submit!</Button></Link>
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
                <div key={index} className="friendbubble" onClick={sendReccomendation}>{friend.name}</div>
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
          <Link to="/notreadbook" state={{ bookTitle: bookTitle, bookCover: bookCover}}><Button variant='primary' className="me-1">Yes, Change Book Status</Button></Link>
          <Button variant='primary' className="me-1" onClick={() => setShowModal(false)}>No, Do Not Change Book Status</Button>
        </div>
      </Modal.Body>
    </Modal>
    </form>
  );
}