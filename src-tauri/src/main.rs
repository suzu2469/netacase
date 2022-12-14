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


#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct Token {
    pub github: String,
    pub atlassian: String,
    pub linear: String,
}

const TOKEN_FILE: &str = "../.config/token.json";

#[tauri::command]
fn set_token(token: Token) -> Result<(), String> {
    let token_string = serde_json::to_string(&token).map_err(|e| e.to_string())?;
    fs::write(TOKEN_FILE, token_string).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_token() -> Result<Token, String> {
    let token_json = match fs::read(TOKEN_FILE) {
        Ok(token_json) => token_json,
        Err(_) => {
            let empty_token = Token {
                github: "".to_string(),
                atlassian: "".to_string(),
                linear: "".to_string(),
            };
            let empty_token_string = serde_json::to_string(&empty_token).map_err(|e| e.to_string())?;
            fs::write(TOKEN_FILE, empty_token_string).map_err(|e| e.to_string())?;
            fs::read(TOKEN_FILE).map_err(|e| e.to_string())?
        }
    };
    serde_json::from_slice(&token_json).map_err(|e| e.to_string())
}

const CONNECTION_FILE: &str = "../.config/connection.json";

#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct Connection {
    pub github: Vec<GithubRepositories>,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct GithubRepositories {
    pub owner: String,
    pub repo: String,
}

#[tauri::command]
fn get_connection() -> Result<Connection, String> {
    let connection_json = match fs::read(CONNECTION_FILE) {
        Ok(con) => con,
        Err(_) => {
            let empty_connection = Connection {
                github: vec![]
            };
            let empty_connection_string = serde_json::to_string(&empty_connection).map_err(|e| e.to_string())?;
            fs::write(CONNECTION_FILE, empty_connection_string).map_err(|e| e.to_string())?;
            fs::read(CONNECTION_FILE).map_err(|e| e.to_string())?
        }
    };
    serde_json::from_slice(&connection_json).map_err(|e| e.to_string())
}

#[tauri::command]
fn set_connection(connection: Connection) -> Result<(), String> {
    let connection_string  = serde_json::to_string(&connection).map_err(|e| e.to_string())?;
    fs::write(CONNECTION_FILE, connection_string).map_err(|e| e.to_string())?;
    Ok(())
}

const MEMBERS_FILE: &str = "../.config/members.json";

#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct MemberSetting {
    pub members: Vec<Member>,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Member {
    pub github_id: String,
    pub linear_id: String,
}

#[tauri::command]
fn get_members() -> Result<MemberSetting, String> {
    let members_json = match fs::read(MEMBERS_FILE) {
        Ok(con) => con,
        Err(_) => {
            let empty_members = MemberSetting {
                members: vec![]
            };
            let empty_members_string = serde_json::to_string(&empty_members).map_err(|e| e.to_string())?;
            fs::write(MEMBERS_FILE, empty_members_string).map_err(|e| e.to_string())?;
            fs::read(MEMBERS_FILE).map_err(|e| e.to_string())?
        }
    };
    serde_json::from_slice(&members_json).map_err(|e| e.to_string())
}

#[tauri::command]
fn set_members(member_setting: MemberSetting) -> Result<(), String> {
    let members_string = serde_json::to_string(&member_setting).map_err(|e| e.to_string())?;
    fs::write(MEMBERS_FILE, members_string).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, set_token, get_token, get_connection, set_connection, get_members, set_members])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
