import React from 'react';
import './readbook.css';

export function ReadBook() {
  return (
    <main>
        <h2>BookTitle</h2>
        <p className="info">Profile Username</p>
        <p><img alt="bookplaceholder" src="BookPlaceHolder.png" width="200" className="imgformat" /></p>
        <section>
          <div className="form-group">
            <label for="review" className="reviewlabel">Review: </label>
            <textarea className="form-control bg-primary text-light" style={{ height: '100px' }} placeholder="Write Your Review Here!" 
            id="review" name="review"></textarea>         
          </div>
        </section>
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