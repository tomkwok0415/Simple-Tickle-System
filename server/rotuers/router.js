const express = require('express');
const UserController = require('../controllers/UserController');
const IssueController = require("../controllers/IssueController");

const router = express.Router();

router.post('/login-user', UserController.UserLogin);
router.get('/getUsers', UserController.UserGet);
router.post('/addUsers', UserController.UserAdd);
router.put('/updateUsers', UserController.UserUpdate);
router.delete('/deleteUsers', UserController.UserDelete);
router.put('/addUserfollowingissue', UserController.UserAddfollowissue);
router.put('/removeUserfollowingissue', UserController.UserRemoveFollowedIssue);
router.get('/getuserfollowing', UserController.UserGetfollowing);


router.post('/createIssue', IssueController.IssueCreate);
router.get('/getAllIssues', IssueController.IssueGet);
router.get('/getUserIssues', IssueController.IssueGetByUser);
router.put('/takeIssue', IssueController.IssueTakeById);
//router.delete('/deleteIssue',IssueController.IssueDeleteById);
router.get('/searchIssues', IssueController.IssueSearch);
router.put('/updateIssue', IssueController.IssueUpdateById);
router.put('/addIssueComment', IssueController.IssueCommentAddById);
router.put('/untakeIssue', IssueController.IssueUnTakeById);

module.exports = router;