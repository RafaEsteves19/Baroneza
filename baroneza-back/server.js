const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Load and Save Carousel

const loadCarousel = () => {
  if (!fs.existsSync("carousel.json")) return [];
  return JSON.parse(fs.readFileSync("carousel.json", "utf8"));
};

const saveCarousel = (data) => {
  fs.writeFileSync("carousel.json", JSON.stringify(data, null, 2));
};

// Load and Save NewComponents

const loadNewComponents = () => {
  if (!fs.existsSync("newcomponents.json")) return [];
  return JSON.parse(fs.readFileSync("newcomponents.json", "utf8"));
};

const saveNewComponents = (data) => {
  fs.writeFileSync("newcomponents.json", JSON.stringify(data, null, 2));
};

// Password

const encryptedPassword = bcrypt.hashSync("1234", 10);

function password(password) {
  return bcrypt.compare(password, encryptedPassword);
}

app.post("/verify-password", async (req, res) => {
  const { password: inputPassword } = req.body;
  const isValid = await password(inputPassword);
  if (isValid) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Senha incorreta" });
  }
});

// Carousel

app.post("/save", upload.single("image"), (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const newEntry = { image };

  const carousel = loadCarousel();
  carousel.push(newEntry);
  saveCarousel(carousel);

  res.json({ success: true, carousel });
});

app.get("/carousel", (req, res) => {
  res.json(loadCarousel());
});

app.delete("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);

    const carousel = loadCarousel();
    const updatedCarousel = carousel.filter((entry) => !entry.image.includes(filename));
    saveCarousel(updatedCarousel);

    res.json({ success: true, message: "Imagem deletada com sucesso" });
  } else {
    res.status(404).json({ success: false, message: "Arquivo não encontrado" });
  }
});

// NewComponents

app.post("/newcomponents/save", upload.single("image"), (req, res) => {
  const { title, text, link } = req.body;
  
  // Verifique se os dados estão sendo enviados corretamente
  if (!title || !text || !link) {
    return res.status(400).json({ success: false, message: "Título, texto e link são obrigatórios!" });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const newComponent = { title, text, link, image };

  const newcomponents = loadNewComponents();
  newcomponents.push(newComponent);
  saveNewComponents(newcomponents);

  res.json({ success: true, newcomponents });
});

app.get("/newcomponents", (req, res) => {
  res.json(loadNewComponents());
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
