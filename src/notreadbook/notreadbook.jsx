import React from 'react';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './notreadbook.css';

export function NotReadBook() {
  const location = useLocation();
  const { bookTitle, bookCover} = location.state || {};
  const [bookStatus, setBookStatus] = React.useState('booknotread')
  const [userName, setUserName] = React.useState('')
  
  React.useEffect(() => {
    const profileName = localStorage.getItem('userName');
    setUserName(profileName)

    const readBooks = JSON.parse(localStorage.getItem('readBooks')) || [];
    const wishBooks = JSON.parse(localStorage.getItem('wishBooks')) || [];

    if (readBooks.some(book => book.title === bookTitle))   {
      setBookStatus('readbook');
    }  else if (wishBooks.some(book => book.title === bookTitle)) {
      setBookStatus('addwishlist');
    } else {
      setBookStatus('booknotread');
    }

  }, []);

  const changeBookStatus = (e) => {
    const selectedStatus = e.target.value;
    setBookStatus(selectedStatus);
  };

  const addBook = (list, book) => {
    const books = JSON.parse(localStorage.getItem(list)) || [];
    const bookInList = books.some(b => b.title === book.title);
    if (!bookInList) {
      books.push(book);
      localStorage.setItem(list, JSON.stringify(books));
    }
  };

  const removeBook = (list, bookTitle) => {
    const books = JSON.parse(localStorage.getItem(list)) || [];
    const updatedList = books.filter(book => book.title !== bookTitle);
    localStorage.setItem(list, JSON.stringify(updatedList));
  };

  const submitBookStatus = () => {
    removeBook('readBooks', bookTitle)
    removeBook('wishBooks', bookTitle)
    removeBook('notReadBooks', bookTitle)

    const book = { title: bookTitle, image: bookCover};
    if (bookStatus === 'readbook') {
      addBook('readBooks', book);
    } else if (bookStatus === 'addwishlist') {
      addBook('wishBooks', book);
    } else {
      addBook('notReadBooks', book);
    }

    const review = '';
    localStorage.setItem(`${bookTitle}_review`, review)

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
                <input className="form-check-input mt-0" type="radio" id="booknotread" value="booknotread" name="bookstatus" checked={bookStatus === 'booknotread'} onChange={changeBookStatus}/>
              </div>
              </label>
            </div>
            </form>
        </section>

        <br></br>

        <section>
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