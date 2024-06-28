const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = Schema({
    content: {type:String, required:true},
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog' 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }
}
    ,{timestamps:true}
)

module.exports = mongoose.model('Comment',commentSchema);