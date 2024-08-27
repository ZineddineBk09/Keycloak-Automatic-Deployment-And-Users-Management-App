"use client";
import { useUsersContext } from "../../context/csv";
import React, { CSSProperties } from "react";
import { useCSVReader } from "react-papaparse";
import { User } from "../../interfaces";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  TrashIcon,
  TableIcon,
  FilePlusIcon,
  FileIcon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { toast } from "sonner";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  } as CSSProperties,

  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  } as CSSProperties,

  progressBarBackgroundColor: {
    backgroundColor: "#1e90ff",
  } as CSSProperties,
};

const CsvReader = () => {
  const { CSVReader } = useCSVReader();
  const { setUsers, setFileName, users } = useUsersContext();

  return (
    <div className="w-full">
      <CSVReader
        onUploadAccepted={(results: any) => {
          // results will be an object with the following structure:
          // {data: Array(3), errors: Array(0), meta: Array(0)}
          // data: Array(3)
          // 0: (7) ['username', 'firstName', 'lastName', 'email', 'emailVerified', 'enabled', 'groups']
          // 1: (7) ['llabdon0', 'Ludovika', 'Labdon', 'llabdon0@mysql.com', 'true', 'false', 'master']
          // ...etc
          // so now we need to convert this data into an array of objects
          // check if the first row is the header and is of the correct format and type User
          const firstRow = results.data[0];
          // ex first row:  ['username', 'password', 'firstName', 'lastName', 'email']
          // get indexes of deferent fields to assign the right values next
          const indexes = {
            username: firstRow.indexOf("username"),
            firstName: firstRow.indexOf("firstName"),
            lastName: firstRow.indexOf("lastName"),
            email: firstRow.indexOf("email"),
            password: firstRow.indexOf("password"),
            emailVerified: firstRow.indexOf("emailVerified"),
            enabled: firstRow.indexOf("enabled"),
            groups: firstRow.indexOf("groups"),
            requiredActions: firstRow.indexOf("requiredActions"),
          };

          const requiredCols = [
            "username",
            "firstName",
            "lastName",
            "email",
            "password",
            //"emailVerified",
            //"enabled",
            //"groups",
          ];

          const missingCols = requiredCols.filter(
            (col) => !firstRow.includes(col)
          );

          if (!firstRow || missingCols.length > 0) {
            toast.error("Missing columns: " + missingCols.join(", ") + ".");
            console.error("Incorrect header row");
            return;
          }

          // convert the data into an array of User objects, skipping the first row (header) and the last row (empty)
          const rows: User[] = results.data
            .slice(1, results.data?.length - 1)
            .map((user: any) => {
              return {
                username: indexes.username === -1 ? "" : user[indexes.username],
                firstName:
                  indexes.firstName === -1 ? "" : user[indexes.firstName],
                lastName: indexes.lastName === -1 ? "" : user[indexes.lastName],
                email: indexes.email === -1 ? "" : user[indexes.email],
                emailVerified:
                  user[indexes.emailVerified] === "true" ? true : false,
                enabled: user[indexes.enabled] === "true" ? true : false,
                groups: user[indexes.groups]
                  ? user[indexes.groups]
                      .split(",")
                      .map((group: string) => group.trim())
                  : [],
                credentials: [
                  {
                    type: "password",
                    value: user[indexes.password],
                    temporary: true,
                  },
                ],
                requiredActions: user[indexes.requiredActions]
                  ? user[indexes.requiredActions]
                      .split(",")
                      .map((action: string) => action.trim())
                  : [],
              } as User;
            });
          setUsers(rows);
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => {
          setFileName(acceptedFile?.name || "No file chosen");

          return (
            <>
              <div className="w-full flex items-center gap-x-6 m-auto">
                <Button variant="outline" type="button" {...getRootProps()}>
                  <FilePlusIcon
                    className="h-5 w-5 text-gray-500 mr-2"
                    aria-hidden="true"
                  />
                  Upload CSV
                </Button>

                <div className="flex-1 flex items-center">
                  <FileIcon
                    className="h-6 w-6 text-gray-500 mr-2"
                    aria-hidden="true"
                  />{" "}
                  File:{" "}
                  {acceptedFile && (
                    <span className="ml-2 rounded py-1 px-2 bg-gray-100">
                      {acceptedFile.name}
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  {...getRemoveFileProps()}
                  onClick={() => setUsers([])}
                >
                  <TrashIcon
                    className="h-6 w-6 text-red-500 mr-2"
                    aria-hidden="true"
                  />
                  Clear
                </Button>
              </div>
              <ProgressBar
                style={{
                  ...styles.progressBarBackgroundColor,
                  marginTop: "20px",
                }}
              />
            </>
          );
        }}
      </CSVReader>
      {users.length > 0 && <DataTable columns={columns} data={users} />}
    </div>
  );
};

export default CsvReader;
