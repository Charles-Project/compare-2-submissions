const express = require("express");
const Compare = require("../models/compare");
const auth = require("../middleware/auth");
const util = require('util');
const router = new express.Router();
var fs = require('fs');

const stringSimilarity = require('string-similarity');
const upload = require("../utils/multer");

router.post("/compare", auth, upload.fields([
  { name: 'student1' },
  { name: 'student2'}
]), async (req, res) => {

const { student1,  student2 } = req.files;
try {
    const studentNote1 =  fs.readFileSync(student1[0].path, 'utf8');
    const studentNote2 =  fs.readFileSync(student2[0].path, 'utf8');
    const similarity = stringSimilarity.compareTwoStrings(studentNote1, studentNote2);
    const percentage = Math.round(similarity*100);

    let compare = new Compare({
         Student1:{
             name:req.body.studentName1,
             txt:studentNote1
         },
         Student2:{
             name:req.body.studentName2,
             txt:studentNote2
         },
         percentage:percentage,

    })

    const compareData = await compare.save();
    res.send({student1,  student2, compareData})

  } catch (e) {
    res
      .status(400)
      .send({ message: { msgBody: "Information not Created", msgError: true }, e });
  }
});

router.get("/history", auth,  async (req, res) => {

try {
    const compareData = await Compare.find();
    res.send({compareData})

  } catch (e) {
    res
      .status(400)
      .send({ message: { msgBody: "Information not Created", msgError: true }, e });
  }
});



module.exports = router;
