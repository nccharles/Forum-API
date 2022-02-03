import { Router } from "express";
import path from "path";
const pages = Router();
pages
.get("/", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../UI/index.html")
    );
  })
  .get("/chat", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../UI/chat.html"
      )
    );
  })
export default pages;
