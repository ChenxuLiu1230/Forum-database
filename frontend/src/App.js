import './App.css';
import React, {useState, useEffect} from "react";
import Axios from 'axios';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';

function App() {
  const [userID, setUserID] = useState(12345);
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [newPassword, setNewPassword] = useState("");

  // const [userIDSearch, setUserIDSearch] = useState();
  const [id, setID] = useState(12345);
  // const id = 12345;

  useEffect(()=>{
    Axios.get("http://34.121.74.179/get").then((response)=>{
      setUserList(response.data)
    });
    Axios.get("http://34.121.74.179/get-comm").then((response)=>{
      setCommentList(response.data)
    });
  }, []);

  const submitUser = () => {
    Axios.post("http://34.121.74.179/insert", {
      "userID": userID,
      "name": name,
      "introduction": introduction,
      "password": password
    }).then(()=>{
      alert('success insert')
    });

    setUserList([
      ...userList,
      {
        "userID": userID,
        "name": name,
        "introduction": introduction,
        "password": password
      },
    ]);
  };

  const searchUser = (userID) => {
    Axios.get("http://34.121.74.179/search/${id}").then((response)=>{
      // alert("Find!");
      // alert(`http://34.121.74.179/search/${id}`);
      window.open(`http://34.121.74.179/search/${id}`);
    }); 
  }

  const deleteComment = (commentID) => {
    Axios.delete(`http://34.121.74.179/delete/${commentID}`).then((response)=>{
      alert("Success!");
    });
  }

  const updateUser = (userID, password) => {
    Axios.put("http://34.121.74.179/update", {
      "userID": userID,
      "password": password,
      "new_password": newPassword,
    }).then((response)=>{
      alert("Success!");
    });
    setNewPassword("");
  };

  const advancedMaxVote = () => {
    Axios.get("http://34.121.74.179/maxVote").then((response)=>{
      // alert("Success!")
      // alert(`http://34.121.74.179/maxVote`);
      //response.redirect(`http://34.121.74.179/maxVote`);
      window.open(`http://34.121.74.179/maxVote`);
    });
  }

  const advancedCapital = () => {
    Axios.get("http://34.121.74.179/capital").then((response)=>{
      // alert("Success!");
      // alert(`http://34.121.74.179/capital`);
      window.open(`http://34.121.74.179/capital`);
    });
  }

  return (
    <div className="App">
      <h1>Hello World!</h1>

      <h2>advanced 1</h2>
      <button onClick = {advancedMaxVote}>maxVote</button>

      <h2>advanced 2</h2>
      <button onClick = {advancedCapital}>capital</button>

      <div className = "form">
        <h2>Insert</h2>
        <label>UserID:</label>
        <input type = "text" name = "userID" onChange = {(e)=>{
          setUserID(e.target.value);
        }}/>
        <label>Name:</label>
        <input type = "text" name = "name" onChange = {(e)=>{
          setName(e.target.value);
        }}/>
        <label>Introduction:</label>
        <input type = "text" name = "introduction" onChange = {(e)=>{
          setIntroduction(e.target.value);
        }}/>

        <label>Password:</label>
        <input type = "text" name = "password" onChange = {(e)=>{
          setPassword(e.target.value);
        }}/>
        <button onClick = {submitUser}>Submit</button>
      </div>

      <div className='search'>
        <h2>Search</h2>
        <label>userIDSearch</label>
        <input type = "text" name = "userIDSearch" onChange = {(e)=>{
          // setUserIDSearch(userIDSearch);
          setID(e.target.value);
        }}/>
        <button onClick = {searchUser}>Search</button>
      </div>



          {userList.map((user)=>{
          return(
            <div className = "card">
              <h1>userID: {user.userID}</h1>
              <p>name: {user.name}</p>
              <p>introduction: {user.introduction}</p>
              <p>password: {user.password}</p>
              {/* <button onClick = {()=>{deleteTitle(row.newsID)}}>Delete</button> */}
              <input type = "text" id = "updateUser" onChange={(e)=>{
                setNewPassword(e.target.value)
              }}/>
              <button onClick={()=>{
                updateUser(user.userID, user.password);
              }}>Update</button>
            </div>
          );
        })}

        {commentList.map((comment)=>{
          return(
            <div className = "card">
              <h1>commentID: {comment.commentID}</h1>
              <p>context: {comment.context}</p>
              <p>vote: {comment.vote}</p>
              <p>newsID: {comment.newsID}</p>
              <p>userID: {comment.userID}</p>
              <button onClick = {()=>{deleteComment(comment.commentID)}}>Delete</button>
            </div>
          );
        })}
      
    </div>
  );
}

export default App;