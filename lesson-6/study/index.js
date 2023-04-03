import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const url =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";
const client = new MongoClient(url);

const dbName = "my_database";

// async function main() {
//   await client.connect();
//   console.log("connected to mongodb");
//
//   const db = client.db(dbName);
//
//   const collection = await db.collection("students");
//   const result = await collection.find({}).toArray();
//
//   console.log(result);
//
//   return "done";
// }

async function main() {
  await mongoose.connect(url, {});

  const studentsSchema = new mongoose.Schema({
    name: {
      firstName: String,
      lastName: String,
    },
    grade: Number,
  });

  const Student = mongoose.model("Student", studentsSchema);

  const sasha = new Student({
    _id: new mongoose.Types.ObjectId(),
    name: {
      firstName: "Sasha",
      lastName: "Kumar",
    },
    grade: 3.5,
  });

  await sasha.save();

  console.log("connected to mongodb");

  return "done";
}
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());