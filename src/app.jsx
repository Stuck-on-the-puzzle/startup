import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Home } from './home/home';
import { ReadBook } from './readbook/readbook';
import { NotReadBook } from './notreadbook/notreadbook';

// import Button from 'react-bootstrap/Button';

// export function NavButton({ text, url }) {
//   const navigate = useNavigate();
//   return (
//     <Button variant="primary" onClick={() => navigate({ url })}>
//       {text}
//     </Button>
//   );
// }

export default function App() {
    return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
      <header>
        <h1>BookClub!📚</h1>
        <nav>
        <ul>
            <li><NavLink to="/" className="makelinkbig">Login</NavLink></li>
            <li><NavLink to="home" className="makelinkbig">Home</NavLink></li>
            <li><NavLink to="readbook" className="makelinkbig">BooksRead</NavLink></li>
            <li><NavLink to="notreadbook" className="makelinkbig">BooksNotRead</NavLink></li>
        </ul>
        </nav>
        <hr />
      </header>

      <Routes>
        <Route path='/' element={<Login />} exact />
        <Route path='/home' element={<Home />} />
        <Route path='/readbook' element={<ReadBook />} />
        <Route path='/notreadbook' element={<NotReadBook />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <footer>
        <div>Author: Nathan Stucki</div>
        <a href="https://github.com/Stuck-on-the-puzzle/startup.git" className="makelinkbig">GitHub</a>
      </footer>
      </div>
  </BrowserRouter>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
  }