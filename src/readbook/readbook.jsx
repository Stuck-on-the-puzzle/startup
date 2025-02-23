import React from 'react';
import Button from 'react-bootstrap/Button'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './readbook.css';

export function ReadBook() {
  const location = useLocation();
  const { bookTitle, bookCover} = location.state || {};
  const [ bookReview, setReview] = React.useState('');
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
    const profileName = localStorage.getItem('userName');
    setUserName(profileName)

    const bookReviewTmp = localStorage.getItem(`${bookTitle}_review`);
    setReview(bookReviewTmp || '');
  }, []);

  const submitReview = () => {
    localStorage.setItem(`${bookTitle}_review`, bookReview);
  };

  return (
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
          <Link to="/notreadbook" state={{ bookTitle: bookTitle, bookCover: bookCover}}><Button variant='primary' className="me-1">Change Book Status?</Button></Link>
        </section>

        <br />

        <section>
           <h2>Recommend to a Friend?</h2>
           <div className="friendbubble"></div>
           <div className="friendbubble"></div>
           <div className="friendbubble"></div>
           <div className="friendbubble"></div>
           <div className="friendbubble"></div>
           <div className="friendbubble"></div>
           <div className="friendbubble"></div>
           <div className="friendbubble"></div>
        </section>
    </main>
  );
}