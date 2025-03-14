import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './authenticated.css';

export function Authenticated(props) {
    const navigate = useNavigate();

    function logout() {
        fetch(`/api/auth/logout`, {
            method: 'delete',
            credentials: 'include',
        })
        .catch(() => {
            // Failed Logout
        })
        .finally (() => {
            localStorage.removeItem('userName');
            props.onLogout();
        });
    }

    return (
        <div>
          <div className="container-fluid">
            <div className='readerName'>{props.userName}</div>
            <Button variant='primary' onClick={() => navigate('/home')}>
                See my Books!
            </Button>
            <Button variant='secondary' onClick={() => logout()}>
                Logout
            </Button>
          </div>
        </div>
    );
}