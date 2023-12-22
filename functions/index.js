const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((req, res) => {
  return res.send("hello world");
});

// firebase functions to create a blog post

exports.createBlog = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body;
    const result = await admin.firestore().collection("blogs").add(data);

    return res.status(200).json({id: result.id});
  } catch (e) {
    return res.status(500).json({error: e.message});
  }
});

// function to update a specific blog
exports.updateBlog = functions.https.onRequest(async (req, res) => {
  try {
    const {id, ...data} = req.body;
    await admin.firestore().collection("blogs").doc(id).update(data);

    return res.status(200).json({message: "Blog updated"});
  } catch (e) {
    return res.status(500).json({error: e.message});
  }
});

// functions to fetch all the data from the cloud
exports.getAllBlogs = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("blogs").get();
    const blogs = [];
    snapshot.forEach((doc) => {
      blogs.push({id: doc.id, ...doc.data()});
    });
    return res.status(200).json(blogs);
  } catch (e) {
    return res.status(500).json({error: e.message});
  }
});

// functions to fetch a single blog
exports.getSingleBlog = functions.https.onRequest(async (req, res) => {
  try {
    const {id} = req.query;
    if (!id) {
      return res.status(400).json({error: "blog id is required"});
    }

    const blogDoc = await admin.firestore().collection("blogs").doc(id).get();

    if (!blogDoc.exists) {
      // .exists is provided by firestore
      // eslint-disable-next-line brace-style
      return res.status(404).json({error: "Blog not found!!!"});
    }

    const BlogData = {id: blogDoc.id, ...blogDoc.data()};
    return res.status(200).json(BlogData);
  } catch (e) {
    return res.status(500).json({error: e.message});
  }
});

// function to delete a blog

exports.deleteBlog = functions.https.onRequest(async (req, res) => {
  try {
    const {id} = req.query;
    if (!id) {
      return res.status(400).json({error: "Blog Id is required"});
    }

    await admin.firestore().collection("blogs").doc(id).delete();
    return res.status(200).json({message: "Blog removed"});
  } catch (e) {
    return res.send(500).json({error: e});
  }
});
