const express = require('express');
const router = express.Router();

/*
 * GET pages index
*/
router.get('/',function(req,res){
    res.send('Admin Area');
});

/*
 * GET add page
*/
router.get('/add-page',function(req,res){
    let title = "";
    let slug = "";
    let content = "";

    res.render('admin/add_page',{
        title: title,
        slug: slug,
        content: content
    });
});
// Exports
module.exports = router;