import OrderModel from '../model/Orders.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
    try {
        const {clientId, managerId, orderName, productName, branding, salePrice, delivery, design, aditionalRows, counts, markUp, priceForOne, salesAmountWithMarkup, costPrice, margin} = req.body;
        
        const lastId = await OrderModel.findOne({}, {}, { sort: { id: -1 } });
        const id = (lastId && lastId.id) ? lastId.id + 1 : 1;
        const data = await OrderModel.create({
            clientId,
            id,
            managerId,
            status: 'Новий',
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
        
        console.log('data',data);
        if(!data) {
            return res.status(500).json({ message: 'Failed create order' });
        }
        res.json(data);
    } catch(error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const {id, clientId, managerId, productName, branding, salePrice, status, orderName, delivery, design, aditionalRows, counts, markUp, priceForOne, salesAmountWithMarkup, costPrice, margin} = req.body;
        const data = await OrderModel.findByIdAndUpdate(id);

        if(!data) {
            return res.status(500).json({ message: 'Failed update order' });
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
        if(status) data.status = status;
        if(productName) data.productName = productName;
        if(branding) data.branding = branding;
        if(salePrice) data.salePrice = salePrice;
        if(clientId) data.clientId = clientId;
        if(managerId) data.managerId = managerId;

        await data.save();

        res.json(data);
    } catch(error) {
        console.error('error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const skip = parseInt(page - 1) * parseInt(limit);
        const allLength = (await OrderModel.find()).length;
        const lastPage = Math.ceil(allLength / parseInt(limit));

        let pipeline = [];

        // Перетворення search у число
        const searchId = parseInt(search);

        // Додавання умови $match, якщо є параметр пошуку та він є валідним числом
        if (search && !isNaN(searchId)) {
            pipeline.push({
                $match: {
                    id: searchId
                }
            });
        }

        // Визначення сортування залежно від наявності параметру пошуку
        if (search) {
            pipeline.push({ $sort: { id: 1 } }); // Сортування за ID, якщо є пошук
        } else {
            pipeline.push({ $sort: { createdAt: -1 } }); // Стандартне сортування за часом створення
        }

        // Додавання пагінації та lookup
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: parseInt(limit) });
        pipeline.push({
            $lookup: {
                from: 'clients',
                localField: 'clientId',
                foreignField: '_id',
                as: 'clientId'
            }
        });
        pipeline.push({
            $lookup: {
                from: 'administrations',
                localField: 'managerId',
                foreignField: '_id',
                as: 'managerId'
            }
        });

        // Розгортання clientId та managerId для перетворення масиву в об'єкт
        pipeline.push({
            $unwind: {
                path: "$clientId",
                preserveNullAndEmptyArrays: true // Це збереже документи, у яких clientId або пустий, або не існує
            }
        });
        pipeline.push({
            $unwind: {
                path: "$managerId",
                preserveNullAndEmptyArrays: true // Це збереже документи, у яких managerId або пустий, або не існує
            }
        });

        let allData = await OrderModel.aggregate(pipeline);

        res.json({pagination: {pageCount: lastPage}, list: allData});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
}

export const getAllOrdersForManager = async (req, res) => {
    try {
        const { page, limit, managerId, search } = req.query;
        const skip = parseInt(page - 1) * parseInt(limit);

        let matchCondition = {};
        if (managerId) {
            // Використання 'new' для створення екземпляра ObjectId
            matchCondition['managerId'] = new mongoose.Types.ObjectId(managerId);
        }

        // Розрахунок загальної кількості замовлень за managerId
        const allLength = await OrderModel.find(matchCondition).countDocuments();
        const lastPage = Math.ceil(allLength / parseInt(limit));
        

        let pipeline = [
            { $match: matchCondition },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'clientId'
                }
            },
            {
                $lookup: {
                    from: 'administrations',
                    localField: 'managerId',
                    foreignField: '_id',
                    as: 'managerId'
                }
            },
            {
                $unwind: {
                    path: "$clientId",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$managerId",
                    preserveNullAndEmptyArrays: true
                }
            }
        ];

        const searchId = parseInt(search);

        // Додавання умови $match, якщо є параметр пошуку та він є валідним числом
        if (search && !isNaN(searchId)) {
            pipeline.push({
                $match: {
                    id: searchId
                }
            });
        }

        // Визначення сортування залежно від наявності параметру пошуку
        if (search) {
            pipeline.push({ $sort: { id: 1 } }); // Сортування за ID, якщо є пошук
        } else {
            pipeline.push({ $sort: { createdAt: -1 } }); // Стандартне сортування за часом створення
        }

        let allData = await OrderModel.aggregate(pipeline);

        res.json({pagination: {pageCount: lastPage}, list: allData});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
}


export const getOneOrder = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await OrderModel.findById(id).populate(['clientId','managerId']);

        if(!data) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(data)

    } catch(error) {
        console.error('error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const {id} = req.body;
        const data = await OrderModel.findByIdAndDelete(id);

        if(!data) {
            return res.status(404).json({ message: 'Failed deleted' });
        }

        res.json(data)

    } catch(error) {
        console.error('error:', error);
        res.status(404).json({ message: 'Server error' });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const {id, status} = req.body;
        const data = await OrderModel.findByIdAndUpdate(id);

        if(!data) {
            return res.status(404).json({ message: 'Failed deleted' });
        }

        if(status) data.status = status;

        await data.save();

        res.json(data)

    } catch(error) {
        console.error('error:', error);
        res.status(404).json({ message: 'Server error' });
    }
}

export const sortByStatus = async (req, res) => {
    try {
        const {status, page, limit} = req.query;
        const skip = (page - 1) * limit;

        const allLength = (await OrderModel.find()).length;
        const lastPage = Math.ceil(allLength / limit)

        const tables = await OrderModel.find({"status": status})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(["clientId","managerId" ]);

        if(!tables) {
            res.status(404).json({ error: 'Таблиць не знайдено' });
        }

        res.json({pagination: {pageCount: lastPage}, list: tables});
    } catch(error) {
        console.log(error);
        res.status(404).json({ error: 'Користувача не знайдено' });
    }
  }
  
export const sortByStatusForManager = async (req, res) => {
    try {
        const {status, page, limit, managerId} = req.query;
        const skip = parseInt(page - 1) * parseInt(limit); // Переконайтесь, що це число

        // Перетворення limit з рядка в число
        const numericLimit = parseInt(limit);

        // Спочатку фільтруємо замовлення за managerId, а потім за статусом
        const matchCondition = {
            managerId: managerId, // Тут можливо потрібне перетворення в ObjectId, залежно від вашої схеми
            status: status
        };

        // Розрахунок загальної кількості замовлень за заданими умовами
        const allLength = await OrderModel.find(matchCondition).countDocuments();
        const lastPage = Math.ceil(allLength / numericLimit);

        const tables = await OrderModel.find(matchCondition)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(numericLimit)
            .populate(["clientId", "managerId"]);

        if (!tables.length) {
            return res.status(404).json({ error: 'Таблиць не знайдено' });
        }

        res.json({pagination: {pageCount: lastPage}, list: tables});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Користувача не знайдено' });
    }
}

export const sortByManager = async (req, res) => {
    try {
        const {manager, page, limit} = req.query;
        const skip = (page - 1) * limit;

        const allLength = (await OrderModel.find()).length;
        const lastPage = Math.ceil(allLength / limit)

        const tables = await OrderModel.find({"managerId": manager})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(["clientId", "managerId"]);

        if(!tables) {
            res.status(404).json({ error: 'Таблиць не знайдено' });
        }

        res.json({pagination: {pageCount: lastPage}, list: tables});
    } catch(error) {
        console.log(error);
        res.status(404).json({ error: 'Користувача не знайдено' });
    }
  }
