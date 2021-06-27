import React, {useState, useEffect} from 'react';
import './Post.css';
import firebase from 'firebase';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase';

function Post({username, user, imageUrl, caption, postId}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const postComment = (event) =>{
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment, 
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment('');
    }
    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
        };
    }, [postId])

    return (
        <div className="post">
            <div className="post__header">
                {/* avatar + username */}
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src={username}
                />
                <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageUrl} alt="" />

            {/* image */}

            <div className="post__text"><strong>{username}</strong>{caption}</div>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <b>{comment.username}</b> {comment.text}
                    </p>
                ))}
            </div>
            {/* username + caption */}
            {user && (
                <form className="post__commentBox">
                <input className="post__input" type="text" 
                placeholder="Enter comment" value={comment} 
                onChange={(e) => setComment(e.target.value)}/>

                <button className="post__button" disabled={!comment}
                type="submit" onClick={postComment}>Post</button>
            </form>
            )}
            
        </div>
    )
};

export default Post;