import React from 'react';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './notreadbook.css';

export function NotReadBook(props) {
  const location = useLocation();
  const { bookTitle = 'Title Placeholder', bookCover = 'BookPlaceHolder.png' } = location.state || {};
  const [userName, setUserName] = React.useState('')
  const [bookStatus, setBookStatus] = React.useState('booknotread');
  
  React.useEffect(() => {
    const profileName = localStorage.getItem('userName');
    setUserName(profileName)
  }, []);

  const changeBookStatus = (e) => {
    const selectedStatus = e.target.value;
    setBookStatus(selectedStatus);
  };

  const addReadBook = () => {
    const readBooks = JSON.parse(localStorage.getItem('readBooks')) || [];
    readBooks.push({title: bookTitle, image: bookCover });
    localStorage.setItem('readBooks',JSON.stringify(readBooks));
  };

  const addWishBook = () => {
    const wishBooks = JSON.parse(localStorage.getItem('wishBooks')) || [];
    wishBooks.push({ title: bookTitle, image: bookCover });
    localStorage.setItem('wishBooks', JSON.stringify(wishBooks));
  };

  const addNotReadBook = () => {
    const notReadBooks = JSON.parse(localStorage.getItem('notReadBooks')) || [];
    notReadBooks.push({ title: bookTitle, image: bookCover });
    localStorage.setItem('notReadBooks', JSON.stringify(notReadBooks));
  };

  const submitBookStatus = () => {
    if (bookStatus === 'readbook') {
      addReadBook();
    } else if (bookStatus === 'addwishlist') {
      addWishBook();
    } else {
      addNotReadBook();
    }
  };

  return (
    <main>
        <h2>{bookTitle}</h2>
        <p className="info">{userName}</p>
        <p><img alt={bookTitle} src={bookCover} width="200" className="imgformat"/></p>

        <section>
            <h2>Book Status:</h2>
            <form id="notreadbookform">
            <div className="input-group">
              <label for="bookread">
              <div className="input-group-text">
                <label for="bookread">I've Read This Book!</label>
                <input className="form-check-input mt-0" type="radio" id="bookread" value="readbook" name="bookstatus" checked={bookStatus === 'readbook'} onChange={changeBookStatus}/>
              </div>
              </label>
              <label for="addwishlist">
              <div className="input-group-text">
                <label for="addwishlist">I Want to Read This Book!</label>
                <input className="form-check-input mt-0" type="radio" id="addwishlist" value="addwishlist" name="bookstatus" checked={bookStatus === 'addwishlist'} onChange={changeBookStatus}/>
              </div>
              </label>
              <label for="booknotread">
              <div className="input-group-text">
                <label for="booknotread">I Have Not Read This Book!</label>
                <input default className="form-check-input mt-0" type="radio" id="booknotread" value="booknotread" name="bookstatus" checked={bookStatus === 'booknotread'} onChange={changeBookStatus}/>
              </div>
              </label>
            </div>
            </form>
        </section>

        <br></br>

        <section>
          {/* make this button take you back to the home screen!!! */}
          <Link to="/home"><Button variant='primary' onClick={submitBookStatus}>Submit!</Button></Link>
        </section>

        <br></br>

         <section>
            <h2>Friends Who Have Read this Book:</h2>
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