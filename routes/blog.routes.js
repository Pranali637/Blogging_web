const express=require("express")
const multer=require("multer")
const Blog=require("../models/Blog.models.js")
const router=express.Router();
const path=require("path")
const Comment=require("../models/comments.models.js")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`))
  },
  filename: function (req, file, cb) {
    const fileName=`${Date.now()}-${file.originalname}`
    cb(null,fileName)
  }
})

const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("Addblog",{
        user:req.user
    })
})
router.get("/blog/:id",async(req,res)=>{
  const blog=await Blog.findById(req.params.id).populate("createdBy");
  const comments=await Comment.find({blogId:req.params.id}).populate("createdBy")
if (!blog) {
    return res.status(404).send({message: "Blog not found"})
      }
  console.log("comments",comments)
  res.render("blog",{
    user:req.user,
    blogs:blog,
    comments,
  })
})
router.post("/comment/:blogId",async(req,res)=>{
  if (!req.user) {
    return res.status(401).send("Login required to comment");
  }
  const comment=await Comment.create({
    content:req.body.content,
    createdBy:req.user._id,
    blogId:req.params.blogId,
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})
router.post("/blog",upload.single("coverImage"),async(req,res)=>{
  if (!req.user) {
    return res.status(401).send("Login required");
  }
  const {title,body}=req.body;
    const blog=await Blog.create({
      title,
      body,
      createdBy:req.user._id,
      coverImageUrl:`/uploads/${req.file.filename}`
    }) 
    return res.redirect(`/blog/${blog._id}`);
})
module.exports=router;