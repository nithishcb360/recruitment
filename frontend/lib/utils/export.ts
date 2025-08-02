// Export utilities for analytics data

export interface ExportData {
  overview?: {
    activeJobs: number
    totalCandidates: number
    timeToFill: number
    costPerHire: number
    offerRate: number
  }
  applicationTrend?: Array<{ month: string; applications: number }>
  hiringFunnel?: Array<{ stage: string; count: number }>
  sourcePerformance?: Array<{ 
    name: string; 
    applications: number; 
    hires: number; 
    cost: number;
    conversionRate: number;
  }>
  timeToFill?: Array<{ department: string; days: number }>
}

export type ExportFormat = 'csv' | 'pdf' | 'excel'

// Convert data to CSV format
export function exportToCSV(data: ExportData, reportType: string): void {
  let csvContent = ''
  const timestamp = new Date().toISOString().split('T')[0]
  
  if (reportType === 'overview') {
    csvContent = 'Recruitment Analytics Report - Overview\n'
    csvContent += `Generated on: ${timestamp}\n\n`
    
    if (data.overview) {
      csvContent += 'Key Metrics\n'
      csvContent += 'Metric,Value\n'
      csvContent += `Active Jobs,${data.overview.activeJobs}\n`
      csvContent += `Total Candidates,${data.overview.totalCandidates}\n`
      csvContent += `Average Time to Fill,${data.overview.timeToFill} days\n`
      csvContent += `Cost per Hire,$${data.overview.costPerHire.toLocaleString()}\n`
      csvContent += `Offer Rate,${data.overview.offerRate}%\n\n`
    }
    
    if (data.applicationTrend) {
      csvContent += 'Application Trend\n'
      csvContent += 'Month,Applications\n'
      data.applicationTrend.forEach(item => {
        csvContent += `${item.month},${item.applications}\n`
      })
      csvContent += '\n'
    }
    
    if (data.hiringFunnel) {
      csvContent += 'Hiring Funnel\n'
      csvContent += 'Stage,Candidates\n'
      data.hiringFunnel.forEach(item => {
        csvContent += `${item.stage},${item.count}\n`
      })
    }
  } else if (reportType === 'sources') {
    csvContent = 'Recruitment Analytics Report - Source Performance\n'
    csvContent += `Generated on: ${timestamp}\n\n`
    
    if (data.sourcePerformance) {
      csvContent += 'Source,Applications,Hires,Conversion Rate,Cost per Hire\n'
      data.sourcePerformance.forEach(source => {
        csvContent += `${source.name},${source.applications},${source.hires},${source.conversionRate.toFixed(1)}%,$${source.cost.toLocaleString()}\n`
      })
    }
  } else if (reportType === 'time-to-fill') {
    csvContent = 'Recruitment Analytics Report - Time to Fill\n'
    csvContent += `Generated on: ${timestamp}\n\n`
    
    if (data.timeToFill) {
      csvContent += 'Department,Time to Fill (Days)\n'
      data.timeToFill.forEach(dept => {
        csvContent += `${dept.department},${dept.days}\n`
      })
    }
  }
  
  downloadFile(csvContent, `analytics-${reportType}-${timestamp}.csv`, 'text/csv')
}

// Convert data to Excel format (simplified CSV with .xlsx extension)
export function exportToExcel(data: ExportData, reportType: string): void {
  // For a real implementation, you'd use libraries like xlsx or exceljs
  // This is a simplified version that creates CSV content with Excel format
  exportToCSV(data, reportType)
  // In a real app, you'd generate proper Excel format here
}

// Convert data to PDF format
export function exportToPDF(data: ExportData, reportType: string): void {
  const timestamp = new Date().toISOString().split('T')[0]
  
  // For a real implementation, you'd use libraries like jsPDF or puppeteer
  // This creates a simplified HTML version that can be printed to PDF
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Analytics Report - ${reportType}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Recruitment Analytics Report</h1>
        <h2>${reportType.charAt(0).toUpperCase() + reportType.slice(1)}</h2>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
  `
  
  if (reportType === 'overview' && data.overview) {
    htmlContent += `
      <div class="section">
        <h3>Key Metrics</h3>
        <div class="metric"><span>Active Jobs:</span><span>${data.overview.activeJobs}</span></div>
        <div class="metric"><span>Total Candidates:</span><span>${data.overview.totalCandidates.toLocaleString()}</span></div>
        <div class="metric"><span>Average Time to Fill:</span><span>${data.overview.timeToFill} days</span></div>
        <div class="metric"><span>Cost per Hire:</span><span>$${data.overview.costPerHire.toLocaleString()}</span></div>
        <div class="metric"><span>Offer Rate:</span><span>${data.overview.offerRate}%</span></div>
      </div>
    `
    
    if (data.hiringFunnel) {
      htmlContent += `
        <div class="section">
          <h3>Hiring Funnel</h3>
          <table>
            <thead><tr><th>Stage</th><th>Candidates</th></tr></thead>
            <tbody>
      `
      data.hiringFunnel.forEach(item => {
        htmlContent += `<tr><td>${item.stage}</td><td>${item.count}</td></tr>`
      })
      htmlContent += '</tbody></table></div>'
    }
  }
  
  if (reportType === 'sources' && data.sourcePerformance) {
    htmlContent += `
      <div class="section">
        <h3>Source Performance</h3>
        <table>
          <thead><tr><th>Source</th><th>Applications</th><th>Hires</th><th>Conversion Rate</th><th>Cost per Hire</th></tr></thead>
          <tbody>
    `
    data.sourcePerformance.forEach(source => {
      htmlContent += `
        <tr>
          <td>${source.name}</td>
          <td>${source.applications}</td>
          <td>${source.hires}</td>
          <td>${source.conversionRate.toFixed(1)}%</td>
          <td>$${source.cost.toLocaleString()}</td>
        </tr>
      `
    })
    htmlContent += '</tbody></table></div>'
  }
  
  if (reportType === 'time-to-fill' && data.timeToFill) {
    htmlContent += `
      <div class="section">
        <h3>Time to Fill by Department</h3>
        <table>
          <thead><tr><th>Department</th><th>Time to Fill (Days)</th></tr></thead>
          <tbody>
    `
    data.timeToFill.forEach(dept => {
      htmlContent += `<tr><td>${dept.department}</td><td>${dept.days}</td></tr>`
    })
    htmlContent += '</tbody></table></div>'
  }
  
  htmlContent += `
    </body>
    </html>
  `
  
  // Create blob and download
  downloadFile(htmlContent, `analytics-${reportType}-${timestamp}.html`, 'text/html')
}

// Generic file download function
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object
  URL.revokeObjectURL(url)
}

// Main export function
export function exportAnalyticsReport(
  data: ExportData, 
  reportType: string, 
  format: ExportFormat
): void {
  switch (format) {
    case 'csv':
      exportToCSV(data, reportType)
      break
    case 'excel':
      exportToExcel(data, reportType)
      break
    case 'pdf':
      exportToPDF(data, reportType)
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}