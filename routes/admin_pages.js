const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    res.render('index',{
        title: 'Admin Area here'
    });
});
// Exports
module.exports = router;