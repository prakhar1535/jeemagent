import { createSwaggerSpec } from "next-swagger-doc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API with Swagger",
      version: "1.0.0",
      description: "API documentation for the Next.js app using App Router",
    },
  },
};

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    definition: options.definition,
    apiFolder: "src/app/api",
  });
  console.log("Generated Swagger Spec:", JSON.stringify(spec, null, 2));
  return spec;
};
