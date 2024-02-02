import { Request, Response } from "express";
import * as promClient from "prom-client";
import connect from "../db/dbConnect";
import { newMetricSchema } from "../db/schema/metrics";

const register = new promClient.Registry();

const subscribeEmailCount = new promClient.Counter({
  name: "subscribe_email_count",
  help: "Number of subscribed emails",
});
register.registerMetric(subscribeEmailCount);

const unsubscribeEmailCount = new promClient.Counter({
  name: "unsubscribe_email_count",
  help: "Number of unsubscribed emails",
});
register.registerMetric(unsubscribeEmailCount);

const sendEmailCount = new promClient.Counter({
  name: "send_email_count",
  help: "Number of sent emails",
});
register.registerMetric(sendEmailCount);

const sendEmailErrorCount = new promClient.Counter({
  name: "send_email_error_count",
  help: "Number of email sending errors",
});
register.registerMetric(sendEmailErrorCount);

const exchangeRateGauge = new promClient.Gauge({
  name: "exchange_rate_gauge",
  help: "Current exchange rate of Bitcoin",
});
register.registerMetric(exchangeRateGauge);

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const db = await connect();

    const metric = await db.select().from(newMetricSchema).execute();

    const subscribeCount = metric[0]?.subscribeCount ?? 0;
    const unsubscribeCount = metric[0]?.unsubscribeCount ?? 0;
    const sendCount = metric[0]?.sendCount ?? 0;
    const sendErrorCount = metric[0]?.sendErrorCount ?? 0;
    const exchangeRateString = metric[0]?.exchangeRate;
    const exchangeRate = exchangeRateString !== null ? parseFloat(exchangeRateString) : 0;

    subscribeEmailCount.inc(subscribeCount);
    unsubscribeEmailCount.inc(unsubscribeCount);
    sendEmailCount.inc(sendCount);
    sendEmailErrorCount.inc(sendErrorCount);
    exchangeRateGauge.inc(exchangeRate);
    exchangeRateGauge.set(exchangeRate);

    const metrics = await register.metrics();

    res.setHeader("Content-Type", register.contentType);
    return res.status(200).send(metrics);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// export const addMetrics = async (req: Request, res: Response) => {
//   try {
//     const db = await connect();

//     const startMetric: TNewMetric = {
//       id: uuidv4(),
//       subscribeCount: 0,
//       unsubscribeCount: 0,
//       sendCount: 0,
//       sendErrorCount: 0,
//       exchangeRate: "1604348.78654257",
//     };

//     await db.insert(newMetricSchema).values(startMetric).execute();

//     return res.status(200).send("Metrics created successfully");
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send("Internal Server Error");
//   }
// };
