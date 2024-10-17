"use client";

import { useEffect, useState } from "react";
import SwaggerUIReact from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerUI() {
  const [spec, setSpec] = useState<object | undefined>(undefined);

  useEffect(() => {
    fetch("/api/swagger")
      .then((response) => response.json())
      .then((data) => setSpec(data))
      .catch((error) => console.error("Error fetching Swagger spec:", error));
  }, []);

  if (!spec) {
    return <div>Loading API documentation...</div>;
  }

  return <SwaggerUIReact spec={spec} />;
}
