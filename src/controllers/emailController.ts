import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import connect from "../db/dbConnect";
import { newUserSchema, TNewUser } from "../db/schema/users";

export const addEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const db = await connect();

    const existingUserEmail = await db
      .select()
      .from(newUserSchema)
      .where(eq(newUserSchema.email, email))
      .execute();

    if (existingUserEmail.length > 0) {
      return res.status(409).json({ error: "E-mail already exists" });
    }

    const newUser: TNewUser = {
      id: uuidv4(),
      email,
      createdAt: new Date().toISOString(),
    };

    await db.insert(newUserSchema).values(newUser).execute();

    return res.status(200).send("E-mail added");
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
