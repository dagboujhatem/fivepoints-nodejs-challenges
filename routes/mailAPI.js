const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const passport = require('passport');
const router = express.Router();

// les API
router.post('/send-text', passport.authenticate("bearer", { session: false }), async(req, res)=>{
    // 1. create transporter 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "*************@gmail.com",
            pass: "**********"
    }});
    // 2. create mail options
     let info = await transporter.sendMail({
        from: '"DAGBOUJ Hatem 👻" <dagboujhatem@gmail.com>', // sender address
        to: "hatem.dagbouj@fivepoints.fr", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Bonjour Hatem !!", // Text body
    });
    // 3. send respone
    res.json({message : "E-mail send successfully!"})
});

router.post('/send-html', passport.authenticate("bearer", { session: false }), async(req, res)=>{
    // 1. create transporter 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "*************@gmail.com",
            pass: "**********"
    }});
    // 2. create mail options
     let info = await transporter.sendMail({
        from: '"DAGBOUJ Hatem 👻" <dagboujhatem@gmail.com>', // sender address
        to: "hatem.dagbouj@fivepoints.fr", // list of receivers
        subject: "Hello ✔", // Subject line
        html: "<h>Bonjour Hatem</h1>", // html body
    });
    // 3. send respone
    res.json({message : "E-mail send successfully!"})
});

router.post('/send-html/:name', passport.authenticate("bearer", { session: false }), async(req, res)=>{
    // 1. create transporter 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "*************@gmail.com",
            pass: "**********"
        }});
    // 2. load HTML template
    const template = fs.readFileSync(path.resolve('./common/mail_templates', 'register_mail.html'), {encoding: 'utf-8'});
    const html = ejs.render(template, {
        name: req.params.name
    })

    // 3. create mail options
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <dagboujhatem@gmail.com>', // sender address
        to: "hatem.dagbouj@fivepoints.fr, dagboujhatem@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        html: html, // html body
    });
    // 4. send respone
    res.json({message : "E-mail send successfully!"})
});

module.exports = router;