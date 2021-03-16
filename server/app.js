const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const port = 4000;
const User = require('./models/user')
const bcrypt = require('bcrypt');
app.use(express.json())
app.use(cors())

const url = "mongodb+srv://bhxshxn:bhxshxn@9@cluster0.ixoza.mongodb.net/MediBoxretryWrites=true&w=majority"
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,

})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database is connected successfully!!!');
});


app.get('/', (req, res) => {
    res.send("Hello from Backend");
});

app.post('/register', async (req, res) => {
    const { email, password, username } = req.body;
    // check for missing filds
    if (!email || !password || !username) {
        res.send({ msg: "Please enter all the fields" })
        return;
    };
    var user = username.charAt(0).toUpperCase() + username.slice(1);

    const doesUserExitsAlreay = await User.findOne({ email });
    if (doesUserExitsAlreay) {
        res.send({ msg: "Email already exists" });
        return;
    };

    const doesUsernameExitsAlreay = await User.findOne({ username: user });
    if (doesUsernameExitsAlreay) {
        res.send({ msg: "Username already exists" });
        return;
    };

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ email, password: hashedPassword, username: user });

    latestUser
        .save()
        .then(() => {
            res.send({ msg: "Sucessfully Registered" });
            return;
        })
        .catch((err) => console.log(err));
});

app.post('/login', async (req, res) => {
    var { username, password } = req.body;

    // check for missing filds
    if (!username || !password) {
        res.send("Please enter all the fields");
        return;
    }
    username = username.charAt(0).toUpperCase() + username.slice(1);
    const doesUserExits = await User.findOne({ username });

    if (!doesUserExits) {
        res.send({ msg: "Invalid useranme or password" });
        return;
    }

    const doesPasswordMatch = await bcrypt.compare(
        password,
        doesUserExits.password
    );

    if (!doesPasswordMatch) {
        res.send({ msg: "Invalid useranme or password" });
        return;
    }
    res.send({ msg: "success" });
})
app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`);
});