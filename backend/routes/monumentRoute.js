import express from "express";
import { Monument } from "../models/monumentModel.js";
import multer from "multer";
import fs, { copyFileSync } from "fs";
import path from "path";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/coverimg/");
  },
  filename: function (req, file, cb) {
    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    // Append the random number to the original filename
    const modifiedFilename = randomNumber + "-" + file.originalname;
    cb(null, modifiedFilename);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("cover_image"), async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.shortdescription ||
      !request.body.description ||
      !request.body.nation ||
      !request.body.state ||
      !request.file ||
      !request.body.place
    ) {
      return response.status(400).send({
        message:
          "send all required fields : title , shortdescription ,file, description,place",
      });
    }

    const newmonument = {
      title: request.body.title,
      shortdescription: request.body.shortdescription,
      description: request.body.description,
      hst_chronology: request.body.hst_chronology,
      ipms_place: request.body.ipms_place,
      archi_imps: request.body.archi_imps,
      past_condition: request.body.past_condition,
      present_condition: request.body.present_condition,
      location: request.body.location,
      nation: request.body.nation,
      state: request.body.state,
      place: request.body.place,
      cover_image: request.file.path.replace("uploads\\", ""),
      user: request.body.user,
      status: request.body.status,
    };
    const monument = await Monument.create(newmonument);

    return response.status(201).send(monument);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
// route get all
router.get("/", async (request, response) => {
  try {
    const monument = await Monument.find();

    return response.status(200).json(monument);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
// route get one
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const monument = await Monument.findById(id);

    return response.status(200).json(monument);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
//update
router.put("/:id", upload.single("cover_image"), async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.shortdescription ||
      !request.body.description ||
      !request.body.nation ||
      !request.body.state ||
      !request.body.place
    ) {
      return response.status(400).send({
        message:
          "send all required fields : title , shortdescription , description",
      });
    }
    const { id } = request.params;
    const monument = await Monument.findById(id);
    if (!monument) {
      return response.status(404).json({ message: "Monument is not found" });
    }

    // Check if a new image or video is uploaded
    if (request.file) {
      // Delete previous image or video if exists
      if (monument.cover_image) {
        const imagePath = path.join(
          "uploads",
          "coverimg",
          monument.cover_image
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          } else {
            console.log("Image deleted successfully");
          }
        });
      }
      monument.cover_image = request.file.path.replace("uploads\\", ""); // Update image or video path with new file
    }
    monument.title = request.body.title;
    monument.shortdescription = request.body.shortdescription;
    monument.description = request.body.description;
    monument.nation = request.body.nation;
    monument.state = request.body.state;
    monument.place = request.body.place;
    monument.location = request.body.location;
    monument.hst_chronology = request.body.hst_chronology;
    monument.ipms_place = request.body.ipms_place;
    monument.past_condition = request.body.past_condition;
    monument.present_condition = request.body.present_condition;
    monument.archi_imps = request.body.archi_imps;
    // Save the updated monument
    await monument.save();

    // const result = await Monument.findByIdAndUpdate(id, request.body);
    // if (!result) {
    //   return response.status(404).json({ mesage: "monument not found " });
    // }
    return response
      .status(200)
      .json({ message: "Monument updated successfully" });
  } catch (error) {
    console.error(error.message);
    return response.status(500).send({ message: "Internal Server Error" });
  }
});

//delete
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Monument.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ mesage: "monument not found " });
    }

    const imagePath = path.join("uploads", "coverimg", result.cover_image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      } else {
        console.log("Image deleted successfully");
      }
    });

    return response
      .status(200)
      .json({ mesage: "monument deleted success fully " });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
