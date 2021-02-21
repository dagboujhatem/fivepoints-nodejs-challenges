const express = require('express');
const router = express.Router();
const Chat = require('../models/private-chat');
const User = require('../models/userSchema');
const Message = require('../models/message-chat');

const passport = require('passport');

// Get inbox list 
router.get('/getInboxList', passport.authenticate('bearer', { session: false }), async(req,res) =>{ 
    const chats = await Chat.find({$or: [{user1: req.user._id }, {user2: req.user._id}]})
    .populate({ path : 'user1', match: { _id: {$ne: req.user._id}}, select: 'firstName lastName'})
    .populate({ path : 'user2', match: { _id: {$ne: req.user._id}}, select: 'firstName lastName'})
    .populate({path: 'messages', options: {limit: 1, sort: { createdAt: -1}}});
    // res.json(chats);
    let response = [];
    let usersIDs = [req.user._id];
    chats.forEach(chat =>{
        let inbox = {
            _id: '',
            message: '',
            createdAt: '',
            userName: '',
            hasNotification: false,
            nubmerOfMessage: 0,
        };
        // message content & createdAt
        if(chat.messages.length >0)
        {
            inbox["message"] = chat.messages[0].content;
            inbox["createdAt"] = chat.messages[0].createdAt;
        }
        // userName
        if(chat.user1 != null)
        {
            inbox["userName"] = chat.user1.firstName + ' ' + chat.user1.lastName;
            inbox["_id"] = chat.user1._id;
            usersIDs.push(chat.user1._id);
        }
        if(chat.user2 != null)
        {
            inbox["userName"] = chat.user2.firstName + ' ' + chat.user2.lastName;
            inbox["_id"] = chat.user2._id;
            usersIDs.push(chat.user2._id);
        }
        // add inbox to response
        response.push(inbox);
    });
    // get all new users
    const usersWithoutChat = await User.find({ _id: {$nin: usersIDs}}, {firstName: 1, lastName: 1});
    usersWithoutChat.forEach(user=>{
        let inbox = {
            _id: '',
            message: '',
            createdAt: '',
            userName: '',
            hasNotification: false,
            nubmerOfMessage: 0,
        };
        inbox["userName"] = user.firstName + ' ' + user.lastName;
        inbox["_id"] = user._id;
        // add inbox to response
        response.push(inbox);
    })
    res.json(response);
});
// This API used to get a Chat between user1 and user2
// Create a new Chat if not exist
router.post('/getOrCreateNewChat/:idUser1/:idUser2', passport.authenticate('bearer', { session: false }), async(req,res) =>{ 
    const existingChat = await Chat.findOne({$or:[
        {user1: req.params.idUser1, user2:req.params.idUser2},
         {user1: req.params.idUser2, user2:req.params.idUser1}]});
    if(existingChat !== null)
    {
        res.json(existingChat);
    }
    else{
        // Create a new Chat
        const newChat = await Chat.create({user1: req.params.idUser1, user2: req.params.idUser2, messages: []});
        res.json(newChat);
    }
});

// Send message API using socket.io
router.post('/sendMessage/:idChat', passport.authenticate('bearer', { session: false }), async(req,res) => {
    const existingChat = await Chat.findById(req.params.idChat);
    if(existingChat == null){
        return res.status(404).json({message: `chat with id=${req.params.idChat} not found.`});
    }
    // Create a new message in the existing Chat
    const io = req.app.get('io');
    const newMessage = await Message.create(req.body);
    io.emit('newMessageSended', newMessage);
    io.emit('newMessageNotification', newMessage);
    // update the chat => to perssist messages
    const chat2 = await Chat.findByIdAndUpdate(existingChat._id, { $push: { messages: newMessage._id }}, { new: true});
    // return
    return res.json({message: 'Message created in the chat.'})

});

//
router.get('/loadOldMessages/:chatId/:limit', passport.authenticate('bearer', { session: false }), async(req,res) => {
        const chat = await Chat.findById(req.params.chatId).populate({path: 'messages', options: {limit: req.params.limit, sort: { createdAt: -1}}}); 
        res.json(chat.messages)
});

module.exports = router;