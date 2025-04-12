const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listings/index.ejs", { alllisting });
};

module.exports.newFormRender = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!data) {
    req.flash("error", "Listing doesn't exist!");
    return res.redirect("/listings");
  }
  console.log(data);
  res.render("listings/show.ejs", { data });
};
module.exports.createListing = async (req, res, next) => {
  let place = req.body.listing.location;
  const mapToken = process.env.MAP_TOKEN;
  const result = await fetch(
    `https://us1.locationiq.com/v1/search?key=${mapToken}&q=${encodeURIComponent(
      place
    )}&format=json`
  );
  const data = await result.json();
  const latitide = data[0].lat;
  const longitude = data[0].lon;

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.coordinates = [longitude, latitide];
  await newListing.save();
  req.flash("success", "New Listing Created!");
  return res.redirect("/listings");
};
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  console.log("Original URL:", listing.image.url);
  console.log("Transformed URL:", originalImageUrl);
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstruct
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
};
module.exports.searchlisting = async (req, res) => {
  const query = req.query.q;
  const alllisting = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { country: { $regex: query, $options: "i" } },
    ],
  });
  res.render("listings/index.ejs", { alllisting });
};
