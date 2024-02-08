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

export const getAllCalculations = async (req, res) => {
    try {
        const data = await CalculationsModel.find().populate('clientId');

        if(!data) {
            return res.status(404).json({ message: 'Calculations not found' });
        }

        res.json(data)

    } catch(error) {
        console.error('error:', error);
        res.status(500).json({ message: 'Server error' });
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