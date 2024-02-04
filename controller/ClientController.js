import ClientModel from '../model/Clients.js';

export const createClient = async (req, res) => {
    try {
        const {fullName, company, email, phone} = req.body;
        const data = await ClientModel.create({
            fullName,
            company,
            email,
            phone
        })

        if(!data) {
            return res.status(500).json({ message: 'Failed create user' });
        }

        res.json(data)
    } catch(error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Failed create user' });
    }
}
export const updateClient = async (req, res) => {
    try {
        const {fullName, company, email, phone, id} = req.body;
        const data = await ClientModel.findByIdAndUpdate(id);

        if(!data) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (fullName) data.fullName = fullName;
        if (company) data.company = company;
        if (email) data.email = email;
        if (phone) data.phone = phone;

        await data.save();

        res.json(data)
    } catch(error) {
        console.error('error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAllClients = async (req, res) => {
    try {
        const data = await ClientModel.find();
        if(!data) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(data)

    } catch(error) {
        console.error('error:', error);
        res.status(404).json({ message: 'User not found' });
    }
}
export const deleteClient = async (req, res) => {
    try {
        const {id} = req.body;
        const data = await ClientModel.findByIdAndDelete(id);
        if(!data) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(data)
    } catch(error) {
        console.error('error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}