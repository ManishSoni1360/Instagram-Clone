import './App.css';
import Post from './MyComponents/Post';
import ImageUpload from './MyComponents/ImageUpload';
import React, { useState, useEffect } from 'react';
import { auth, db } from './MyComponents/firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';

// [Start]******Login Modal****** 
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// [End]******Login Modal*****

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);


  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => alert(error.message))
      setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="app__SignUp">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>

      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="app__SignUp">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>

      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )
        }
      </div>

      <div className="app__posts">
        <div className="app_postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
            ))
          }
        </div>
        <div className="app_postsRight">
          <InstagramEmbed
          clientAccessToken='123|456'
            url= 'https://www.instagram.com/p/B_uf9dmAGPw/'
            method = 'post'
            access_token= '1234|5678'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) :
        <h3>Sorry you need to login to upload!</h3>
      }
    </div>
  );
}

export default App;
