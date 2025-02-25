import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function Home() {
  const [userName, setUserName] = React.useState('')
  const [readBooks, setReadBooks] = React.useState([])
  const [wishBooks, setWishBooks] = React.useState([])
  const [friends, setFriends] = React.useState([])
  const [friendsToSelect, setFriendsToSelect] = React.useState([])
  const [showModal, setShowModal] = React.useState(false);
  const [showFriendModal, setShowFriendModal] = React.useState(false);
  const [booksToSelect, setBooksToSelect] = React.useState([]);
  const [selectedBook, setSelectedBook] = React.useState(null);

  React.useEffect(() => {
    const profileName = localStorage.getItem('userName');
    setUserName(profileName);

    const readBookList = JSON.parse(localStorage.getItem('readBooks')) || [];
    const wishBookList = JSON.parse(localStorage.getItem('wishBooks')) || [];
    const friendList = JSON.parse(localStorage.getItem('friendList')) || [];

    console.log(readBookList, wishBookList, friendList);
    setReadBooks(readBookList);
    setWishBooks(wishBookList);
    setFriends(friendList);
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('readBooks');
    localStorage.removeItem('wishBooks');
    localStorage.removeItem('notReadBooks');

    setReadBooks([]);
    setWishBooks([]);
  };

  const bookSelection = () => {
    setBooksToSelect([]); // This resets the book selection

    // THIS IS THE DATABASE PLACEHOLDER
    const booksDatabase = [
      { title: 'PlaceHolderBook1', image: "BookPlaceHolder.png"},
      { title: 'PlaceHolderBook2', image: "BookPlaceHolderTwo.png"} ];

    const allBooks = [...readBooks, ...wishBooks];

    const selectableBooks = booksDatabase.filter(book => {
      return !allBooks.some(b => b.title === book.title);
    });

    selectableBooks.forEach(book => {
      setBooksToSelect(prevBooks => [...prevBooks, book])
    });
    setShowModal(true);
  };

  const friendSelection = () => {
    setFriendsToSelect([]); // Resets friend selection

    // THIS IS THE USER LIST PLACE HOLDER
    const userListPlaceholder = [
      { name: 'John', books: [{ title: 'PlaceHolderBook2', image: "BookPlaceHolderTwo.png"}]},
      { name: 'Rose', books: [{ title: 'PlaceHolderBook1', image: "BookPlaceHolder.png"}] },
      { name: 'Charles', books: [] },
      { name: 'Emilee', books: [{ title: 'PlaceHolderBook1', image: "BookPlaceHolder.png"},{ title: 'PlaceHolderBook2', image: "BookPlaceHolderTwo.png"}]}
      ]

    const selectableFriends = userListPlaceholder.filter(friend => {
      return !friends.some(existingFriend => existingFriend.name === friend.name);
    });

    selectableFriends.forEach(friend => {
      setFriendsToSelect(prevFriends => [...prevFriends, friend])
    });
    setShowFriendModal(true)
  }

  const addBook = (book) => {
    setSelectedBook(prevBooks => [...prevBooks, book]);
    setShowModal(false);
  };

  const addFriend = (friend) => {
    const updatedFriends = [...friends, friend];
    localStorage.setItem('friendList', JSON.stringify(updatedFriends));
    setFriends(prevFriends => [...prevFriends, friend]);
    setShowFriendModal(false);
  }

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
                    <Link to="/readbook" key={index} state={{ bookTitle: book.title, bookCover: book.image}}><img alt={`book-${index}`} src={book.image} width="200" className="book"/></Link>
                  )
                )}   
                <img alt="plusSymbol" src="plus.png"  width="150" className="book" onClick={bookSelection}/>        
            </div>
        </section>

        <br></br>

        <section>
            <h2>My Wishlist</h2>
            <div className="image-container">
              {wishBooks.map((book,index) => (
                  <Link to="/notreadbook" key={index} state={{ bookTitle: book.title, bookCover: book.image}}><img alt={`book-${index}`} src={book.image} width="200" className="book"/></Link>
                )
              )}  
              <img alt="plusSymbol" src="plus.png"  width="150" className="book" onClick={bookSelection}/>              
            </div>
        </section>

        <br></br>

        <section>
        <Button variant='primary' onClick={clearLocalStorage}>Clear Books</Button>
        </section>

        <section>
          <h2>Friends:</h2>
          <div className="friend-container">
            {friends.map((friend, index) => (
              <div key={index} className="friendbubble">{friend.name}</div>
            ))}
            <img alt="plusSymbol" src="plus.png" width="50" className="imgformat" onClick={friendSelection}/>
          </div>
        </section>

    </main>

    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <div className="book-selection">
            {booksToSelect.length === 0 ? (
              <p>No Books Available</p>
            ) : (
              booksToSelect.map((book,index) => (
                <div key={index}>
                  <Link to="/notreadbook" state={{ bookTitle: book.title, bookCover: book.image }}>
                  {/* maybe change the class name for the image */}
                    <img alt={`book-${index}`} src={book.image} width="150" className="book" onClick={() => addBook(book)} />
                  </Link>
                  <p>{book.title}</p>
                </div>
              )))}  
          </div>
      </Modal.Body>
    </Modal>

    <Modal show={showFriendModal} onHide={() => setShowFriendModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Friend to Add</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="friend-selection">
          {friendsToSelect.length === 0 ? (
            <p>No Friends Left To Add...</p>
          ) : (
            friendsToSelect.map((friend, index) => (
              <div key={index}>
                <p onClick={() => addFriend(friend)}>{friend.name}</p>
              </div>
            )))}
        </div>
      </Modal.Body>
    </Modal>
    </form>
  );
}