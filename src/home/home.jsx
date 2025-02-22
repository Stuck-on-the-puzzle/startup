import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

export function Home(props) {
  const [readBookUrl, setReadBookUrl] = React.useState("")
  const [readBooks, setReadBooks] = React.useState([])
  const [notReadBookUrl, setNotReadBookUrl] = React.useState("")
  const [notReadBooks, setNotReadBooks] = React.useState([])
  const [friends, setFriends] = React.useState([])

  React.useEffect(() => {
    setReadBookUrl("BookPlaceHolder.png");
  }, []);

  React.useEffect(() => {
    setNotReadBookUrl("BookPlaceHolder.png");
  }, []);

  return (
    <form id="homeform">
    <main>
        <section>
            <h1>Welcome to BookClub!📚</h1>
            <br></br>
            <p className="info">Profile Username</p>
        </section>

        <section>
            <h2>My Books</h2>
             <div className="image-container">
              {readBooks.length === 0 ? (
                <Link to="/notreadbook"><img alt="plusSymbol" src="plus.png"  width="150" className="book"/></Link>
              ) : (
                readBooks.map((book,index) => (
                  <Link to="/readbook"><img alt={`book-${index}`} src={readBookUrl} width="200" className="book"/></Link>
                ))
              )}              
            </div>
        </section>

        <br></br>

        <section>
            <h2>My Wishlist</h2>
            <div className="image-container">
              {notReadBooks.length === 0 ? (
                <Link to="/notreadbook"><img alt="plusSymbol" src="plus.png"  width="150" className="book"/></Link>
              ) : (
                notReadBooks.map((book,index) => (
                  <Link to="/notreadbook"><img alt={`book-${index}`} src={notReadBookUrl} width="200" className="book"/></Link>
                ))
              )}              
            </div>
        </section>

        <br></br>

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