var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    author: {
        id: {                                                //we store the author id so that we can check whether current user id matches with the user id of the comment author
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    text: String,
    username: String,
    timestamp: {
        day: Number,
        month: Number,
        year: Number
    }
})
module.exports = mongoose.model("Comment", commentSchema);