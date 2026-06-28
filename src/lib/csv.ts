export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
      row.push(cell.trim());
      cell = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
      if (ch === "\r") i++;
    } else if (ch === "\r") {
      row.push(cell.trim());
      cell = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c !== "")) rows.push(row);
  }

  return rows;
}

export function parseNumber(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") return null;
  const n = parseFloat(value.trim());
  return isNaN(n) ? null : n;
}

export function cell(row: string[] | undefined, index: number): string {
  if (!row || index >= row.length) return "";
  return (row[index] ?? "").trim();
}
