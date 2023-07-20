import { render } from "@testing-library/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { Component, useState, useEffect } from "react";
export default function Preferences() {
 const [data1, setdata1] = useState([{"username": "loading"}]);
 const [click, setclick] = useState(false);
 const hostname = "http://127.0.0.1:3001";
  function addUser(){
    fetch("http://"+hostname+":3001/addUsers", {
      method: "POST",
      //mode: "no-cors",
      // crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
      body:JSON.stringify({username: document.getElementById("uname").value, password: document.getElementById("pw").value})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data!=null){
        document.getElementById("pw").value = '';
        document.getElementById("uname").value = '';
      }
        
    });
  
  }
  
  function updateUser(uname){
    fetch("http://"+hostname+":3001/updateUsers", {
      method: "PUT",
      // crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
   
     body:JSON.stringify({old: uname, username: document.getElementById(uname+"username").value, password: document.getElementById(uname+"pw").value})
    })
    .then((res) => res.json())
    .then((data) => {
        if(data!=null){
          document.getElementById(data+"username").value = '';
          document.getElementById(data+"pw").value = "";
          
        }
          
     
    });
  
  }
  
  function delUser(username){

    fetch("http://"+hostname+":3001/deleteUsers", {
      method: "DELETE",
      // crossDomain: true,

      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
        // "Access-Control-Allow-Origin": "*",
      },
      body:JSON.stringify({name: username})
    })
    .then((res) => res.json())
    .then((data) => {
      


      
    });
  
  }
  
  function Logout() {
    localStorage.clear();
    window.location.href = '/';
  }  
  
  useEffect(()=>{
    fetch("http://"+hostname+":3001/getUsers", {
      method: "GET",
      // crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
        // "Access-Control-Allow-Origin": "*",
      }
    })
    .then((res) => res.json())
    .then((data) => {
      setdata1(data);
      setclick(false);
      document.getElementById("OldU").style.backgroundColor = "#CCCCCC";
      document.getElementById("OldPw").style.backgroundColor = "#CCCCCC";
      for(let i = 0; i<data1.length; i++){
        document.getElementById(data1[i].username).value = data1[i].username;
        document.getElementById(data1[i].username).style.backgroundColor = "#CCCCCC";
        document.getElementById(data1[i].username+"p").value = data1[i].password;
        document.getElementById(data1[i].username+"p").style.backgroundColor = "#CCCCCC";
      }
      for(let i = 0; i<data1.length; i++){
  
        if( document.getElementById(data1[i].username+"username").value !="" && document.getElementById(data1[i].username+"pw").value !=""){
          
          document.getElementById(data1[i].username+"up").classList.remove('disabled');
        }else{
          document.getElementById(data1[i].username+"up").classList.add('disabled');
        }
      }

      if( document.getElementById("uname").value !="" && document.getElementById("pw").value !=""){
          
        document.getElementById("add").classList.remove('disabled');
      }else{
        document.getElementById("add").classList.add('disabled');
      }
    })
  }, [click, data1])
  
    return(
    
    <main>
      <header>        
          <div className="d-flex align-items-center bg-info mb-3">
            <div id = "userName" className="p-2">Admin Panel</div>
            <div className="ms-auto p-2"><button type="submit" className="btn btn-primary" onClick={()=>{Logout(); setclick(true);}}>Log out <i class="bi bi-forward"></i></button></div>
          </div>
        </header>
        <div class="container border border-info border-4">
          <br></br>
          
      <form >
        
          <input id="OldU"value="Old Username"></input>
          <input id="OldPw"value="Old Password"></input>
          <br></br>
          <input value="New Username"></input>
          <input value="New Password"></input>
          <br></br>
          <br></br>
          <p>------User Records------</p>

        {data1.map((_,index) => 
   <>
          <input id={data1[index].username} readOnly></input>
          <input type="text" id={data1[index].username+"p"} readOnly></input>
          <br></br>
          <input placeholder="Confirm/New Username" id={data1[index].username+"username"} required></input>
          <input placeholder="New Password" id={data1[index].username+"pw"}></input>
          <br></br>
          <button id = {data1[index].username + "up"} className="btn btn-success"onClick={(e)=>{ e.preventDefault(); updateUser(data1[index].username); setclick(true);}}><i class="bi bi-pencil-square"></i> Update</button>  
          <button className="btn btn-danger" onClick={(e)=>{ e.preventDefault(); delUser(data1[index].username); setclick(true);}}><i class="bi bi-trash"></i> Delete</button>  
          <br></br>
          <br></br>
        
       
          {/* <input id={data1[index].password}></input>  */}
   </>
         
        
        )}
           <p>------Add new User------</p>

          <input placeholder="Username" id="uname"></input>
          <input placeholder="Password" id="pw"></input>
          <br></br>
          
          <button id="add" className="btn btn-primary" onClick={(e)=>{ e.preventDefault(); addUser(); setclick(true);}}><i className="bi bi-plus"></i> Add User</button>  
      
      </form>
      <br></br>
      </div>

    </main>
    

    )
  
}