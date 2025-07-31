const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const multer = require("multer");
let img = '';
let editedImg = '';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/show", async (req, res) => {
  try {
    let product = await Product.find();
    res.send(product);
  } catch (error) {
    console.log(error);
  }
});



router.post("/upload", upload.single("file"), (req,res) => {
    let imgPath = req.file.path;
    img = imgPath.slice(14);
})

router.post("/add", async (req, res) => {
  try {
    await Product.create({
        name : req.body.name,
        img : img,
        price : req.body.price,
        quantity : req.body.quantity,
        category : req.body.category
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.post("/editimg", upload.single("file"), (req,res) => {
    let imgPath = req.file.path;
    editedImg = imgPath.slice(14);
    console.log(editedImg);
})

router.put("/update/:id", async (req, res) => {
  let { id } = req.params;
  let product = req.body;

  if(editedImg !== ''){
    product.img = editedImg;
  }
  console.log(product);
  try {
    let updatedProduct = await Product.findByIdAndUpdate(id, {...product});
    console.log(updatedProduct);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.delete("/delete/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let deleteProduct = await Product.findByIdAndDelete(id);
    console.log(deleteProduct);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

module.exports = router;
