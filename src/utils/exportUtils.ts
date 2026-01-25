// Export utilities for generating CSV, PDF-like reports, and data downloads

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
}

// Generate CSV content from data
export const generateCSV = (data: ExportData): string => {
  const headerRow = data.headers.join(",");
  const dataRows = data.rows.map((row) =>
    row.map((cell) => {
      const cellStr = String(cell);
      // Escape quotes and wrap in quotes if contains comma
      if (cellStr.includes(",") || cellStr.includes('"')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(",")
  );
  return [headerRow, ...dataRows].join("\n");
};

// Download file helper
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download CSV
export const downloadCSV = (data: ExportData, filename: string) => {
  const csv = generateCSV(data);
  downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
};

// Generate printable HTML report
export const generatePrintableReport = (title: string, content: string, styles?: string) => {
  const defaultStyles = `
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1a1a2e; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
    h2 { color: #374151; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
    th { background-color: #f3f4f6; font-weight: 600; }
    .total-row { font-weight: bold; background-color: #f9fafb; }
    .header-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0ea5e9; }
    .meta { color: #6b7280; font-size: 14px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
    @media print { body { padding: 20px; } }
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>${styles || defaultStyles}</style>
    </head>
    <body>
      <div class="header-info">
        <div class="logo">MediCare Pro</div>
        <div class="meta">Generated: ${new Date().toLocaleString()}</div>
      </div>
      <h1>${title}</h1>
      ${content}
      <div class="footer">
        <p>MediCare Pro Hospital Management System</p>
        <p>This is a computer-generated document. No signature required.</p>
      </div>
    </body>
    </html>
  `;
};

// Open print dialog with HTML content
export const printReport = (title: string, content: string) => {
  const html = generatePrintableReport(title, content);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

// Generate invoice HTML for printing/PDF
export const generateInvoiceHTML = (invoice: {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  status: string;
}) => {
  const itemsHTML = invoice.items
    .map(
      (item) => `
      <tr>
        <td>${item.description}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
        <td style="text-align: right;">$${(item.quantity * item.unitPrice).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div style="margin-bottom: 30px;">
      <p><strong>Invoice #:</strong> ${invoice.id}</p>
      <p><strong>Status:</strong> <span style="text-transform: capitalize;">${invoice.status}</span></p>
    </div>
    
    <h2>Patient Information</h2>
    <p><strong>Name:</strong> ${invoice.patientName}</p>
    <p><strong>Patient ID:</strong> ${invoice.patientId}</p>
    
    <h2>Invoice Details</h2>
    <p><strong>Issue Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
    <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
    
    <h2>Items</h2>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>
    
    <table style="width: 300px; margin-left: auto;">
      <tr>
        <td>Subtotal:</td>
        <td style="text-align: right;">$${invoice.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Tax (10%):</td>
        <td style="text-align: right;">$${invoice.tax.toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td>Total:</td>
        <td style="text-align: right;">$${invoice.total.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Paid:</td>
        <td style="text-align: right; color: #22c55e;">$${invoice.paid.toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td>Balance Due:</td>
        <td style="text-align: right; color: ${invoice.total - invoice.paid > 0 ? "#ef4444" : "#22c55e"};">
          $${(invoice.total - invoice.paid).toFixed(2)}
        </td>
      </tr>
    </table>
  `;
};

// Patient report data
export const generatePatientReportData = (patients: Array<{
  id: string;
  name: string;
  department: string;
  status: string;
  admissionDate: string;
}>) => {
  return {
    headers: ["Patient ID", "Name", "Department", "Status", "Admission Date"],
    rows: patients.map((p) => [p.id, p.name, p.department, p.status, p.admissionDate]),
    title: "Patient Summary Report",
  };
};

// Financial report HTML
export const generateFinancialReportHTML = (data: {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  pendingPayments: number;
  monthlyData: { month: string; revenue: number; expenses: number }[];
}) => {
  const monthlyRows = data.monthlyData
    .map(
      (m) => `
      <tr>
        <td>${m.month}</td>
        <td style="text-align: right;">$${m.revenue.toLocaleString()}</td>
        <td style="text-align: right;">$${m.expenses.toLocaleString()}</td>
        <td style="text-align: right;">$${(m.revenue - m.expenses).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  return `
    <h2>Financial Summary</h2>
    <table style="width: 400px;">
      <tr>
        <td>Total Revenue:</td>
        <td style="text-align: right; color: #22c55e;"><strong>$${data.totalRevenue.toLocaleString()}</strong></td>
      </tr>
      <tr>
        <td>Total Expenses:</td>
        <td style="text-align: right; color: #ef4444;"><strong>$${data.totalExpenses.toLocaleString()}</strong></td>
      </tr>
      <tr class="total-row">
        <td>Net Income:</td>
        <td style="text-align: right;"><strong>$${data.netIncome.toLocaleString()}</strong></td>
      </tr>
      <tr>
        <td>Pending Payments:</td>
        <td style="text-align: right; color: #f59e0b;">$${data.pendingPayments.toLocaleString()}</td>
      </tr>
    </table>
    
    <h2>Monthly Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th style="text-align: right;">Revenue</th>
          <th style="text-align: right;">Expenses</th>
          <th style="text-align: right;">Net</th>
        </tr>
      </thead>
      <tbody>
        ${monthlyRows}
      </tbody>
    </table>
  `;
};

// Department report HTML
export const generateDepartmentReportHTML = (departments: Array<{
  name: string;
  patients: number;
  bedCapacity: number;
  occupiedBeds: number;
  staffCount: number;
}>) => {
  const rows = departments
    .map(
      (d) => `
      <tr>
        <td>${d.name}</td>
        <td style="text-align: center;">${d.patients}</td>
        <td style="text-align: center;">${d.occupiedBeds}/${d.bedCapacity}</td>
        <td style="text-align: center;">${Math.round((d.occupiedBeds / d.bedCapacity) * 100)}%</td>
        <td style="text-align: center;">${d.staffCount}</td>
      </tr>
    `
    )
    .join("");

  return `
    <h2>Department Performance Overview</h2>
    <table>
      <thead>
        <tr>
          <th>Department</th>
          <th style="text-align: center;">Patients</th>
          <th style="text-align: center;">Beds</th>
          <th style="text-align: center;">Occupancy</th>
          <th style="text-align: center;">Staff</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};
