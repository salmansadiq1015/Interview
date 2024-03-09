import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import channelModel from "../model/channelModel.js";
import userModel from "../model/userModel.js";
import OrderModel from "../model/OrderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Webhook endpoint to listen for Stripe events
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Retrieve payment details
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );

      // Save payment details to the database
      const order = new OrderModel({
        sellerId: paymentIntent.metadata.sellerId,
        sellerName: paymentIntent.metadata.sellerName,
        sellerEmail: paymentIntent.metadata.sellerEmail,
        channelId: paymentIntent.metadata.channelId,
        channelName: paymentIntent.metadata.channelName,
        channelLink: paymentIntent.metadata.channelLink,
        paymentId: paymentIntent.id,
        price: paymentIntent.amount,
      });

      await order.save();
      console.log("Payment details saved:", order);
    } catch (error) {
      console.error("Error retrieving payment details:", error);
    }
  }

  res.status(200).end();
};

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { userId, channelId, price } = req.body;
    console.log(userId, channelId, price);
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User id is required!",
      });
    }
    if (!channelId) {
      return res.status(400).send({
        success: false,
        message: "Channel id is required!",
      });
    }
    if (!price) {
      return res.status(400).send({
        success: false,
        message: "Price is required!",
      });
    }
    // Get Channel
    const channel = await channelModel.findById({ _id: channelId });
    if (!channel) {
      return res.status(400).send({
        success: true,
        message: "Channel not found!",
      });
    }
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).send({
        success: true,
        message: "Sell User not found!",
      });
    }

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          unit_amount: price * 100,
          product_data: {
            name: channel.name,
            description: channel.channelLink,
          },
        },
        quantity: 1,
      },
    ];

    // Create Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.SUCCESS_URI}/success`,
      cancel_url: `${process.env.CANCEL_URI}/error`,
      metadata: {
        sellerId: channel.userId,
        sellerName: user.name,
        sellerEmail: user.email,
        channelId: channelId,
        channelName: channel.name,
        channelLink: channel.channelLink,
        price: price,
      },
    });

    res.json({ id: session.id });
    console.log("Session:", session);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({
      success: false,
      message: "Error in order controller.",
      error,
    });
  }
};
