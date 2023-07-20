import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Button, InputGroup, FormControl, Table,Form } from 'react-bootstrap';
import { getCurrentDate, ShowComment, addIssueComment, CreateIssue, UpdateIssue, sanitizeInput } from './IssuePageUtils';
import { set } from 'mongoose';

function IssueDetail() {
  const [userName, setUserName] = useState();
  const [realV, updateV] = useState([]);
  const [Issue, setIssue] = useState([]);
  const [Title, setTitle] = useState();
  const [Type, setType] = useState();
  const [Context, setContext] = useState();
  const [Date, setDate] = useState();
  const [Status, setStatus] = useState();
  const [Assignee, setAssignee] = useState();
  const [Reporter, setReporter] = useState();
  const [button, setbutton] = useState();
  const [comment, setComment] = useState();
  const [AllComments, setAllComments] = useState([])
  const [CommentUpdate, setCommentUpdate] = useState(0);

  const navigate = useNavigate();
  const IssueDetail = useLocation().state;

  //console.log(IssueDetail)

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
    if (IssueDetail.mode === "create"){
      setAssignee(userName);
      setStatus("Open");
      setbutton("Create");
    }
  }, [userName, realV]);

  //get issue detail
  useEffect(() => {
    //console.log("all triggered")
    async function getIssueDetail() {
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
          let issue = data.find((issues) => issues.issueID === IssueDetail.issueId);
          setIssue(issue);
          setAllComments(issue.issueComment);
        })
        .catch((err) => {
          //console.log(err)
        });
    }

    if (IssueDetail.mode !== "create") {
      getIssueDetail();
      if (IssueDetail.mode === "edit"){
        setbutton("Update");
      }
      else {
        setbutton("Comment");
      }
    }

  }, [CommentUpdate]);


  //assign issue detail
  useEffect(() => {
    async function AssignIssue() {
      setTitle(Issue.issueTitle);
      setType(Issue.issueType);
      setContext(Issue.issueContext);
      setDate(Issue.issueDate.split("T")[0]);
      setStatus(Issue.issueStatus);
      setAssignee(Issue.issueAssignee);
      setReporter(Issue.issueReporter);
    }
    AssignIssue();
  }, [Issue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (IssueDetail.mode === "create") {
      if(Title === undefined || Type === undefined || Context === undefined || Assignee === undefined || Date === undefined){
        alert("Please fill in all the fields");
      }
      else{
        let sanitizedInput = sanitizeInput({Title, Type, Context});
        setTitle(sanitizedInput.Title);
        setType(sanitizedInput.Type);
        setContext(sanitizedInput.Context);
        if (sanitizedInput.Title === "" || sanitizedInput.Type === "" || sanitizedInput.Context === "") {
          alert("Please fill in all the fields");
          return;
        }
        let content = JSON.stringify({
          token: window.localStorage.getItem('token'),
          issueTitle: sanitizedInput.Title,
          issueAssignee: Assignee,
          issueDate: Date,
          issueType: sanitizedInput.Type,
          issueStatus: Status,
          issueContext: sanitizedInput.Context,          
        });
        CreateIssue(content);
        handleRedirect();
      }
    }
    else if (IssueDetail.mode === "edit") {
      let sanitizedInput = sanitizeInput({Title, Type, Context});
      setTitle(sanitizedInput.Title);
      setType(sanitizedInput.Type);
      setContext(sanitizedInput.Context);
      if (sanitizedInput.Title === "" || sanitizedInput.Type === "" || sanitizedInput.Context === "") {
        alert("Please fill in all the fields");
        return;
      }
      let content = JSON.stringify({
        token: window.localStorage.getItem('token'),
        issueID: IssueDetail.issueId,
        issueTitle: sanitizedInput.Title,
        issueAssignee: Assignee,
        issueDate: Date,
        issueType: sanitizedInput.Type,
        issueStatus: Status,
        issueContext: sanitizedInput.Context,  
        issueReporter: Reporter,        
      });
      // console.log(content);
      UpdateIssue(content);
      handleRedirect();
    }
    else if (IssueDetail.mode === "view") {
      let date = getCurrentDate();
      let sanitizedInput = sanitizeInput({comment});
      if (sanitizedInput.comment === "" || comment === undefined) {
        alert("Please fill in the comment");
        return;
      }
      setComment(sanitizedInput.comment);
      // console.log(comment);
      addIssueComment(IssueDetail.issueId, date, sanitizedInput.comment);
      setAllComments(AllComments=>[...AllComments,{ comment: sanitizedInput.comment, date: date }]);
    }
  }

  function logout() {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    window.location.href = '/';
  }

  function handleRedirect(){
    navigate("/Dashboard")
  }

  return (
    <>
      <header className="bg-white border-bottom">
        <Container fluid>
          <Row className="align-items-center">
                      <div className="h2 text-dark">Issue Detail</div>
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
              <Button variant="outline-primary" className="me-3" onClick={() => handleRedirect()}><i className="bi bi-arrow-return-left"></i> Dashboard</Button>
            </Col>
          </Row>
        </Container>
      </header>
      <Container fluid>
        <Row>
          <Col>
            <div className="my-3">
              <div className="bg-white rounded p-3">
                  <h3 className="mb-4 text-left" style={{ textDecoration: 'underline' }}> Issue {IssueDetail.issueId} ({IssueDetail.mode})</h3>
                  <form id="login_form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-7">
                        <div className="form-group row">
                          <label htmlFor="colFormLabelLg" className="col-sm-2 col-form-label col-form-label-lg">Title:</label>
                          <div className="col-sm-10">
                            <input type="text" id="issueTitle" name="issueTitle" className="form-control form-control-lg" placeholder="Title" value={Title} disabled={IssueDetail.mode === "view" ? true : false} onChange={(e) => setTitle(e.target.value)} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="colFormLabelLg" className="col-sm-2 col-form-label col-form-label-lg">Type:</label>
                          <div className="col-sm-10">
                            <input type="text" id="issueType" name="issueType" className="form-control form-control-lg" placeholder="Type" value={Type} disabled={IssueDetail.mode === "view" ? true : false} onChange={(e) => setType(e.target.value)} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="colFormLabelLg" className="col-sm-2 col-form-label col-form-label-lg">Context:</label>
                          <div className="col-sm-10">
                            <textarea id="issueContext" name="issueContext" className="form-control form-control-lg" placeholder="Context" value={Context} disabled={IssueDetail.mode === "view" ? true : false} onChange={(e) => setContext(e.target.value)} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="issueDate" className="col-sm-2 col-form-label col-form-label-lg">Date:</label>
                          <div className="col-sm-10">
                              <Form.Control type="date" id="issueDate" name="issueDate" disabled={IssueDetail.mode === "view" ? true : false} value={Date} onChange={(e) => setDate(e.target.value)} required />                            
                          </div>
                        </div>      
                        <div className="form-group row">
                          <label htmlFor="colFormLabelLg" className="col-sm-2 col-form-label col-form-label-lg">Assignee:</label>
                          <div className="col-sm-10">
                            <input type="text" id="issueAssignee" name="issueAssignee" className="form-control form-control-lg" placeholder="Assignee" value={Assignee} disabled={true} />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="colFormLabelLg" className="col-sm-2 col-form-label col-form-label-lg">Reporter:</label>
                          <div className="col-sm-10">
                            <input type="text" id="issueReporter" name="issueReporter" className="form-control form-control-lg" placeholder="Reporter" value={Reporter} disabled={true}  onChange={(e) => setReporter(e.target.value)}/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label htmlFor="issueStatus" className="col-sm-2 col-form-label col-form-label-lg">Status:</label>
                          <div className="col-sm-10">
                            <select id="issueStatus" name="issueStatus" className="form-control form-control-lg" placeholder="Status" value={Status} disabled={IssueDetail.mode === "view" ? true : false} onChange={(e) => setStatus(e.target.value)} >
                              <option value="open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>                                                   
                        </div>                          
                        <div className="form-group row mt-3">
                          <div className="col text-end">
                            <button className="btn btn-primary"> {button} </button>
                          </div>
                        </div>                                                                                                                         
                      </div>                      
                      <div className="col-md">
                      {/* <div className='row'>
                        <h3 className="mb-4" style={{ textDecoration: 'underline' }}> Comments </h3>
                      </div> */}
                      <div className='row'>
                        <div style={{ height: '300px', overflowY: 'scroll' }}>
                            <Table striped bordered hover responsive>
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Comment</th>
                                </tr>
                              </thead>
                              { ShowComment(AllComments) }
                            </Table>
                        </div>
                      </div>
                      <div className='row mt-3'>
                        <textarea id="comment" name="comment" disabled={IssueDetail.mode === "view" ? false : true} onChange={(e) => setComment(e.target.value)}></textarea>
                      </div>                        
                      </div>
                    </div>
                    {/* <button className="btn btn-primary"> {button} </button> */}
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default IssueDetail;