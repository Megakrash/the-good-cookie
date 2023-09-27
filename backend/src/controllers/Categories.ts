import { Controller } from "./Interface";
import { Request, Response } from "express";
import { Category } from "../entities/Category";
import { validate } from "class-validator";

export class CategoriesController extends Controller {
  // Get all categories
  getAll = async (req: Request, res: Response) => {
    const categorys = await Category.find();
    res.status(200).json(categorys);
  };

  // Get category by Id
  getOne = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    const categorys = await Category.findOne({
      where: { id: id },
    });
    res.status(200).json(categorys);
  };

  // Post new Category with class-validator
  createOne = async (req: Request, res: Response) => {
    const categoryName: string = req.body.name;
    const existingCategory = await Category.findOne({
      where: { name: categoryName },
    });

    if (existingCategory) {
      res.status(409).send("Category name already in use");
    } else {
      const category = new Category();
      category.name = req.body.name;

      try {
        const errors = await validate(category);
        if (errors.length > 0) {
          res.status(400).json({ errors: errors });
        } else {
          await category.save();
          res.status(200).send("New Category successfully created");
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  };

  // Not working we have to delete or remove Ad from the category first
  deleteOne = async (req: Request, res: Response) => {
    const category = await Category.findOne({
      where: { id: Number(req.params.id) },
    });
    if (category) {
      await category.remove();
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  };

  // Update Category by Id
  patchOne = async (req: Request, res: Response) => {
    const cat = await Category.findOne({
      where: { id: Number(req.params.id) },
    });
    if (cat) {
      Object.assign(cat, req.body, { id: cat.id });
      await cat.save();
    } else {
      res.status(404).send("Not found");
    }
    res.status(200).send("Category were successfully updated");
  };
}
