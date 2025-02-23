import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export function Home(props) {
  const [userName, setUserName] = React.useState('')
  const [readBooks, setReadBooks] = React.useState([])
  const [wishBooks, setWishBooks] = React.useState([])
  const [friends, setFriends] = React.useState([])

  React.useEffect(() => {
      const profileName = localStorage.getItem('userName');
      setUserName(profileName)
    }, []);

  React.useEffect(() => {
    const readBookList = JSON.parse(localStorage.getItem('readBooks')) || [];
    const wishBookList = JSON.parse(localStorage.getItem('wishBooks')) || [];

    setReadBooks(readBookList);
    setWishBooks(wishBookList);
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('readBooks');
    localStorage.removeItem('wishBooks');
    localStorage.removeItem('notReadBooks');

    setReadBooks([]);
    setWishBooks([]);
  };

  return (
    <form id="homeform">
    <main>
        <section>
            <h1>Welcome to BookClub!📚</h1>
            <br></br>
            <p className="info">{userName}</p>
        </section>

        <section>
            <h2>My Books</h2>
             <div className="image-container">
                {readBooks.map((book,index) => (
                    <Link to="/readbook" key={index} state={{ bookTitle: book.title, bookCover: book.image, bookStatus: book.status}}><img alt={`book-${index}`} src={book.image} width="200" className="book"/></Link>
                  )
                )}   
                <Link to="/notreadbook"><img alt="plusSymbol" src="plus.png"  width="150" className="book"/></Link>           
            </div>
        </section>

        <br></br>

        <section>
            <h2>My Wishlist</h2>
            <div className="image-container">
              {wishBooks.map((book,index) => (
                  <Link to="/notreadbook" key={index} state={{ bookTitle: book.title, bookCover: book.image, bookStatus: book.status}}><img alt={`book-${index}`} src={book.image} width="200" className="book"/></Link>
                )
              )}  
              <Link to="/notreadbook"><img alt="plusSymbol" src="plus.png"  width="150" className="book"/></Link>            
            </div>
        </section>

        <br></br>

        <section>
        <Button variant='primary' onClick={clearLocalStorage}>Clear Books</Button>
        </section>

        <section>
          <h2>Friends:</h2>
          <div className="friendbubble"></div>
          <div className="friendbubble"></div>
          <div className="friendbubble"></div>
          <div className="friendbubble"></div>
          <div className="friendbubble"></div>
          <div className="friendbubble"></div>
          <div className="friendbubble"></div>
          <div className="friendbubble"></div>
          <img alt="plusSymbol" src="plus.png" width="50" className="imgformat"/>
        </section>

    </main>
    </form>
  );
}