import { createSwaggerSpec } from "next-swagger-doc";

const apiDocumentation = {
  openapi: "3.0.0",
  info: {
    title: "Next.js API Routes Documentation",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
    },
  ],
};

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    definition: apiDocumentation,
    apiFolder: "app",
  });
  console.log("Generated Swagger Spec:", JSON.stringify(spec, null, 2));
  return spec;
};
