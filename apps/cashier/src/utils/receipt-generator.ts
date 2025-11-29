import type { Transaction } from "../types"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generateReceiptHTML = (transaction: Transaction): string => {
  return `
    <div id="receipt" style="font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto;">
      <div style="text-align: center; font-weight: bold; margin-bottom: 20px; font-size: 18px;">
        RECEIPT
      </div>
      <div style="text-align: center; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
        ${transaction.id}
      </div>
      <div style="text-align: center; margin-bottom: 15px; font-size: 12px;">
        ${transaction.timestamp.toLocaleString()}
      </div>
      <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>
      <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">Items:</div>
      
      ${transaction.items.map(item => `
        <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px;">
          <span>${item.name} x${item.quantity}</span>
          <span>Rp ${(item.price * item.quantity).toLocaleString("id-ID")}</span>
        </div>
      `).join('')}
      
      <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>
      <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px;">
        <span>Subtotal:</span>
        <span>Rp ${transaction.subtotal.toLocaleString("id-ID")}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px;">
        <span>Tax (8%):</span>
        <span>Rp ${transaction.tax.toLocaleString("id-ID")}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 5px 0; font-weight: bold; font-size: 16px;">
        <span>Total:</span>
        <span>Rp ${transaction.total.toLocaleString("id-ID")}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px;">
        <span>Payment:</span>
        <span>${transaction.paymentMethod.toUpperCase()}</span>
      </div>
      <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>
      <div style="text-align: center; margin-top: 20px; font-size: 11px;">
        Thank you for your purchase!
      </div>
    </div>
  `
}

export const printReceipt = (transaction: Transaction): void => {
  const receipt = generateReceiptHTML(transaction)
  const printWindow = window.open("", "", "width=400,height=600")
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${transaction.id}</title>
          <style>
            body { font-family: monospace; padding: 20px; }
          </style>
        </head>
        <body>
          ${receipt}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

export const downloadReceiptPDF = async (transaction: Transaction): Promise<void> => {
  // Create a temporary div to render the receipt
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.top = '0'
  tempDiv.style.width = '300px'
  tempDiv.innerHTML = generateReceiptHTML(transaction)
  document.body.appendChild(tempDiv)

  try {
    // Use html2canvas to capture the receipt as an image
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      width: 300,
      height: tempDiv.scrollHeight,
      windowWidth: 300,
      windowHeight: tempDiv.scrollHeight
    })

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, tempDiv.scrollHeight * 0.35] // Thermal receipt size
    })

    // Add the image to PDF
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 80
    const pageHeight = pdf.internal.pageSize.height
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add new pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(`receipt-${transaction.id}.pdf`)

  } catch (error) {
    console.error('Error generating PDF:', error)
    // Fallback to simple text PDF
    generateSimplePDF(transaction)
  } finally {
    // Clean up
    document.body.removeChild(tempDiv)
  }
}

// Fallback PDF generation method
const generateSimplePDF = (transaction: Transaction): void => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200] // Thermal receipt size
  })

  // Set font
  pdf.setFont('courier')
  pdf.setFontSize(10)

  let yPosition = 10

  // Header
  pdf.text('RECEIPT', 40, yPosition, { align: 'center' })
  yPosition += 8
  pdf.text(transaction.id, 40, yPosition, { align: 'center' })
  yPosition += 6
  pdf.text(transaction.timestamp.toLocaleString(), 40, yPosition, { align: 'center' })
  yPosition += 10

  // Separator
  pdf.line(5, yPosition, 75, yPosition)
  yPosition += 8

  // Items header
  pdf.text('ITEMS:', 5, yPosition)
  yPosition += 6

  // Items list
  transaction.items.forEach(item => {
    const itemText = `${item.name} x${item.quantity}`
    const priceText = `Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    
    pdf.text(itemText, 5, yPosition)
    pdf.text(priceText, 75, yPosition, { align: 'right' })
    yPosition += 5
  })

  yPosition += 5

  // Separator
  pdf.line(5, yPosition, 75, yPosition)
  yPosition += 8

  // Totals
  pdf.text(`Subtotal: Rp ${transaction.subtotal.toLocaleString('id-ID')}`, 75, yPosition, { align: 'right' })
  yPosition += 5
  pdf.text(`Tax (8%): Rp ${transaction.tax.toLocaleString('id-ID')}`, 75, yPosition, { align: 'right' })
  yPosition += 5
  pdf.setFontSize(12)
  pdf.text(`Total: Rp ${transaction.total.toLocaleString('id-ID')}`, 75, yPosition, { align: 'right' })
  yPosition += 8
  pdf.setFontSize(10)
  pdf.text(`Payment: ${transaction.paymentMethod.toUpperCase()}`, 75, yPosition, { align: 'right' })
  yPosition += 10

  // Footer
  pdf.line(5, yPosition, 75, yPosition)
  yPosition += 8
  pdf.text('Thank you for your purchase!', 40, yPosition, { align: 'center' })

  // Save PDF
  pdf.save(`receipt-${transaction.id}.pdf`)
}

// Alternative: Text-based PDF (simpler)
export const downloadReceiptTextPDF = (transaction: Transaction): void => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6'
  })

  pdf.setFont('helvetica')
  pdf.setFontSize(12)

  let y = 15
  const lineHeight = 7
  const margin = 15

  // Header
  pdf.setFontSize(16)
  pdf.text('RECEIPT', margin, y)
  y += lineHeight + 2

  pdf.setFontSize(10)
  pdf.text(`Transaction ID: ${transaction.id}`, margin, y)
  y += lineHeight
  pdf.text(`Date: ${transaction.timestamp.toLocaleString()}`, margin, y)
  y += lineHeight + 5

  // Items
  pdf.text('Items:', margin, y)
  y += lineHeight

  transaction.items.forEach(item => {
    const itemName = `${item.name} x${item.quantity}`
    const itemTotal = `Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    
    pdf.text(itemName, margin, y)
    pdf.text(itemTotal, pdf.internal.pageSize.width - margin, y, { align: 'right' })
    y += lineHeight
  })

  y += 5

  // Separator
  pdf.line(margin, y, pdf.internal.pageSize.width - margin, y)
  y += 10

  // Totals
  pdf.text(`Subtotal: Rp ${transaction.subtotal.toLocaleString('id-ID')}`, margin, y)
  y += lineHeight
  pdf.text(`Tax (8%): Rp ${transaction.tax.toLocaleString('id-ID')}`, margin, y)
  y += lineHeight
  pdf.setFontSize(12)
  pdf.setFont("helvetica", 'bold')
  pdf.text(`Total: Rp ${transaction.total.toLocaleString('id-ID')}`, margin, y)
  y += lineHeight
  pdf.setFontSize(10)
  pdf.setFont("helvetica", 'normal')
  pdf.text(`Payment Method: ${transaction.paymentMethod.toUpperCase()}`, margin, y)
  y += lineHeight + 10

  // Footer
  pdf.text('Thank you for your purchase!', pdf.internal.pageSize.width / 2, y, { align: 'center' })

  pdf.save(`receipt-${transaction.id}.pdf`)
}