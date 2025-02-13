import React from 'react';
import './login.css'

export function Login() {
  return (
    <form id="loginform">
    <main className="container-fluid">
        <h1>Welcome to BookClub!📚</h1>
         <div className="input-group mb-3">
          <label className="input-group-text" for="username">Username: </label>
          <input className="form-control" type="text" id="username" name="username" placeholder="Enter Username Here" required pattern="^[^\s]*$"/>
         </div>
         <div className="input-group mb-3">
          <label className="input-group-text" for="password">Password: </label>
          <input className="form-control" type="password" id="password" name="password" placeholder="Enter Password Here" required pattern="^[^\s]*$"/>
         </div>
         <div className="d-flex gap-1">
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="submit" className="btn btn-secondary">Create</button><br></br>
         </div>
    </main>
    </form>
  );
}