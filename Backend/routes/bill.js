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

module.exports = router;