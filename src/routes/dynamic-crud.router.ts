import { Router } from "express";
import fs from "fs";
import path from "path";
import * as controller from "../controllers/dynamic-crud.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Load allowed resources from schema.json
const schemaPath = path.join(process.cwd(), "schema.json");
const schemaJson = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const allowedResources = Object.keys(schemaJson.tables);

// Middleware to whitelist resources
router.use("/:resource", (req, res, next) => {
  const { resource } = req.params;
  if (!allowedResources.includes(resource)) {
    return res.status(404).json({ error: `Resource '${resource}' not found.` });
  }
  next();
});

// GET is public (as per requirements for simplified platform)
router.get("/:resource", controller.getResources);

// POST, PUT, PATCH, DELETE are protected
router.post("/:resource", authMiddleware, controller.createResource);
router.put("/:resource/:id", authMiddleware, controller.updateResource);
router.patch("/:resource/:id", authMiddleware, controller.updateResource);
router.delete("/:resource/:id", authMiddleware, controller.deleteResource);

export default router;
