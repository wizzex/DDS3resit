const { default: mongoose } = require('mongoose');
const sharp = require('sharp');
const Contact = require('../database/models/contact')

const UpdateKeys = ['firstName', 'lastName', 'company', 'birthDate', 'address', 'phones', 'emails'];

module.exports.list = async ({ query: filter, user }, res) => {
    try
    {
        filter.owner = user._id;
        const contacts = await Contact.find(filter);
        res.status(200).send(contacts);
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

module.exports.details = async ( { params: { id }, user}, res) => {
    try
    {
        const contact = await Contact.findOne({ _id: id, owner: user._id });
        res.status(200).send(contact);
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

module.exports.create = async ({ body, user }, res) => {
    try
    {
        var contact = new Contact({
            contactId: new mongoose.Types.ObjectId(),
            ...body
        });

        contact.owner = user._id;

        await contact.save();
        res.status(200).send(contact);
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

module.exports.update = async ({ body, params, user }, res) => {
    try
    {
        const validKeys = Object.keys(body).every(key => {
            return UpdateKeys.includes(key);
        })

        if (!validKeys) {
            throw new Error('Invalid update parameters');
        }

        let contact = await Contact.findOne({ _id: params.id, owner: user._id });
        if (!contact) {
            throw new Error(`Could not find contact with id ${params.id}`);
        }
    
        Object.keys(body).forEach(key => {
            contact[key] = body[key];
        });

        await contact.save();
        res.status(200).send(contact);
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

module.exports.delete = async ({ params, user }, res) => {
    try
    {
        const contact = await Contact.findOneAndDelete({ 
            _id: params.id, 
            owner: user._id 
        }, { 
            returnDocument: true 
        });

        if (!contact) {
            throw new Error(`Could not find contact with id ${params.id}`);
        }

        res.status(200).send(contact);
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

module.exports.createAvatar = async ({ params, user, file }, res) => {
    try {
        const contact = await Contact.findOne({ _id: params.id, owner: user._id });
        if (!contact) {
            throw new Error(`Could not find contact with id ${params.id}`);
        }

        const image = await sharp(file.buffer)
            .resize({width: 250, height: 250})
            .png()
            .toBuffer();

        contact.avatar = image;
        await contact.save();

        res.status(201).send();
    }
    catch(error) {
        console.log(error.message);

        res.status(400).send({
            error: error.message,
            date: new Date()
        })
    }
}

module.exports.getAvatar = async ({ params }, res) => {
    try {

       const contactAvatar = await Contact.findOne({ _id: params.id }, 'avatar');

        res.set('Content-Type', 'image/jpg')
            .status(200)
          .send(contactAvatar.avatar);
    }
    catch (error) {
        console.log(error.message);

        res.status(400).send({
        error: error.message,
            date: new Date()
        });
    }
}