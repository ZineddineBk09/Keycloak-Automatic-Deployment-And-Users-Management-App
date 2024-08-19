"use client";
import { CloudDownloadIcon } from "lucide-react";
import CsvReader from "../../components/csv/csv-reader";
import { Button } from "../../components/ui/button";
import { UsersContextProvider } from "../../context/csv";

export default function UploadPage() {
  const downloadTemplate = () => {
    // download csv file in /public/mass_users_registeration_template_example.csv
    window.open("/mass_users_registeration_template_example.csv");
  };
  
  return (
    <UsersContextProvider>
      <div className="container mx-auto py-10">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-3xl font-bold mb-10">Upload CSV File</h1>

          <Button variant="default" onClick={downloadTemplate}>
            <CloudDownloadIcon className="mr-3" />
            <span>Download Template</span>
          </Button>
        </div>
        <CsvReader />
      </div>
    </UsersContextProvider>
  );
}
