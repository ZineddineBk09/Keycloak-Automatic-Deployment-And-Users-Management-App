import axios from "../../../lib/axios/keycloak";
import jwtDecode from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";
import { toast } from "sonner";
import { prisma } from "../../../db";

export async function GET(request: NextRequest) {
  const { data } = await axios.get(`/admin/realms/master/users`, {
    baseURL: "http://10.0.0.95",
    headers: {
      Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZU3hzWlZiX2FDRnpJN2xxTTR1YUVrRGdSY212ZUs4WkxZemxTNGN2NERVIn0.eyJleHAiOjE3MjE2MzkwMDMsImlhdCI6MTcyMTYzNzIwMywianRpIjoiY2U1M2ViM2MtNTlmNi00Y2U5LTkxNzktNzQxNzE1ODY0MWE2IiwiaXNzIjoiaHR0cDovLzEwLjAuMC45NS9yZWFsbXMvbWFzdGVyIiwiYXVkIjpbIm1hc3Rlci1yZWFsbSIsImFjY291bnQiXSwic3ViIjoiNGI4MzJlZjAtNGIwYS00NTdlLWE0NmUtNzg3OGYxMzE2NmFhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicmVzdC1hcGktY2xpZW50IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW1hc3RlciIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsibWFuYWdlLXVzZXJzIiwidmlldy11c2VycyIsInF1ZXJ5LWdyb3VwcyIsInF1ZXJ5LXVzZXJzIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJjbGllbnRIb3N0IjoiMTkyLjE2OC4yNTMuNSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXJlc3QtYXBpLWNsaWVudCIsImNsaWVudEFkZHJlc3MiOiIxOTIuMTY4LjI1My41IiwiY2xpZW50X2lkIjoicmVzdC1hcGktY2xpZW50In0.cW3LMOyDbq7BrO_HEnKjS81_MqL0RPed65dhZ-5OThnamfk5NqySrGWX93W8fd5j00TP5AXMm6rwrcZjRWv2Zg8swmT7btsvCISfxwpVXtbf-VHmM4Wbs41TzohgcYqtaZOAk5ZiFiuCCgRjqSb0uz6tbqi5FBy78OSEfSwmqVDwPVG5MM518QOGAvjvaInkkvpOMILLpjnJjCryfTPSAT41UAKgf0FAwnXi60ulmZw1UZZyI7SereqqGK6oaQl8ZacuOocdxqcm13RQQ-VD3FEzL611Pphc5-pqyVMVtJaUpHL6boIgyfWfTVOhXXhdpDijylIJxlO8kgHBOLVCJw`,
    },
  });

  return NextResponse.json(
    {
      status: 200,
      data: {
        message: "client found",
        data,
      },
    },
    { status: 200 }
  );
}
