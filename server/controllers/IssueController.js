const Issue = require("../db/issue")
const User = require('../db/user')
const until = require("./until");
const jwt = until.jwt;
const bcrypt = until.bcrypt;
const JWT_SECRET = until.JWT_SECRET; 
const checktoken = until.checktoken; 

IssueCreate = async (req, res) => {    
    const token = req.body['token'];    

    //const token = jwt.sign({ username: req.body['issueAssignee'] }, JWT_SECRET);//for test

    //console.log(token)
    const assignee = await checktoken(token)
    if(!assignee) return res.json({error:"token fail"})
    
    //console.log(req.body)
    
    const title = req.body['issueTitle'];
    const date = req.body['issueDate'];
    const type = req.body['issueType'];
    const status = req.body['issueStatus'];
    const Context = req.body['issueContext'];
    
    
    const id = await Issue.countDocuments({}) + 1;
    //console.log(id);
    //console.log(assignee)

    user = await User.findOne({assignee});
    if(user == null) {
        res.json({ status: "error", error: "No users" });
    }
    else {
        const issue = Issue.create({
            issueID: id,
            issueTitle: title,
            issueAssignee: assignee,
            issueDate: date,
            issueType: type,
            issueStatus: status,
            issueContext: Context,
            issueReporter: null,         
            issueComment: []   
        }).then(()=>{
            return res.json("create issue");
        }).catch((error)=>{
            return res.json(error);
        })
        
    }
}

IssueGet = async(req, res) =>{
    //return res.json("testing");
    const token = req.query['token'];    
    //console.log(req.query)
    //const token = jwt.sign({ username: req.body['user'] }, JWT_SECRET);//for test

    if(!await checktoken(token)) return res.json({error:"token fail"})

    Issue.find({}).then((issues) => {
        if (!issues) {
            return res.json("No issues");
        }
        else {
            return res.json(issues);
        }
    }).catch((error) => {
        return res.json(error)
    });
}

IssueGetByUser = async(req, res) =>{

    const token = req.query['token'];    

    //const token = jwt.sign({ username: req.body['user'] }, JWT_SECRET);//for test

    const name = await checktoken(token)
    if(!name) return res.json({error:"token fail"})
    

    Issue.find({issueAssignee:name}).then((issues) => {
        if (!issues) {
            return res.json("No issues");
        }
        else {
            return res.json(issues);
        }
    }).catch((error) => {
        return res.json(error)
    });
}

IssueTakeById = async(req, res) =>{
    const token = req.body['token'];    

    //const token = jwt.sign({ username: req.body['user'] }, JWT_SECRET);//for test

    const name = await checktoken(token)
    if(!name) return res.json({error:"token fail"})

    const id = req.body['issueID'];        

    const user = await User.findOne({username: name});

    Issue.updateOne({ issueID:id }, { issueReporter: name }).then(() => {
        return res.json("issue set reporter successfully")
    }).catch((error) => {
        return res.json(error)
    });
}


IssueSearch = async(req, res) =>{    
    // {
    //     "tags":["Type:C", "Assignee:user123"] //some tages: Type, Assignee, Status, Date, ID, Reporter, Title
    // }
    //console.log(req.body)
    const token = req.query['token'];    
    
    //const token = jwt.sign({ username: req.body['user'] }, JWT_SECRET);//for test

    if(!await checktoken(token)) return res.json({error:"token fail"});

    const searchTags = req.query.tags; // replace with the name of the query parameter that contains the tags
    //console.log(searchTags)
    const query = {};

    if (searchTags) {
        searchTags.split(',').forEach(async (tag) => {
            let [key, value] = tag.split(':');
            //console.log(key, value)
            if (key && value) {                
                if(key == 'Type') key = "issueType";
                else if (key == 'Date') key = "issueDate";
                else if (key == 'Status') key = "issueStatus";
                else if (key == 'Assignee') key = 'issueAssignee';
                else if (key == 'Reporter') key = 'issueReporter';
                else if (key == 'ID') key ="issueID"
                else if (key == 'Title') key = 'issueTitle'
                query[key] = value;
            }
            if (key == 'Reporter' && value == null) key = 'issueReporter';
        });
    }

    //console.log(query)
    Issue.find(query).then((issues) => {
        if (!issues) {
            return res.json("No issues");
        }
        else {
            return res.json(issues);
        }
    }).catch((error) => {
        return res.json(error)
    });
}



IssueUpdateById = async(req,res) =>{
    //console.log(req.body)
    const token = req.body['token'];    
    //const token = jwt.sign({ username: req.body['user'] }, JWT_SECRET);//for test
    if(!await checktoken(token)) return res.json({error:"token fail"})    
    const id = req.body['issueID'];
    const title = req.body['issueTitle'];
    const date = req.body['issueDate'];
    const type = req.body['issueType'];
    const status = req.body['issueStatus'];
    const Context = req.body['issueContext'];
    const currentDate = new Date();
    const currentdate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');

    Issue.updateOne({ issueID:id }, { issueContext:Context, issueStatus:status, issueType:type, issueTitle:title, issueDate:date }).then(async () => {
        const update = {
            $push: {
              issueComment: {            
                comment: "issue edited",
                date: currentdate,
              }
            }
          };                 
        await Issue.updateOne({issueID:id}, update);
        return res.json("issue update successfully")
    }).catch((error) => {
        return res.json(error)
    });
}

IssueCommentAddById =async(req, res) =>{
    const token = req.body['token'];    

    //const token = jwt.sign({ username: req.body['user'] }, JWT_SECRET);//for test

    const name = await checktoken(token)
    if(!name) return res.json({error:"token fail"})

    const id = req.body['issueID'];
    const date = req.body['date'];
    const comment = req.body['comment'];

    const update = {
        $push: {
          issueComment: {            
            comment: comment,
            date: date
          }
        }
      };

    Issue.updateOne({ issueID:id }, update).then(() => {
        return res.json("issue add comment successfully")
    }).catch((error) => {
        return res.json(error)
    }); 

}

IssueUnTakeById = async(req, res) =>{
    const token = req.body['token'];    

    //const token = jwt.sign({ username: req.body['user'] }, JWT_SECRET);//for test

    const name = await checktoken(token)
    if(!name) return res.json({error:"token fail"})

    const id = req.body['issueID'];        

    const user = await User.findOne({username: name});

    Issue.updateOne({ issueID:id }, { issueReporter: null}).then(() => {
        return res.json("untake issue successfully")
    }).catch((error) => {
        return res.json(error)
    });
}

module.exports = {
    IssueCreate,
    IssueGet,
    IssueGetByUser,
    IssueTakeById,
    //IssueDeleteById,
    IssueSearch,
    IssueUpdateById,
    IssueCommentAddById,
    IssueUnTakeById,
}