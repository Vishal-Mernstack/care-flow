// Export utilities for generating CSV, PDF-like reports, and data downloads

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
}

export type ExportFormat = "csv" | "json" | "html";

// Generate CSV content from data
export const generateCSV = (data: ExportData): string => {
  const headerRow = data.headers.join(",");
  const dataRows = data.rows.map((row) =>
    row.map((cell) => {
      const cellStr = String(cell);
      // Escape quotes and wrap in quotes if contains comma
      if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(",")
  );
  return [headerRow, ...dataRows].join("\n");
};

// Generate JSON content from data
export const generateJSON = (data: ExportData): string => {
  const jsonData = data.rows.map((row) => {
    const obj: Record<string, string | number> = {};
    data.headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return JSON.stringify({
    title: data.title || "Export",
    exportDate: new Date().toISOString(),
    recordCount: data.rows.length,
    data: jsonData,
  }, null, 2);
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

// Download JSON
export const downloadJSON = (data: ExportData, filename: string) => {
  const json = generateJSON(data);
  downloadFile(json, `${filename}.json`, "application/json;charset=utf-8;");
};

// Professional report styles
const professionalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 40px;
    max-width: 900px;
    margin: 0 auto;
    color: #1f2937;
    background: #fff;
    line-height: 1.6;
  }
  
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 24px;
    border-bottom: 3px solid #0ea5e9;
    margin-bottom: 32px;
  }
  
  .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .logo-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: 700;
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #0ea5e9;
  }
  
  .logo-subtitle {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .meta-section {
    text-align: right;
    font-size: 13px;
    color: #6b7280;
  }
  
  .meta-section p {
    margin: 4px 0;
  }
  
  .report-id {
    font-weight: 600;
    color: #374151;
  }
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }
  
  .report-description {
    color: #6b7280;
    margin-bottom: 32px;
  }
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin: 32px 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  
  .summary-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }
  
  .summary-card-value {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
  }
  
  .summary-card-label {
    font-size: 13px;
    color: #6b7280;
    margin-top: 4px;
  }
  
  .summary-card.primary .summary-card-value {
    color: #0ea5e9;
  }
  
  .summary-card.success .summary-card-value {
    color: #22c55e;
  }
  
  .summary-card.warning .summary-card-value {
    color: #f59e0b;
  }
  
  .summary-card.danger .summary-card-value {
    color: #ef4444;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
  }
  
  th {
    background: #f3f4f6;
    font-weight: 600;
    text-align: left;
    padding: 14px 16px;
    border-bottom: 2px solid #e5e7eb;
    color: #374151;
  }
  
  td {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    color: #4b5563;
  }
  
  tr:hover td {
    background: #fafafa;
  }
  
  .total-row {
    font-weight: 600;
    background: #f9fafb;
  }
  
  .total-row td {
    border-top: 2px solid #e5e7eb;
    color: #111827;
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-success {
    background: #dcfce7;
    color: #166534;
  }
  
  .status-warning {
    background: #fef3c7;
    color: #92400e;
  }
  
  .status-danger {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .status-info {
    background: #dbeafe;
    color: #1e40af;
  }
  
  .footer {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    color: #9ca3af;
    font-size: 12px;
  }
  
  .footer p {
    margin: 4px 0;
  }
  
  .confidential-notice {
    background: #fef3c7;
    border: 1px solid #fcd34d;
    border-radius: 8px;
    padding: 12px 16px;
    margin-top: 16px;
    font-size: 12px;
    color: #92400e;
  }
  
  @media print {
    body {
      padding: 20px;
    }
    
    .report-header {
      margin-bottom: 24px;
    }
    
    @page {
      margin: 1cm;
    }
  }
`;

// Generate printable HTML report
export const generatePrintableReport = (title: string, content: string, description?: string) => {
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
  const currentDate = new Date();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - MediCare Pro</title>
      <style>${professionalStyles}</style>
    </head>
    <body>
      <div class="report-header">
        <div class="logo-section">
          <div class="logo-icon">M</div>
          <div>
            <div class="logo-text">MediCare Pro</div>
            <div class="logo-subtitle">Hospital Management System</div>
          </div>
        </div>
        <div class="meta-section">
          <p class="report-id">Report ID: ${reportId}</p>
          <p>Generated: ${currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p>Time: ${currentDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</p>
        </div>
      </div>
      
      <h1>${title}</h1>
      ${description ? `<p class="report-description">${description}</p>` : ''}
      
      ${content}
      
      <div class="footer">
        <p><strong>MediCare Pro</strong> - Hospital Management System</p>
        <p>123 Healthcare Ave, Medical City, MC 12345 | Tel: +1 800 MEDICARE | www.medicare.com</p>
        <p style="margin-top: 12px;">This is a computer-generated document. No signature required.</p>
        <div class="confidential-notice">
          <strong>⚠️ CONFIDENTIAL:</strong> This document contains sensitive healthcare information protected under HIPAA regulations. 
          Unauthorized access, use, or disclosure is strictly prohibited.
        </div>
      </div>
    </body>
    </html>
  `;
};

// Open print dialog with HTML content
export const printReport = (title: string, content: string, description?: string) => {
  const html = generatePrintableReport(title, content, description);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

// Download HTML report
export const downloadHTMLReport = (title: string, content: string, filename: string, description?: string) => {
  const html = generatePrintableReport(title, content, description);
  downloadFile(html, `${filename}.html`, "text/html;charset=utf-8;");
};

// Generate professional settings export
export const generateSettingsExportHTML = (data: {
  profile: { name: string; email: string; phone: string; role: string; department: string; employeeId: string };
  hospital: { name: string; address: string; phone: string; email: string; website: string };
  system: { theme: string; language: string; dateFormat: string; timeZone: string; currency: string };
  notifications: Record<string, boolean>;
}) => {
  const notificationRows = Object.entries(data.notifications)
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      return `
        <tr>
          <td>${label}</td>
          <td><span class="status-badge ${value ? 'status-success' : 'status-danger'}">${value ? 'Enabled' : 'Disabled'}</span></td>
        </tr>
      `;
    }).join('');

  return `
    <div class="summary-cards">
      <div class="summary-card primary">
        <div class="summary-card-value">5</div>
        <div class="summary-card-label">Settings Categories</div>
      </div>
      <div class="summary-card success">
        <div class="summary-card-value">${Object.values(data.notifications).filter(v => v).length}</div>
        <div class="summary-card-label">Active Notifications</div>
      </div>
      <div class="summary-card warning">
        <div class="summary-card-value">${data.system.theme.toUpperCase()}</div>
        <div class="summary-card-label">Current Theme</div>
      </div>
    </div>
    
    <h2>👤 Profile Information</h2>
    <table>
      <tr><td style="width: 200px; font-weight: 500;">Full Name</td><td>${data.profile.name}</td></tr>
      <tr><td style="font-weight: 500;">Email Address</td><td>${data.profile.email}</td></tr>
      <tr><td style="font-weight: 500;">Phone Number</td><td>${data.profile.phone}</td></tr>
      <tr><td style="font-weight: 500;">Role</td><td>${data.profile.role}</td></tr>
      <tr><td style="font-weight: 500;">Department</td><td>${data.profile.department}</td></tr>
      <tr><td style="font-weight: 500;">Employee ID</td><td>${data.profile.employeeId}</td></tr>
    </table>
    
    <h2>🏥 Hospital Information</h2>
    <table>
      <tr><td style="width: 200px; font-weight: 500;">Hospital Name</td><td>${data.hospital.name}</td></tr>
      <tr><td style="font-weight: 500;">Address</td><td>${data.hospital.address}</td></tr>
      <tr><td style="font-weight: 500;">Phone</td><td>${data.hospital.phone}</td></tr>
      <tr><td style="font-weight: 500;">Email</td><td>${data.hospital.email}</td></tr>
      <tr><td style="font-weight: 500;">Website</td><td>${data.hospital.website}</td></tr>
    </table>
    
    <h2>⚙️ System Settings</h2>
    <table>
      <tr><td style="width: 200px; font-weight: 500;">Theme</td><td>${data.system.theme.charAt(0).toUpperCase() + data.system.theme.slice(1)}</td></tr>
      <tr><td style="font-weight: 500;">Language</td><td>${data.system.language.toUpperCase()}</td></tr>
      <tr><td style="font-weight: 500;">Date Format</td><td>${data.system.dateFormat.toUpperCase()}</td></tr>
      <tr><td style="font-weight: 500;">Time Zone</td><td>${data.system.timeZone.toUpperCase()}</td></tr>
      <tr><td style="font-weight: 500;">Currency</td><td>${data.system.currency.toUpperCase()}</td></tr>
    </table>
    
    <h2>🔔 Notification Preferences</h2>
    <table>
      <thead>
        <tr>
          <th>Notification Type</th>
          <th style="width: 120px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${notificationRows}
      </tbody>
    </table>
  `;
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
      (item, index) => `
      <tr>
        <td style="text-align: center;">${index + 1}</td>
        <td>${item.description}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">$${item.unitPrice.toFixed(2)}</td>
        <td style="text-align: right;">$${(item.quantity * item.unitPrice).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const statusClass = invoice.status === 'paid' ? 'status-success' : 
                      invoice.status === 'pending' ? 'status-warning' : 'status-danger';

  return `
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-card-value">${invoice.id}</div>
        <div class="summary-card-label">Invoice Number</div>
      </div>
      <div class="summary-card primary">
        <div class="summary-card-value">$${invoice.total.toFixed(2)}</div>
        <div class="summary-card-label">Total Amount</div>
      </div>
      <div class="summary-card success">
        <div class="summary-card-value">$${invoice.paid.toFixed(2)}</div>
        <div class="summary-card-label">Amount Paid</div>
      </div>
      <div class="summary-card ${invoice.total - invoice.paid > 0 ? 'danger' : 'success'}">
        <div class="summary-card-value">$${(invoice.total - invoice.paid).toFixed(2)}</div>
        <div class="summary-card-label">Balance Due</div>
      </div>
    </div>
    
    <h2>Invoice Details</h2>
    <table>
      <tr>
        <td style="width: 150px; font-weight: 500;">Status</td>
        <td><span class="status-badge ${statusClass}">${invoice.status.toUpperCase()}</span></td>
      </tr>
      <tr>
        <td style="font-weight: 500;">Issue Date</td>
        <td>${new Date(invoice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
      </tr>
      <tr>
        <td style="font-weight: 500;">Due Date</td>
        <td>${new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
      </tr>
    </table>
    
    <h2>Patient Information</h2>
    <table>
      <tr>
        <td style="width: 150px; font-weight: 500;">Patient Name</td>
        <td>${invoice.patientName}</td>
      </tr>
      <tr>
        <td style="font-weight: 500;">Patient ID</td>
        <td>${invoice.patientId}</td>
      </tr>
    </table>
    
    <h2>Services & Items</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 50px; text-align: center;">#</th>
          <th>Description</th>
          <th style="width: 80px; text-align: center;">Qty</th>
          <th style="width: 120px; text-align: right;">Unit Price</th>
          <th style="width: 120px; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>
    
    <table style="width: 350px; margin-left: auto; margin-top: 24px;">
      <tr>
        <td style="font-weight: 500;">Subtotal</td>
        <td style="text-align: right;">$${invoice.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight: 500;">Tax (10%)</td>
        <td style="text-align: right;">$${invoice.tax.toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td style="font-weight: 600;">Total Amount</td>
        <td style="text-align: right; font-weight: 600;">$${invoice.total.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight: 500; color: #22c55e;">Amount Paid</td>
        <td style="text-align: right; color: #22c55e;">$${invoice.paid.toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td style="font-weight: 600; color: ${invoice.total - invoice.paid > 0 ? '#ef4444' : '#22c55e'};">Balance Due</td>
        <td style="text-align: right; font-weight: 600; color: ${invoice.total - invoice.paid > 0 ? '#ef4444' : '#22c55e'};">
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
        <td style="text-align: right; color: #22c55e;">$${m.revenue.toLocaleString()}</td>
        <td style="text-align: right; color: #ef4444;">$${m.expenses.toLocaleString()}</td>
        <td style="text-align: right; font-weight: 500;">${m.revenue - m.expenses >= 0 ? '+' : ''}$${(m.revenue - m.expenses).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="summary-cards">
      <div class="summary-card success">
        <div class="summary-card-value">$${data.totalRevenue.toLocaleString()}</div>
        <div class="summary-card-label">Total Revenue</div>
      </div>
      <div class="summary-card danger">
        <div class="summary-card-value">$${data.totalExpenses.toLocaleString()}</div>
        <div class="summary-card-label">Total Expenses</div>
      </div>
      <div class="summary-card primary">
        <div class="summary-card-value">$${data.netIncome.toLocaleString()}</div>
        <div class="summary-card-label">Net Income</div>
      </div>
      <div class="summary-card warning">
        <div class="summary-card-value">$${data.pendingPayments.toLocaleString()}</div>
        <div class="summary-card-label">Pending Payments</div>
      </div>
    </div>
    
    <h2>Monthly Financial Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th style="text-align: right;">Revenue</th>
          <th style="text-align: right;">Expenses</th>
          <th style="text-align: right;">Net Profit/Loss</th>
        </tr>
      </thead>
      <tbody>
        ${monthlyRows}
      </tbody>
      <tfoot>
        <tr class="total-row">
          <td><strong>Total</strong></td>
          <td style="text-align: right;"><strong>$${data.totalRevenue.toLocaleString()}</strong></td>
          <td style="text-align: right;"><strong>$${data.totalExpenses.toLocaleString()}</strong></td>
          <td style="text-align: right;"><strong>$${data.netIncome.toLocaleString()}</strong></td>
        </tr>
      </tfoot>
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
  const totalPatients = departments.reduce((sum, d) => sum + d.patients, 0);
  const totalBeds = departments.reduce((sum, d) => sum + d.bedCapacity, 0);
  const totalOccupied = departments.reduce((sum, d) => sum + d.occupiedBeds, 0);
  const totalStaff = departments.reduce((sum, d) => sum + d.staffCount, 0);
  
  const rows = departments
    .map(
      (d) => {
        const occupancy = Math.round((d.occupiedBeds / d.bedCapacity) * 100);
        const occupancyClass = occupancy > 90 ? 'status-danger' : occupancy > 70 ? 'status-warning' : 'status-success';
        return `
          <tr>
            <td style="font-weight: 500;">${d.name}</td>
            <td style="text-align: center;">${d.patients}</td>
            <td style="text-align: center;">${d.occupiedBeds}/${d.bedCapacity}</td>
            <td style="text-align: center;"><span class="status-badge ${occupancyClass}">${occupancy}%</span></td>
            <td style="text-align: center;">${d.staffCount}</td>
          </tr>
        `;
      }
    )
    .join("");

  return `
    <div class="summary-cards">
      <div class="summary-card primary">
        <div class="summary-card-value">${departments.length}</div>
        <div class="summary-card-label">Departments</div>
      </div>
      <div class="summary-card success">
        <div class="summary-card-value">${totalPatients}</div>
        <div class="summary-card-label">Total Patients</div>
      </div>
      <div class="summary-card warning">
        <div class="summary-card-value">${Math.round((totalOccupied / totalBeds) * 100)}%</div>
        <div class="summary-card-label">Avg Occupancy</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-value">${totalStaff}</div>
        <div class="summary-card-label">Total Staff</div>
      </div>
    </div>
    
    <h2>Department Performance Overview</h2>
    <table>
      <thead>
        <tr>
          <th>Department</th>
          <th style="text-align: center;">Patients</th>
          <th style="text-align: center;">Beds (Used/Total)</th>
          <th style="text-align: center;">Occupancy</th>
          <th style="text-align: center;">Staff</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr class="total-row">
          <td><strong>Total</strong></td>
          <td style="text-align: center;"><strong>${totalPatients}</strong></td>
          <td style="text-align: center;"><strong>${totalOccupied}/${totalBeds}</strong></td>
          <td style="text-align: center;"><strong>${Math.round((totalOccupied / totalBeds) * 100)}%</strong></td>
          <td style="text-align: center;"><strong>${totalStaff}</strong></td>
        </tr>
      </tfoot>
    </table>
  `;
};
