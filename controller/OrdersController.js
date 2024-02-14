import OrderModel from '../model/Orders.js';

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
        pipeline.push({ $lookup: { from: 'tables', localField: 'orders', foreignField: '_id', as: 'orders' } });

        let allData = await OrderModel.aggregate(pipeline);

        console.log('allData', allData);
        res.json(allData);
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
        const tables = await OrderModel.find({"status": status})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        // .populate("user");

        if(!tables) {
            res.status(404).json({ error: 'Таблиць не знайдено' });
        }

        res.json(tables);
    } catch(error) {
        console.log(error);
        res.status(404).json({ error: 'Користувача не знайдено' });
    }
  }
