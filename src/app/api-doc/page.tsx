import dynamic from "next/dynamic";

const SwaggerUI = dynamic(() => import("@/components/Swagger-UI"), {
  ssr: false,
});

export default function ApiDoc() {
  return <SwaggerUI />;
}
