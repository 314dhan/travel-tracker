import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

pg.Client
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "postgres",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries")
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code)
  })
  console.log(countries);
  res.render("index.ejs", {countries: countries, total: countries.length});
});

app.post("/add", async (req, res) => {
  try {
    const newCountryCode = req.body.country; // Ambil data negara baru dari formulir

    // Periksa apakah negara tersebut sudah ada dalam database
    const checkCountry = await db.query("SELECT * FROM visited_countries WHERE country_code = $1", [newCountryCode]);

    if (checkCountry.rows.length > 0) {
      // Negara sudah ada, berikan respon sesuai kebutuhan (misalnya: negara sudah ada dalam database)
      res.send("Negara sudah ada dalam daftar");
    } else {
      // Negara belum ada, tambahkan ke database
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [newCountryCode]);

      // Berikan respon sesuai kebutuhan (misalnya: negara berhasil ditambahkan)
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisisted();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    })};
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
