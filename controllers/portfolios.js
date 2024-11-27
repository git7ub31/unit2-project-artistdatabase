const express = require('express');
const router = express.Router();

const Portfolio = require('../models/portfolio');

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
      res.render('portfolios/show.ejs', {portfolio: populatedPortfolios,});
    } catch (error) {
      console.log(error);
      res.redirect('/');
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

module.exports = router; 