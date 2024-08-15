// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{command, generate_handler};
use std::error::Error;

#[command]
async fn print_hello_world(pdf_buffer: Vec<u8>) -> Result<String, String> {
    // Print the PDF
    match print_pdf(pdf_buffer).await {
        Ok(_) => Ok("Pencetakan selesai!".to_string()),
        Err(e) => Err(format!("Gagal mencetak: {}", e)),
    }
}

// Example function to print the PDF
async fn print_pdf(_pdf_buffer: Vec<u8>) -> Result<(), Box<dyn Error>> {
    // Use the Tauri printer plugin to print the PDF
    let printer_id = "WHByaW50ZXIgWFAtNDIwQg=="; // Your printer ID
    let printer_name = "Xprinter XP-402B";

    // Here you would typically call the printing function
    println!("Printing to {} (ID: {})", printer_name, printer_id);

    // Convert the buffer to a proper format if necessary
    // Example code for printing (implementation may vary based on plugin usage)
    // You might need to call a Tauri plugin method here

    Ok(())
}
fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_printer::init()) // Register the printer plugin
    .invoke_handler(generate_handler![print_hello_world])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
