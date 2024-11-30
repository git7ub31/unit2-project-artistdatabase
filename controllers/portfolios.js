const express = require('express');
const router = express.Router();

const Portfolio = require('../models/portfolio');
const Comment = require('../models/comment'); //for comments

//showing the list of portfolios
router.get('/', async(req,res) => {
    try{
        const populatedPortfolios = await Portfolio.find({}).populate('owner')
        console.log('Populated Portfolios:', populatedPortfolios);
        res.render('portfolios/index.ejs', {portfolios: populatedPortfolios});
    }catch(err){
        console.log(err);
        res.redirect('/index.ejs');
    }
})

//add + create
router.get('/new', async(req,res) => {
    res.render('portfolios/new.ejs');
});

router.post('/', async(req,res) => {
    req.body.owner = req.session.user._id;
    await Portfolio.create(req.body);
    res.redirect('/portfolios')
})

//show
router.get('/:portfolioId', async (req, res) => {
    try {
      const populatedPortfolios = await Portfolio.findById(req.params.portfolioId).populate('owner');
      const userHasLiked = populatedPortfolios.likedByUsers.some((user) => user.equals(req.session.user._id));
      const comments = await Comment.find({portfolio: req.params.portfolioId }).populate('user', 'username');
      console.log(comments); 
      res.render('portfolios/show.ejs', {portfolio: populatedPortfolios, userHasLiked: userHasLiked, comments: comments});
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

//adding the comment
router.post('/:portfolioId/comments', async (req, res) => {
    try {
      const userId = req.session.user._id;  
      
      const newComment = new Comment({
        content: req.body.content,
        user: userId,              
        portfolio: req.params.portfolioId
      });
  
      // Save the comment to mongo
      const newComments = await newComment.save();
      console.log(newComments)
  
      // go back to the portfolio 
      res.redirect(`/portfolios/${req.params.portfolioId}`);
    } catch (error) {
      console.log(error);
      res.redirect(`/portfolios/${req.params.portfolioId}`);
    }
  });

//delete
router.delete('/:portfolioId', async (req, res) => {
    try {
      const portfolio = await Portfolio.findById(req.params.portfolioId);
      if (portfolio.owner.equals(req.session.user._id)) {
        await portfolio.deleteOne();
        res.redirect('/portfolios');
      } else {
        res.send("You don't have permission to do that.");
      }
    } catch (error) {
      console.error(error);
      res.redirect('/portfolios');
    }
  });

//editForm + update
router.get('/:portfolioId/edit', async (req, res) => {
    try {
      const currentPortfolio = await Portfolio.findById(req.params.portfolioId);
      res.render('portfolios/edit.ejs', {portfolio: currentPortfolio,});
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

  router.put('/:portfolioId', async (req, res) => {
    try {
      const currentPortfolio = await Portfolio.findById(req.params.portfolioId);
      if (currentPortfolio.owner.equals(req.session.user._id)) {
        await currentPortfolio.updateOne(req.body);
        res.redirect('/portfolios');
      } else {
        res.send("You don't have permission to do that.");
      }
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

//liking and unliking
router.post('/:portfolioId/liked-by/:userId', async(req,res) => {
    try{
        await Portfolio.findByIdAndUpdate(req.params.portfolioId, {
            $push: { likedByUsers: req.params.userId }
        });
        res.redirect(`/portfolios/${req.params.portfolioId}`)
    }catch(error) {
        console.log(error);
        res.redirect('/');
    }
})

router.delete('/:portfolioId/liked-by/:userId', async(req,res) => {
    try{
        await Portfolio.findByIdAndUpdate(req.params.portfolioId, {
            $pull: { likedByUsers: req.params.userId }
        })
        res.redirect(`/portfolios/${req.params.portfolioId}`)
    }catch(err){
        console.log(err);
        res.redirect('/');
    }
})

module.exports = router; 