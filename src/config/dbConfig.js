import moongoose from "mongoose";


export default async function connectDB() {
    try{
      await moongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected");
    }
    catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
}