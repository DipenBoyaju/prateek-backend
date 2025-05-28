import express from "express";
import { addResearch, getAllResearch, getResearchById } from "../controllers/researchController.js";


const router = express.Router();

router.route("/allResearch").get(getAllResearch);
router.route("/division/slug/:slug").get(getResearchById)
router.route("/addResearch").post(addResearch)

export default router;