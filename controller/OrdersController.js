import OrderModel from '../model/Orders.js';

export const createOrder = async (req, res) => {
    try {
        const {clientId, managerId, orderName, productName, branding, salePrice, delivery, design, aditionalRows, counts, markUp, priceForOne, salesAmountWithMarkup, costPrice, margin} = req.body;
        const data = await OrderModel.create({
            clientId,
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
        const data = await OrderModel.find().populate(['clientId','managerId']);

        if(!data) {
            return res.status(404).json({ message: 'Orders not found' });
        }

        res.json(data)

    } catch(error) {
        console.error('error:', error);
        res.status(500).json({ message: 'Server error' });
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