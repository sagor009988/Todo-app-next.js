import { MongoClient } from "mongodb";

const uri= "mongodb+srv://todos:todo123@cluster0.kmm909o.mongodb.net/?appName=Cluster0"


const client = new MongoClient(uri);
  
export default client;