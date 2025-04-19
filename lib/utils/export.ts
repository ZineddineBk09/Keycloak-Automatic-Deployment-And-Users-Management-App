export function downloadCSV(data: any[], filename: string) {
  // Convert objects to CSV format
  const csvContent = [
    // Headers
    Object.keys(data[0]).join(","),
    // Data rows
    ...data.map((item) =>
      Object.values(item)
        .map((value) => {
          // Handle arrays, objects, and null values
          if (Array.isArray(value)) {
            return `"${value.join(";")}"`;
          } else if (typeof value === "object" && value !== null) {
            return `"${JSON.stringify(value)}"`;
          }
          return `"${value ?? ""}"`;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
