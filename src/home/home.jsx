import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

export function Home() {
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
              <Link to="/readbook"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></Link>
              <Link to="/readbook"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></Link>
              <Link to="/readbook"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></Link>
              <Link to="/readbook"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></Link>
              <Link to="/readbook"><img alt="plusSymbol" src="plus.png"  width="150" className="book"/></Link>
            </div>
        </section>
        <br></br>
        <section>
            <h2>My Wishlist</h2>
            <div>
              <Link to="/notreadbook"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></Link>
              <Link to="/notreadbook"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></Link>
              <Link to="/notreadbook"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></Link>
              <Link to="/notreadbook"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></Link>
              <Link to="/notreadbook"><img alt="plusSymbol" src="plus.png" width="150" className="book"/></Link>
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