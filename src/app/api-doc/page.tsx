import { getApiDocs } from "@/lib/swagger";
import { Box } from "@mui/material";
import SwaggerUI from "@/components/Swagger-UI";

export default async function ApiDoc() {
  const spec = await getApiDocs();
  return (
    <Box>
      <SwaggerUI spec={spec} />
    </Box>
  );
}
