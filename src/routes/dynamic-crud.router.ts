import { Router } from "express";
import fs from "fs";
import path from "path";
import * as controller from "../controllers/dynamic-crud.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";

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
router.get("/:resource/:id", controller.getResourceById);

// POST, PUT, PATCH, DELETE are protected
router.post(
  "/:resource",
  authMiddleware,
  validateRequest(),
  controller.createResource,
);
router.put(
  "/:resource/:id",
  authMiddleware,
  validateRequest(),
  controller.updateResource,
);
router.patch(
  "/:resource/:id",
  authMiddleware,
  validateRequest(),
  controller.updateResource,
);
router.delete(
  "/:resource/:id",
  authMiddleware,
  validateRequest(),
  controller.deleteResource,
);

export default router;
