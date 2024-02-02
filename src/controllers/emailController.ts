import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import connect from "../db/dbConnect";
import { newUserSchema, TNewUser } from "../db/schema/users";

export const addEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const db = await connect();

    const existingemail = await db
      .select()
      .from(newUserSchema)
      .where(eq(newUserSchema.email, email))
      .execute();

    if (existingemail.length > 0) {
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

export const deleteEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const db = await connect();

    const users = await db
      .select()
      .from(newUserSchema)
      .where(eq(newUserSchema.email, email))
      .execute();

    if (users.length === 0) {
      return res.status(404).json({ error: "E-mail not found" });
    }

    await db.delete(newUserSchema).where(eq(newUserSchema.email, email)).execute();

    return res.status(200).send("E-mail deleted");
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getAllEmails = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const [emails] = await Promise.all([db.select().from(newUserSchema).execute()]);

    const formattedEmails = emails.map((userEmail) => {
      const { email, createdAt } = userEmail;
      return { email, createdAt };
    });

    return res.status(200).json({ emails: formattedEmails });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
