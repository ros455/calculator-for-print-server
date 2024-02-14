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

// export const getAllClients = async (req, res) => {
//     // try {
//     //     const data = await ClientModel.find();
//     //     if(!data) {
//     //         return res.status(404).json({ message: 'User not found' });
//     //     }

//     //     res.json(data)

//     // } catch(error) {
//     //     console.error('error:', error);
//     //     res.status(404).json({ message: 'User not found' });
//     // }
//     try {
//         const { page, limit } = req.query;
//         const skip = parseInt(page - 1) * parseInt(limit); // Переконайтеся, що ці значення є числами
    
//         // Використання агрегаційного пайплайну для сортування без урахування регістру
//         let allData = await ClientModel.aggregate([
//           { $addFields: { nameLower: { $toLower: "$name" } } },
//           { $sort: { nameLower: 1 } },
//           { $skip: skip },
//           { $limit: parseInt(limit) },
//           { $lookup: { from: 'tables', localField: 'orders', foreignField: '_id', as: 'orders' } }
//         ]);
    
//         console.log('allData',allData);
    
//         // Відправка відсортованих даних
//         res.json(allData);
//       } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Помилка сервера' });
//       }
// }

export const getAllClients = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const skip = parseInt(page - 1) * parseInt(limit); // Переконайтеся, що ці значення є числами

        // Створення початкового пайплайну з можливим $match для пошуку
        let pipeline = [];

        // Додавання умови $match, якщо є параметр пошуку
        if (search) {
            pipeline.push({
                $match: {
                    fullName: { $regex: search, $options: 'i' }, // Пошук за іменем без урахування регістру
                }
            });
        }

        if(search) {
            pipeline = pipeline.concat([
                { $addFields: { nameLower: { $toLower: "$fullName" } } },
                { $sort: { nameLower: 1} },
                { $skip: skip },
                { $limit: parseInt(limit) },
                { $lookup: { from: 'tables', localField: 'orders', foreignField: '_id', as: 'orders' } }
            ]);
        } else {
            pipeline = pipeline.concat([
                { $addFields: { nameLower: { $toLower: "$fullName" } } },
                { $sort: { createdAt: -1} },
                { $skip: skip },
                { $limit: parseInt(limit) },
                { $lookup: { from: 'tables', localField: 'orders', foreignField: '_id', as: 'orders' } }
            ]);
        }


        let allData = await ClientModel.aggregate(pipeline);

        console.log('allData', allData);

        // Відправка відсортованих даних
        res.json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Помилка сервера' });
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