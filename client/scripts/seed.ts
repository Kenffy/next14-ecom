import bcrypt from "bcryptjs";
import { createHash } from "crypto";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category, Product, User } from "@/schemas/models";
import { UsersData, CategoriesData } from "@/data/data";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

async function seedData() {
  try {
    await mongoDbConnection();
    console.log(`Seeding data started...`);

    const users = await User.find();
    //const products = await Product.find();
    const categories = await Category.find();

    if (users.length == 0) {
      console.log(`Seeding users data ...`);
      const userModels = [];
      for (const user of UsersData) {
        const password = user.isAdmin ? ADMIN_PASSWORD : user.password;
        const email = user.isAdmin ? ADMIN_EMAIL_ADDRESS : user.email;

        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = new User({
          ...user,
          email,
          id: hashValue(email),
          password: hashedPassword,
          shouldChangePassword: true,
          lastFailedAttempts: 0,
          totalFailedAttempts: 0,
        });
        userModels.push(userModel);
      }
      await User.insertMany(userModels);
    }

    if (categories.length == 0) {
      console.log(`Seeding categories data ...`);
      const categoryModels = [];
      for (const category of CategoriesData) {
        const categoryModel = new Category({
          ...category,
        });
        categoryModels.push(categoryModel);
      }
      await Category.insertMany(categoryModels);
    }

    // if(products.length == 0){
    //     console.log(`Seeding products data ...`);
    //     const productModels = [];
    //     for(const product of ProductsData){
    //         const productModel = new Product({
    //             ...product
    //         });
    //         productModels.push(productModel);
    //     }
    //     await Product.insertMany(productModels);
    // }
    console.log(`Seed data successfull.`);
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
  } finally {
    mongoose.disconnect();
  }
}

function hashValue(value: string) {
  const hash = createHash("sha256");
  hash.update(value);
  return hash.digest("hex");
}

async function mongoDbConnection() {
  try {
    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env"
      );
    }
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    throw new Error("Connection failed!");
  }
}

seedData();
