const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = Schema({
    email: {type:String, required:true},
    password: {type:String,required:true},
    username: {type:String,required:true},
    likedBlogs: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }]
}
    ,{timestamps:true}
)

module.exports = mongoose.model('User',userSchema);