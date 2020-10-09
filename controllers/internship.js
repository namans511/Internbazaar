const Internship = require("../models/internship");
const { validationResult } = require("express-validator/check");
const Student = require("../models/User");
const Employer = require("../models/Company");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// adding internships to database
exports.addInternships = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed ");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  var internshipType = req.body.internshipType;
  const title = req.body.title;
  const description = req.body.description;
  const stipend = req.body.stipend;
  const internshipPeriod = req.body.internshipPeriod;
  const companyName = req.body.companyName;
  const startDate = req.body.startDate;
  const applyBy = req.body.applyBy;
  const vacancy = req.body.vacancy;
  const skillsReq = req.body.skillsReq;
  const perks = req.body.perks;
  const whocanApply = req.body.whocanApply;
  var location = req.body.location;
  var creatorId = req.body.creatorId;
  location = String(location).toLowerCase();
  internshipType = String(internshipType).toLowerCase();

  // Employer.findById(creatorId).then((company) => {});

  const internship = new Internship({
    creatorId: creatorId,
    location: location,
    vacancy: vacancy,
    skillsReq: skillsReq,
    title: title,
    description: description,
    stipend: stipend,
    internshipPeriod: internshipPeriod,
    companyName: companyName,
    internshipType: internshipType,
    applyBy: applyBy,
    startDate: startDate,
    whocanApply: whocanApply,
    perks: perks,
    creatorId: creatorId,
  });
  let postedInternship;

  internship
    .save() // saving the internship in the databse
    .then((data) => {
      if (!data) {
        const error = new Error("Failed to post internship");
        error.statusCode = 422;
        error.data = {
          msg: "internship could not be saved",
          dataSent: internship,
        };
        throw error;
      }

      postedInternship = data;
      return Employer.findById(creatorId);
    })
    .then((employer) => {
      if (!employer) {
        const error = new Error("employer not found");
        error.statusCode = 422;
        error.data = {
          msg: "internship could not be saved",
          dataSent: internship,
        };
        throw error;
      }

      let internshipsPosted = [
        ...employer.internshipsPosted,
        postedInternship._id,
      ];
      employer.internshipsPosted = internshipsPosted;
      return employer.save(); // linking the internship with the employer
    })
    .then((data) => {
      if (!data) {
        const error = new Error("Failed to add internship to employer");
        error.statusCode = 422;
        error.data = {
          msg: "internship posted but could not be added to the employer",
          dataSent: internship,
        };
        throw error;
      }

      if (
        data.imageUrl != null ||
        data.imageUrl != undefined ||
        data.imageUrl
      ) {
        internship.creatorImage = data.imageUrl;
      }

      return internship.save();
    })
    .then((data) => {
      res.status(200).json({
        message: "Internship added",
        data: internship,
      });
    })
    .catch((err) => {
      // console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.rateInternship = (req, res, next) => {
  const internshipId = req.body.internshipId;
  const userId = req.body.userId;
  var newrating = req.body.rating;
  var ratevalue = newrating;
  var found = false;
  Internship.findById(internshipId).then((result) => {
    result.rater.forEach((rater) => {
      if (rater.raterId == userId) {
        rater.ratevalue = newrating;
        found = true;
      }
    });
    if (found == false) {
      var data = {
        raterId: userId,
        ratevalue: ratevalue,
      };

      result.rater.push(data);
    }

    var total = 0;
    result.rater.forEach((rater) => {
      total += rater.ratevalue;
    });
    console.log(total / result.rater.length);

    result.avgrating = total / result.rater.length;
    // result.rating.rater++;
    // result.rating.ratings.push(newrating);
    // result.rating.ratings[0] += result.rating.ratings[1];
    // result.rating.ratings.pop();
    // console.log(result.rating.ratings);
    result.save().then((data) => {
      res.status(200).json({
        message: "Rating added",
      });
    });
  });

  // var avgrating = ratings[0] / rater;
  // console.log(avgrating);
};

exports.getInternships = (req, res, next) => {
  Internship.find(req.query)
    .then((result) => {
      if (result.length === 0) {
        return res.status(422).json({
          message: "No such internships found",
        });
      }

      res.status(200).json({
        message: "Internships loaded",

        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.viewinternship = (req, res, next) => {
  const internshipId = req.params.internshipId;

  Internship.findById(internshipId)
    .then((data) => {
      // console.log("ABHAY", data);
      if (!data) {
        const error = new Error("No such internship exists");
        error.statusCode = 422;
        error.data = {
          value: null,
          msg: "Internship not found ",
          // param: internshipId,
          location: "viewinternship",
        };
        throw error;
      }

      res.status(200).json({
        message: "Internship Found",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.allinternships = (req, res, next) => {
  Internship.find({})
    .then((result) => {
      if (result.length === 0) {
        const error = new Error("No internship found");
        error.status = 401;
        throw error;
      }

      res.status(200).json({
        message: "All internships fetched",
        data: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.applyinternship = (req, res, next) => {
  const internshipId = req.body.internshipId;
  const userId = req.body.userId;
  // console.log(userId, internshipId);

  if (req.userType != "student") {
    const error = new Error("Apply internship failed, token unverified");
    error.statusCode = 502;
    error.data = {
      msg: "user not authorized, token not verified",
      param: "userType",
      value: req.userType,
      location: "updateProfile",
    };
    throw error;
  }

  Internship.findById(internshipId)
    .then((result) => {
      result.applications.forEach((application) => {
        // console.log(application.userId, userId);
        if (application.userId == userId) {
          const error = new Error("You have already applied");
          error.statusCode = 422;
          error.data = {
            userId: userId,
          };
          throw error;
        }
      });

      const application = {
        userId: userId,
        status: "Applied",
      };
      // console.log(result.applications);
      // console.log("abhay");
      const updatedapplications = [...result.applications, application];
      result.applications = updatedapplications;
      result.save();

      Student.findById(userId)
        .then((data) => {
          const appli = {
            internshipId: internshipId,
            status: "Applied",
            internshipProfile: result.title,
            companyName: result.companyName,
          };
          // console.log(data.applications);

          const updatedapplications = [...data.applications, appli];
          data.applications = updatedapplications;
          data.save();

          // console.log(internshipId);
          res.status(200).json({
            message: "Applied to this internship",
            data: {
              internshipId: internshipId,
              userId: userId,
            },
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.viewresume = (req, res, next) => {
  const userId = req.params.userId;
  // console.log(__dirname);

  let resumePath;
  Student.findById(userId)
    .then((data) => {
      // console.log("data1==" + data);
      const resumeName = "resume-" + userId + ".pdf";

      resumePath = path.join(__dirname, "../", "resume", resumeName);
      data.resume = "resume-" + userId + ".pdf";
      return data.save();
    })
    .then((data) => {
      // console.log("data2=");
      // const userPdf = createPdf(resumePath, data);
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(resumePath));
      // pdfDoc.pipe(res);

      pdfDoc.fontSize(22).text("Hello there , I am " + data.name, {
        underline: true,
      });
      pdfDoc.moveDown();
      // var imageUrl = "image/" + data.imageUrl;
      // pdfDoc.image("images/Logo.png", 180, 150, { fit: [100, 100] });

      // TODO:fix this image in pdf bug
      if (data.imageUrl != "" && data.imageUrl) {
        pdfDoc.image(data.imageUrl, 120, 110, { width: 100, height: 90 });
        pdfDoc.moveDown();
        pdfDoc.moveDown();
        pdfDoc.moveDown();
        pdfDoc.moveDown();
      }
      pdfDoc.fontSize(18).text("About Me", {
        underline: true,
      });

      pdfDoc.moveDown();

      pdfDoc.fontSize(15).text("" + data.about);

      pdfDoc.moveDown();

      pdfDoc.moveDown();

      pdfDoc.moveDown();
      pdfDoc.fontSize(18).text("Education", {
        underline: true,
      });

      pdfDoc.moveDown();
      pdfDoc.fontSize(15).text("" + data.education);
      pdfDoc.moveDown();
      pdfDoc.fontSize(18).text("Skills", {
        underline: true,
      });
      pdfDoc.moveDown();
      pdfDoc.fontSize(15).text("" + data.skills);
      pdfDoc.moveDown();
      pdfDoc.fontSize(18).text("Contact Me", {
        underline: true,
      });
      pdfDoc.moveDown();
      pdfDoc.fontSize(15).text("" + data.phone);
      pdfDoc.moveDown();
      pdfDoc.fontSize(18).text("Social media links", { underline: true });
      pdfDoc.fontSize(15).text(data.links);
      console.log(data);
      // console.log("outside pdf.end");
      // console.log("you can still do stuff after res");
      pdfDoc.end(() => {
        console.log("inside pdf.end");
      });
      res.status(200).json({ path: data.resume });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

function createPdf(resumePath, data) {
  const pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(resumePath));
  pdfDoc.pipe(res);

  pdfDoc.fontSize(22).text("Hello there , I am " + data.name, {
    underline: true,
  });
  pdfDoc.moveDown();
  // var imageUrl = "image/" + data.imageUrl;
  // pdfDoc.image("images/Logo.png", 180, 150, { fit: [100, 100] });

  // TODO:fix this image in pdf bug
  // pdfDoc.image(data.imageUrl, 120, 110, { width: 100, height: 90 });

  pdfDoc.moveDown();
  pdfDoc.moveDown();
  pdfDoc.moveDown();
  pdfDoc.moveDown();
  pdfDoc.moveDown();
  pdfDoc.fontSize(18).text("About Me", {
    underline: true,
  });

  pdfDoc.moveDown();

  pdfDoc.fontSize(15).text("" + data.about);

  pdfDoc.moveDown();

  pdfDoc.moveDown();
  pdfDoc.fontSize(18).text("About Me", {
    underline: true,
  });

  pdfDoc.moveDown();

  pdfDoc.moveDown();
  pdfDoc.fontSize(15).text("" + data.about);

  pdfDoc.moveDown();
  pdfDoc.fontSize(18).text("Education", {
    underline: true,
  });

  pdfDoc.moveDown();
  pdfDoc.fontSize(15).text("" + data.education);
  pdfDoc.moveDown();
  pdfDoc.fontSize(18).text("Skills", {
    underline: true,
  });
  pdfDoc.moveDown();
  pdfDoc.fontSize(15).text("" + data.skills);
  pdfDoc.moveDown();
  pdfDoc.fontSize(18).text("Contact Me", {
    underline: true,
  });
  pdfDoc.moveDown();
  pdfDoc.fontSize(15).text("" + data.phone);
  pdfDoc.moveDown();
  pdfDoc.fontSize(18).text("Social media links", { underline: true });
  pdfDoc.fontSize(15).text(data.links);
  console.log(data);
  console.log("outside pdf.end");
  // console.log("you can still do stuff after res");
  pdfDoc.end(() => {
    console.log("inside pdf.end");
  });
}

exports.updateInternship = (req, res, next) => {
  const id = req.body.internshipId;
  const data = req.body.data;
  // console.log(id);

  Internship.findById(id)
    .then((internship) => {
      if (!internship) {
        const error = new Error("Update request failed");
        error.statusCode = 422;
        error.data = {
          msg: "internship found",
          param: "internshipId",
          value: id,
          location: "updateinternship",
        };
        throw error;
      }

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key] != null) internship.set(key, data[key]);
        }
      }
      return internship.save();
    })
    .then((internship) => {
      // console.log(internship);
      res.status(200).json({
        message: "updated internship",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteInternship = (req, res, next) => {
  const id = req.body.internshipId;

  Internship.deleteOne({ _id: id })
    .then((result) => {
      res.status(200).json({
        msg: "Internship deleted",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
