import './App.css'

import { useState, useEffect } from 'react'
import {io} from 'socket.io-client'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const socket = io.connect('http://localhost:5000')

function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyChDBuL-_57SE5tLILhtMkpiLyVGN5LvMY",
    authDomain: "chat-app-pranjali.firebaseapp.com",
    projectId: "chat-app-pranjali",
    storageBucket: "chat-app-pranjali.appspot.com",
    messagingSenderId: "51859414044",
    appId: "1:51859414044:web:52732dab73dbd339f5d3d9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  getAuth(app);
  const [currentUser, setCurrentUser] = useState();
  const provider = new GoogleAuthProvider();

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])

  const sendChat = (e) => {
    e.preventDefault()
    socket.emit('chat', { message, userName: currentUser.displayName })
    setMessage('')
  }

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user);
    });

    socket.on('chat', (payload) => {
      setChat([...chat, payload])
    })
  })

  const GoogleLoginButton = () => {
    const login = () => {
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          setCurrentUser(user)

        }).catch((error) => {
          console.error(error)
        });
    }
    return <button className='login' onClick={login}>Login Using Google</button>
  }


  return (
    <>
      {currentUser == null ? <GoogleLoginButton /> :
        <div className="App App-header">
          <div>
            <h1>Chat app</h1>
            {chat.map((payload, index) => {
              return (
                <p key={index}>
                  <span>{payload.userName}:</span> {payload.message}
                </p>
              )
            })}

            <form onSubmit={sendChat}>
              <input
                type="text"
                name="chat"
                placeholder="send text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                }}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>}
    </>
  )
}
export default App
