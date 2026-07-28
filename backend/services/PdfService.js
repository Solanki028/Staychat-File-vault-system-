import PDFDocument from 'pdfkit';

class PdfService {
  generateInvoicePdf(invoice, company, res) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);

    doc.pipe(res);

    // Header
    doc
      .fillColor('#4f46e5')
      .fontSize(20)
      .text(company?.companyName || 'COMPANY WORKSPACE', 50, 45)
      .fontSize(10)
      .fillColor('#64748b')
      .text(`Reg: ${company?.registrationNumber || 'N/A'}`, 50, 70)
      .text(`${company?.address?.street || ''}, ${company?.address?.city || ''}`, 50, 83)
      .text(`Email: ${company?.contact?.email || ''} | Phone: ${company?.contact?.phone || ''}`, 50, 96);

    // Invoice Title & Status Badge
    doc
      .fillColor('#0f172a')
      .fontSize(22)
      .text(invoice.invoiceType.toUpperCase(), 380, 45, { align: 'right' })
      .fontSize(10)
      .fillColor('#64748b')
      .text(`#${invoice.invoiceNumber}`, 380, 72, { align: 'right' })
      .text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 380, 85, { align: 'right' })
      .text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, 380, 98, { align: 'right' });

    doc.moveTo(50, 120).lineTo(545, 120).strokeColor('#e2e8f0').stroke();

    // Bill To Section
    doc
      .fontSize(11)
      .fillColor('#4f46e5')
      .text('Billed To:', 50, 135)
      .fontSize(10)
      .fillColor('#0f172a')
      .text(invoice.clientName, 50, 150)
      .fillColor('#64748b')
      .text(invoice.clientAddress || 'No address provided', 50, 163)
      .text(invoice.clientEmail || '', 50, 176);

    // Line Items Table Header
    const tableTop = 210;
    doc
      .rect(50, tableTop, 495, 20)
      .fill('#f1f5f9')
      .fillColor('#334155')
      .fontSize(9)
      .text('DESCRIPTION', 60, tableTop + 5)
      .text('QTY', 300, tableTop + 5, { width: 40, align: 'center' })
      .text('UNIT PRICE', 350, tableTop + 5, { width: 80, align: 'right' })
      .text('TAX %', 435, tableTop + 5, { width: 40, align: 'right' })
      .text('AMOUNT', 480, tableTop + 5, { width: 60, align: 'right' });

    let position = tableTop + 30;

    // Line Items Rows
    invoice.lineItems.forEach((item) => {
      doc
        .fillColor('#1e293b')
        .fontSize(9)
        .text(item.description, 60, position)
        .text(item.quantity.toString(), 300, position, { width: 40, align: 'center' })
        .text(`${invoice.currency} ${item.unitPrice.toFixed(2)}`, 350, position, { width: 80, align: 'right' })
        .text(`${item.taxRate}%`, 435, position, { width: 40, align: 'right' })
        .text(`${invoice.currency} ${item.amount.toFixed(2)}`, 480, position, { width: 60, align: 'right' });

      position += 20;
    });

    doc.moveTo(50, position).lineTo(545, position).strokeColor('#e2e8f0').stroke();
    position += 15;

    // Totals Section
    doc
      .fontSize(9)
      .fillColor('#64748b')
      .text('Subtotal:', 350, position, { width: 120, align: 'right' })
      .fillColor('#0f172a')
      .text(`${invoice.currency} ${invoice.subtotal.toFixed(2)}`, 480, position, { width: 60, align: 'right' });

    position += 15;
    doc
      .fillColor('#64748b')
      .text('Tax / VAT:', 350, position, { width: 120, align: 'right' })
      .fillColor('#0f172a')
      .text(`${invoice.currency} ${invoice.taxAmount.toFixed(2)}`, 480, position, { width: 60, align: 'right' });

    if (invoice.discountAmount > 0) {
      position += 15;
      doc
        .fillColor('#64748b')
        .text('Discount:', 350, position, { width: 120, align: 'right' })
        .fillColor('#0f172a')
        .text(`- ${invoice.currency} ${invoice.discountAmount.toFixed(2)}`, 480, position, { width: 60, align: 'right' });
    }

    position += 20;
    doc
      .fontSize(12)
      .fillColor('#4f46e5')
      .text('Total Amount:', 350, position, { width: 120, align: 'right' })
      .fillColor('#4f46e5')
      .text(`${invoice.currency} ${invoice.totalAmount.toFixed(2)}`, 480, position, { width: 60, align: 'right' });

    // Footer Terms
    doc
      .fontSize(8)
      .fillColor('#94a3b8')
      .text(`Terms & Conditions: ${invoice.terms || 'Payment due within 30 days.'}`, 50, 730, { align: 'center' })
      .text('Thank you for your business!', 50, 745, { align: 'center' });

    doc.end();
  }
}

export default new PdfService();
