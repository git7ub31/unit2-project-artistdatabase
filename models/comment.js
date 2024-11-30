const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }, 
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
