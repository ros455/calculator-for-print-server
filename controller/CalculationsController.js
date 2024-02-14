import CalculationsModel from '../model/Calculations.js';

export const createCalculation = async (req, res) => {
    try {
        const {clientId, orderName, productName, branding, salePrice, delivery, design, aditionalRows, counts, markUp, priceForOne, salesAmountWithMarkup, costPrice, margin} = req.body;
        const data = await CalculationsModel.create({
            clientId,
            orderName,
            productName,
            branding,
            salePrice,
            delivery,
            design,
            aditionalRows,
            counts,
            markUp,
            priceForOne,
            salesAmountWithMarkup,
            costPrice,
            margin
        })

        if(!data) {
            return res.status(500).json({ message: 'Failed create calculation' });
        }

        res.json(data);
    } catch(error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const updateCalculation = async (req, res) => {
    try {
        const {id, clientId, productName, branding, salePrice, orderName, delivery, design, aditionalRows, counts, markUp, priceForOne, salesAmountWithMarkup, costPrice, margin} = req.body;
        const data = await CalculationsModel.findByIdAndUpdate(id);

        if(!data) {
            return res.status(500).json({ message: 'Failed update calculation' });
        }

        if(orderName) data.orderName = orderName;
        if(delivery) data.delivery = delivery;
        if(design) data.design = design;
        if(aditionalRows) data.aditionalRows = aditionalRows;
        if(counts) data.counts = counts;
        if(markUp) data.markUp = markUp;
        if(priceForOne) data.priceForOne = priceForOne;
        if(salesAmountWithMarkup) data.salesAmountWithMarkup = salesAmountWithMarkup;
        if(costPrice) data.costPrice = costPrice;
        if(margin) data.margin = margin;
        if(clientId) data.clientId = clientId;
        if(productName) data.productName = productName;
        if(branding) data.branding = branding;
        if(salePrice) data.salePrice = salePrice;

        await data.save();

        res.json(data);
    } catch(error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// export const getAllCalculations = async (req, res) => {
//     try {
//         const data = await CalculationsModel.find().populate('clientId');

//         if(!data) {
//             return res.status(404).json({ message: 'Calculations not found' });
//         }

//         res.json(data)

//     } catch(error) {
//         console.error('error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }
export const getAllCalculations = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const skip = parseInt(page - 1) * parseInt(limit); // Переконайтеся, що ці значення є числами

        // Створення початкового пайплайну з можливим $match для пошуку
        let pipeline = [];

        // Додавання умови $match, якщо є параметр пошуку
        if (search) {
            pipeline.push({
                $match: {
                    orderName: { $regex: search, $options: 'i' }, // Пошук за іменем без урахування регістру
                }
            });
        }

        if(search) {
            pipeline = pipeline.concat([
                { $addFields: { nameLower: { $toLower: "$orderName" } } },
                { $sort: { nameLower: 1} },
                { $skip: skip },
                { $limit: parseInt(limit) },
                { $lookup: { from: 'tables', localField: 'orders', foreignField: '_id', as: 'orders' } }
            ]);
        } else {
            pipeline = pipeline.concat([
                { $addFields: { nameLower: { $toLower: "$orderName" } } },
                { $sort: { createdAt: -1} },
                { $skip: skip },
                { $limit: parseInt(limit) },
                { $lookup: { from: 'tables', localField: 'orders', foreignField: '_id', as: 'orders' } }
            ]);
        }


        let allData = await CalculationsModel.aggregate(pipeline);

        console.log('allData', allData);

        // Відправка відсортованих даних
        res.json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
}

export const getOneCalculation = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await CalculationsModel.findById(id).populate('clientId');

        if(!data) {
            return res.status(404).json({ message: 'Calculation not found' });
        }

        res.json(data)

    } catch(error) {
        console.error('error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteCalculation = async (req, res) => {
    try {
        const {id} = req.body;
        const data = await CalculationsModel.findByIdAndDelete(id);

        if(!data) {
            return res.status(404).json({ message: 'Failed deleted' });
        }

        res.json(data)

    } catch(error) {
        console.error('error:', error);
        res.status(404).json({ message: 'Server error' });
    }
}