import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const recommendationPlaceHolder = (displayRecommendation, friends) => {
  setInterval(() => {
    const randomFriend = friends[Math.floor(Math.random() * friends.length)];
    if (randomFriend.readBooks.length > 0) {
      const randomBook = randomFriend.readBooks[Math.floor(Math.random() * randomFriend.readBooks.length)];
      displayRecommendation({booktitle: randomBook.bookTitle, from: randomFriend.username });
    }
  }, 7000);
};

export function Home() {
  const [userName, setUserName] = React.useState('');
  const [readBooks, setReadBooks] = React.useState([]);
  const [wishBooks, setWishBooks] = React.useState([]);
  const [friends, setFriends] = React.useState([]);
  const [friendsToSelect, setFriendsToSelect] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showFriendModal, setShowFriendModal] = React.useState(false);
  const [removeFriendModal, setRemoveFriendModal] = React.useState(false);
  const [recommendedBook, setRecommendedBook] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [bookDatabase, setBookDatabase] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserName(data.username)
        setReadBooks(data.readBooks || []);
        setWishBooks(data.wishBooks || []);
        setFriends(data.friends || []);
        console.log(data)
        recommendationPlaceHolder(displayRecommendation, data.friends);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const searching = (event) => {
    setSearchTerm(event.target.value);
  };

  const enterButtonSearch = (event) => {
    if (event.key === 'Enter') {
      searchBooks();
    }
  };

  const searchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://openlibrary.org/search.json?title=${searchTerm}`);
      const data = await response.json();
      const books = data.docs.map((book) => ({
        title: book.title,
        coverImage: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
      }));
      setBookDatabase(books);
    } catch (error) {
      console.error('Error Fetching Books:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookSelection = () => {
    setShowModal(true);
  };

  const friendSelection = async () => {
    setFriendsToSelect([]); // Resets friend selection
    try {
      const response = await fetch(`/api/users`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to Find Friends to Add');
      const allUsers = await response.json();
      const selectableFriends = allUsers.filter(user => {
        return !friends.some(existingFriend => existingFriend.username === user.username);
      });
      setFriendsToSelect(selectableFriends);
      setShowFriendModal(true);
    } catch (error) {
      console.error('Error Finding Friends to Add:', error);
    }
  };

  const filterFriends = (users) => {
    if (!searchTerm) return users;
    return users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  const addBook =  () => {
    setShowModal(false);
  };

  const addFriend = async (friend) => {
    try {
      const response = await fetch(`/api/user/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friend: {username: friend.username } }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to add friend');
      const updatedFriends = await response.json();
      setFriends(updatedFriends);
      setShowFriendModal(false);
    } catch (err) {
      console.error('Error adding friend:', err);
    }
  };

  const removeFriendPopUp = () => {
    setRemoveFriendModal(true);
  };

  const removeFriend = async (friend) => {
    try {
      const response = await fetch(`/api/user/friends`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friend }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to remove friend');
      const updatedFriends = await response.json();
      setFriends(updatedFriends);
      setRemoveFriendModal(false);
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const displayRecommendation = (recommendation) => {
    setRecommendedBook(`${recommendation.from} recommends ${recommendation.booktitle}`)
  };

  const clearBooks = async () => {
    try {
      const response = await fetch(`/api/user/clearBooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to clear books');
      }
      // Reset the local state after clearing books
      setReadBooks([]);
      setWishBooks([]);
    } catch (err) {
      console.error('Error clearing books:', err);
    }
  };

  return (
    <form id="homeform">
    <main>
        <section>
            <h1>Welcome to BookClub!📚</h1>
            <br></br>
            <p className="info">{userName}</p>
        </section>

        {recommendedBook && (
          <div className="recommendation-container">
            <p>{recommendedBook}</p>
          </div>
        )}

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
        <Button variant='primary' className="me-1" onClick={clearBooks}>Clear All Books</Button>
        <Button variant='primary' className="me-1" onClick={removeFriendPopUp}>Remove A Friend</Button>
        </section>

        <section>
          <h2>Friends:</h2>
          <div className="friend-container">
            {friends.map((friend, index) => (
              <div key={index} className="friendbubble">{friend.username}</div>
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
            <input type="text" value={searchTerm} onChange={searching} onKeyDown={enterButtonSearch} placeholder="Search For Book by Title" />
            <Button variant="primary" onClick={searchBooks}>Search</Button>
            {loading ? ( <p>Loading...</p>
            ) :
            bookDatabase.length === 0 ? (
              <p>No Books Found</p>
            ) : (
              bookDatabase.map((book,index) => (
                <div key={index}>
                  {book.coverImage ? (
                    <Link to="/notreadbook" state={{ bookTitle: book.title, bookCover: book.coverImage }}>
                    {/* removed classname */}
                      <img alt={`book-${index}`} src={book.coverImage} width="150" onClick={() => addBook()} />
                    </Link>
                  ) : (
                    <Link to="/notreadbook" state={{ bookTitle: book.title, bookCover: book.coverImage }}>
                      <img alt="NoCoverPlaceHolder" src="/BookPlaceHolder.png" width="150" onClick={() => addBook()} />
                    </Link>
                  )}
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
          <input type="text" value={searchTerm} onChange={searching} onKeyDown={enterButtonSearch}
          placeholder="Search For Friend by Username" />
          {friendsToSelect.length === 0 ? (
            <p>No Friends To Add...</p>
          ) : (
            filterFriends(friendsToSelect).map((friend, index) => (
              <div key={index}>
                <p onClick={() => addFriend(friend)}>{friend.username}</p>
              </div>
            )))}
        </div>
      </Modal.Body>
    </Modal>

    <Modal show={removeFriendModal} onHide={() => setRemoveFriendModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Friend to Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="friend-selection">
          {friends.length === 0 ? (
            <p>No Friends To Remove</p>
          ) : (
            friends.map((friend, index) => (
              <div key={index}>
                <p onClick={() => removeFriend(friend)}>{friend.username}</p>
              </div>
            )))}
        </div>
      </Modal.Body>
    </Modal>
    </form>
  );
}