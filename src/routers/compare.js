const express = require("express");
const Compare = require("../models/compare");
const auth = require("../middleware/auth");
const util = require('util');
const router = new express.Router();
var fs = require('fs');

const stringSimilarity = require('string-similarity');
const Diff = require('diff');
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
    const result = `The percentage of similarity is ${compareData.percentage}%`
    res.send({result, message: {msgBody: `The percentage of similarity is ${compareData.percentage}%`, msgError: false }})

  } catch (e) {
    res
      .status(400)
      .send({ message: { msgBody: "System Failed", msgError: true }, e });
  }
});

router.get("/history", auth,  async (req, res) => {

try {
    const compareData = await Compare.find();
    let comaprisonData = [];
    compareData.forEach(value=>{
        comaprisonData.push({
            txt: `The comparism is between ${value.Student1.name} and ${value.Student2.name}  and the similarity is ${value.percentage}`,
            id: value._id
        })
    })
    res.send({comaprisonData})

  } catch (e) {
    res
      .status(400)
      .send({ message: { msgBody: "History not fetched", msgError: true }, e});
  }
});

router.post("/compare/:id", auth,  async (req, res) => {

try {
    const compareData = await Compare.find({
        _id: req.params.id
    });

   let result = `The comparism is between ${compareData[0].Student1.name} and ${compareData[0].Student2.name}  and the similarity is ${compareData[0].percentage}`
    res.send({Result: result})

  } catch (e) {
    res
      .status(400)
      .send({ message: { msgBody: "Did not fetched the result of the comparism", msgError: true }, e });
  }
});

router.post("/compare/run/:id", auth, async (req, res) => {
try {
     const compareData = await Compare.find({
        _id: req.params.id
    });
    console.log("value1");
    const {Student1, Student2} = compareData[0];;
    const similarity = stringSimilarity.compareTwoStrings(Student1.txt, Student2.txt);
    const percentage = Math.round(similarity*100);

   let result = `The comparism is between ${Student1.name} and ${Student2.name}  and the similarity is ${percentage}`

    res.send({result})

  } catch (e) {
    res
      .status(400)
      .send({ message: { msgBody: "Information not Created", msgError: true }, e });
  }
});


module.exports = router;
