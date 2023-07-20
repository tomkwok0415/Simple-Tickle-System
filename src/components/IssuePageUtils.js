import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, Link, Outlet } from 'react-router-dom';

 export function getCurrentDate(separator='-'){
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${String(date).padStart(2, '0')}`
    }

 export function ShowComment(AllComments) {
    let CommentTable = AllComments.map((comment, index) =>
    <tr key={index} >
      <td>{comment.date}</td>
      <td>{comment.comment}</td>
    </tr>
    );
    return (
      <tbody>
        {CommentTable}
      </tbody>
    );
 }

 export function addIssueComment(IssueID, date, comment) {
    let token = window.localStorage.getItem('token');
    const method = 'PUT';
    fetch("http://127.0.0.1:3001/api/addIssueComment" , {
      method,
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
            token: token,
            issueID: IssueID,
            date: date,
            comment: comment,
        }
      )
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      //console.log(data);;
      // handle the response data
    })
    .catch(error => {
      console.error(error);
      // handle the error
    });
  }
 
  export function CreateIssue(content) {    
    const method = 'POST';
    fetch("http://127.0.0.1:3001/api/createIssue" , {
      method,
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: content
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      //console.log(data);      
    })
    .catch(error => {
      console.error(error);
      // handle the error
    });
  }

  export function UpdateIssue(content) {

    const method = 'PUT';
    fetch("http://127.0.0.1:3001/api/updateIssue" , {
      method,
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: content
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      //console.log(data);
      alert(data);      
    })
    .catch(error => {
      console.error(error);
      // handle the error
    });
  }

  export function sanitizeInput(input) {
    const sanitizedInput = {};
    
    for (const key in input) {
      if (key === "Title") {
        sanitizedInput[key] = String(input[key]).trim().replace(/[^\w\s]/gi,"").trim();
        continue;
      }
      if (key === "Context") {
        sanitizedInput[key] = String(input[key]).trim().replace(/[^a-z0-9áéíóúñü_-\s\.,]/gim,"");
        continue;
      }
      if (key === "Type") {
        sanitizedInput[key] = String(input[key]).trim().replace(/[^a-zA-Z0-9\s\-\+\#\.\(\)]/g,"");
        continue;
      }
      if (key === "comment") {
        sanitizedInput[key] = String(input[key]).trim().replace(/[^a-zA-Z0-9\s\-\+\#\.\(\)]/g,"");
        continue;
      }
    }
    return sanitizedInput;
  }
