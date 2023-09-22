import { Controller } from "./Interface";
import { Request, Response } from "express";
import { Category } from "../entities/Category";
import { validate } from "class-validator";

export class CategoriesController implements Controller {
  // Get all categories
  async getAll(req: Request, res: Response) {
    try {
      const categorys = await Category.find();
      res.status(200).json(categorys);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  // Get category by Id
  async getOne(req: Request, res: Response) {
    const id: number = Number(req.params.id);
    try {
      const categorys = await Category.findOne({
        where: { id: id },
      });
      res.status(200).json(categorys);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  // Post new Category with class-validator
  async createOne(req: Request, res: Response) {
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
  }

  // Not working we have to delete or remove Ad from the category first
  async deleteOne(req: Request, res: Response) {
    try {
      const category = await Category.findOne({
        where: { id: Number(req.params.id) },
      });
      if (category) {
        await category.remove();
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    } catch (err: any) {
      // typeguards
      console.error(err);
      res.status(500).send();
    }
  }

  // Update Category by Id
  async patchOne(req: Request, res: Response) {
    try {
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
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }
}
