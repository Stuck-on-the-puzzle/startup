import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import './notreadbook.css';

export function NotReadBook() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookTitle, bookCover } = location.state || {};
  const [bookStatus, setBookStatus] = React.useState('booknotread');
  const [userName, setUserName] = React.useState('');
  const [friends, setFriends] = React.useState([]);
  const [reviewModal, setReviewModal] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState('');
  
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
        const readBooks = data.readBooks || [];
        const wishBooks = data.wishBooks || [];

        if (readBooks.some(book => book.title === bookTitle))   {
          setBookStatus('readbook');
        }  else if (wishBooks.some(book => book.title === bookTitle)) {
          setBookStatus('addwishlist');
        } else {
          setBookStatus('booknotread');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    const fetchFriendData = async () => {
      try {
        const response = await fetch(`/api/user/friendbooks`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setFriends(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };


    fetchUserData();
    fetchFriendData();
  }, []);

  const changeBookStatus = (e) => {
    const selectedStatus = e.target.value;
    setBookStatus(selectedStatus);
  };

  const submitBookStatus = async () => {
    const book = { title: bookTitle, image: bookCover };

    try {
      await fetch(`/api/user/readbooks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ book, list: 'readBooks' }),
        credentials: 'include',
      });
      await fetch(`/api/user/wishbooks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ book, list: 'readBooks' }),
        credentials: 'include',
      });

      if (bookStatus === 'readbook') {
        await fetch(`/api/user/readbooks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ book }),
          credentials: 'include',
        });
      } else if (bookStatus === 'addwishlist') {
        await fetch(`/api/user/wishbooks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ book }),
          credentials: 'include',
        });
      }

      const review = '';
      await fetch(`/api/user/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, bookTitle, review }),
        credentials: 'include',
      });

    } catch (err) {
      console.error('Error updating book status:', err);
    }
  };

  const submitButtonNav = () => {
    submitBookStatus();
    if (bookStatus === 'readbook') {
      navigate('/readbook', {state: { bookTitle: bookTitle, bookCover: bookCover }});
    } else {
      navigate('/home');
    }
  };

  const seeReview = (friend) => {
    const friendReadBooks = friend.readBooks || [];
    const friendReview = friendReadBooks.find(book => book.title === bookTitle)?.review;
    setSelectedReview(friendReview || "No Review Available.");
    setReviewModal(true);
  }

  return (
    <form>
    <main>
        <h2>{bookTitle}</h2>
        <p className="info">{userName}</p>
        <p><img alt={bookTitle} src={bookCover} width="200" className="imgformat"/></p>

        <section>
            <h2>Book Status:</h2>
            <form id="notreadbookform">
            <div className="input-group">
              <label htmlFor="bookread">
              <div className="input-group-text">
                <label htmlFor="bookread">I've Read This Book!</label>
                <input className="form-check-input mt-0" type="radio" id="bookread" value="readbook" name="bookstatus" checked={bookStatus === 'readbook'} onChange={changeBookStatus}/>
              </div>
              </label>
              <label htmlFor="addwishlist">
              <div className="input-group-text">
                <label htmlFor="addwishlist">I Want to Read This Book!</label>
                <input className="form-check-input mt-0" type="radio" id="addwishlist" value="addwishlist" name="bookstatus" checked={bookStatus === 'addwishlist'} onChange={changeBookStatus}/>
              </div>
              </label>
              <label htmlFor="booknotread">
              <div className="input-group-text">
                <label htmlFor="booknotread">I Have Not Read This Book!</label>
                <input className="form-check-input mt-0" type="radio" id="booknotread" value="booknotread" name="bookstatus" checked={bookStatus === 'booknotread'} onChange={changeBookStatus}/>
              </div>
              </label>
            </div>
            </form>
        </section>

        <br></br>

        <section>
          <Button variant='primary' onClick={submitButtonNav}>Submit!</Button>
        </section>

        <br></br>

         <section>
            <h2>Friends Who Have Read this Book:</h2>
            <p>Click to See Their Review!</p>
            <div className="friend-container">
              {friends.length === 0 ? (
                <p>No Friends Have Read This Book</p>
              ) : (
                friends.map((friend, index) => (
                  <div key={index} className="friendbubble" onClick={() => seeReview(friend)}>{friend.username}</div>
                ))
              )}
            </div>
         </section>

    </main>

    <Modal show={reviewModal} onHide={() => setReviewModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Your Friend's Review:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="review-container">
          <p>{selectedReview}</p>
        </div>
      </Modal.Body>
    </Modal>

    </form>
  );
}