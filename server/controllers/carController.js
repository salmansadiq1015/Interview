import cardataModel from "../models/cardataModel.js";

// Create New Car_Card
export const createNewRecord = async (req, res) => {
  try {
    const { userId, carModel, price, phone, city, images } = req.body;
    console.log(userId, carModel, price, phone, city, images);

    // Validation
    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "User_Id is required!" });
    }
    if (!carModel) {
      return res
        .status(400)
        .send({ success: false, message: "Car model is required!" });
    }
    if (!price) {
      return res
        .status(400)
        .send({ success: false, message: "Car price is required!" });
    }
    if (!phone) {
      return res
        .status(400)
        .send({ success: false, message: "Phone number is required!" });
    }
    if (!city) {
      return res
        .status(400)
        .send({ success: false, message: "City is required!" });
    }
    if (!images) {
      return res
        .status(400)
        .send({ success: false, message: "Images is required!" });
    }

    const carData = await cardataModel.create({
      userId,
      carModel,
      price,
      phone,
      city,
      images,
    });

    res.status(200).send({
      success: true,
      message: "New record added successfully",
      carData: carData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create card controller",
      error,
    });
  }
};

// Get All Records
export const getAllRecords = async (req, res) => {
  try {
    const carData = await cardataModel.find({});

    res.status(200).send({
      total: carData.lenght,
      success: true,
      message: "All car records",
      carData: carData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all records controller",
      error,
    });
  }
};
