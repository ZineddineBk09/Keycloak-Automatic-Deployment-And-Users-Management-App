'use client';
import Histories from "../../components/histories";
import { HistoryContextProvider } from "../../context/history";

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="w-full flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">
            Here you can see the error logs of your uploads.
          </p>
        </div>
      </div>
      <HistoryContextProvider>
        <Histories />
      </HistoryContextProvider>
    </div>
  );
}
