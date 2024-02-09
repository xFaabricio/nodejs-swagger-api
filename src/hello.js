import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import { pool } from "./db.js"; // Importe a pool de conexão corretamente

const router = express();

router.use(bodyParser.json()); // to use body object in requests
router.use(morgan("dev"));
router.use(cors());

router.set("view engine", "ejs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.set("views", path.join(__dirname, "views"));
router.set("view engine", "ejs");

router.use(express.static(path.join(__dirname, "views/pages")));

router.get("/", async (req, res) => {
  try {
    // Verifica se a conexão do banco de dados foi aberta
    console.log("Conexão do banco de dados aberta.");

    // Executa a consulta SQL
    const result = await pool.query("SELECT * FROM sh_user");
    
    // Imprime o resultado da consulta no console
    console.log("Resultado da consulta:", result.rows);

    // Renderiza a página com os dados recuperados do banco de dados
    res.render(path.join(__dirname, "views", "pages", "index"), { data: result.rows });
  } catch (error) {
    // Imprime o erro no console caso ocorra algum problema na consulta
    console.error("Erro ao consultar banco de dados:", error);
    res.status(500).send("Erro interno do servidor");
  }
});

export default router;