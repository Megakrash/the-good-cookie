import { Controller } from "./Interface";
import { Request, Response } from "express";
import { Like, LessThanOrEqual, MoreThan, In } from "typeorm";
import { Ad } from "../entities/Ad";
import { validate } from "class-validator";

export class AdsController extends Controller {
  // Get all ads with or not query
  getAll = async (req: Request, res: Response) => {
    const query = req.query;
    const where: any = {};

    // If query location
    if (query.location) {
      where.location = Like(`%${query.location}%`);
    }
    // If query title
    if (query.title) {
      where.title = Like(`%${query.title}%`);
    }
    // If query max price
    if (query.maxPrice) {
      where.price = LessThanOrEqual(query.maxPrice);
    }
    // If query min price
    if (query.minPrice) {
      where.price = MoreThan(query.minPrice);
    }
    // If query category
    if (typeof query.subCategory === "string") {
      const subCategories = query.subCategory.split(",");
      where.subCategory = In(subCategories);
    }

    // If query tag
    // if (typeof query.tags === "string") {
    //   const tags = query.tags.split(",");
    //   where.tags = In(tags);
    // }

    // Find Ad with query & relations
    const ads = await Ad.find({
      where: where,
      relations: {
        subCategory: true,
        tags: true,
      },
      order: {
        // price: "ASC",
        createdDate: "DESC",
      },
    });
    if (ads.length >= 1) {
      res.status(200).json(ads);
    } else {
      res.status(404).send("No ad found with this query");
    }
  };

  // Get one Ad by Id
  getOne = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    const ads = await Ad.findOne({
      where: { id: id },
      relations: {
        subCategory: true,
        tags: true,
      },
    });
    if (ads) {
      res.status(200).json(ads);
    } else {
      res.status(404).send("Not Found");
    }
  };

  // Post new Ad with autoDate + class-validator
  createOne = async (req: Request, res: Response) => {
    const date: Date = new Date();
    const createdDate: string = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    const ad = new Ad();
    ad.title = req.body.title;
    ad.description = req.body.description;
    ad.user = req.body.user;
    ad.price = req.body.price;
    ad.createdDate = createdDate;
    ad.updateDate = createdDate;
    ad.picture = req.body.picture;
    ad.location = req.body.location;
    ad.subCategory = req.body.subCategory;
    ad.tags = req.body.tags;

    const errors = await validate(ad);
    if (errors.length > 0) {
      console.error(errors);
      res.status(400).json({ errors: errors });
    } else {
      await ad.save();
      res.status(200).send("New Ad successfully created");
    }
  };

  // Delete Ad by id
  deleteOne = async (req: Request, res: Response) => {
    const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });
    if (ad) {
      await ad.remove();
    }
    res.status(200).send("Ad were successfully deleted");
  };

  // Update Ad by Id + auto updateDate +validator
  patchOne = async (req: Request, res: Response) => {
    const ad = await Ad.findOne({ where: { id: Number(req.params.id) } });

    if (ad) {
      const date: Date = new Date();
      const updateDate: string = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      Object.assign(ad, req.body, { id: ad.id }, { updateDate: updateDate });
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
  };
}
