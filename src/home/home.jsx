import React from 'react';
import './home.css';

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
              <a href="readbook.html"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></a>
              <a href="readbook.html"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></a>
              <a href="readbook.html"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></a>
              <a href="readbook.html"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></a>
              <a href="readbook.html"><img alt="plusSymbol" src="plus.png"  width="150" className="book"/></a>
            </div>
        </section>
        <br></br>
        <section>
            <h2>My Wishlist</h2>
            <div>
              <a href="notreadbook.html"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></a>
              <a href="notreadbook.html"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></a>
              <a href="notreadbook.html"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></a>
              <a href="notreadbook.html"><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="book"/></a>
              <a href="notreadbook.html"><img alt="plusSymbol" src="plus.png" width="150" className="book"/></a>
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