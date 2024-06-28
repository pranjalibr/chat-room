import './App.css'

import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'

const socket = io.connect('http://localhost:5000')

function App() {
  const firebaseConfig = {
    apiKey: 'AIzaSyDxGfri2DwfmMCNOf_l1f0JL-sXqiOsjYE',
    authDomain: 'chat-room-356b7.firebaseapp.com',
    projectId: 'chat-room-356b7',
    storageBucket: 'chat-room-356b7.appspot.com',
    messagingSenderId: '998194300150',
    appId: '1:998194300150:web:427ebdd92d27d6d87b18d7',
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  getAuth(app)
  const [currentUser, setCurrentUser] = useState()
  const provider = new GoogleAuthProvider()

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])

  const sendChat = (e) => {
    e.preventDefault()
    socket.emit('chat', { message, userName: currentUser.displayName })
    setMessage('')
  }

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user)
    })
  }, [currentUser])

  useEffect(() => {
    socket.on('chat', (payload) => {
      setChat([...chat, payload])
    })
  })

  const GoogleLoginButton = () => {
    const login = () => {
      const auth = getAuth()
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user
          setCurrentUser(user)
        })
        .catch((error) => {
          console.error(error)
        })
    }
    return (
      <button className="login" onClick={login}>
        Login Using Google
      </button>
    )
  }

  const signOutUser = async () => {
    try {
      await signOut(getAuth())
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {currentUser == null ? (
        <GoogleLoginButton />
      ) : (
        <>
          <button className="signoutbtn" onClick={signOutUser}>
            Sign Out
          </button>
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
          </div>
        </>
      )}
    </>
  )
}
export default App
