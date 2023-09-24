import { Controller } from "./Interface";
import { Like } from "typeorm";
import { Request, Response } from "express";
import { Tag } from "../entities/Tag";
import { validate } from "class-validator";

export class TagsController implements Controller {
  // Get all tags with or not query name
  async getAll(req: Request, res: Response) {
    try {
      const queryName = req.query.name;
      const where: any = {};

      // If query name
      if (queryName) {
        where.name = Like(`%${queryName}%`);
      }

      // Find Ad with query & relations
      const tags = await Tag.find({
        where: where,
      });
      if (tags.length >= 1) {
        res.status(200).json(tags);
      } else {
        res.status(404).send("No Tag found with this query");
      }
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
      const tag = new Tag();
      tag.name = req.body.name;

      try {
        const errors = await validate(tag);
        if (errors.length > 0) {
          res.status(400).json({ errors: errors });
        } else {
          await tag.save();
          res.status(200).send("New Tag successfully created");
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  }

  // Delete tag
  async deleteOne(req: Request, res: Response) {
    try {
      const tag = await Tag.findOne({
        where: { id: Number(req.params.id) },
      });
      if (tag) {
        await tag.remove();
        res.status(200).send("Tag successfully removed");
      } else {
        res.status(404).send("Not Found");
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).send();
    }
  }

  // Update Tag by Id
  async patchOne(req: Request, res: Response) {
    try {
      const tag = await Tag.findOne({ where: { id: Number(req.params.id) } });

      if (tag) {
        Object.assign(tag, req.body, { id: tag.id });
        const errors = await validate(tag);
        if (errors.length === 0) {
          await tag.save();
          res.status(200).send("Ad were successfully updated");
        } else {
          res.status(400).json({ errors: errors });
        }
      } else {
        res.status(404).send("Not found");
      }
    } catch (err: any) {
      res.status(500).send(err);
    }
  }
}
