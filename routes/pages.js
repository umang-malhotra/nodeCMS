const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    res.render('index',{
        title: 'Front Page'
    });
});
// Exports
module.exports = router;