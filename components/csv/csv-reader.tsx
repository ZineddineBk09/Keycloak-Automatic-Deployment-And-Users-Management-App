"use client";
import { useUsersContext } from "../../context/csv";
import React, { CSSProperties } from "react";
import { useCSVReader } from "react-papaparse";
import { User } from "../../interfaces";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TrashIcon, TableIcon } from "@radix-ui/react-icons";
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
  const { setUsers, users } = useUsersContext();

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
          const requiredCols = [
            "username",
            "firstName",
            "lastName",
            "email",
            "emailVerified",
            "enabled",
            "groups",
            "password",
          ];
          const missingCols = requiredCols.filter(
            (col) => !firstRow.includes(col)
          );
          console.log("firstRow", firstRow);
          if (
            !firstRow ||
            firstRow.length !== requiredCols.length ||
            missingCols.length > 0
          ) {
            toast.error("Missing columns: " + missingCols.join(", ") + ".");
            console.error("Incorrect header row");
            return;
          }
          // convert the data into an array of User objects, skipping the first row (header) and the last row (empty)
          const rows: User[] = results.data
            .slice(1, results.data?.length - 1)
            .map((user: any) => {
              return {
                username: user[0],
                firstName: user[1],
                lastName: user[2],
                email: user[3],
                emailVerified: user[4] === "true" ? true : false,
                enabled: user[5] === "true" ? true : false,
                groups: user[6].split(",").map((group: string) => group.trim()),
                credentials: [
                  {
                    type: "password",
                    value: user[7],
                    temporary: true,
                  },
                ],
                requiredActions: ["CONFIGURE_TOTP", "UPDATE_PASSWORD"],
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
        }: any) => (
          <>
            <div className="w-full flex items-center gap-x-6 m-auto">
              <Button variant="outline" type="button" {...getRootProps()}>
                Upload CSV
                <TableIcon
                  className="h-5 w-5 text-gray-500 ml-2"
                  aria-hidden="true"
                />
              </Button>

              <div className="flex-1">
                File: {acceptedFile && acceptedFile.name}
              </div>

              <Button
                variant="outline"
                {...getRemoveFileProps()}
                onClick={() => setUsers([])}
              >
                Clear
                <TrashIcon
                  className="h-6 w-6 text-red-500 ml-2"
                  aria-hidden="true"
                />
              </Button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      {users.length > 0 && <DataTable columns={columns} data={users} />}
    </div>
  );
};

export default CsvReader;
