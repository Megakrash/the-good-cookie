import { Controller } from "./Interface";
import { Request, Response } from "express";
import { Ad } from "../entities/Ad";
import { Category } from "../entities/Category";
import { validate } from "class-validator";

export class AdsController implements Controller {
  // Get all ads
  async getAll(req: Request, res: Response) {
    try {
      const ads = await Ad.find({ relations: { category: true } });
      res.status(200).json(ads);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  // Get Ad by Id
  async getOne(req: Request, res: Response) {
    const id: number = Number(req.params.id);
    try {
      const ads = await Ad.findOne({
        where: { id: id },
        relations: { category: true },
      });
      res.status(200).json(ads);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  // Post new Ad with autoDate + class-validator
  async createOne(req: Request, res: Response) {
    const date: Date = new Date();
    const createdDate: string = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    const ad = new Ad();
    ad.title = req.body.title;
    ad.description = req.body.description;
    ad.owner = req.body.owner;
    ad.price = req.body.price;
    ad.createdDate = createdDate;
    ad.picture = req.body.picture;
    ad.location = req.body.location;
    ad.category = { id: req.body.categoryId } as Category;

    try {
      const errors = await validate(ad);
      if (errors.length > 0) {
        console.error(errors);
        res.status(400).json({ errors: errors });
      } else {
        await ad.save();
        res.status(200).send("New Ad successfully created");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  // Delete Ad by id
  async deleteOne(req: Request, res: Response) {
    try {
      const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });
      if (ad) {
        await ad.remove();
      }
      res.status(200).send("Ad were successfully deleted");
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  // Update Ad by Id
  async patchOne(req: Request, res: Response) {
    try {
      const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });

      if (ad) {
        Object.assign(ad, req.body, { id: ad.id });
        const errors = await validate(ad);
        if (errors.length === 0) {
          await ad.save();
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
