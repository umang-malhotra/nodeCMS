const express = require('express');
const router = express.Router();
const Page = require('../models/page');

/*
 * GET pages index
*/
router.get('/', function (req, res) {
    Page.find({}).sort({ sorting: 1 }).exec()
        .then(pages => {
            res.render('admin/pages', {
                pages: pages
            })
        })
        .catch(err => {
            console.log("err in getting pages form Page moder", err);
        });
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
        Page.findOne({ slug: slug })
            .then(page => {
                if (page) {
                    req.flash('danger', 'Page slug already exists, choose another.');
                    res.render('admin/add_page', {
                        title: title,
                        slug: slug,
                        content: content
                    });
                }
                else {
                    let page = new Page({
                        title: title,
                        slug: slug,
                        content: content,
                        sorting: 100
                    });

                    page.save(function (err) {
                        if (err)
                            return console.log(err);
                        req.flash('success', 'Page added!');
                        res.redirect('/admin/pages');
                    });
                }

            })
            .catch(err => {
                console.log('Error in finding page', err);
                req.flash('danger', 'Error in finding/saving page - db error.');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            });
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

/*
 * POST reorder pages
*/
router.post('/reorder-pages', function (req, res) {
    console.log("reached here");
    console.log(req.body);
});

/*
 * GET edit page
*/
router.get('/edit-page/:slug', function (req, res) {
    Page.findOne({ slug: req.params.slug })
        .then(page => {
            res.render('admin/edit_page', {
                title: page.title,
                slug: page.slug,
                content: page.content,
                id: page._id
            });
        })
        .catch(err => {
            return console.log(err);
        });
});

/*
 * POST edit page
*/
router.post('/edit-page/:slug', function (req, res) {

    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('title', 'Title must have a value').notEmpty();

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let content = req.body.content;
    let id = req.body.id;


    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    } else {
        Page.findOne({ slug: slug, _id: { '$ne': id } })
            .then(page => {
                if (page) {
                    req.flash('danger', 'Page slug already exists, choose another.');
                    res.render('admin/edit_page', {
                        title: title,
                        slug: slug,
                        content: content,
                        id: id
                    });
                }
                else {
                    Page.findById(id, function (err, page) {
                        if (err) {
                            return console.log(err);
                        }
                        page.title = title;
                        page.slug = slug;
                        page.constent = content;

                        page.save(function (err) {
                            if (err)
                                return console.log(err);
                            req.flash('success', 'Page edited!');
                            res.redirect('/admin/pages/edit-page/' + page.slug);
                        });
                    })
                }

            })
            .catch(err => {
                console.log('Error in finding page', err);
                req.flash('danger', 'Error in finding/saving page - db error.');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            });
    }
});

/*
 * GET delete page
*/
router.get('/delete-page/:id', function (req, res) {
    Page.findByIdAndRemove(req.params.id).then(success => {
        req.flash('success', 'Page deleted!');
        res.redirect('/admin/pages');
    })
        .catch(err => {
            return console.log(err);
        })
});

// Exports
module.exports = router;