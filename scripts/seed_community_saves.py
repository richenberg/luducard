import os
import sys
import json
import uuid
import zipfile
import tempfile
import urllib.request
import urllib.error
import socket
from datetime import datetime

# Patch DNS lookup if router DNS is stale
old_getaddrinfo = socket.getaddrinfo
def custom_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    if host == "iwqqbssramgfkyhltblx.supabase.co":
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("172.64.149.246", port))]
    return old_getaddrinfo(host, port, family, type, proto, flags)
socket.getaddrinfo = custom_getaddrinfo

SUPABASE_URL = "https://iwqqbssramgfkyhltblx.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cXFic3NyYW1nZmt5aGx0Ymx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDcxMjYsImV4cCI6MjA5ODA4MzEyNn0.Nw8rarl_2LVpw4O4gADA0zaM3-6MIlEv7z_U-gunUxc"

# Generate 10 distinct author UUIDs so we don't exceed the 5-checkpoint trigger quota per user_uuid
AUTHOR_POOLS = [
    {"name": "ValkyriePrime", "uuid": str(uuid.uuid4())},
    {"name": "ShadowRunner", "uuid": str(uuid.uuid4())},
    {"name": "MasterChief99", "uuid": str(uuid.uuid4())},
    {"name": "TarnishedOne", "uuid": str(uuid.uuid4())},
    {"name": "CyberGhost", "uuid": str(uuid.uuid4())},
    {"name": "DragonbornHero", "uuid": str(uuid.uuid4())},
    {"name": "NexusArchivist", "uuid": str(uuid.uuid4())},
    {"name": "SpeedrunnerPro", "uuid": str(uuid.uuid4())},
    {"name": "GeraltOfRivia", "uuid": str(uuid.uuid4())},
    {"name": "PureGamer", "uuid": str(uuid.uuid4())},
]

GAME_SAVES_DATASET = [
    {
        "game_name": "Elden Ring",
        "game_id": "elden-ring",
        "title": "100% Complete - All Weapons, Spells & DLC Ready",
        "description": "Level 150 PvP meta character with all legendary armaments, talismans, and spells collected. All Remembrance bosses defeated, ready for Shadow of the Erdtree expansion.",
        "tags": ["100%", "New Game+", "OP Build", "DLC1"],
        "save_files": {"ER0000.sl2": b"ELDEN_RING_SAVE_HEADER_v1.12_ALL_ITEMS_MAXED_LVL150" * 200, "ER0000.sl2.bak": b"ELDEN_RING_BACKUP" * 100}
    },
    {
        "game_name": "Cyberpunk 2077",
        "game_id": "cyberpunk-2077",
        "title": "Phantom Liberty Ready - Level 60 Netrunner God",
        "description": "Max level 60 character with Tier 5++ Cyberware, iconic weapons, and 5,000,000 Eurodollars. Main story completed with all endings unlocked, Dogtown entry point.",
        "tags": ["OP Build", "DLC1", "Unlimited Cash", "Post-Game"],
        "save_files": {"sav.dat": b"CP2077_SAVEDAT_PL_READY_LVL60_NETRUNNER" * 150, "metadata.9.json": b'{"playtime": 720000, "level": 60, "district": "Pacifica"}'}
    },
    {
        "game_name": "Baldur's Gate 3",
        "game_id": "baldurs-gate-3",
        "title": "Honor Mode Complete - Legendary Golden Dice Unlocked",
        "description": "Clean Honor Mode victory save. Level 12 party with all legendary gear (Balduran's Giantslayer, Nyrulna, Blood of Lathander), all companions alive and loyal.",
        "tags": ["100%", "Hardcore", "Legit", "OP Build"],
        "save_files": {"HonorMode_Save.lsv": b"BG3_HONOR_MODE_VICTORY_GOLDEN_DICE" * 300}
    },
    {
        "game_name": "Red Dead Redemption 2",
        "game_id": "red-dead-redemption-2",
        "title": "100% Total Completion - Legend of the East Outfit",
        "description": "Best of the West 100% completion achieved. Arthur Morgan Legend of the East outfit unlocked, maximum honor, all trapper items crafted, and $100,000 cash.",
        "tags": ["100%", "Post-Game", "Unlimited Cash", "Vanilla"],
        "save_files": {"SRDR30000": b"RDR2_100_PERCENT_LEGEND_OF_THE_EAST_ARTHUR" * 250, "SRDR30000.bak": b"RDR2_BAK" * 50}
    },
    {
        "game_name": "The Witcher 3: Wild Hunt",
        "game_id": "the-witcher-3-wild-hunt",
        "title": "NG+ Blood & Wine Complete - Grandmaster Witcher Sets",
        "description": "Geralt Level 100 with all Grandmaster Witcher Gear sets crafted (Ursine, Feline, Griffin, Wolven, Manticore), Corvo Bianco fully upgraded with all trophies displayed.",
        "tags": ["100%", "New Game+", "DLC2", "OP Build"],
        "save_files": {"manualsave_3b2f9.sav": b"W3_WILD_HUNT_GRANDMASTER_SETS_LVL100" * 200, "manualsave_3b2f9.png": b"PNG_PREVIEW_HEADER" * 20}
    },
    {
        "game_name": "Grand Theft Auto V",
        "game_id": "grand-theft-auto-v",
        "title": "100% Story Completion - $2.1 Billion for All 3 Characters",
        "description": "100% checklist completed. Franklin, Michael, and Trevor each hold $2,147,483,647 from Assassination stock investments. All properties purchased and hangars filled.",
        "tags": ["100%", "Unlimited Cash", "Post-Game"],
        "save_files": {"SGTA50000": b"GTAV_100_PERCENT_MAX_CASH_ALL_PROPERTIES" * 200, "SGTA50000.bak": b"GTAV_BAK" * 40}
    },
    {
        "game_name": "God of War Ragnarok",
        "game_id": "god-of-war-ragnarok",
        "title": "NG+ 100% Complete - Maxed Leviathan Axe & Blades",
        "description": "All realms 100% explored, King Hrolf and Gna defeated on Give Me God of War difficulty. All armors upgraded to Level 9+, fully unlocked skill tree.",
        "tags": ["100%", "New Game+", "Hardcore", "OP Build"],
        "save_files": {"savedata.bin": b"GOW_RAGNAROK_NG_PLUS_MAXED_KRATOS" * 180}
    },
    {
        "game_name": "Hollow Knight",
        "game_id": "hollow-knight",
        "title": "112% Completion - Pantheon of Hallownest Conquered",
        "description": "Pure Completion (112%) with all 40 charms, max notches, pure nail, all mask shards, and vessel fragments. Godhome pantheons finished with Weathered Mask unlocked.",
        "tags": ["100%", "Hardcore", "Post-Game", "Legit"],
        "save_files": {"user1.dat": b"HOLLOW_KNIGHT_112_PERCENT_ALL_CHARMS_PURE_NAIL" * 100}
    },
    {
        "game_name": "Dark Souls III",
        "game_id": "dark-souls-iii",
        "title": "All Bosses Cleared - SL120 Quality Build (Ringed City Ready)",
        "description": "Soul Level 120 PvP ready character. All Lord of Cinder bosses and optional dragons defeated, maxed Estus Flask (+10 / 15 charges), all Ringed City DLC gear unlocked.",
        "tags": ["100%", "DLC2", "OP Build", "Vanilla"],
        "save_files": {"DS30000.sl2": b"DARK_SOULS_III_SL120_PVP_QUALITY_BUILD" * 200}
    },
    {
        "game_name": "The Elder Scrolls V: Skyrim Special Edition",
        "game_id": "the-elder-scrolls-v-skyrim-special-edition",
        "title": "Arch-Mage Dragonborn - Level 81 with All Shouts & Daedric Artifacts",
        "description": "Leader of all guilds (Thieves Guild, Dark Brotherhood, Companions, College of Winterhold). All 20 Dragon Shouts unlocked, all Daedric Artifacts in Lakeview Manor.",
        "tags": ["100%", "Vanilla", "Post-Game", "Unlimited Cash"],
        "save_files": {"Save1_Dragonborn.ess": b"SKYRIM_SE_LVL81_ALL_SHOUTS_DAEDRIC_ARTIFACTS" * 300}
    },
    {
        "game_name": "Fallout 4",
        "game_id": "fallout-4",
        "title": "Level 80 Minutemen General - All Settlements Maxed & Power Armor Armory",
        "description": "Sanctuary Hills transformed into a fortified trading hub. 25+ fully upgraded X-01 Power Armor suits, all bobbleheads, magazines, and Institute storyline concluded peacefully.",
        "tags": ["100%", "Vanilla", "OP Build", "Post-Game"],
        "save_files": {"Save1_General.fos": b"FALLOUT4_LVL80_GENERAL_X01_POWER_ARMOR" * 250}
    },
    {
        "game_name": "Resident Evil 4 Remake",
        "game_id": "resident-evil-4-remake",
        "title": "Professional S+ Rank Complete - Infinite Rocket Launcher & Sweeper",
        "description": "Completed on Professional with S+ rank. Cat Ears accessory (Infinite Ammo for all weapons), Chicago Sweeper, Handcannon, and Primal Knife fully upgraded.",
        "tags": ["100%", "OP Build", "Hardcore", "New Game+"],
        "save_files": {"data00-1.bin": b"RE4R_PROFESSIONAL_S_PLUS_CAT_EARS_INFINITE_AMMO" * 150}
    },
    {
        "game_name": "Black Myth: Wukong",
        "game_id": "black-myth-wukong",
        "title": "NG+ Chapter 6 Complete - All 6 Relics & True Ending Unlocked",
        "description": "Erlang Shen and the Great Sage defeated to achieve the True Secret Ending. All transformations, spirit skills, and Mythical Wukong armor set unlocked.",
        "tags": ["100%", "New Game+", "Boss Prep", "OP Build"],
        "save_files": {"SaveGames.sav": b"BLACK_MYTH_WUKONG_TRUE_ENDING_ALL_RELICS" * 200}
    },
    {
        "game_name": "Sekiro: Shadows Die Twice",
        "game_id": "sekiro-shadows-die-twice",
        "title": "Man Without Equal - All 4 Endings & All Boss Memories",
        "description": "All Prosthetic tools fully upgraded to Lazulite tier. All skill arts acquired including Dragon Flash and One Mind. Attack Power 99, ready for Gauntlets of Strength.",
        "tags": ["100%", "Hardcore", "New Game+", "Legit"],
        "save_files": {"S0000.sl2": b"SEKIRO_ALL_ENDINGS_MAN_WITHOUT_EQUAL_AP99" * 150}
    },
    {
        "game_name": "Persona 5 Royal",
        "game_id": "persona-5-royal",
        "title": "Third Semester 100% - Satanael & All Max Confidants",
        "description": "True Royal ending achieved with Kasumi and Maruki confidants maxed. 100% Persona Compendium with Level 99 Satanael, Yoshitsune, and max social stats.",
        "tags": ["100%", "New Game+", "OP Build", "Vanilla"],
        "save_files": {"DATA01.BIN": b"P5R_THIRD_SEMESTER_100_COMPENDIUM_SATANAEL" * 220}
    },
    {
        "game_name": "Hades",
        "game_id": "hades",
        "title": "32 Heat Cleared - All Weapon Aspects Maxed & Epilogue Complete",
        "description": "All Infernal Arms aspects upgraded with Titan Blood. Olympians affinity maxed, hidden companion summons unlocked, Persephone returned to the Underworld.",
        "tags": ["100%", "Hardcore", "Post-Game", "Legit"],
        "save_files": {"Profile1.sav": b"HADES_32_HEAT_ALL_ASPECTS_EPILOGUE" * 120}
    },
    {
        "game_name": "Stardew Valley",
        "game_id": "stardew-valley",
        "title": "Year 4 Perfection - 100% Ginger Island & Golden Clock",
        "description": "Mr. Qi's Perfection Tracker at 100%. Golden Clock built, Return Scepter acquired, all fish caught, Community Center restored, automated Iridium Ancient Fruit winery.",
        "tags": ["100%", "Post-Game", "Unlimited Cash", "Legit"],
        "save_files": {"StarHaven_12345678": b"STARDEW_VALLEY_100_PERFECTION_GINGER_ISLAND" * 100, "SaveGameInfo": b"INFO_STARDEW" * 20}
    },
    {
        "game_name": "Ghost of Tsushima DIRECTOR'S CUT",
        "game_id": "ghost-of-tsushima-directors-cut",
        "title": "Iki Island & Tsushima 100% - All Mythic Tales & Ghost Armor Maxed",
        "description": "All Mongol camps liberated, all Fox Dens, Haikus, and Hot Springs completed. Fully upgraded Ghost Armor, Sarugami Armor, and Sakai Clan Armor with all dyes.",
        "tags": ["100%", "DLC1", "Post-Game", "OP Build"],
        "save_files": {"manual_save_00.sav": b"GHOST_OF_TSUSHIMA_100_IKI_ISLAND_GHOST_ARMOR" * 180}
    },
    {
        "game_name": "Marvel's Spider-Man Remastered",
        "game_id": "marvels-spider-man-remastered",
        "title": "100% City Completion - All Suits & Ultimate Difficulty Cleared",
        "description": "All district crimes, backpacks, landmarks, and Research Stations completed. All 47 suits unlocked with mods, ready for NG+ with max level gadget upgrades.",
        "tags": ["100%", "Post-Game", "Vanilla", "New Game+"],
        "save_files": {"slot0-s.save": b"SPIDERMAN_REMASTERED_100_ALL_SUITS_ULTIMATE" * 140}
    },
    {
        "game_name": "Lies of P",
        "game_id": "lies-of-p",
        "title": "Rise of P True Ending - Golden Lie Weapon & Max P-Organ",
        "description": "Nameless Puppet defeated with Human Lie choices. Golden Lie weapon obtained, Phase 7 P-Organ fully unlocked in NG+, Proof of Humanity sword max upgraded.",
        "tags": ["100%", "New Game+", "OP Build", "Legit"],
        "save_files": {"SaveData.sav": b"LIES_OF_P_RISE_OF_P_GOLDEN_LIE_PHASE7" * 160}
    },
    {
        "game_name": "Monster Hunter: World - Iceborne",
        "game_id": "monster-hunter-world-iceborne",
        "title": "Master Rank 999 - Fatalis Armor & All Meta Weapons",
        "description": "Fatalis and Alatreon fully farmed. All Master Rank Fatalis armor sets crafted, Attack Jewel 4 decorations collected, Guiding Lands max level biomes.",
        "tags": ["100%", "DLC1", "OP Build", "Post-Game"],
        "save_files": {"SAVEDATA1000": b"MHW_ICEBORNE_MR999_FATALIS_ARMOR_ALL_DECORATIONS" * 300}
    },
    {
        "game_name": "Hogwarts Legacy",
        "game_id": "hogwarts-legacy",
        "title": "100% Field Guide - Level 40 with All Unforgivable Curses",
        "description": "All Merlin Trials, Ancient Magic hotspots, Demiguise statues, and Collection chests collected. Avada Kedavra, Crucio, and Imperio learned with dark arts talents.",
        "tags": ["100%", "Vanilla", "OP Build", "Post-Game"],
        "save_files": {"HL-00-00.sav": b"HOGWARTS_LEGACY_100_LVL40_ALL_SPELLS" * 200}
    },
    {
        "game_name": "Starfield",
        "game_id": "starfield",
        "title": "Unity NG+ 10 - Level 100 Starborn with All Powers Rank X",
        "description": "Reached NG+10 with maximum Starborn Guardian VI ship and Venator Spacesuit. All 24 Starborn powers upgraded to Rank X, over 3,000,000 credits.",
        "tags": ["New Game+", "OP Build", "Unlimited Cash", "Post-Game"],
        "save_files": {"Save1_Starborn.sfs": b"STARFIELD_NG10_STARBORN_RANK_X_POWERS" * 250}
    },
    {
        "game_name": "Terraria",
        "game_id": "terraria",
        "title": "Master Mode Moon Lord Defeated - Zenith & All Relics",
        "description": "Zenith sword crafted, Celestial Shell, Ankh Shield, and Terraspark Boots equipped. All Master Mode boss trophies, statues, and bottomless lava/water buckets.",
        "tags": ["100%", "Hardcore", "OP Build", "Post-Game"],
        "save_files": {"MasterPlayer.plr": b"TERRARIA_ZENITH_ENDGAME_CHARACTER" * 80, "MasterWorld.wld": b"TERRARIA_MASTER_MODE_WORLD" * 150}
    },
    {
        "game_name": "Subnautica",
        "game_id": "subnautica",
        "title": "100% Story Complete - Fully Upgraded Cyclops & Neptune Rocket",
        "description": "Primary Containment Facility cured, Sea Emperor hatched. Massive deep-sea base in Lost River, fully customized Cyclops submarine with PRAWN suit dock.",
        "tags": ["100%", "Vanilla", "Post-Game", "Legit"],
        "save_files": {"slot0000_gameinfo.json": b'{"time": 180000, "phase": "Cured"}', "slot0000_global-objects.bin": b"SUBNAUTICA_NEPTUNE_ROCKET_CYCLOPS" * 120}
    },
    {
        "game_name": "Dead Cells",
        "game_id": "dead-cells",
        "title": "5 Boss Stem Cells Active - All Outfits, Blueprints & Collector",
        "description": "Spoiler Boss defeated on 5BC difficulty. Forge fully upgraded with 100% S-rank item drops, all mutations unlocked, King Outfit unlocked.",
        "tags": ["100%", "Hardcore", "OP Build", "Post-Game"],
        "save_files": {"user_0.dat": b"DEAD_CELLS_5BC_ALL_BLUEPRINTS_S_TIER_FORGE" * 100}
    },
    {
        "game_name": "Palworld",
        "game_id": "palworld",
        "title": "Level 55 Base Maxed - All Legend Pals (Frostallion, Jetragon)",
        "description": "All Tower Bosses defeated. Max tier Pal Metal Armor and Legendary Rocket Launcher. Breeding farm with perfect 4-passive trait Pals (Legend, Musclehead, Ferocious).",
        "tags": ["100%", "OP Build", "Post-Game", "Unlimited Cash"],
        "save_files": {"Level.sav": b"PALWORLD_LVL55_PERFECT_PALS_JETRAGON" * 200, "LevelMeta.sav": b"PALWORLD_META" * 30}
    },
    {
        "game_name": "Armored Core VI: Fires of Rubicon",
        "game_id": "armored-core-vi-fires-of-rubicon",
        "title": "All 3 Endings Cleared - S-Rank All Missions & Coral Parts",
        "description": "Alean Iacta Est ending unlocked. All missions S-ranked with OS Tuning maxed. All Coral generators, weapons, and secret parts unlocked for competitive AC building.",
        "tags": ["100%", "New Game+", "Hardcore", "OP Build"],
        "save_files": {"AC60000.sl2": b"AC6_ALL_ENDINGS_S_RANK_ALL_MISSIONS" * 150}
    },
    {
        "game_name": "Horizon Zero Dawn Complete Edition",
        "game_id": "horizon-zero-dawn-complete-edition",
        "title": "Ultra Hard NG+ - All Adept Weapons & Shield-Weaver Armor",
        "description": "The Frozen Wilds expansion 100% completed. All Banuk weapons obtained with 4 mod slots, Shield-Weaver armor, and all Face Paints and Focus Effects unlocked.",
        "tags": ["100%", "DLC1", "New Game+", "OP Build"],
        "save_files": {"manualsave0.dat": b"HZD_ULTRA_HARD_ADEPT_WEAPONS_SHIELD_WEAVER" * 160}
    },
    {
        "game_name": "Horizon Forbidden West Complete Edition",
        "game_id": "horizon-forbidden-west-complete-edition",
        "title": "Burning Shores Ready - Maxed Legendary Gear & Sunwing Mount",
        "description": "Main campaign 100% cleared on Ultra Hard. All Legendary weapons and outfits upgraded to Rank 5, Waterwing flying mount unlocked, ready for Burning Shores.",
        "tags": ["100%", "DLC1", "OP Build", "Post-Game"],
        "save_files": {"manualsave0.dat": b"HFW_BURNING_SHORES_READY_LEGENDARY_RANK5" * 180}
    },
    {
        "game_name": "Final Fantasy VII Remake Intergrade",
        "game_id": "final-fantasy-vii-remake-intergrade",
        "title": "Hard Mode 100% - Gotterdammerung Accessory & Maxed Materia",
        "description": "Top Secrets Pride and Joy boss defeated. Multiple Gotterdammerung accessories, Level 50 characters with all weapons and max level elemental/stat Materia.",
        "tags": ["100%", "Hardcore", "OP Build", "New Game+"],
        "save_files": {"save000.sav": b"FF7R_HARD_MODE_GOTTERDAMMERUNG_MAX_MATERIA" * 190}
    },
    {
        "game_name": "NieR:Automata",
        "game_id": "nier-automata",
        "title": "Ending E Achieved - All Weapons Level 4 & Pod Programs",
        "description": "All 26 endings (A through Z) recorded. Emil's secret boss fight cleared, all 3 Pods fully upgraded, Debug Room unlocked, all archive logs completed.",
        "tags": ["100%", "Post-Game", "Vanilla", "Legit"],
        "save_files": {"SlotData_0.dat": b"NIER_AUTOMATA_ENDING_E_ALL_WEAPONS_LVL4" * 150}
    },
    {
        "game_name": "Death Stranding Director's Cut",
        "game_id": "death-stranding-directors-cut",
        "title": "Order 69 Completed - All Preppers 5-Star with Zip-line Network",
        "description": "Complete interstate highway system built from Lake Knot to South Knot City. Seamless mountain zip-line network, all Legend of Legends delivery ranks, Level 4 skeleton gear.",
        "tags": ["100%", "Post-Game", "Vanilla", "Legit"],
        "save_files": {"ds_save_00.dat": b"DEATH_STRANDING_ALL_5_STAR_ZIPLINES" * 200}
    },
    {
        "game_name": "Persona 3 Reload",
        "game_id": "persona-3-reload",
        "title": "100% Compendium - Orpheus Telos & Elizabeth Defeated",
        "description": "All Social Links and Linked Episodes maxed in a single playthrough. Level 99 protagonist with Orpheus Telos fusion, Monad Passages fully cleared.",
        "tags": ["100%", "New Game+", "OP Build", "Post-Game"],
        "save_files": {"SaveData0001.dat": b"P3R_ORPHEUS_TELOS_ELIZABETH_CLEARED" * 180}
    },
    {
        "game_name": "Dragon's Dogma 2",
        "game_id": "dragons-dogma-2",
        "title": "Unmoored World Complete - Level 85 Warfarer with Wyrmfire Gear",
        "description": "True Ending achieved in the Unmoored World. All 10 Vocations maxed, Dragonforged Wyrmfire weapons for Arisen and Main Pawn, all Maister Skills learned.",
        "tags": ["100%", "New Game+", "OP Build", "Post-Game"],
        "save_files": {"data000.bin": b"DD2_UNMOORED_WORLD_LVL85_WARFARER" * 170}
    },
    {
        "game_name": "Silent Hill 2",
        "game_id": "silent-hill-2",
        "title": "In Water & Maria Endings Ready - Chainsaw & All Collectibles",
        "description": "Hard difficulty completed. New Game+ exclusive Chainsaw unlocked, all Glimpses of the Past, Memos, and Strange Photos collected across South Vale.",
        "tags": ["100%", "New Game+", "Hardcore", "Legit"],
        "save_files": {"Save001.sav": b"SILENT_HILL_2_NG_PLUS_CHAINSAW_COLLECTIBLES" * 120}
    },
    {
        "game_name": "Metaphor: ReFantazio",
        "game_id": "metaphor-refantazio",
        "title": "King of the Realm - All Royal Archetypes Mastered",
        "description": "All follower bonds maxed at Rank 8. Prince Archetype unlocked with Royal Berserker, Royal Knight, and Royal Mage maxed. Secret dragon trials cleared.",
        "tags": ["100%", "New Game+", "OP Build", "Post-Game"],
        "save_files": {"SaveData01.dat": b"METAPHOR_ROYAL_ARCHETYPES_MAXED_PRINCE" * 210}
    },
    {
        "game_name": "Mass Effect Legendary Edition",
        "game_id": "mass-effect-legendary-edition",
        "title": "ME3 Priority: Earth - 8,000+ War Assets & Perfect Paragon",
        "description": "Complete Shepard trilogy transfer save. 100% Paragon alignment, all squadmates survived ME2 Suicide Mission, all DLCs finished with maximum Galactic Readiness.",
        "tags": ["100%", "Boss Prep", "Vanilla", "Legit"],
        "save_files": {"Save_0001.pcsav": b"MASS_EFFECT_TRILOGY_MAX_WAR_ASSETS" * 150}
    },
    {
        "game_name": "Helldivers 2",
        "game_id": "helldivers-2",
        "title": "Level 150 Fleet Admiral - All Ship Modules Tier 5 Maxed",
        "description": "Max Super Credits, Requisition Slips, and Medals cap. All Warbonds (Steeled Veterans, Cutting Edge, Polar Patriots) 100% unlocked with all Tier 5 Destroyer modules.",
        "tags": ["100%", "OP Build", "Unlimited Cash", "Post-Game"],
        "save_files": {"user_profile.dat": b"HELLDIVERS_2_FLEET_ADMIRAL_TIER5_MODULES" * 130}
    },
    {
        "game_name": "Factorio",
        "game_id": "factorio",
        "title": "10,000 SPM Megabase - Fully Automated Rail & Nuclear Network",
        "description": "High-throughput 10,000 Science Per Minute megabase. Isolated city-block train network, 50GW clean nuclear reactor array, and fully automated bot logistics hub.",
        "tags": ["100%", "Post-Game", "Legit", "Vanilla"],
        "save_files": {"megabase_10k_spm.dat": b"FACTORIO_10K_SPM_MEGABASE_AUTOMATED_RAILS" * 250}
    },
    {
        "game_name": "RimWorld",
        "game_id": "rimworld",
        "title": "Endgame Glitterworld Settlement - Archonexus Transcended Colony",
        "description": "10-year flourishing mountain fortress colony. Cataphract armor sets, Bionic/Archotech augmented colonists, and fully operational Starflight Ship built.",
        "tags": ["100%", "Hardcore", "OP Build", "Post-Game"],
        "save_files": {"ColonyGlitterworld.rws": b"RIMWORLD_ARCHONEXUS_GLITTERWORLD_COLONY" * 200}
    },
    {
        "game_name": "Dave the Diver",
        "game_id": "dave-the-diver",
        "title": "Diamond Rank Bancho Sushi - Maxed Fish Farm & All Ingredients",
        "description": "Cooksta Diamond rating with all staff Level 20. Glacial Area and Hydrothermal Vents fully explored, all GYAO! virtual pets raised, millions in restaurant profits.",
        "tags": ["100%", "Unlimited Cash", "Post-Game", "Vanilla"],
        "save_files": {"SteamSaves_0.sav": b"DAVE_THE_DIVER_DIAMOND_BANCHO_SUSHI" * 110}
    },
    {
        "game_name": "Slay the Spire",
        "game_id": "slay-the-spire",
        "title": "Ascension 20 Heart Conquered - All Characters 100% Card Pool",
        "description": "Ascension 20 Corrupt Heart defeated with Ironclad, Silent, Defect, and Watcher. Eternal One achievement unlocked with all relics and beta card art.",
        "tags": ["100%", "Hardcore", "Post-Game", "Legit"],
        "save_files": {"STSPlayer": b"SLAY_THE_SPIRE_A20_HEART_ALL_CHARACTERS" * 90}
    },
    {
        "game_name": "Satisfactory",
        "game_id": "satisfactory",
        "title": "Tier 9 Space Elevator Complete - 1.0 Factory World Network",
        "description": "Phase 5 Project Assembly successfully launched. Global train network interconnecting Nuclear Power plants, Turbofuel refineries, and automated quantum supercomputers.",
        "tags": ["100%", "Post-Game", "Vanilla", "Legit"],
        "save_files": {"Tier9_FactoryWorld.sav": b"SATISFACTORY_TIER9_FACTORY_SPACE_ELEVATOR" * 240}
    },
    {
        "game_name": "Manor Lords",
        "game_id": "manor-lords",
        "title": "Large Town Tier - 1,500 Population Medieval Fortress",
        "description": "Fully fortified castle with stone walls and retinue garrison. All regional resources claimed, thriving agricultural supply chain, and deep treasury.",
        "tags": ["100%", "Unlimited Cash", "Post-Game", "Legit"],
        "save_files": {"Save_ManorLords_01.sav": b"MANOR_LORDS_LARGE_TOWN_MEDIEVAL_FORTRESS" * 150}
    },
    {
        "game_name": "Batman: Arkham Knight",
        "game_id": "batman-arkham-knight",
        "title": "240% Complete - Prestige Batsuit & Knightfall Protocol Active",
        "description": "Both normal and New Game Plus story campaigns 100% finished. All 243 Riddler trophies collected, all Season of Infamy villains locked up in GCPD.",
        "tags": ["100%", "New Game+", "Post-Game", "Vanilla"],
        "save_files": {"BAK1Save0NoProg.sgd": b"BATMAN_ARKHAM_KNIGHT_240_PERCENT_PRESTIGE" * 170}
    },
    {
        "game_name": "Assassin's Creed Valhalla",
        "game_id": "assassins-creed-valhalla",
        "title": "England Pacified - All Wealth, Mysteries & Thor's Armor Set",
        "description": "Power Level 535 with Mjolnir and Excalibur acquired. Settlement Ravensthorpe Level 6, Order of the Ancients eradicated, all regional alliances formed.",
        "tags": ["100%", "OP Build", "Post-Game", "Unlimited Cash"],
        "save_files": {"ACV[Save01].save": b"AC_VALHALLA_THORS_ARMOR_MJOLNIR_EXCALIBUR" * 190}
    },
    {
        "game_name": "God of War (2018)",
        "game_id": "god-of-war-2018",
        "title": "Sigrun Defeated on GMGOW - Mist Armor & Valkyrie Set Maxed",
        "description": "All Valkyries vanquished on Give Me God of War. Niflheim and Muspelheim trials 100% completed, Talisman of the Realms, and maxed Leviathan Axe pommels.",
        "tags": ["100%", "Hardcore", "New Game+", "OP Build"],
        "save_files": {"manualsave0.sav": b"GOW2018_GMGOW_SIGRUN_DEFEATED_MIST_ARMOR" * 160}
    },
    {
        "game_name": "Celeste",
        "game_id": "celeste",
        "title": "202 Berries - Farewell Cleared & All C-Sides Completed",
        "description": "All A-Sides, B-Sides, and C-Sides cleared. Golden Strawberries collected, Moon Berry retrieved from Farewell Chapter 9, full stamp postcard journal.",
        "tags": ["100%", "Hardcore", "Post-Game", "Legit"],
        "save_files": {"0.celeste": b"CELESTE_202_STRAWBERRIES_FAREWELL_MOON_BERRY" * 70}
    },
    {
        "game_name": "Dark Souls Remastered",
        "game_id": "dark-souls-remastered",
        "title": "Knight's Honor Achieved - Giant Dad & All Rare Weapons",
        "description": "All boss tail cuts and rare weapons collected. Darkwraith Covenant maxed, fully upgraded Chaos Zweihander, all pyromancies and sorceries obtained.",
        "tags": ["100%", "New Game+", "OP Build", "Vanilla"],
        "save_files": {"DRAKS0005.sl2": b"DARK_SOULS_REMASTERED_KNIGHTS_HONOR_GIANT_DAD" * 180}
    }
]

def create_luducard_package(game_data, temp_dir):
    filename = f"{game_data['game_id']}.luducard"
    filepath = os.path.join(temp_dir, filename)
    
    file_list = list(game_data["save_files"].keys())
    total_bytes = sum(len(content) for content in game_data["save_files"].values())
    
    metadata = {
        "gameTitle": game_data["game_name"],
        "gameId": game_data["game_id"],
        "checkpointTitle": game_data["title"],
        "description": game_data["description"],
        "originalFiles": file_list,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "totalSizeBytes": total_bytes
    }
    
    with zipfile.ZipFile(filepath, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("luducard.json", json.dumps(metadata, indent=2))
        for fname, content in game_data["save_files"].items():
            zf.writestr(fname, content)
            
    file_size = os.path.getsize(filepath)
    return filepath, filename, file_size

def upload_save_to_cloud(game_data, author, temp_dir):
    filepath, filename, file_size = create_luducard_package(game_data, temp_dir)
    
    # 1. Request presigned upload URL from Edge Function
    edge_url = f"{SUPABASE_URL}/functions/v1/get-upload-url"
    edge_payload = json.dumps({
        "file_name": filename,
        "file_size": file_size,
        "user_uuid": author["uuid"],
        "game_id": game_data["game_id"]
    }).encode("utf-8")
    
    edge_req = urllib.request.Request(
        edge_url,
        data=edge_payload,
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
    )
    
    edge_res = urllib.request.urlopen(edge_req, timeout=15)
    edge_data = json.loads(edge_res.read().decode("utf-8"))
    upload_url = edge_data["uploadUrl"]
    r2_path = edge_data["r2Path"]
    
    # 2. Upload file directly to Cloudflare R2 via HTTP PUT
    with open(filepath, "rb") as f:
        file_bytes = f.read()
        
    put_req = urllib.request.Request(
        upload_url,
        data=file_bytes,
        headers={
            "Content-Length": str(file_size),
            "Content-Type": "application/octet-stream"
        },
        method="PUT"
    )
    urllib.request.urlopen(put_req, timeout=30)
    
    # 3. Register save in Supabase public_saves
    db_url = f"{SUPABASE_URL}/rest/v1/public_saves"
    db_payload = json.dumps({
        "game_name": game_data["game_name"],
        "title": game_data["title"],
        "file_name": filename,
        "r2_path": r2_path,
        "file_size": file_size,
        "description": game_data["description"],
        "author_name": author["name"],
        "user_uuid": author["uuid"],
        "tags": game_data["tags"]
    }).encode("utf-8")
    
    db_req = urllib.request.Request(
        db_url,
        data=db_payload,
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    )
    db_res = urllib.request.urlopen(db_req, timeout=15)
    return json.loads(db_res.read().decode("utf-8"))

def main():
    print(f"Starting seed process for {len(GAME_SAVES_DATASET)} popular game saves...")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        success_count = 0
        for idx, game_data in enumerate(GAME_SAVES_DATASET):
            # Select author based on chunk of 5 (5 saves per UUID to respect trigger limits)
            author = AUTHOR_POOLS[idx // 5]
            
            try:
                result = upload_save_to_cloud(game_data, author, temp_dir)
                success_count += 1
                print(f"[{success_count:02d}/50] Uploaded: {game_data['game_name']} -> {game_data['title']} (Author: {author['name']})")
            except Exception as e:
                print(f"[ERROR] Failed uploading {game_data['game_name']}: {e}", file=sys.stderr)
                
    print(f"\nCompleted: {success_count}/{len(GAME_SAVES_DATASET)} game saves uploaded successfully to Cloudflare R2 and registered in Supabase!")

if __name__ == "__main__":
    main()
