const User = require("../db/user");
const Issue = require("../db/issue");
const until = require("./until");
const jwt = until.jwt;
const bcrypt = until.bcrypt;
const JWT_SECRET = until.JWT_SECRET; 
const checktoken = until.checktoken; 

UserLogin = async (req, res) => {    
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ error: "User Not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      if (res.status(200)) {
        if (username == "admin") {
          return res.json({
            status: "ok",
            data: token,
            username: username,
            adminFlag: true
          });
        } else {
          return res.json({
            status: "ok",
            data: token,
            username: username,
            adminFlag: false
          });
        }
      } else {
        return res.json({ error: "error" });
      }
    }
    res.json({ status: "error", error: "Invalid Password" });
  }

UserGet = async (req, res) => {
  const token = req.query['token'];    
  if(!await checktoken(token)) return res.json({error:"token fail"});

    const user = await User.find({ "adminFlag": false }).populate('followissue')
    if (!user) {
      return res.json({ error: "No user found" });
    } else {
      return res.json(user);
    }
  }

UserAdd = async (req, res) => {
    const username = req.body['username'];
    const password = req.body['password'];
    const user = await User.findOne({ "username": username });
    if (user == null) {
      //console.log(username);
      const a = User.create({
        username: username,
        password: await bcrypt.hash(password, 10),
        // password: password,
        followissue: [],
        adminFlag: false,        
      })
      res.json("hi");
    }
  }

UserUpdate = async (req, res) => {
    User
      .findOne({ "username": req.body.old })
      .exec(async (e, results) => {
        if (results == null)
          res.json({ status: "error", error: "No users" });
        else {
          results.username = req.body.username;
          results.password = await bcrypt.hash(req.body.password, 10);             
          // results.password = req.body.password;
          results.adminFlag = false;
          results.save();
          res.json(req.body.old);
        }

      })
  }

UserDelete = async (req, res) => {
    const username = req.body['name'];
    const user = await User.findOne({ "username": username });
    if (user == null)
      res.json({ status: "error", error: "No users" });
    else {
      user.remove();
      res.send("Deleted", 200);
    }
  }

UserAddfollowissue = async (req, res) => {
  const token = req.body['token'];
    
  const name = await checktoken(token);
  if(!name) return res.json({error:"token fail"})
  
  const id = req.body['issueID'];    

  const user = await User.findOne({ username: name });

  if (!user) {
    return res.json("User not found");
  }

  const issue = await Issue.findOne({ issueID: id });

  if (!issue) {
    return res.json("Issue not found");
  }

  if (user.followissue.includes(issue._id))
    return res.json("Already follow this issue");
  
  user.followissue.push(issue._id);
  await user.save();

  return res.json("Follow issue added successfully" );

};

UserRemoveFollowedIssue = async (req, res) => {
  const token = req.body['token'];
    
  const name = await checktoken(token);
  if(!name) return res.json({error:"token fail"})
  
  const id = req.body['issueID'];    

  const user = await User.findOne({ username: name });

  if (!user) {
    return res.json("User not found");
  }

  const issue = await Issue.findOne({ issueID: id });

  if (!issue) {
    return res.json("Issue not found");
  }

  const index = user.followissue.indexOf(issue._id);

  if (index === -1) {
    return res.json("Issue is not being followed");
  }

  user.followissue.splice(index, 1);
  await user.save();

  return res.json("Followed issue removed successfully");
};

UserGetfollowing =async (req, res) => {
  const token = req.query['token'];    
  const name = await checktoken(token);
  if(!name) return res.json({error:"token fail"})

    const user = await User.findOne({ username:name }).populate('followissue')
    if (!user) {
      return res.json({ error: "No user found" });
    } else {
      return res.json(user.followissue);
    }
  }

module.exports = {
    UserLogin,
    UserGet,
    UserAdd,
    UserDelete,
    UserUpdate,
    UserAddfollowissue,
    UserRemoveFollowedIssue,
    UserGetfollowing,
}