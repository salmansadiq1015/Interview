import commentModel from "../model/commentModel.js";
import userModel from "../model/userModel.js";

// Create Comment
export const createComment = async (req, res) => {
  try {
    const { userId, channelId, rating, comment } = req.body;

    let avg = 0;
    const existingcomment = await commentModel.find({ channelId: channelId });

    const user = await userModel.findById(userId).select("name email");

    const comments = await commentModel.create({
      channelId: channelId,
      userName: user.name,
      userEmail: user.email,
      userId,
      rating,
      comment,
    });

    res.status(200).send({
      success: true,
      message: "Comment created successfully.",
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in create comment controller.",
    });
  }
};

// Get Comment

export const getComments = async (req, res) => {
  try {
    const comments = await commentModel.find({});

    res.status(200).send({
      success: true,
      message: "All Comments.",
      comments: comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in create comment controller.",
    });
  }
};

// Get Comment By Channels
export const getChannelComments = async (req, res) => {
  try {
    const channelId = req.params.id;
    const comments = await commentModel.find({ channelId: channelId });

    res.status(200).send({
      success: true,
      message: "All Comments.",
      comments: comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in create comment controller.",
    });
  }
};
