const mongoose = require("mongoose");


// don't need to reference to user
//add IssueTitle
//add comment (typr: ixed) => add date, context change by assignee / add comment (assignee <=> reporter )
const IssueSchema = new mongoose.Schema(
  {
    issueID: {type: Number, required: true, unique: true},
    issueTitle:{type: String, require: true},
    issueDate: {type: Date, required: true},
    issueType: {type: String, required: true},
    issueAssignee: {type: String, required: true},
    issueReporter: {type: String, ref: 'User'},
    issueStatus: {type: String, required: true}, //open=> in progrcess =>complete (by assigner)
    issueContext: {type: String, required: true},
    issueComment:[{type: mongoose.Schema.Types.Mixed}],        
  }
);

const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;