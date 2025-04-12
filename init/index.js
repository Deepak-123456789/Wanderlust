const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dburl =
  "mongodb+srv://deepak80063:vxM!85BLF!VCg!w@cluster0.1mekrrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log(dburl);

main()
  .then(() => {
    console.log("Connected to mongo");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

const initBD = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    // owner: "67ef682464cf96a481eba70e",
    owner: "67f8a4910a84a9b4968d574e",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data inserted");
};

initBD();
