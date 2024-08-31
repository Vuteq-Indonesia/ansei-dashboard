'use client'
// import {print_file} from "tauri-plugin-printer";
import {jsPDF, RGBAData} from "jspdf";
import qrcode from "qrcode";
import {invoke} from "@tauri-apps/api/tauri";
import {print_file} from "tauri-plugin-printer";

async function printHelloWorld(qty: number, part: string) {
    try {
        if (typeof window === 'undefined') return null
        // Buat buffer PDF
        const pdfBuffer = await createPDFBuffer(qty, part);
        // Mencetak file PDF dari buffer
        // Convert ArrayBuffer to Uint8Array for sending to Rust
        const uint8Array = new Uint8Array(pdfBuffer);

        // Invoke the Rust command to print
        // a const result = await invoke('print_hello_world', { pdf_buffer: Array.from(uint8Array) });
        // console.log(result); // Should log "Pencetakan selesai!"
        await print_file({
            id:"WHByaW50ZXIgWFAtNDIwQg==",
            file: pdfBuffer,
            print_setting: {
                orientation: "landscape",
                method: "simplex", // duplex | simplex | duplexshort
                paper: "A4", // "A2" | "A3" | "A4" | "A5" | "A6" | "letter" | "legal" | "tabloid"
                scale: "noscale", //"noscale" | "shrink" | "fit"
                repeat: 1, // total copies
                range: {        // print page 1 - 3
                    from: 1,
                    to: 1
                }
            }
        })
    } catch (error) {
        console.error('Gagal mencetak:', error);
    }
}
export async function createPDFBuffer(qty: number, part: string) {
    // Ukuran kertas dalam piksel
    const width = 50; // 50mm
    const height = 20; // 20mm

    const doc = new jsPDF({
        orientation: "l",
        unit: "mm", // Menggunakan piksel
        format: [width, height], // Format halaman kertas
    });

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold',);
    doc.text("Part Number", 5, 2, {align: 'left',});

    // Tambahkan teks part number dengan font normal
    doc.setFont('helvetica', 'normal');
    doc.text(`${part}`, 5, 7);

    // Tambahkan teks "QTY Part" dengan font bold
    doc.setFont('helvetica', 'bold');
    doc.text("QTY Part", 5, 12, {align: 'left'});

    // Tambahkan teks qty dengan font normal
    doc.setFont('helvetica', 'normal');
    doc.text(qty.toString() + " Pcs", 5, 17);
    const qrCodeData = `${part}_`+qty.toString(); // Data untuk QR code
    const qrSize = 17; // Ukuran QR code
    const qrX = 32; // Koordinat X untuk QR code
    const qrY = 1; // Koordinat Y untuk QR code
    qrcode.toDataURL(qrCodeData, {width: qrSize, margin: 1}, function (err: any, url: string | HTMLImageElement | Uint8Array | HTMLCanvasElement | RGBAData) {
        if (!err) {
            console.log(url)
            doc.addImage(url, 'PNG', qrX, qrY, qrSize, qrSize);
            // doc.save('output.pdf');
        } else {
            console.error('Error generating QR code:', err);
        }
    });
    // Ambil output PDF sebagai ArrayBuffer
    const pdfOutput = doc.output('arraybuffer');
    // Konversi ArrayBuffer ke Buffer
    return Buffer.from(pdfOutput);
}

export default printHelloWorld