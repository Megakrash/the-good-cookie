import { Controller } from "./Interface";
import { Request, Response } from "express";
import { SubCategory } from "../entities/SubCategory";
import { validate } from "class-validator";
import fs from "fs";
import path from "path";

export class SubCategoriesController extends Controller {
  // Get all subCategories
  getAll = async (req: Request, res: Response) => {
    const subCategories = await SubCategory.find({
      relations: {
        category: true,
      },
    });
    res.status(200).json(subCategories);
  };

  // Get subCategories by Id
  getOne = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    const subCategory = await SubCategory.findOne({
      where: { id: id },
      relations: {
        category: true,
      },
    });
    res.status(200).json(subCategory);
  };

  // Post new subCategories with class-validator
  createOne = async (req: Request, res: Response) => {
    const subCategoryName: string = req.body.name;
    const existingSubCategory = await SubCategory.findOne({
      where: { name: subCategoryName },
    });

    if (existingSubCategory) {
      res.status(409).send("SubCategory name already in use");
    } else {
      const subCategory = new SubCategory();
      subCategory.name = req.body.name;
      subCategory.picture = req.body.picture;
      subCategory.category = req.body.category;

      try {
        const errors = await validate(subCategory);
        if (errors.length > 0) {
          res.status(400).json({ errors: errors });
        } else {
          await subCategory.save();
          res.status(200).send("New SubCategory successfully created");
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  };

  // Delete subCategory and his picture
  deleteOne = async (req: Request, res: Response) => {
    const subCategory = await SubCategory.findOne({
      where: { id: Number(req.params.id) },
    });
    if (subCategory) {
      try {
        if (
          fs.existsSync(
            `public/assets/images/subCategory/${subCategory.picture}`
          )
        ) {
          fs.unlinkSync(
            `public/assets/images/subCategory/${subCategory.picture}`
          );
        }
      } catch (error) {
        console.error("Error to delete subCategory picture:", error);
      }

      await subCategory.remove();
      res.status(200).send("SubCategory and his picture successfully deleted");
    } else {
      res.status(404).send();
    }
  };

  // Update Category by Id
  patchOne = async (req: Request, res: Response) => {
    const subCategory = await SubCategory.findOne({
      where: { id: Number(req.params.id) },
    });
    if (subCategory) {
      Object.assign(subCategory, req.body, { id: subCategory.id });
      await subCategory.save();
    } else {
      res.status(404).send("Not found");
    }
    res.status(200).send("SubCategory were successfully updated");
  };
}
