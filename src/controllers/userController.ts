import axios from "axios";
import { Request, Response } from "express";

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

      return res.status(200).json(rate);
    } else {
      return res.status(500).send("Failed to fetch BTC to UAH rate");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
