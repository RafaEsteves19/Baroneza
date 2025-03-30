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

//Storage

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

const loadData = () => {
  if (!fs.existsSync("data.json")) return [];
  return JSON.parse(fs.readFileSync("data.json", "utf8"));
};

const saveData = (data) => {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
};

//Password

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

  const data = loadData();
  data.push(newEntry);
  saveData(data);

  res.json({ success: true, data });
});

app.get("/data", (req, res) => {
  res.json(loadData());
});

app.delete("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);

    const data = loadData();
    const updatedData = data.filter((entry) => !entry.image.includes(filename));
    saveData(updatedData);

    res.json({ success: true, message: "Imagem deletada com sucesso" });
  } else {
    res.status(404).json({ success: false, message: "Arquivo não encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
