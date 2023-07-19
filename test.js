const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const uuid = require('uuid');

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());

app.use(`/`, (req, res) => {
    res.send(`Hiiii`);
})

const server = app.listen(port, () => {
    console.log(`Server is listening at port: ${port}`);
})

const io = socketio(server, {
    cors: {
        origin: '*'
    }
});

const connections = {};

io.on(`connection`, (socket) => {
    socket.on(`join`, function (event) {
        connections[event?.username] = socket;
        socket.join(`room`);
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on(`kick-out-user`, async function (event) {
        // Here, let's say the admin is trying to disconnect the user himanshu
        const sockets = await io.in(`room`).fetchSockets();
        console.log(sockets.length);
        let socketToDisconnect;
        for (const [key, value] of Object.entries(connections)) {
            console.log(key, event);
            if (key === event?.username) {
                socketToDisconnect = value;
            }
        }          

        socketToDisconnect?.disconnect();
    })
})


const init = async () => {
    const connection = await mongoose.connect("mongodb://localhost:27017/test3");
    console.log('Connected');

    const coll1 = new mongoose.Schema({
        field1: [{
            val1: { type: String },
            val2: { type: String }
        }]
    })

    const coll1Model = mongoose.model('coll1', coll1, 'coll1');

    const user = await coll1Model.findOneAndUpdate(
        { _id: '64b2e4d54c8fd79111c32948' },
        {
            $set: {
                field1: [{
                    val1: "def",
                    val2: "abc",
                    _id: "$field1._id"
                }]
            }
        }    
    );

    console.log('user', user);
}

init();

console.log('NEWCHANGE');
