import express from "express";
import { addResearch, getAllResearch, getResearchById, updateResearchById } from "../controllers/researchController.js";


const router = express.Router();

router.route("/allResearch").get(getAllResearch);
router.route("/division/slug/:slug").get(getResearchById)
router.route("/addResearch").post(addResearch)
router.route("/research/update/:id").put(updateResearchById)

export default router;