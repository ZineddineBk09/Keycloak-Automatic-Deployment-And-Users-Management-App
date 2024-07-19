import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Client } from "../../../../interfaces";

// define the schema for the request body
const schema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const req = await request.json();

  // check if the request body is valid
  const result = schema.safeParse(req);

  // if the request body is not valid or contains more than 2 keys
  if (Object.keys(req).length !== 2 || !result.success) {
    console.log("invalid request body");
    return NextResponse.json(
      {
        status: 400,
        data: {
          message: "invalid request body",
        },
      },
      { status: 400 }
    );
  }

  const { clientId, clientSecret } = req;

  // check if the client exist in the database
  let client = await prisma.client.findUnique({
    where: {
      clientId,
    },
  });

  // if the client does not exist
  if (!client) {
    console.log("client does not exist");

    return NextResponse.json(
      {
        status: 404,
        data: {
          message: "client does not exist",
        },
      },
      { status: 404 }
    );
  }

  // if the client exist and the clientSecret is correct
  if (client && (await bcrypt.compare(clientSecret, client.clientSecret))) {
    try {
      const { domain, realm, protocol } = {
        domain: client?.serverUrl,
        realm: client?.realmId,
        protocol: client?.authProtocol,
      };
      const url: string = `${domain}/realms/${realm}/protocol/${protocol}/token`;

      // request an access token from the keycloak server
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        }),
      });

      // return the response from the keycloak server
      return NextResponse.json(
        {
          status: response.status,
          data: await response.json(),
        },
        {
          status: response.status,
        }
      );
    } catch (err) {
      console.log("error loging client", err);
      return NextResponse.json(
        {
          status: 500,
          data: {
            message: "error loging client",
          },
        },
        { status: 500 }
      );
    }
  } else {
    // return an error
    console.log("client secret is incorrect");
    return NextResponse.json(
      {
        status: 401,
        data: {
          message: "client secret is incorrect",
        },
      },
      { status: 401 }
    );
  }
}
