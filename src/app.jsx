import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
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
    return <div className="body bg-dark text-light"><header>
    <h1>BookClub!📚</h1>
    <nav>
      <ul>
        <li><a href="index.html" className="makelinkbig">Login</a></li>
        <li><a href="home.html" className="makelinkbig">Home</a></li>
        <li><a href="readbook.html" className="makelinkbig">BooksRead</a></li>
        <li><a href="notreadbook.html" className="makelinkbig">BooksNotRead</a></li>
      </ul>
    </nav>
    <hr />
  </header>

  <main className="container-fluid">App components go here</main>

  <footer>
      <div>Author: Nathan Stucki</div>
      <a href="https://github.com/Stuck-on-the-puzzle/startup.git" className="makelinkbig">GitHub</a>
  </footer></div>;
}