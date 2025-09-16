import { FastifyInstance } from "fastify";
import { addBlog, listBlog, deleteblog, updateBlog } from "./blog.handler";

export default async function blogRoutes(app: FastifyInstance) {
  app.post("/create", addBlog);
  app.get("/", listBlog);
  app.delete("/delete", deleteblog);
  app.put("/update", updateBlog);
}
