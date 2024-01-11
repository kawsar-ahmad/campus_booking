const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");
const { Error } = require("./models/errorModel");
const { User } = require("./models/user.model");
const { OPTION } = require("./models/optionModel");
require("dotenv/config");
var http = require("http");
const { REQUEST } = require("./models/requestModel");
const server = http.createServer(app);
const xl = require("excel4node");
const wb = new xl.Workbook();
const ws = wb.addWorksheet("Worksheet Name");
const moment = require("moment");
const { Meal } = require("./models/meal.model");
var csv = require("csvtojson");

const multer = require("multer");
const { STUDENT } = require("./models/studentModel");
const { ADVISOR } = require("./models/teacherModel");
const studentStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `students.csv`);
  },
});

const advisorStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `advisors.csv`);
  },
});

const studentupload = multer({ storage: studentStorage });
const advisorupload = multer({ storage: advisorStorage });

const api = process.env.API_URL;
const ENV = process.env;

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.post("/file/student", studentupload.single("file"),async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }
  await parseStudentCsv();
  res.send(file);
});

async function parseStudentCsv() {
  csv()
    .fromFile("./uploads/students.csv")
    .then(function (jsonArrayObj) {
      jsonArrayObj.forEach(student=> {
        const newStd = new STUDENT({
          name: student.name,
          roll: student.roll,
          cgpa: parseFloat(student.cgpa).toFixed(2),
          series: student.series || "",
        });
        newStd.save();
      })
      
    });
}

app.post("/file/advisor", advisorupload.single("file"),async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }
  console.log('asdasd sdasdß')
  parseadvisorCsv();
  res.send(file);
});

async function parseadvisorCsv() {
  csv()
    .fromFile("./uploads/advisors.csv")
    .then(function (jsonArrayObj) {
      jsonArrayObj.forEach(advisor=> {
        const newStd = new ADVISOR({
          name: advisor.name,
          designation:advisor.designation
        });
        newStd.save();
      })
      
    });
}

app.post("/login", async (req, res) => {
  console.log('request',req.body)
  var user = await User.findOne({ email: req.body.email });
  if (user && user.password === req.body.password) {
    res.status(201).json(user);
  } else {
    res.status(500).json({
      error: "Wrong elami or password",
      success: false,
    });
  }
});

app.post("/create/student", async (req, res) => {
  const student = new STUDENT({
    name: req.body.name,
    roll: req.body.roll,
    cgpa: parseFloat(req.body.cgpa).toFixed(2),
    series: req.body.series || "",
  });
  student
    .save()
    .then((createdstudent) => {
      res.status(201).json(createdstudent);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

app.post("/signUp", async (req, res) => {
  const user = new User({
    email: req.body.email,
    roll: req.body.roll,
    password: req.body.password,
    role:'appuser',
    series: req.body.series || "",
  });
  user
    .save()
    .then((createdstudent) => {
      res.status(201).json(createdstudent);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});
async function saveUser() {
  const  student= new STUDENT({
    email: req.body.email,
    roll: req.body.roll,
    series: req.body.series || "",
  });
  student
    .save()
    .then((createdstudent) => {
    })
    .catch((err) => {
    });
}

app.get("/students", async (req, res) => {
  let students = await STUDENT.find();
  students.sort((a,b) => a.roll - b.roll)
  if (students.length) {
    res.status(201).json(students);
  } else {
    res.status(500).json({
      error: "NOT_FOUND",
      success: false,
    });
  }
});

app.post("/create/advisor", async (req, res) => {
  const advisor = new ADVISOR({
    name: req.body.name,
    designation:req.body.designation
  });
  console.log(advisor)
  advisor
    .save()
    .then((createdstudent) => {
      res.status(201).json(createdstudent);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

app.get("/advisors", async (req, res) => {
  [ajsdkjahdskjhasd]
  let advisors = await ADVISOR.find();
  if (advisors.length) {
    res.status(201).json(advisors);
  } else {
    res.status(500).json({
      error: "NOT_FOUND",
      success: false,
    });
  }
});

app.delete("/delete/student",async (req, res, next) => {
  let r = await STUDENT.remove({})
  res.status(201).json('deleted');
});

app.delete("/delete/advisors",async (req, res, next) => {
  let r = await ADVISOR.remove({})
  res.status(201).json('deleted');
});

app.get("/generate", async (req, res) => {
  let advisors = await ADVISOR.find();
  let students = await STUDENT.find()
  students.sort((a, b) => (a.cgpa > b.cgpa) ? 1 : -1)
  let len = advisors.length
  let slen = students.length
  let startIndex = 0
  let endIndex = len-1
  console.log(slen)
  let assign = {}
  advisors.forEach(advisor => {
      assign[advisor.name] = []
  })
  let props = Object.keys(assign)
  while(endIndex<slen-1){
    let newStudents = []
    for(let i=startIndex;i<=endIndex;i++) {
      newStudents.push(students[i])
    }
    let shuffledStudents = shuffle(newStudents)
    shuffledStudents.forEach((student,index) => {
        const prop = props[index]
        let stds = assign[prop]
        stds.push(student.roll)
        assign[prop]=stds
    })
    startIndex = endIndex+1
    endIndex = startIndex+len-1
    if(endIndex>=slen){
      endIndex = slen-1
    }
  }
  makeExcel(assign)
  // prepareData(advisors,stdarr)
  if (assign) {
    res.status(201).json(assign);
  } else {
    res.status(500).json({
      error: "NOT_FOUND",
      success: false,
    });
  }
});



function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}




const sendMail = () => {
  var recepents = process.env.TO.split(" ");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ENV.EMAIL_ADDRESS,
      pass: ENV.PASSWORD,
    },
  });

  var mailOptions = {
    from: ENV.EMAIL_ADDRESS,
    to: recepents,
    subject: "Students list for upcomming thesis",
    html: "",
    attachments: [
      {
        filename: "Students.xlsx",
        path: "./Students.xlsx",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const formatStudent = (students) => {
  let str = ''
  students.forEach(std => {
    if(std != undefined || std != null) {
      str =str + std + ", "
    }
  })
  return str
} 




const makeExcel = (assigns) => {
  let data=[]
  let keys = Object.keys(assigns)
  keys.forEach(key => {
    let obj = {
      advisor:key,
      students:formatStudent(assigns[key])
    }
    data.push(obj)
  })
  const headingColumnNames = ["Advisor", "Student List"];
  //Write Column Title in Excel file
  let headingColumnIndex = 1;
  headingColumnNames.forEach((heading) => {
    ws.cell(1, headingColumnIndex++).string(heading);
  });
  //Write Data in Excel file
  let rowIndex = 2;
  data.forEach((record) => {
    let columnIndex = 1;
    Object.keys(record).forEach((columnName) => {
      ws.cell(rowIndex, columnIndex++).string(record[columnName]);
    });
    rowIndex++;
  });
  const name = "Students";
  wb.write(name + ".xlsx");
  sendMail()
};

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(ENV.PORT, () => {
  console.log("server is running http://localhost:",ENV.PORT);
});
