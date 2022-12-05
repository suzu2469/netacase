#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[derive(serde::Serialize, serde::Deserialize)]
struct Token {
    pub github: String,
    pub atlassian: String,
    pub linear: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct Settings {
    pub initialized: bool,
    pub token: Token,
}

const TOKEN_FILE: &str = "../token.json";

#[tauri::command]
fn set_token(token: Token) -> Result<(), String> {
    let token_string = serde_json::to_string(&token).map_err(|e| e.to_string())?;
    fs::write(TOKEN_FILE, token_string).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_token() -> Result<Token, String> {
    let token_json = fs::read(TOKEN_FILE).map_err(|e| e.to_string())?;
    serde_json::from_slice(&token_json).map_err(|e| e.to_string())?
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, set_token, get_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
