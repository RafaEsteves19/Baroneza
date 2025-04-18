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

const DATA_FILE = "data.json";

// Helpers
const loadData = () => {
  if (!fs.existsSync(DATA_FILE)) return { carousel: [], newcomponents: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Storage config
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

// Password logic
const encryptedPassword = bcrypt.hashSync("1234", 10);

function password(inputPassword) {
  return bcrypt.compare(inputPassword, encryptedPassword);
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

// CAROUSEL ROUTES
app.post("/save-carousel", upload.single("image"), (req, res) => {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const newEntry = { image };

  const data = loadData();
  data.carousel.push(newEntry);
  saveData(data);

  res.json({ success: true, carousel: data.carousel });
});

app.get("/carousel", (req, res) => {
  const data = loadData();
  res.json(data.carousel || []);
});

app.delete("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);

    const data = loadData();
    data.carousel = data.carousel.filter(entry => !entry.image.includes(filename));
    saveData(data);

    res.json({ success: true, message: "Imagem deletada com sucesso" });
  } else {
    res.status(404).json({ success: false, message: "Arquivo não encontrado" });
  }
});

// NEW COMPONENTS ROUTES
app.post("/newcomponents/save", upload.single("image"), (req, res) => {
  const { title, text, link } = req.body;

  if (!title || !text || !link) {
    return res.status(400).json({ success: false, message: "Título, texto e link são obrigatórios!" });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const newComponent = { title, text, link, image };

  const data = loadData();
  data.newcomponents.push(newComponent);
  saveData(data);

  res.json({ success: true, newcomponents: data.newcomponents });
});

app.get("/newcomponents", (req, res) => {
  const data = loadData();
  res.json(data.newcomponents || []);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
