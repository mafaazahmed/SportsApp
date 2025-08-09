const express = require("express");
const router = express.Router();
const Bill = require('../models/bill');

router.get('/show', async (req,res) => {
     try {
        let data = await Bill.find();
        res.send(data);
      } catch (e) {
        console.log(e);
        res.json({ success: true });
      }
})

router.post('/createBill', async (req,res) => {
     let id = req.body.id;
     console.log(id);
     try {
        let data = await Bill.findOne({bill_id : id});
        if(data){
          console.log('existing data');
          return res.json({ success: false });
        }else{
          await Bill.create({
            bill_id : req.body.id,
            products : req.body.products,
            discount : req.body.discount,
            total : req.body.total,
            Date : req.body.Date
        });
        console.log('new data');
        return res.json({ success: true });
        }
      } catch (error) {
        console.log(error);
        return res.json({ success: false });
      }
})

router.get('/lastBill', async (req, res) => {
  try {
    const lastBill = await Bill.findOne().sort({ _id: -1 }).limit(1);
    if (lastBill) {
      res.json(lastBill);
    } else {
      res.status(404).json({ message: 'No bills found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})

module.exports = router;