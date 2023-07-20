import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, Link, Outlet } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Button, InputGroup, FormControl, Table } from 'react-bootstrap';
import { set } from 'mongoose';
import { ShowIssue } from './DashboardUtils';


function Dashboard() {
  const [userName, setUserName] = useState();
  const [realV, updateV] = useState([]);
  const [AllIssues, setAllIssues] = useState([]);
  const [followid, setfollowid] = useState([]);
  const [CurrentIssues, setCurrentIssues] = useState([]);
  const [CurrentState, setCurrentState] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  //get user name
  useEffect(() => {
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };
    let token = window.localStorage.getItem('token');
    let decodedToken = parseJwt(token);
    setUserName(decodedToken.username);
    let user = userName;
    window.sessionStorage.setItem('uname', user);
  }, [userName, realV]);

  //get all issues
  useEffect(() => {
    ////console.log("all triggered")
    async function getAllIssues() {
      let token = window.localStorage.getItem('token');
      fetch("http://127.0.0.1:3001/api/getAllIssues?token="+token, {
        method: "Get",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setAllIssues(data);
            setCurrentIssues(data);
            //console.log(data)
          }
        });
    }
    async function getfollow() {
      let token = window.localStorage.getItem('token');
      fetch("http://127.0.0.1:3001/api/getuserfollowing?token="+token, {
        method: "Get",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            //console.log(data)
            let follow = []
            data.forEach(element => {
              follow.push(element.issueID)
            });
            setfollowid(follow)
          }
        });
    }    
    getAllIssues();
    getfollow();
  }, []); 

  function logout() {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    window.location.href = '/';
  }

  useEffect(() => {
    //console.log("Current triggered")
    if (CurrentState === 0){ //Presss all issue
      setCurrentIssues(AllIssues);
    }
    else if(CurrentState === 1){ //Presss my issue
      let user = window.sessionStorage.getItem('uname');
      let token = window.localStorage.getItem('token');
      fetch("http://127.0.0.1:3001/api/getUserIssues?token="+token, {
        method: "Get",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            //setAllIssues(data);
            //setCurrentIssues(data);
            //console.log(data)
            setCurrentIssues(data);
          }
        }).catch(error=>{
          //console.log(error);
        });
    }
    else if(CurrentState === 2){ //Presss following issue
      //setCurrentIssues(FollowingIssues); 
      let token = window.localStorage.getItem('token');
      fetch("http://127.0.0.1:3001/api/getuserfollowing?token="+token, {
        method: "Get",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setCurrentIssues(data);
          }
        }).catch(error=>{
        });
    }
  }, [CurrentState]);

  function handleSearch(e) {
    setSearchTerm(e.target.value);
  }

  function handleViewMode(mode){
    setCurrentState(mode);
  }

  function handleRedirect(issueId, mode) {
    navigate('/Dashboard/IssuePage', { state: { issueId: issueId, mode: mode} });
  }

  const handleSearchEnterPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit(event);
    }
  };

  function handleSearchSubmit(event) {
    //console.log("search item: ", searchTerm);

    const tagRegex = /^(Type|Assignee|Status|Date|ID|Reporter|Title):.+$/;      
    const tags = searchTerm.split(',').map((tag) => {
      if (!tagRegex.test(tag.trim())) {        
        if(searchTerm === "")
           return ''; //except ""
        alert(`Invalid Search format: ${tag}. 
        \nSearch format should be in the form 'Type:value,Assignee:value,ID:value'.
        \nSupport Search: Type, Assignee, Status, Date, ID, Reporter, Title`);
        return '';
      }
      const [key, value] = tag.trim().split(':');
      switch (key) {
        case 'Type':
          return `Type:${value}`;
        case 'Assignee':
          return `Assignee:${value}`;
        case 'Status':
          return `Status:${value}`;
        case 'Date':
          return `Date:${value}`;
        case 'ID':
          return `ID:${value}`;
        case 'Reporter':
          return `Reporter:${value}`;
        case 'Title':
          return `Title:${value}`;
        default:
          alert('Not support searching for ' + key);
          return '';
      }
    }).filter((tag) => tag !== '');
    
    if (tags.length == 0)  return;
    //console.log('Tags:', tags);
    let token = window.localStorage.getItem('token');
    event.preventDefault();
    fetch("http://127.0.0.1:3001/api/searchIssues?token=" + token + "&tags=" + tags, {
      method: "GET",
      redirect: 'follow',
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      setCurrentState(999); //avoid effect following issues, my issue, all issue, e.g click following issues before search (currentstste = 2) 
                            // => if not setCurrentState here =>CurrentState still is 2, re click following issues have no effect
      setCurrentIssues(data);
    }).catch(error=>{
      //console.log(error)
    });
  }

  return (
    <>
      <header className="bg-white border-bottom">
        <Container fluid>
          <Row className="align-items-center">
                      <div className="h2 text-dark">Dashboard</div>
            <Col xs={12} md={6}>
    
              <div id="userName" className="text-muted"><b>Welcome back, {userName}!</b></div>
            </Col>
            <Col xs={12} md={6} className="text-end">
            <div className="ms-auto p-2"><button id="logoutBtn" onClick={() => logout()} type="submit" className="btn btn-primary"><i className="bi bi-person"> </i>Logout</button></div>
         
            </Col>
          </Row>
        </Container>
        <Container fluid className="py-3 border-bottom">
          <Row className="align-items-center">
            <Col xs={12} md={6} className="text-start">
              <Button variant="outline-primary" className="me-3" onClick={ () => handleRedirect(AllIssues.length+1, "create")}><i className="bi bi-plus"></i> Create Issue</Button>
              <Button variant="outline-primary" className="me-3" onClick={() => handleViewMode(0)}><i className="bi bi-shift"></i> All Issues</Button>
              <Button variant="outline-primary" className="me-3" onClick={() => handleViewMode(1)}><i className="bi bi-journal-text"></i> My Issues</Button>
              <Button variant="outline-primary" className="me-3" onClick={() => handleViewMode(2)}><i className="bi bi-star"></i> Following Issues</Button>
            </Col>
            <Col xs={12} md={6} className="text-end">
              <InputGroup className="w-auto">
                <FormControl type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} onKeyDown={handleSearchEnterPressed}/>
                <Button variant="primary" onClick={handleSearchSubmit}><i className="bi bi-search"></i></Button>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </header>
      <Container fluid>
        <Row>
          <Col>
            <div className="my-3">
              <div className="bg-white rounded p-3">
                <h2 className="mb-4">Issue list</h2>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Issue ID</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Context</th>
                      <th>Assignee</th>
                      <th>Reporter</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                      { ShowIssue(CurrentIssues, userName, followid) }
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;