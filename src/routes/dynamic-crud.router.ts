import { Router } from "express";
import fs from "fs";
import path from "path";
import * as controller from "../controllers/dynamic-crud.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { AppError } from "../utils/AppError";

const router = Router();

// Load allowed resources from schema.json
const schemaPath = path.join(process.cwd(), "schema.json");
const schemaJson = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const allowedResources = Object.keys(schemaJson.tables);

// Middleware to whitelist resources
router.use("/:resource", (req, res, next) => {
  const { resource } = req.params;
  if (!allowedResources.includes(resource)) {
    return next(new AppError(`Resource ${resource} not found`, 404));
  }
  next();
});

/**
 * @swagger
 * tags:
 *   name: CRUD
 *   description: Dynamic CRUD operations for schema-defined resources
 */

/**
 * @swagger
 * /{resource}:
 *   get:
 *     summary: Get all items of a resource
 *     tags: [CRUD]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the resource (e.g., users, posts)
 *       - in: query
 *         name: _page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: _limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: _sort
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: _order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for full-text search
 *       - in: query
 *         name: _expand
 *         schema:
 *           type: string
 *         description: Query for expand data of parent
 *       - in: query
 *         name: _embed
 *         schema:
 *           type: string
 *         description: Query for expand data of children
 *     responses:
 *       200:
 *         description: A list of items
 *       404:
 *         description: Resource not found
 */
router.get("/:resource", controller.getResources);

/**
 * @swagger
 * /{resource}/{id}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [CRUD]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The item details
 *       404:
 *         description: Item not found
 */
router.get("/:resource/:id", controller.getResourceById);

/**
 * @swagger
 * /{resource}:
 *   post:
 *     summary: Create a new item
 *     tags: [CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/:resource",
  authMiddleware,
  validateRequest(),
  controller.createResource,
);

/**
 * @swagger
 * /{resource}/{id}:
 *   put:
 *     summary: Update an item (Full update)
 *     tags: [CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.put(
  "/:resource/:id",
  authMiddleware,
  validateRequest(),
  controller.updateResource,
);

/**
 * @swagger
 * /{resource}/{id}:
 *   patch:
 *     summary: Update an item (Partial update)
 *     tags: [CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.patch(
  "/:resource/:id",
  authMiddleware,
  validateRequest(),
  controller.updateResource,
);

/**
 * @swagger
 * /{resource}/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted successfully
 */
router.delete(
  "/:resource/:id",
  authMiddleware,
  validateRequest(),
  controller.deleteResource,
);

export default router;
