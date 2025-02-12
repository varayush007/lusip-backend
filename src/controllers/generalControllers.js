
const Projects = require("../models/Project")
const Response = require("../models/Response")
const Teacher = require("../models/Teacher")
const Admin = require("../models/Admin")


const getAllProjectsController = async (req, res, next) => {
  
  try {
    let projects = await Projects.find({}).populate("teacherId").lean();
    projects = projects.map(projects => {
      return {
        ...projects,
        teacherDetails: projects.teacherId,
        teacherId: undefined
      };
    });
    res.send({projects})
  } catch (err) {
    res.status(500).send({message : "Error Fetching Data..."});
  }
};



const getAllResponseController = async (req, res, next) => {
  const {projectId} = req.body;
  try {
    let responses = await Response.find({projectId}).populate("studentId").lean();
    responses = responses.map(response => {
      return {
        ...response,
        studentDetails: response.studentId,
        studentId: undefined
      };
    });
    res.send({responses})
  } catch (err) {
    res.status(500).send("Error fetching data...");
  }
};



const getRegistrationStatus = async (req, res, next) => {
  try {
    let admin = await Admin.findOne({});
    if (!admin) {
      res.status(500).send({ message: "No admin found!" });
    }
    const status = admin.registrationStatus;
    res.send({ status: status });
  } catch (err) {
    res.status(500).send({ message: "Error Fetching Data..." });
  }
};

const getReport = async (req, res, next) => {
  try {
    let responses = await Response.find({})
      .populate("studentId")
      .populate({
        path: "projectId",
        populate: {
          path: "teacherId"
        }
      })
      .lean();


    responses = responses.map((response) => {
      return {
        ...response,
        studentDetails: response.studentId,
        projectDetails : response.projectId,
        studentId: undefined,
        projectId: undefined,
      };
    });

    responses = responses.map(item => {
      const { teacherId, ...rest } = item.projectDetails;
      return {
        ...item,
        projectDetails: {
          ...rest,
          teacherId: null,
          teacherDetails: teacherId
        }
      };
    });
    res.send({ responses : responses});
  } catch (err) {
    res.status(500).send({ message: "Error Fetching Data..." });
  }
};


module.exports = {
  getAllProjectsController,
  getAllResponseController,
  getRegistrationStatus,
  getReport
};


// [
//   {
//     _id: new ObjectId("6427fa98265d26f260c21615"),
//     studentId: undefined,
//     projectId: undefined,
//     responseStatus: true,
//     __v: 0,
//     studentDetails: {
//       _id: new ObjectId("641f662097492f2d41169682"),
//       name: 'sohel',
//       userId: new ObjectId("641f662097492f2d41169680"),
//       college: 'LNM',
//       year: '1st Year',
//       branch: 'CSE',
//       __v: 0
//     },
//     projectDetails: {
//       _id: new ObjectId("6427fa7e265d26f260c21600"),
//       name: 'Project1',
//       description: 'Project1 description',
//       teacherId: new ObjectId("641f67c6d603e773091bc362"),
//       modeOfExecution: 'Offline',
//       prerequists: 'None',
//       validYear: [Array],
//       validBranch: 'CSE',
//       __v: 0
//     }
//   }
// ]
