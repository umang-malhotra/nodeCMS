const express = require('express');
const router = express.Router();

/*
 * GET pages index
*/
router.get('/', function (req, res) {
    res.send('Admin Area');
});

/*
 * POST add page
*/
router.post('/add-page', function (req, res) {

    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('title', 'Title must have a value').notEmpty();

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let content = req.body.content;

    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        console.log('success');
    }
});

/*
 * GET add page
*/
router.get('/add-page', function (req, res) {
    let title = "";
    let slug = "";
    let content = "";

    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });
});


// Exports
module.exports = router;