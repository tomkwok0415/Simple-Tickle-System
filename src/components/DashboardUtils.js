import React, { Component, useState, useEffect } from 'react';
import { Container, Row, Col, Button, InputGroup, FormControl, Table } from 'react-bootstrap';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, Link, Outlet, json } from 'react-router-dom';

export function FollowIssue(issueID) {

    let token = window.localStorage.getItem('token');
    const method = 'PUT';
    const url = 'http://127.0.0.1:3001/api/addUserfollowingissue'; 
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : token,
        issueID : issueID,
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      //console.log(data);
        if (data === "Already follow this issue"){
            alert("Already follow this issue");  
        }
        else{
            alert("Follow issue successfully");
            window.location.reload(false);
        }
      // handle the response data
    })
    .catch(error => {
      console.error(error);
      // catch error
    });
}

export function unFollowIssue(issueID) {

  let token = window.localStorage.getItem('token');
  const method = 'PUT';
  const url = 'http://127.0.0.1:3001/api/removeUserfollowingissue'; 
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token : token,
      issueID : issueID,
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(data => {
    //console.log(data);
      if (data === "Issue is not being followed"){
          alert("Issue is not being followed");  
      }
      else{
          alert("Followed issue removed successfully");
          window.location.reload(false);
      }
    // handle the response data
  })
  .catch(error => {
    console.error(error);
    // catch error
  });
}

export function TakeIssue(issueID) {

    let token = window.localStorage.getItem('token');
    const method = 'PUT';
    const url = 'http://127.0.0.1:3001/api/takeIssue'; 
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : token,
        issueID : issueID,
      })
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
      window.location.reload(false);
      // handle the response data
    })
    .catch(error => {
      console.error(error);
      // catch error
    });
}

export function unTakeIssue(issueID) {

  let token = window.localStorage.getItem('token');
  const method = 'PUT';
  const url = 'http://127.0.0.1:3001/api/untakeIssue'; 
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token : token,
      issueID : issueID,
    })
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
    window.location.reload(false);
    // handle the response data
  })
  .catch(error => {
    console.error(error);
    // catch error
  });
}


export function ShowIssue(CurrentIssues, username, followid) {
    const navigate = useNavigate();
    
    function handleRedirectIssue(issueId, mode) {
        navigate('/Dashboard/IssuePage', { state: { issueId: issueId, mode: mode} });
    }
    function checkTakehidden(reporter, assignee)
    {      
      //true for hidden Take
      //console.log(username)
      if (username === assignee) return true; // it owns issue
      if (!reporter) return false; // no reporter      
      if (username === reporter)  return true;
      //return false;
      return true;
    }

    const IssueTable = CurrentIssues.map((issue) =>
        <tr key={issue.issueID}>
          <td>{issue.issueID}</td>
          <td>{issue.issueDate.split("T")[0]}</td>
          <td>{issue.issueType}</td>
          <td>{issue.issueTitle}</td>
          <td>{issue.issueContext}</td>
          <td>{issue.issueAssignee}</td>
          <td>{issue.issueReporter}</td>
          <td>{issue.issueStatus}</td>
          <td>
            <Button variant="link" className="text-muted" hidden = {issue.issueAssignee === username ? false : true} onClick={() => handleRedirectIssue(issue.issueID, "edit")}><i className="bi bi-pencil" hidden = {issue.issueAssignee === username ? false : true} ></i>Edit</Button>        <Button variant="link" className="text-muted" onClick={() => handleRedirectIssue(issue.issueID, "view")}><i className="bi bi-eye"></i>View</Button>                                
            <Button variant="link" className="text-muted" hidden = {followid.includes(issue.issueID)} onClick={() => FollowIssue(issue.issueID) }><i className="bi bi-star"></i>Follow</Button>
            <Button variant="link" className="text-muted" hidden = {!followid.includes(issue.issueID)} onClick={() => unFollowIssue(issue.issueID) }><i className="bi bi-star"></i>Unfollow</Button>
            <Button variant="link" className="text-muted" hidden = {checkTakehidden(issue.issueReporter,issue.issueAssignee)} onClick={() => TakeIssue(issue.issueID) }><i className="bi bi-hand-index"></i>Take</Button>
            <Button variant="link" className="text-muted" hidden = {issue.issueReporter === username ? false : true} onClick={() => unTakeIssue(issue.issueID) }><i className="bi bi-hand-index"></i>Untake</Button>
          </td>
        </tr>
        );
        return (
          <tbody>
            {IssueTable}
          </tbody>
        );

  }


