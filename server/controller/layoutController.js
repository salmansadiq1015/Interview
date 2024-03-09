import layoutModel from "../model/layoutModel.js";

// Create Layout
export const createLayout = async (req, res) => {
  try {
    const { type, logoImage, title } = req.body;
    const isExisting = await layoutModel.findOne({ type });
    if (isExisting) {
      return res
        .status(400)
        .send({ success: false, message: `${type} is already exist!` });
    }

    if (type === "Logo") {
      await layoutModel.create({ type: "Logo", logo: { logoImage, title } });
    }
    // For FAQ
    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItem = await Promise.all(
        faq.map(async (item) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );

      await layoutModel.create({ type: "FAQ", faq: faqItem });
    }

    res.status(200).send({
      success: true,
      message: "Layout created successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create layout",
      error,
    });
  }
};

// Edit Layout
export const editLayout = async (req, res) => {
  try {
    const { type, logoImage, title } = req.body;
    const layoutData = await layoutModel.findOne({ type });

    if (!layoutData) {
      return res
        .status(400)
        .send({ success: false, message: `${type} not found!` });
    }

    if (type === "Logo") {
      await layoutModel.findByIdAndUpdate(
        layoutData._id,
        {
          logo: { logoImage, title },
        },
        { new: true }
      );
    }
    // For FAQ
    if (type === "FAQ") {
      const { faq } = req.body;

      const faqItem = await layoutModel.findOne({ type: "FAQ" });
      const faqItems = await Promise.all(
        faq.map(async (item) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );

      await layoutModel.findByIdAndUpdate(
        faqItem._id,
        { type: "FAQ", faq: faqItems },
        { new: true }
      );
    }

    res.status(200).send({
      success: true,
      message: "Layout updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create layout",
      error,
    });
  }
};

// Get Layout
export const getLayout = async (req, res) => {
  try {
    const { type } = req.params;
    const layoutData = await layoutModel.findOne({ type });

    res.status(200).send({
      success: true,
      layoutData: layoutData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create layout",
      error,
    });
  }
};
