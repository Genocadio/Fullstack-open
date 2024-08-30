import { Router } from "express";
import diagnosesData from "../data/diagonosesData";

const router = Router();

router.get("/", (_req, res) => {
    res.json(diagnosesData);
});

export default router;