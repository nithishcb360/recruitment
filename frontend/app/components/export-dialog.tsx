"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Table, FileSpreadsheet, Loader2 } from "lucide-react"
import { exportAnalyticsReport, type ExportData, type ExportFormat } from "@/lib/utils/export"
import { useToast } from "@/hooks/use-toast"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  data: ExportData
  reportType: string
}

export default function ExportDialog({
  isOpen,
  onClose,
  data,
  reportType,
}: ExportDialogProps) {
  const { toast } = useToast()
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')
  const [includeSections, setIncludeSections] = useState({
    overview: true,
    charts: true,
    rawData: true,
    summary: true,
  })
  const [isExporting, setIsExporting] = useState(false)

  const formatOptions = [
    {
      value: 'csv' as ExportFormat,
      label: 'CSV (Comma Separated Values)',
      description: 'Best for spreadsheet applications and data analysis',
      icon: <Table className="h-5 w-5 text-green-600" />,
      fileSize: '~5-15 KB'
    },
    {
      value: 'excel' as ExportFormat,
      label: 'Excel Spreadsheet',
      description: 'Formatted spreadsheet with charts and styling',
      icon: <FileSpreadsheet className="h-5 w-5 text-blue-600" />,
      fileSize: '~20-50 KB'
    },
    {
      value: 'pdf' as ExportFormat,
      label: 'PDF Report',
      description: 'Professional report format for sharing and printing',
      icon: <FileText className="h-5 w-5 text-red-600" />,
      fileSize: '~50-200 KB'
    },
  ]

  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      // Filter data based on selected sections
      const exportData: ExportData = {}
      
      if (includeSections.overview && data.overview) {
        exportData.overview = data.overview
      }
      if (includeSections.charts) {
        exportData.applicationTrend = data.applicationTrend
        exportData.hiringFunnel = data.hiringFunnel
      }
      if (includeSections.rawData) {
        exportData.sourcePerformance = data.sourcePerformance
        exportData.timeToFill = data.timeToFill
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Perform the export
      exportAnalyticsReport(exportData, reportType, selectedFormat)
      
      toast({
        title: "Export Successful",
        description: `Your ${selectedFormat.toUpperCase()} report has been downloaded successfully.`,
        variant: "default"
      })
      
      onClose()
      
    } catch (error: any) {
      console.error('Export failed:', error)
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const selectedFormatInfo = formatOptions.find(f => f.value === selectedFormat)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Export Analytics Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Export Format</Label>
            <div className="grid gap-3">
              {formatOptions.map((format) => (
                <Card 
                  key={format.value}
                  className={`cursor-pointer transition-all ${
                    selectedFormat === format.value 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedFormat(format.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {format.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{format.label}</h4>
                          <span className="text-xs text-muted-foreground">{format.fileSize}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedFormat === format.value
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedFormat === format.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Content Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Include Sections</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overview"
                  checked={includeSections.overview}
                  onCheckedChange={(checked) =>
                    setIncludeSections(prev => ({ ...prev, overview: Boolean(checked) }))
                  }
                />
                <Label htmlFor="overview" className="text-sm">
                  Key Metrics Overview
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={includeSections.charts}
                  onCheckedChange={(checked) =>
                    setIncludeSections(prev => ({ ...prev, charts: Boolean(checked) }))
                  }
                />
                <Label htmlFor="charts" className="text-sm">
                  Chart Data (Trends, Funnel)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rawData"
                  checked={includeSections.rawData}
                  onCheckedChange={(checked) =>
                    setIncludeSections(prev => ({ ...prev, rawData: Boolean(checked) }))
                  }
                />
                <Label htmlFor="rawData" className="text-sm">
                  Detailed Performance Data
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="summary"
                  checked={includeSections.summary}
                  onCheckedChange={(checked) =>
                    setIncludeSections(prev => ({ ...prev, summary: Boolean(checked) }))
                  }
                />
                <Label htmlFor="summary" className="text-sm">
                  Executive Summary
                </Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          {selectedFormatInfo && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Export Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{selectedFormatInfo.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Report Type:</span>
                  <span className="font-medium capitalize">{reportType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Size:</span>
                  <span className="font-medium">{selectedFormatInfo.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sections:</span>
                  <span className="font-medium">
                    {Object.values(includeSections).filter(Boolean).length} of 4
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting || Object.values(includeSections).every(v => !v)}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}