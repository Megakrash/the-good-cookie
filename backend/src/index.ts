//-----------------------------------------
//-----------------EXPRESS-----------------
//-----------------------------------------

import express from "express";
import { Request, Response } from "express";

//-----------------------------------------
//-----------------DATABASE----------------
//-----------------------------------------

import sqlite3 from "sqlite3";
export const db = new sqlite3.Database("tgc.sqlite", (err) => {
  if (err) {
    console.warn("Error oppening database");
  } else {
    console.warn("Database SQLite connected 🍾");
  }
});

db.get("PRAGMA foreign_keys = ON;");

//-----------------------------------------
//-----------------SERVER-----------------
//-----------------------------------------

const app = express();

app.use(express.json());

const port = 5000;

//-----------------------------------------
//-----------------ADS---------------------
//-----------------------------------------

//-----------------GET---------------------

// Get all ads
app.get("/api/ads/", (req: Request, res: Response) => {
  db.all("SELECT * FROM Ad", (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
});

// Get Ad by Id
app.get("/api/ads/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  db.all("SELECT * FROM Ad WHERE id= $id", { $id: id }, (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
});

// Get all ads by location
app.get("/api/locations/ads/", (req: Request, res: Response) => {
  if (
    typeof req.query.location !== "string" ||
    req.query.location.trim() === ""
  ) {
    res.status(400).send({ error: "Invalid or missing location parameter." });
    return;
  }

  const selectedLocation = req.query.location;

  db.all(
    "SELECT * FROM Ad WHERE location= $location",
    {
      $location: selectedLocation,
    },
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      res.status(200).json(rows);
    }
  );
});

// Get Ads by one or more categoryId
app.get("/api/categoryIds/ads", (req: Request, res: Response) => {
  const categoryIdsString = req.query.categoryIds as string;

  if (!categoryIdsString) {
    res.status(400).send({ error: "categoryIds are required" });
    return;
  }

  const categoryIds: number[] = categoryIdsString.split(",").map(Number);

  const placeholders = categoryIds.map((id) => "?").join(",");
  const sql = `SELECT Ad.*, Category.name AS categoryName FROM Ad INNER JOIN Category ON Ad.category_id = Category.id WHERE Ad.category_id IN (${placeholders})`;

  db.all(sql, categoryIds, (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
});

// Get Ads by one or more categoryId and one or more location with category name
app.get("/api/categoryIds/locations/ads", (req: Request, res: Response) => {
  const categoryIdsString = req.query.categoryIds as string;
  const locationsString = req.query.locations as string;

  if (!categoryIdsString || !locationsString) {
    res
      .status(400)
      .send({ error: "Both categoryIds and locations are required" });
    return;
  }

  const categoryIds: number[] = categoryIdsString.split(",").map(Number);
  const locations: string[] = locationsString.split(",");

  const categoryPlaceholders = categoryIds.map((id) => "?").join(",");
  const locationPlaceholders = locations.map(() => "?").join(",");

  const sql = `
    SELECT Ad.*, Category.name AS categoryName 
    FROM Ad 
    INNER JOIN Category ON Ad.category_id = Category.id 
    WHERE Ad.category_id IN (${categoryPlaceholders}) 
    AND Ad.location IN (${locationPlaceholders})`;

  const parameters = [...categoryIds, ...locations];

  db.all(sql, parameters, (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
});

//-----------------DELETE------------------

// Remove ad by id
app.delete("/api/ads/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  db.run("DELETE FROM Ad WHERE id= $id", { $id: id }, (err) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.status(200).send({
      message: `Ad were successfully deleted`,
    });
  });
});

// Remove all entries whose price is higher than the given price
app.delete("/api/ads/maxprice", (req: Request, res: Response) => {
  if (typeof req.query.price !== "string") {
    res.status(400).send({
      error:
        "Price query parameter should be a string representation of a number.",
    });
    return;
  }
  const maxPrice = parseInt(req.query.price, 10);

  if (isNaN(maxPrice)) {
    res.status(400).send({ error: "Invalid price value provided" });
    return;
  }

  db.run("DELETE FROM Ad WHERE price > ?", [maxPrice], (err) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.send({
      message: `Ads with price greater than ${maxPrice} were successfully deleted`,
    });
  });
});

//-----------------PATCH-------------------

// Patch ad by id
app.patch("/api/ads/:id", (req: Request, res: Response) => {
  let query = "UPDATE Ad SET ";
  const allowedFields = [
    "title",
    "description",
    "price",
    "picture",
    "location",
    "category_id",
  ];
  const fields = Object.keys(req.body);
  for (const field of fields) {
    if (allowedFields.includes(field) === true) {
      query += field + "=?, ";
    } else {
      res.status(400).json({ message: `Field ${field} not allowed` });
      // this return prevents to go futher
      return;
    }
  }
  const queryWithoutLastComa = query.slice(0, query.length - 2);
  query = queryWithoutLastComa + " WHERE id=?";

  db.run(query, Object.values(req.body).concat([req.params.id]), (err) => {
    if (err) {
      res.status(500).send("Error occured");
    } else {
      res.status(204).send("Ad were successfully updated");
    }
  });
});

//-----------------POST--------------------

app.post("/api/ads", (req: Request, res: Response) => {
  const { title, description, owner, price, picture, location, category_id } =
    req.body;
  const date: Date = new Date();
  const createdDate: string = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  db.run(
    "INSERT INTO Ad(title, description, owner, price, created_Date, picture, location, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      description,
      owner,
      price,
      createdDate,
      picture,
      location,
      category_id,
    ],
    (err) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
      res.status(200).send({
        message: "New Ad were successfully created",
      });
    }
  );
});

//-----------------------------------------
//-----------------CATEGORY----------------
//-----------------------------------------

//-----------------GET---------------------

// Get all category
app.get("/api/category/", (req: Request, res: Response) => {
  db.all("SELECT * FROM Category", (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
});

// Get category by Id
app.get("/api/category/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  db.all("SELECT * FROM Category WHERE id= $id", { $id: id }, (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.status(200).json(rows);
  });
});

//-----------------DELETE---------------------

// Remove category by id
app.delete("/api/category/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  db.run("DELETE FROM Category WHERE id= $id", { $id: id }, (err) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.status(200).send({
      message: `Ad were successfully deleted`,
    });
  });
});

//-----------------POST--------------------

app.post("/api/category", (req: Request, res: Response) => {
  const { name } = req.body;

  // First check if this name alreday exist in Category
  db.get("SELECT id FROM Category WHERE name = ?", [name], (err, row) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }

    // If row is not undefined then the name already exists in Category
    if (row) {
      res.status(409).send({ error: "This category name already exists" });
      return;
    }

    db.run("INSERT INTO Category(name) VALUES (?)", [name], (insertErr) => {
      if (insertErr) {
        res.status(500).send({ error: insertErr.message });
        return;
      }
      res.status(200).send({
        message: "New Category was successfully created",
      });
    });
  });
});

//-----------------PATCH-------------------

// Patch category by id
app.patch("api/category/:id", (req: Request, res: Response) => {
  let query = "UPDATE Category SET ";
  const allowedFields = ["name"];
  const fields = Object.keys(req.body);
  for (const field of fields) {
    if (allowedFields.includes(field) === true) {
      query += field + "=?, ";
    } else {
      res.status(400).json({ message: `Field ${field} not allowed` });
      // this return prevents to go futher
      return;
    }
  }
  const queryWithoutLastComa = query.slice(0, query.length - 2);
  query = queryWithoutLastComa + " WHERE id=?";

  db.run(query, Object.values(req.body).concat([req.params.id]), (err) => {
    if (err) {
      res.status(500).send("Error occured");
    } else {
      res.status(204).send("Category were successfully updated");
    }
  });
});

app.listen(port, () => {
  console.warn(`Server is listening on port ${port} 👍`);
});
