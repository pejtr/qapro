import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface ReportData {
  title: string;
  executionId: number;
  scriptName: string;
  status: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  logs: Array<{
    timestamp: number;
    level: string;
    message: string;
  }>;
  screenshots?: string[];
  metrics?: {
    totalSteps: number;
    successfulSteps: number;
    failedSteps: number;
    successRate: number;
  };
}

export async function generatePDFReport(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc
      .fontSize(24)
      .fillColor('#818cf8')
      .text('QA Automation - AI ToolKit', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(18)
      .fillColor('#22d3ee')
      .text(data.title, { align: 'center' })
      .moveDown(1);

    // Execution Info
    doc.fontSize(14).fillColor('#6366f1').text('Execution Information');
    doc.moveDown(0.5);

    doc.fontSize(11).fillColor('#000000');
    doc.text(`Script Name: ${data.scriptName}`);
    doc.text(`Execution ID: #${data.executionId}`);
    doc.text(`Status: ${data.status.toUpperCase()}`);
    doc.text(`Start Time: ${data.startTime.toLocaleString()}`);
    doc.text(`End Time: ${data.endTime.toLocaleString()}`);
    doc.text(`Duration: ${(data.duration / 1000).toFixed(2)}s`);
    doc.moveDown(1);

    // Metrics
    if (data.metrics) {
      doc.fontSize(14).fillColor('#6366f1').text('Performance Metrics');
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor('#000000');
      doc.text(`Total Steps: ${data.metrics.totalSteps}`);
      doc.text(`Successful Steps: ${data.metrics.successfulSteps}`);
      doc.text(`Failed Steps: ${data.metrics.failedSteps}`);
      doc.text(`Success Rate: ${data.metrics.successRate.toFixed(1)}%`);
      doc.moveDown(1);
    }

    // Execution Logs
    doc.fontSize(14).fillColor('#6366f1').text('Execution Logs');
    doc.moveDown(0.5);

    doc.fontSize(9).fillColor('#000000');
    data.logs.slice(0, 50).forEach((log) => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      const levelColor =
        log.level === 'error'
          ? '#ef4444'
          : log.level === 'warning'
            ? '#f59e0b'
            : '#10b981';

      doc
        .fillColor('#6b7280')
        .text(`[${timestamp}] `, { continued: true })
        .fillColor(levelColor)
        .text(`${log.level.toUpperCase()}: `, { continued: true })
        .fillColor('#000000')
        .text(log.message);
    });

    if (data.logs.length > 50) {
      doc.moveDown(0.5);
      doc
        .fillColor('#6b7280')
        .text(`... and ${data.logs.length - 50} more log entries`);
    }

    // Footer
    doc
      .fontSize(8)
      .fillColor('#6b7280')
      .text(
        `Generated on ${new Date().toLocaleString()} by QA Automation - AI ToolKit`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

    doc.end();
  });
}
