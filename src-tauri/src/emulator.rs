use ludusavi::api::Ludusavi;
use ludusavi::resource::SaveableResourceFile;
use ludusavi::resource::config::CustomGame;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

/// Metadata for a detected emulator save
#[derive(Clone, Debug)]
pub struct DetectedSave {
    pub game_title: String,
    pub save_path: String,
    pub emulator_name: String, // "Yuzu", "Ryujinx", "Dolphin", "RetroArch", etc.
}

/// Helper to get APPDATA directory on Windows
fn appdata_dir() -> Option<PathBuf> {
    std::env::var("APPDATA").ok().map(PathBuf::from)
}

/// Helper to get Documents directory on Windows
fn document_dir() -> Option<PathBuf> {
    std::env::var("USERPROFILE")
        .ok()
        .map(|p| PathBuf::from(p).join("Documents"))
}

/// Helper to read custom MLC path from Cemu settings.xml
fn get_cemu_mlc_path(cemu_dir: &Path) -> PathBuf {
    let settings_path = cemu_dir.join("settings.xml");
    if settings_path.exists()
        && let Ok(content) = std::fs::read_to_string(&settings_path)
            && let Some(start) = content.find("<mlc_path>")
                && let Some(end) = content[start..].find("</mlc_path>") {
                    let path_str = content[start + 10..start + end].trim();
                    if !path_str.is_empty() {
                        let mlc_path = PathBuf::from(path_str);
                        if mlc_path.exists() {
                            return mlc_path;
                        }
                    }
                }
    cemu_dir.join("mlc01")
}

/// Helper to read custom NAND path from Yuzu qt-config.ini
fn get_yuzu_nand_path(emulator_dir: &Path) -> Option<PathBuf> {
    let mut config_path = emulator_dir.join("user").join("config").join("qt-config.ini");
    if !config_path.exists()
        && let Some(appdata) = appdata_dir() {
            config_path = appdata.join("yuzu").join("config").join("qt-config.ini");
        }

    if config_path.exists()
        && let Ok(content) = std::fs::read_to_string(&config_path) {
            for line in content.lines() {
                let trimmed = line.trim();
                if trimmed.starts_with("nand_directory")
                    && let Some(pos) = trimmed.find('=') {
                        let path_val = trimmed[pos + 1..].trim();
                        let path_clean = path_val.trim_matches('"');
                        if !path_clean.is_empty() {
                            let path_buf = PathBuf::from(path_clean);
                            if path_buf.exists() {
                                return Some(path_buf);
                            }
                        }
                    }
            }
        }
    None
}

/// Helper to resolve Dolphin user path (checks for portable mode first)
fn get_dolphin_user_path(emulator_dir: &Path) -> PathBuf {
    let local_user = emulator_dir.join("User");
    let portable_txt = emulator_dir.join("portable.txt");
    if local_user.exists() || portable_txt.exists() {
        local_user
    } else if let Some(doc_dir) = document_dir() {
        doc_dir.join("Dolphin Emulator")
    } else {
        local_user
    }
}

/// Map Nintendo Switch Title ID (16-char hex) to friendly game names
pub fn get_switch_game_name(title_id: &str) -> Option<&'static str> {
    match title_id.to_lowercase().as_str() {
        "01007ef00011e000" => Some("The Legend of Zelda: Breath of the Wild"),
        "0100f2c0115b6000" => Some("The Legend of Zelda: Tears of the Kingdom"),
        "0100000000010000" => Some("Super Mario Odyssey"),
        "01006a800016e000" => Some("Super Smash Bros. Ultimate"),
        "0100152000022000" => Some("Mario Kart 8 Deluxe"),
        "01006f8002326000" => Some("Animal Crossing: New Horizons"),
        "0100abf008968000" => Some("Pokémon Sword"),
        "0100ac000896a000" => Some("Pokémon Shield"),
        "010075f00e954000" => Some("Pokémon Brilliant Diamond"),
        "010076000e956000" => Some("Pokémon Shining Pearl"),
        "01008d500c50a000" => Some("Pokémon Legends: Arceus"),
        "0100187003a36000" => Some("Pokémon Let's Go, Pikachu!"),
        "0100188003a38000" => Some("Pokémon Let's Go, Eevee!"),
        "0100a3d008c5c000" => Some("Pokémon Scarlet"),
        "0100a3e008c5e000" => Some("Pokémon Violet"),
        "0100b3f000be2000" => Some("Pokkén Tournament DX"),
        "0100f4300bf2c000" => Some("New Pokémon Snap"),
        "010007500f27c000" => Some("Detective Pikachu Returns"),
        "01003d200baa2000" => Some("Pokémon Mystery Dungeon: Rescue Team DX"),
        "0100b7d00aaee000" => Some("Super Mario 3D World + Bowser's Fury"),
        "0100d87002ed8000" => Some("Super Mario Maker 2"),
        "010012f00d50e000" => Some("Super Mario 3D All-Stars"),
        "0100c2500fc96000" => Some("Splatoon 3"),
        "01003bc0000a0000" => Some("Splatoon 2"),
        "010014f007ab8000" => Some("Super Mario Party"),
        "0100e3900c3be000" => Some("Mario Party Superstars"),
        "0100baf00f77c000" => Some("Xenoblade Chronicles 3"),
        "0100ff6008ab4000" => Some("The Legend of Zelda: Link's Awakening"),
        "0100a2900c4f2000" => Some("The Legend of Zelda: Skyward Sword HD"),
        "01000f000af5a000" => Some("Xenoblade Chronicles: Definitive Edition"),
        "0100e95004034000" => Some("Xenoblade Chronicles 2"),
        "010028600eb9c000" => Some("Fire Emblem Engage"),
        "0100c6300a7b2000" => Some("Fire Emblem: Three Houses"),
        "01003f700c990000" => Some("Metroid Prime Remastered"),
        "01001a10132da000" => Some("Metroid Dread"),
        "01005a7008422000" => Some("Luigi's Mansion 3"),
        "010086000b200000" => Some("Astral Chain"),
        "01007ef007ad0000" => Some("The Legend of Zelda: Breath of the Wild (Exemplo)"),
        _ => None,
    }
}

/// Map Dolphin Wii Game ID (4-char ASCII decoded from hex) to friendly game names
pub fn get_wii_game_name(id: &str) -> Option<&'static str> {
    match id.to_uppercase().as_str() {
        "SMNE" | "SMNP" | "SMNJ" => Some("Super Mario Galaxy"),
        "SB4E" | "SB4P" | "SB4J" => Some("Super Smash Bros. Brawl"),
        "RMCE" | "RMCP" | "RMCJ" => Some("Mario Kart Wii"),
        "R32E" | "R32P" | "R32J" => Some("New Super Mario Bros. Wii"),
        "R7AE" | "R7AP" | "R7AJ" => Some("The Legend of Zelda: Skyward Sword"),
        "RVLE" | "RVLP" | "RVLJ" => Some("The Legend of Zelda: Twilight Princess"),
        "SOUE" | "SOUP" | "SOUJ" => Some("Super Mario Galaxy 2"),
        "RSBE" | "RSBP" | "RSBJ" => Some("Wii Sports"),
        "RSPE" | "RSPP" | "RSPJ" => Some("Wii Sports Resort"),
        "RHOE" | "RHOP" | "RHOJ" => Some("Wii Play"),
        _ => None,
    }
}

/// Map Cemu Wii U Title ID (8-char hex) to friendly game names
pub fn get_wiiu_game_name(title_id: &str) -> Option<&'static str> {
    match title_id.to_lowercase().as_str() {
        "101c9400" | "101c9500" => Some("The Legend of Zelda: Breath of the Wild"),
        "1010ec00" | "1010ed00" => Some("Mario Kart 8"),
        "10111200" | "10143500" | "10143600" => Some("The Legend of Zelda: The Wind Waker HD"),
        "10145c00" | "10145d00" | "10145b00" => Some("Super Mario 3D World"),
        "10182600" => Some("Xenoblade Chronicles X"),
        "1010db00" => Some("Super Mario Maker"),
        "10113f00" => Some("Splatoon"),
        "1019e300" | "1019e400" => Some("Super Smash Bros. for Wii U"),
        "101c9300" | "10101d00" => Some("New Super Mario Bros. U"),
        "1019c800" | "1019e500" => Some("The Legend of Zelda: Twilight Princess HD"),
        "10112c00" => Some("Yoshi's Woolly World"),
        "10179a00" => Some("Captain Toad: Treasure Tracker"),
        "10107b00" => Some("Pikmin 3"),
        "10112200" | "10137f00" => Some("Donkey Kong Country: Tropical Freeze"),
        "10162e00" => Some("Mario Party 10"),
        "10175800" | "10175700" | "1011bb00" => Some("Bayonetta 2"),
        "1011ba00" => Some("Bayonetta"),
        "10102000" | "10102100" | "10101f00" => Some("Nintendo Land"),
        "1017d800" | "1017d900" | "1017d700" => Some("Hyrule Warriors"),
        "101abd00" | "101abc00" => Some("Kirby and the Rainbow Curse"),
        "10129000" | "10129100" => Some("Sonic Lost World"),
        "1010b300" => Some("Sonic & All-Stars Racing Transformed"),
        "1010c700" => Some("Mario & Sonic at the Sochi 2014 Olympic Winter Games"),
        "1f600b00" | "1f600900" => Some("Paper Mario: Color Splash"),
        "10142200" | "1014b700" => Some("New Super Luigi U"),
        "10117700" | "10104d00" => Some("Monster Hunter 3 Ultimate"),
        "1010b100" => Some("Rayman Legends"),
        "1010dd00" | "1010ef00" => Some("ZombiU"),
        "101b6b00" => Some("Minecraft: Wii U Edition"),
        "101aff00" => Some("Star Fox Zero"),
        "101dcc00" => Some("Star Fox Guard"),
        "1012de00" => Some("The Wonderful 101"),
        "101c1b00" => Some("Pokkén Tournament"),
        "1016e800" => Some("Shovel Knight"),
        "1012ba00" => Some("Deus Ex: Human Revolution - Director's Cut"),
        "1010dc00" => Some("Mass Effect 3: Special Edition"),
        "1014c800" => Some("Assassin's Creed IV: Black Flag"),
        "10142000" => Some("Watch Dogs"),
        "1010cf00" => Some("Call of Duty: Black Ops II"),
        "10101a00" => Some("LEGO City Undercover"),
        "10154800" => Some("Batman: Arkham Origins"),
        "10128800" => Some("Need for Speed: Most Wanted U"),
        "1010b200" => Some("Scribblenauts Unlimited"),
        "1010ab00" => Some("Batman: Arkham City - Armored Edition"),
        "101a3500" => Some("Mario Tennis: Ultra Smash"),
        "10177900" => Some("Sonic Boom: Rise of Lyric"),
        "10110f00" => Some("Darksiders II"),
        "10110000" => Some("Tekken Tag Tournament 2: Wii U Edition"),
        "1012cf00" | "1012b400" => Some("Resident Evil: Revelations"),
        "1010aa00" => Some("Darksiders Warmastered Edition"),
        "10152400" => Some("LEGO Marvel Super Heroes"),
        "101b4400" => Some("LEGO Star Wars: The Force Awakens"),
        "1010a800" => Some("Scribblenauts Unmasked"),
        _ => None,
    }
}

/// Decodes an 8-character hex string representing a Wii Title ID into a 4-char ASCII string.
fn decode_wii_title_id(hex_str: &str) -> Option<String> {
    if hex_str.len() == 8 {
        let mut bytes = Vec::new();
        for i in 0..4 {
            if let Ok(byte) = u8::from_str_radix(&hex_str[i * 2..i * 2 + 2], 16) {
                bytes.push(byte);
            } else {
                return None;
            }
        }
        if let Ok(s) = String::from_utf8(bytes)
            && s.chars().all(|c| c.is_ascii_alphanumeric()) {
                return Some(s);
            }
    }
    None
}

/// Helper to check if a string is a 16-character hex Title ID
fn is_title_id(s: &str) -> bool {
    s.len() == 16 && s.chars().all(|c| c.is_ascii_hexdigit())
}

/// Helper to check if a string is an 8-character hex Title ID (Wii/WiiU)
fn is_wii_hex_id(s: &str) -> bool {
    s.len() == 8 && s.chars().all(|c| c.is_ascii_hexdigit())
}

/// Identify the emulator type from a directory path by checking for executable files
pub fn identify_emulator(dir: &Path) -> Option<String> {
    let check_dir = if dir.is_file() { dir.parent()? } else { dir };

    if let Ok(entries) = std::fs::read_dir(check_dir) {
        for entry in entries.flatten() {
            let name = entry.file_name().to_string_lossy().to_lowercase();
            if name.ends_with(".exe") {
                if name.contains("yuzu") || name.contains("suyu") || name.contains("sudachi") {
                    return Some("Yuzu".to_string());
                } else if name.contains("ryujinx") {
                    return Some("Ryujinx".to_string());
                } else if name.contains("dolphin") {
                    return Some("Dolphin".to_string());
                } else if name.contains("pcsx2") {
                    return Some("PCSX2".to_string());
                } else if name.contains("retroarch") {
                    return Some("RetroArch".to_string());
                } else if name.contains("mgba") {
                    return Some("mGBA".to_string());
                } else if name.contains("citra") {
                    return Some("Citra".to_string());
                } else if name.contains("ppsspp") {
                    return Some("PPSSPP".to_string());
                } else if name.contains("cemu") {
                    return Some("Cemu".to_string());
                }
            }
        }
    }
    None
}

/// Scans the saves for a given emulator type and path
pub fn scan_emulator_saves(emulator_name: &str, path_str: &str) -> Vec<DetectedSave> {
    let mut saves = Vec::new();
    let root_path = Path::new(path_str);
    let emulator_dir = if root_path.is_file() {
        root_path.parent().unwrap_or(root_path)
    } else {
        root_path
    };

    match emulator_name {
        "Yuzu" => {
            let mut save_root = None;
            if let Some(custom_nand) = get_yuzu_nand_path(emulator_dir) {
                let candidate = custom_nand.join("user").join("save").join("0000000000000000");
                if candidate.exists() {
                    save_root = Some(candidate);
                }
            }

            let save_root = save_root.unwrap_or_else(|| {
                let portable = emulator_dir
                    .join("user")
                    .join("nand")
                    .join("user")
                    .join("save")
                    .join("0000000000000000");
                if portable.exists() {
                    portable
                } else if let Some(appdata) = appdata_dir() {
                    appdata
                        .join("yuzu")
                        .join("nand")
                        .join("user")
                        .join("save")
                        .join("0000000000000000")
                } else {
                    portable
                }
            });

            if save_root.exists() {
                // Read profiles
                if let Ok(profiles) = std::fs::read_dir(&save_root) {
                    for profile in profiles.flatten() {
                        if profile.path().is_dir() {
                            // Read title ids inside profile
                            if let Ok(titles) = std::fs::read_dir(profile.path()) {
                                for title in titles.flatten() {
                                    let name_str = title.file_name().to_string_lossy().to_string();
                                    if title.path().is_dir() && is_title_id(&name_str) {
                                        let wildcard_path = save_root
                                            .join("*")
                                            .join(&name_str)
                                            .to_string_lossy()
                                            .to_string()
                                            .replace('\\', "/");
                                        let game_title = get_switch_game_name(&name_str)
                                            .map(|s| s.to_string())
                                            .or_else(|| online_lookup_switch(&name_str))
                                            .unwrap_or_else(|| format!("Switch Game ({})", name_str.to_uppercase()));

                                        if !saves.iter().any(|s: &DetectedSave| s.game_title == game_title) {
                                            saves.push(DetectedSave {
                                                game_title,
                                                save_path: wildcard_path,
                                                emulator_name: "Yuzu".to_string(),
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        "Ryujinx" => {
            let mut save_root = emulator_dir.join("portable").join("bis").join("user").join("save");
            if !save_root.exists()
                && let Some(appdata) = appdata_dir() {
                    save_root = appdata.join("Ryujinx").join("bis").join("user").join("save");
                }

            if save_root.exists()
                && let Ok(profiles) = std::fs::read_dir(&save_root) {
                    for profile in profiles.flatten() {
                        if profile.path().is_dir()
                            && let Ok(titles) = std::fs::read_dir(profile.path()) {
                                for title in titles.flatten() {
                                    let name_str = title.file_name().to_string_lossy().to_string();
                                    if title.path().is_dir() && is_title_id(&name_str) {
                                        let wildcard_path = save_root
                                            .join("*")
                                            .join(&name_str)
                                            .to_string_lossy()
                                            .to_string()
                                            .replace('\\', "/");
                                        let game_title = get_switch_game_name(&name_str)
                                            .map(|s| s.to_string())
                                            .or_else(|| online_lookup_switch(&name_str))
                                            .unwrap_or_else(|| format!("Switch Game ({})", name_str.to_uppercase()));

                                        if !saves.iter().any(|s: &DetectedSave| s.game_title == game_title) {
                                            saves.push(DetectedSave {
                                                game_title,
                                                save_path: wildcard_path,
                                                emulator_name: "Ryujinx".to_string(),
                                            });
                                        }
                                    }
                                }
                            }
                    }
                }
        }
        "Dolphin" => {
            let user_path = get_dolphin_user_path(emulator_dir);
            let wii_title_root = user_path.join("Wii").join("title").join("00010000");

            if wii_title_root.exists()
                && let Ok(titles) = std::fs::read_dir(&wii_title_root) {
                    for title in titles.flatten() {
                        let name_str = title.file_name().to_string_lossy().to_string();
                        if title.path().is_dir() && is_wii_hex_id(&name_str) {
                            let save_data_dir = title.path().join("data");
                            if save_data_dir.exists() {
                                let ascii_id = decode_wii_title_id(&name_str).unwrap_or_else(|| name_str.clone());
                                let game_title = get_wii_game_name(&ascii_id)
                                    .map(|s| s.to_string())
                                    .unwrap_or_else(|| format!("Wii Game ({})", ascii_id.to_uppercase()));

                                saves.push(DetectedSave {
                                    game_title,
                                    save_path: save_data_dir.to_string_lossy().to_string().replace('\\', "/"),
                                    emulator_name: "Dolphin".to_string(),
                                });
                            }
                        }
                    }
                }
        }
        "Cemu" => {
            let mlc_path = get_cemu_mlc_path(emulator_dir);
            let save_root = mlc_path.join("usr").join("save").join("00050000");
            if save_root.exists()
                && let Ok(titles) = std::fs::read_dir(&save_root) {
                    for title in titles.flatten() {
                        let name_str = title.file_name().to_string_lossy().to_string();
                        if title.path().is_dir() && is_wii_hex_id(&name_str) {
                            let save_data_dir = title.path().join("user");
                            if save_data_dir.exists() {
                                let game_title = get_wiiu_game_name(&name_str)
                                    .map(|s| s.to_string())
                                    .or_else(|| online_lookup_wiiu(&name_str))
                                    .unwrap_or_else(|| format!("Wii U Game ({})", name_str.to_uppercase()));

                                saves.push(DetectedSave {
                                    game_title,
                                    save_path: save_data_dir.to_string_lossy().to_string().replace('\\', "/"),
                                    emulator_name: "Cemu".to_string(),
                                });
                            }
                        }
                    }
                }
        }
        "RetroArch" => {
            let mut saves_dir = emulator_dir.join("saves");
            if !saves_dir.exists()
                && let Some(appdata) = appdata_dir() {
                    saves_dir = appdata.join("RetroArch").join("saves");
                }

            if saves_dir.exists()
                && let Ok(entries) = std::fs::read_dir(&saves_dir) {
                    for entry in entries.flatten() {
                        let path = entry.path();
                        if path.is_file() {
                            let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();
                            if (ext == "srm" || ext == "sav")
                                && let Some(stem) = path.file_stem() {
                                    let game_title = stem.to_string_lossy().to_string();
                                    saves.push(DetectedSave {
                                        game_title,
                                        save_path: path.to_string_lossy().to_string().replace('\\', "/"),
                                        emulator_name: "RetroArch".to_string(),
                                    });
                                }
                        }
                    }
                }
        }
        "PCSX2" => {
            let mut memcards_dir = emulator_dir.join("memcards");
            if !memcards_dir.exists()
                && let Some(doc_dir) = document_dir() {
                    memcards_dir = doc_dir.join("PCSX2").join("memcards");
                }

            if memcards_dir.exists()
                && let Ok(entries) = std::fs::read_dir(&memcards_dir) {
                    for entry in entries.flatten() {
                        let path = entry.path();
                        if path.is_dir() {
                            let game_title = entry.file_name().to_string_lossy().to_string();
                            if !game_title.to_lowercase().contains("default") && !game_title.starts_with('.') {
                                saves.push(DetectedSave {
                                    game_title,
                                    save_path: path.to_string_lossy().to_string().replace('\\', "/"),
                                    emulator_name: "PCSX2".to_string(),
                                });
                            }
                        }
                    }
                }
        }
        "mGBA" => {
            let mut saves_dir = emulator_dir.join("saves");
            if !saves_dir.exists()
                && let Some(doc_dir) = document_dir() {
                    saves_dir = doc_dir.join("mGBA").join("saves");
                }

            let search_dir = if saves_dir.exists() {
                saves_dir
            } else {
                emulator_dir.to_path_buf()
            };

            if let Ok(entries) = std::fs::read_dir(search_dir) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_file() {
                        let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();
                        if ext == "sav"
                            && let Some(stem) = path.file_stem() {
                                let game_title = stem.to_string_lossy().to_string();
                                saves.push(DetectedSave {
                                    game_title,
                                    save_path: path.to_string_lossy().to_string().replace('\\', "/"),
                                    emulator_name: "mGBA".to_string(),
                                });
                            }
                    }
                }
            }
        }
        "Citra" => {
            let mut sdmc_root = emulator_dir.join("sdmc").join("Nintendo 3DS");
            if !sdmc_root.exists()
                && let Some(appdata) = appdata_dir() {
                    sdmc_root = appdata.join("Citra").join("sdmc").join("Nintendo 3DS");
                }

            if sdmc_root.exists() {
                for entry in WalkDir::new(&sdmc_root).into_iter().flatten() {
                    let path = entry.path();
                    if path.is_dir() {
                        let name_str = path.file_name().unwrap_or_default().to_string_lossy().to_string();
                        if is_wii_hex_id(&name_str)
                            && let Some(parent) = path.parent()
                                && parent.file_name().unwrap_or_default().to_string_lossy() == "00040000" {
                                    let save_data_dir = path.join("data").join("00000001");
                                    if save_data_dir.exists() {
                                        let game_title = match name_str.to_lowercase().as_str() {
                                            "000ec300" => "The Legend of Zelda: A Link Between Worlds",
                                            "00086300" => "The Legend of Zelda: Ocarina of Time 3D",
                                            "00125a00" => "The Legend of Zelda: Majora's Mask 3D",
                                            "00030800" => "Mario Kart 7",
                                            "00030700" => "Super Mario 3D Land",
                                            "0011c400" => "Super Smash Bros. for Nintendo 3DS",
                                            "00055d00" => "Pokémon X",
                                            "00055e00" => "Pokémon Y",
                                            "0011c500" => "Pokémon Omega Ruby",
                                            "0011c600" => "Pokémon Alpha Sapphire",
                                            "00164800" => "Pokémon Sun",
                                            "00164900" => "Pokémon Moon",
                                            "001b5000" => "Pokémon Ultra Sun",
                                            "001b5100" => "Pokémon Ultra Moon",
                                            _ => name_str.as_str(),
                                        };
                                        let display_title = if game_title == name_str.as_str() {
                                            format!("3DS Game ({})", game_title.to_uppercase())
                                        } else {
                                            game_title.to_string()
                                        };

                                        saves.push(DetectedSave {
                                            game_title: display_title,
                                            save_path: save_data_dir.to_string_lossy().to_string().replace('\\', "/"),
                                            emulator_name: "Citra".to_string(),
                                        });
                                    }
                                }
                    }
                }
            }
        }
        "PPSSPP" => {
            let mut savedata_dir = emulator_dir.join("memstick").join("PSP").join("SAVEDATA");
            if !savedata_dir.exists()
                && let Some(doc_dir) = document_dir() {
                    savedata_dir = doc_dir.join("PPSSPP").join("PSP").join("SAVEDATA");
                }

            if savedata_dir.exists()
                && let Ok(entries) = std::fs::read_dir(&savedata_dir) {
                    for entry in entries.flatten() {
                        let path = entry.path();
                        if path.is_dir() {
                            let folder_name = entry.file_name().to_string_lossy().to_string();
                            if !folder_name.starts_with('.') {
                                saves.push(DetectedSave {
                                    game_title: folder_name.clone(),
                                    save_path: path.to_string_lossy().to_string().replace('\\', "/"),
                                    emulator_name: "PPSSPP".to_string(),
                                });
                            }
                        }
                    }
                }
        }
        _ => {}
    }

    saves
}

/// Registers the list of detected emulator saves as custom games in Ludusavi config
pub fn register_emulator_saves(detected: Vec<DetectedSave>) -> Result<(), String> {
    let mut api = Ludusavi::load().map_err(|e| format!("{:?}", e))?;

    // Prune obsolete or unmapped emulator games for the scanned emulators
    let emulators_in_scan: std::collections::HashSet<String> =
        detected.iter().map(|s| s.emulator_name.clone()).collect();
    let detected_names: std::collections::HashSet<String> = detected
        .iter()
        .map(|s| format!("[{}] {}", s.emulator_name, s.game_title))
        .collect();
    api.config.custom_games.retain(|g| {
        let is_scanned_emulator = emulators_in_scan
            .iter()
            .any(|emu| g.name.starts_with(&format!("[{}] ", emu)));
        if is_scanned_emulator {
            detected_names.contains(&g.name)
        } else {
            true
        }
    });

    for save in detected {
        let custom_game_name = format!("[{}] {}", save.emulator_name, save.game_title);

        let target_path = if save.save_path.contains('*') {
            save.save_path.clone()
        } else {
            let path_buf = std::path::Path::new(&save.save_path);
            if path_buf.is_file() {
                save.save_path.clone()
            } else {
                format!("{}/**/*", save.save_path.trim_end_matches('/'))
            }
        };

        // Check if already registered
        let already_registered = api.config.custom_games.iter().any(|g| g.name == custom_game_name);

        if !already_registered {
            let custom_game = CustomGame {
                name: custom_game_name,
                ignore: false,
                files: vec![target_path],
                expanded: true,
                ..Default::default()
            };
            api.config.custom_games.push(custom_game);
        } else {
            // If already registered, ensure the path is correct
            if let Some(pos) = api.config.custom_games.iter().position(|g| g.name == custom_game_name) {
                let game = &mut api.config.custom_games[pos];
                if !game.files.contains(&target_path) {
                    game.files = vec![target_path];
                }
            }
        }
    }

    // Clean up invalid config custom games that don't have paths anymore
    api.config.custom_games.retain(|g| !g.name.trim().is_empty());

    api.config.save();
    Ok(())
}

/// Automatically repairs any registered custom game directories by appending wildcards
pub fn heal_custom_game_paths() -> Result<(), String> {
    let mut api = Ludusavi::load().map_err(|e| format!("{:?}", e))?;
    let mut changed = false;
    for cg in &mut api.config.custom_games {
        for file in &mut cg.files {
            if !file.contains('*') {
                let path_buf = std::path::Path::new(file);
                if path_buf.is_dir() {
                    *file = format!("{}/**/*", file.trim_end_matches('/'));
                    changed = true;
                }
            }
        }
    }
    if changed {
        api.config.save();
    }
    Ok(())
}

fn online_lookup_switch(title_id: &str) -> Option<String> {
    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(3))
        .build()
        .ok()?;
    let id_lower = title_id.to_lowercase();
    let url = format!("https://tinfoil.io/Title/{}", id_lower);
    if let Ok(resp) = client.get(&url).send()
        && resp.status().is_success()
            && let Ok(html) = resp.text()
                && let Some(pos) = html.find("og:title")
                    && let Some(content_pos) = html[pos..].find("content=\"")
                        && let Some(end_pos) = html[pos + content_pos + 9..].find('"') {
                            let name = &html[pos + content_pos + 9..pos + content_pos + 9 + end_pos];
                            let cleaned = name.trim().to_string();
                            if !cleaned.is_empty() {
                                return Some(cleaned);
                            }
                        }
    None
}

fn online_lookup_wiiu(title_id: &str) -> Option<String> {
    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(3))
        .build()
        .ok()?;
    let url = "https://raw.githubusercontent.com/Laf111/CEMU-Batch-Framework/master/resources/WiiU-Titles-Library.csv";
    if let Ok(resp) = client.get(url).send()
        && resp.status().is_success()
            && let Ok(content) = resp.text() {
                let id_upper = title_id.to_uppercase();
                for line in content.lines() {
                    let line_upper = line.to_uppercase();
                    if line_upper.contains(&id_upper) {
                        let parts: Vec<&str> = if line.contains(';') {
                            line.split(';').collect()
                        } else {
                            line.split(',').collect()
                        };
                        if parts.len() > 1 {
                            let name = parts[1].trim().trim_matches('"').trim();
                            if !name.is_empty() {
                                return Some(name.to_string());
                            }
                        }
                    }
                }
            }
    None
}
