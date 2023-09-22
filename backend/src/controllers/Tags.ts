import { Controller } from "./Interface";
import { Request, Response } from "express";
import { Category } from "../entities/Category";
import { Tag } from "../entities/Tag";
import { validate } from "class-validator";

export class TagsController implements Controller {
  // Get all tags
  async getAll(req: Request, res: Response) {
    try {
      const tags = await Tag.find();
      res.status(200).json(tags);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  // Get tag by Id
  async getOne(req: Request, res: Response) {
    const id: number = Number(req.params.id);
    try {
      const tags = await Tag.findOne({
        where: { id: id },
      });
      res.status(200).json(tags);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  // Post new Tag with class-validator
  async createOne(req: Request, res: Response) {
    const tagName: string = req.body.name;
    const existingTag = await Tag.findOne({
      where: { name: tagName },
    });

    if (existingTag) {
      res.status(409).send("Tag name already in use");
    } else {
      const category = new Category();
      category.name = req.body.name;

      try {
        const errors = await validate(category);
        if (errors.length > 0) {
          res.status(400).json({ errors: errors });
        } else {
          await category.save();
          res.status(200).send("New Tag successfully created");
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  }

  // Not working we have to delete or remove Ad from the category first
  async deleteOne(req: Request, res: Response) {
    try {
      const tag = await Tag.findOne({
        where: { id: Number(req.params.id) },
      });
      if (tag) {
        await tag.remove();
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

  // Update Tag by Id
  async patchOne(req: Request, res: Response) {
    try {
      const tag = await Tag.findOne({
        where: { id: Number(req.params.id) },
      });
      if (tag) {
        Object.assign(tag, req.body, { id: tag.id });
        await tag.save();
      } else {
        res.status(404).send("Not found");
      }
      res.status(200).send("Tag were successfully updated");
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }
}
