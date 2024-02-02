import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { newMetricSchema } from "../db/schema/metrics";
import connect from "../db/dbConnect";

const sgMail = require("@sendgrid/mail");
dotenv.config();
sgMail.setApiKey(`${process.env.API_KEY}`);

export const getRate = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://api.coinbase.com/v2/prices/BTC-UAH/buy");

    if (
      response.status === 200 &&
      response.data &&
      response.data.data &&
      response.data.data.amount
    ) {
      const rate = parseFloat(response.data.data.amount);

      const db = await connect();
      const metrics = await db.select().from(newMetricSchema).execute();

      if (metrics[0]?.exchangeRate !== null) {
        const exchangeRateValue = `${rate}`;

        const metricId = process.env.METRIC_ID;
        await db
          .update(newMetricSchema)
          .set({
            exchangeRate: exchangeRateValue,
          })
          .where(sql`${newMetricSchema.id} = ${metricId}`)
          .execute();
      }

      return res.status(200).json(rate);
    } else {
      return res.status(500).send("Failed to fetch BTC to UAH rate");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const postRate = async (req: Request, res: Response) => {
  const port = process.env.PORT || 7001;
  const getRateEndpoint = "/rate";
  const getAllEmailsEndpoint = "/emails";

  try {
    const response = await axios.get(`http://localhost:${port}/api${getRateEndpoint}`); //just for test using localhost
    const bitcoinRate = response.data;

    const emailsResponse = await axios.get(`http://localhost:${port}/api${getAllEmailsEndpoint}`);
    const emails = emailsResponse.data.emails;

    for (const emailObject of emails) {
      const { email } = emailObject;

      const msg = {
        to: `${email}`,
        from: `${process.env.EMAIL_FROM}`,
        subject: "Bitcoin Rate Update",
        text: `The current Bitcoin rate is ${bitcoinRate} UAH.`,
        html: `<p>The current Bitcoin rate is ${bitcoinRate} UAH.</p>`,
      };

      await sgMail.send(msg);

      const db = await connect();
      const metrics = await db.select().from(newMetricSchema).execute();

      if (metrics[0]?.sendCount !== null && metrics[0]?.exchangeRate !== null) {
        const sendCountValue = ++metrics[0].sendCount;
        const exchangeRateValue = `${bitcoinRate}`;

        const metricId = process.env.METRIC_ID;
        await db
          .update(newMetricSchema)
          .set({
            sendCount: sendCountValue,
            exchangeRate: exchangeRateValue,
          })
          .where(sql`${newMetricSchema.id} = ${metricId}`)
          .execute();
      }
    }

    return res.status(200).send("Rate successfully sent to active subscriptions");
  } catch (error) {
    const db = await connect();
    const metrics = await db.select().from(newMetricSchema).execute();

    if (metrics[0]?.sendErrorCount !== null) {
      const sendErrorCountValue = ++metrics[0].sendErrorCount;

      const metricId = process.env.METRIC_ID;
      await db
        .update(newMetricSchema)
        .set({
          sendErrorCount: sendErrorCountValue,
        })
        .where(sql`${newMetricSchema.id} = ${metricId}`)
        .execute();
    }

    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
