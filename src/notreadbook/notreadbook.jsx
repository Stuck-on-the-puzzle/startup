import React from 'react';
import './notreadbook.css';

export function NotReadBook() {
  return (
    <main>
        <h2>BookTitle</h2>
        <p className="info">Profile Username</p>
        <p><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="imgformat"/></p>
        <section>
            <h2>Book Status:</h2>
            <form id="notreadbookform">
            <div className="input-group">
              <label for="bookread">
              <div className="input-group-text">
                <label for="bookread">I've Read This Book!</label>
                <input className="form-check-input mt-0" type="radio" id="bookread" value="bookread" name="bookstatus"/>
              </div>
              </label>
              <label for="addwishlist">
              <div className="input-group-text">
                <label for="addwishlist">I Want to Read This Book!</label>
                <input className="form-check-input mt-0" type="radio" id="addwishlist" value="addwishlist" name="bookstatus"/>
              </div>
              </label>
              <label for="booknotread">
              <div className="input-group-text">
                <label for="booknotread">I Have Not Read This Book!</label>
                <input default className="form-check-input mt-0" type="radio" id="booknotread" value="booknotread" name="bookstatus"/>
              </div>
              </label>
            </div>
            </form>
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