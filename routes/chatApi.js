const express = require('express');
const router = express.Router();
const Chat = require('../models/private-chat');
const User = require('../models/userSchema');
const Message = require('../models/message-chat');

const passport = require('passport');

// Get inbox list 
router.get('/getInboxList', passport.authenticate('bearer', { session: false }), async(req,res) =>{ 
    const users = await User.find({ _id: {$ne: req.user._id}}, {firstName: 1, lastName: 1});
    res.json(users)
});
// This API used to get a Chat between user1 and user2
// Create a new Chat if not exist
router.post('/getOrCreateNewChat/:idUser1/:idUser2', passport.authenticate('bearer', { session: false }), async(req,res) =>{ 
    const chat1 = await Chat.findOne({user1: req.params.idUser1, user2:req.params.idUser2});
    if(chat1 !== null)
    {
        res.json(chat1);
    }
    else{
        const chat2 = await Chat.findOne({user1: req.params.idUser2, user2:req.params.idUser1});
        if(chat2 !== null)
        {
            res.json(chat2);
        }
        else{
            // Create a new Chat
            const newChat = await Chat.create({user1: req.params.idUser1, user2: req.params.idUser2, messages: []});
            res.json(newChat);
        }
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
    // update the chat => to perssist messages
    const chat2 = await Chat.findByIdAndUpdate(existingChat._id, { $push: { messages: newMessage._id }}, { new: true});
    // return
    return res.json({message: 'Message created in the chat.'})

});

//
router.get('/loadOldMessages/:chatId', passport.authenticate('bearer', { session: false }), async(req,res) => {
        const chat = await Chat.findById(req.params.chatId).populate('messages'); 
        res.json(chat.messages)
});

module.exports = router;