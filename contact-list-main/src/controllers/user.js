const user = require('../database/models/user');
const User = require('../database/models/user')
const UpdateKeys = ['username', 'password', 'name'];

module.exports.list = async ({ query: filter }, res) => {
    try
    {
        const users = await User.find(filter);
        res.status(200).send(users);
    }
    catch(error)
    {
        console.log(error.message);

        res.status(400).send({
            error: error.message,
            date: new Date()
        })
    }
}

module.exports.details = async (req, res) => {
    try
    {
        const user = await User.findById(user._id).populate('contacts');
        res.status(200).send(user);
    }
    catch(error)
    {
        console.log(error.message);

        res.status(400).send({
            error: error.message,
            date: new Date()
        })
    }
}

module.exports.create = async ({ body }, res) => {
    try
    {
        var user = new User({
            ...body
        });
        
        await user.save();
        res.status(200).send(user);
    }
    catch(error)
    {
        console.log(error.message);

        res.status(400).send({
            error: error.message,
            date: new Date()
        })
    }
}

module.exports.update = async ({ body, user }, res) => {
    try
    {
        const validKeys = Object.keys(body).every(key => {
            return UpdateKeys.includes(key);
        })

        if (!validKeys) {
            throw new Error('Invalid update parameters');
        }

        let db = await User.findOne({ _id: user._id });
        if (!db) {
            throw new Error(`Could not find user with id ${user.id}`);
        }
    
        Object.keys(body).forEach(key => {
            db[key] = body[key];
        });

        await db.save();
        res.status(200).send(db);
    }
    catch(error)
    {
        console.log(error.message);

        res.status(400).send({
            error: error.message,
            date: new Date()
        })
    }
}

module.exports.delete = async ({ user }, res) => {
    try
    {
        const db = await User.findOneAndDelete({ _id: user._id }, { returnDocument: true });
        if (!db) {
            throw new Error(`Could not find user with id ${user._id}`);
        }

        res.status(200).send(db);
    }
    catch(error)
    {
        console.log(error.message);

        res.status(400).send({
            error: error.message,
            date: new Date()
        })
    }
}

module.exports.login = async ({ body }, res) => {
    try
    {
        const user = await User.findByCredentials(body.username, body.password);
        const token = await user.generateToken();

        res.status(200).send(token);
    }
    catch(error)
    {
        console.log(error.message);

        res.status(401).send({
            error: error.message,
            date: new Date()
        })
    }
}