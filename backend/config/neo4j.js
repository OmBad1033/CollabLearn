import neo4j from "neo4j-driver";
import dotenv from "dotenv";
dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

export const connectNeo4j = async () => {
  try {
    await driver.verifyConnectivity();
    console.log("✅ Neo4j connected");
  } catch (err) {
    console.error("❌ Neo4j connection error:", err);
    process.exit(1);
  }
};

export const getNeo4jSession = () => {
  return driver.session({ database: process.env.NEO4J_DB });
};

export default driver;
