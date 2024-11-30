const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({

    artistName: {
        type: String,
        required: false,
      },
      biography: {
        type: String,
        required: false,
      },
      portfolio: {
        type: String,
        required: false,
      },
      link:{
        type: String,
        required: false,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
  likedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
},
{
  timestamps: true 
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
module.exports = Portfolio;