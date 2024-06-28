const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogSchema = Schema({
    title: {type:String, required:true},
    overview: {type:String,required:true},
    content: {type:String,required:true},
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
}
    ,{timestamps:true}
) 

module.exports = mongoose.model('Blog',blogSchema);