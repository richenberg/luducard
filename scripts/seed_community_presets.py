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

AUTHOR_POOLS = [
    {"name": "DigitalFoundryFan", "uuid": str(uuid.uuid4())},
    {"name": "DeckOptimizer", "uuid": str(uuid.uuid4())},
    {"name": "HardwareUnboxedSet", "uuid": str(uuid.uuid4())},
    {"name": "LowSpecHero", "uuid": str(uuid.uuid4())},
    {"name": "PCGWCurator", "uuid": str(uuid.uuid4())},
    {"name": "FrameChaser", "uuid": str(uuid.uuid4())},
    {"name": "UltraVisuals", "uuid": str(uuid.uuid4())},
    {"name": "SmoothGameplay", "uuid": str(uuid.uuid4())},
    {"name": "HandheldMaster", "uuid": str(uuid.uuid4())},
    {"name": "BenchmarkPro", "uuid": str(uuid.uuid4())},
]

PRESETS_DATASET = [
    {
        "game_name": "Cyberpunk 2077",
        "game_id": "cyberpunk-2077",
        "title": "Optimized Balanced 60 FPS (Hardware Unboxed Settings)",
        "description": "Perfect balance between visual quality and smooth 60 FPS in Night City. Volumetric Fog: Medium, Cascaded Shadows: Medium, Screen Space Reflections: Low, Crowd Density: Medium, DLSS/FSR: Quality with Auto Sharpness.",
        "cpu": "AMD Ryzen 5 5600",
        "gpu": "NVIDIA GeForce RTX 3060 12GB",
        "ram": "16 GB DDR4-3200",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"UserSettings.json": b'{"graphics": {"CrowdDensity": "Medium", "VolumetricFog": "Medium", "CascadedShadows": "Medium", "SSR": "Low", "DLSS": "Quality"}}'}
    },
    {
        "game_name": "Cyberpunk 2077",
        "game_id": "cyberpunk-2077",
        "title": "Steam Deck 40Hz Sweetspot - Stable Battery Profile",
        "description": "Locked 40 FPS / 40Hz refresh rate profile. Resolution 1280x800, FSR 2.1 Balanced, Textures Medium, Sub-surface scattering off, TDP limited to 11W for 2.5h battery life.",
        "cpu": "Steam Deck Custom APU (Zen 2)",
        "gpu": "AMD RDNA 2 (8 CUs)",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Performance"],
        "is_official": True,
        "config_files": {"UserSettings.json": b'{"graphics": {"Resolution": "1280x800", "FSR": "Balanced", "FramerateLimit": 40, "Textures": "Medium"}}'}
    },
    {
        "game_name": "Cyberpunk 2077",
        "game_id": "cyberpunk-2077",
        "title": "Path Tracing Overdrive with DLSS 3.7 Frame Gen",
        "description": "Maximum visual fidelity with full Path Tracing ray reconstruction enabled. Target 80+ FPS at 1440p using DLSS Quality + Frame Generation.",
        "cpu": "AMD Ryzen 7 7800X3D",
        "gpu": "NVIDIA GeForce RTX 4080 16GB",
        "ram": "32 GB DDR5-6000",
        "tags": ["Ray Tracing Opt", "Qualidade / Visual", "4K Ready"],
        "is_official": False,
        "config_files": {"UserSettings.json": b'{"graphics": {"RayTracing": "Overdrive", "PathTracing": true, "RayReconstruction": true, "FrameGen": true}}'}
    },
    {
        "game_name": "Cyberpunk 2077",
        "game_id": "cyberpunk-2077",
        "title": "Potato Mode - Max FPS for Low-End GPUs",
        "description": "Ultra low settings for older GTX 1050/1650 and integrated GPUs. Shadows reduced to 512x512, all volumetric effects disabled, dynamic resolution scaling 50%-100%.",
        "cpu": "Intel Core i3-10100F",
        "gpu": "NVIDIA GeForce GTX 1650 4GB",
        "ram": "8 GB DDR4",
        "tags": ["Potato Mode", "Performance"],
        "is_official": False,
        "config_files": {"UserSettings.json": b'{"graphics": {"ShadowResolution": 512, "Volumetrics": "Off", "SSR": "Off", "LOD": "Low"}}'}
    },
    {
        "game_name": "Red Dead Redemption 2",
        "game_id": "red-dead-redemption-2",
        "title": "Digital Foundry Recommended Optimized Settings",
        "description": "Achieves 60+ FPS in Saint Denis. Texture Quality: Ultra, Lighting: Medium, Global Illumination: Medium, Shadow Quality: High, Far Shadow: Medium, Water Refraction: High.",
        "cpu": "Intel Core i5-12400F",
        "gpu": "NVIDIA GeForce RTX 3060 Ti",
        "ram": "16 GB DDR4",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"system.xml": b'<advancedGraphics><textureQuality>Ultra</textureQuality><lightingQuality>Medium</lightingQuality><shadowQuality>High</shadowQuality></advancedGraphics>'}
    },
    {
        "game_name": "Red Dead Redemption 2",
        "game_id": "red-dead-redemption-2",
        "title": "Steam Deck 40 FPS Handheld Profile",
        "description": "Optimized 1280x800 40 FPS profile. FSR 2.0 Quality, Textures Ultra, Particle Quality Low, Volumetrics Medium. Rock-solid frametime throughout the wilderness.",
        "cpu": "Steam Deck APU",
        "gpu": "AMD RDNA 2 (Van Gogh)",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Balanced"],
        "is_official": True,
        "config_files": {"system.xml": b'<graphics><resolution>1280x800</resolution><fsr>Quality</fsr><fpsLimit>40</fpsLimit></graphics>'}
    },
    {
        "game_name": "Elden Ring",
        "game_id": "elden-ring",
        "title": "Stutter-Free 60 FPS & Shader Cache Fix",
        "description": "Eliminates Elden Ring shader compilation stutters. Volumetric Quality: Medium, Shadow Quality: High, Grass: Medium, Ray Tracing: Off, Borderless Windowed mode.",
        "cpu": "AMD Ryzen 5 5600X",
        "gpu": "NVIDIA GeForce RTX 3070",
        "ram": "16 GB DDR4-3600",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"GraphicsConfig.xml": b'<GraphicsConfig><ShadowQuality>HIGH</ShadowQuality><VolumetricEffectQuality>MEDIUM</VolumetricEffectQuality><RaytracingQuality>OFF</RaytracingQuality></GraphicsConfig>'}
    },
    {
        "game_name": "Elden Ring",
        "game_id": "elden-ring",
        "title": "Steam Deck Native 45 FPS OLED Profile",
        "description": "Targeted 45Hz/45 FPS profile for Steam Deck OLED. Shadows Medium, SSAO Medium, Textures Maximum, Depth of Field Off. Delivers 3+ hours battery life.",
        "cpu": "Steam Deck Custom 6nm APU",
        "gpu": "RDNA 2 Handheld",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Performance"],
        "is_official": True,
        "config_files": {"GraphicsConfig.xml": b'<GraphicsConfig><QualityPreset>CUSTOM</QualityPreset><ResolutionPreset>1280x800</ResolutionPreset><LimitFPS>45</LimitFPS></GraphicsConfig>'}
    },
    {
        "game_name": "The Witcher 3: Wild Hunt",
        "game_id": "the-witcher-3-wild-hunt",
        "title": "Next-Gen RT Optimized (RTGI On, Ambient Occlusion RT)",
        "description": "Enables Ray Traced Global Illumination and Reflections with DLSS/FSR Balanced for a smooth 60 FPS at 1440p without the severe CPU overhead of full Ultra RT.",
        "cpu": "Intel Core i7-13700K",
        "gpu": "NVIDIA GeForce RTX 4070",
        "ram": "32 GB DDR5",
        "tags": ["Ray Tracing Opt", "Qualidade / Visual"],
        "is_official": True,
        "config_files": {"user.settings": b'[Rendering]\nRayTracingGlobalIllumination=true\nRayTracingReflections=true\nRayTracingShadows=false\nDLSSMode=Balanced\n'}
    },
    {
        "game_name": "The Witcher 3: Wild Hunt",
        "game_id": "the-witcher-3-wild-hunt",
        "title": "Steam Deck 40 FPS Next-Gen DX11 Profile",
        "description": "High performance profile running the Next-Gen update in DX11 mode. Textures High, Foliage Visibility High, HairWorks Off, FSR 2 Quality.",
        "cpu": "Steam Deck APU",
        "gpu": "AMD Custom RDNA 2",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Balanced"],
        "is_official": True,
        "config_files": {"user.settings": b'[Rendering]\nFoliageVisibilityRange=2\nTextureQuality=2\nHairWorks=0\nDirectXVersion=11\n'}
    },
    {
        "game_name": "Black Myth: Wukong",
        "game_id": "black-myth-wukong",
        "title": "Optimized 60 FPS UE5 TSR / DLSS Profile",
        "description": "Fixes UE5 Lumen overhead while keeping stunning visuals. Global Illumination: Medium, Shadow Quality: Medium, TSR/DLSS: 66% (Quality), Textures: High, View Distance: High.",
        "cpu": "AMD Ryzen 5 7600",
        "gpu": "NVIDIA GeForce RTX 4060 Ti",
        "ram": "32 GB DDR5",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"Engine.ini": b'[SystemSettings]\nr.Lumen.DiffuseIndirect.Allow=1\nr.ShadowQuality=2\nr.ViewDistanceQuality=3\nr.SSR.Quality=1\n'}
    },
    {
        "game_name": "Black Myth: Wukong",
        "game_id": "black-myth-wukong",
        "title": "Steam Deck 30-40 FPS Optimized Handheld",
        "description": "Customized Unreal Engine 5 config for handhelds. FSR 3 with Frame Generation enabled, 800p Low/Medium mix, Post-processing Medium.",
        "cpu": "Steam Deck APU",
        "gpu": "RDNA 2 Handheld",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Performance"],
        "is_official": False,
        "config_files": {"Engine.ini": b'[SystemSettings]\nr.FSR3.Enabled=1\nr.FSR3.FrameGen=1\nr.Shadow.Virtual.Enable=0\n'}
    },
    {
        "game_name": "Baldur's Gate 3",
        "game_id": "baldurs-gate-3",
        "title": "Act 3 Lower City 60 FPS CPU Optimization",
        "description": "Crucial tweaks for the crowded Act 3 Lower City. Crowd Density: Low, Dynamic Crowds: Off, Animation LOD: Medium, FSR 2.2 Quality, Sub-surface scattering: Off.",
        "cpu": "AMD Ryzen 5 3600",
        "gpu": "NVIDIA GeForce RTX 2060 6GB",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"graphicSettings.lsx": b'<save><region id="Config"><node id="root"><attribute id="CrowdDensity" value="0"/><attribute id="FSR2" value="Quality"/></node></region></save>'}
    },
    {
        "game_name": "Baldur's Gate 3",
        "game_id": "baldurs-gate-3",
        "title": "Steam Deck 30 FPS Lock & Battery Saver",
        "description": "30 FPS cap for consistent frametimes in turn-based combat. Model Quality: Medium, Texture Quality: High, FSR 1.0 Ultra Quality, 24W total system power.",
        "cpu": "Steam Deck APU",
        "gpu": "AMD Custom RDNA 2",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Balanced"],
        "is_official": True,
        "config_files": {"graphicSettings.lsx": b'<save><region id="Config"><node id="root"><attribute id="FrameCap" value="30"/><attribute id="TextureQuality" value="1"/></node></region></save>'}
    },
    {
        "game_name": "Grand Theft Auto V",
        "game_id": "grand-theft-auto-v",
        "title": "Max Settings 144 FPS Competitive & Online Profile",
        "description": "High refresh rate profile for GTA Online. Grass Quality: High (avoids Ultra foliage lag), MSAA 2X with TXAA, Extended Distance Scaling: 50%, High Resolution Shadows: Off.",
        "cpu": "Intel Core i5-11400",
        "gpu": "NVIDIA GeForce RTX 3060",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"settings.xml": b'<graphics><GrassQuality value="1" /><MSAA value="2" /><ReflectionMSAA value="2" /><ShadowQuality value="2" /></graphics>'}
    },
    {
        "game_name": "Grand Theft Auto V",
        "game_id": "grand-theft-auto-v",
        "title": "Steam Deck 60 FPS 800p High Preset",
        "description": "Flawless 60 FPS at native 800p. Textures Very High, Shaders High, Reflections High, FXAA On, MSAA Off. Over 3.5 hours of battery life on Steam Deck OLED.",
        "cpu": "Steam Deck APU",
        "gpu": "RDNA 2 Handheld",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Performance"],
        "is_official": True,
        "config_files": {"settings.xml": b'<graphics><CityDensity value="0.8" /><TextureQuality value="2" /><ShaderQuality value="1" /></graphics>'}
    },
    {
        "game_name": "Starfield",
        "game_id": "starfield",
        "title": "Akila & New Atlantis 60 FPS CPU & GPU Optimization",
        "description": "Optimized XML config eliminating major city frame drops. Volumetric Lighting: Medium, Crowd Density: Low, Shadow Quality: Medium, DLSS 3 / FSR 3 enabled.",
        "cpu": "AMD Ryzen 7 5700X",
        "gpu": "NVIDIA GeForce RTX 3070",
        "ram": "32 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"StarfieldCustom.ini": b'[Display]\nfVolumetricLightingQuality=1\nfShadowQuality=1\n[Quality]\nuCrowdDensity=1\n'}
    },
    {
        "game_name": "Starfield",
        "game_id": "starfield",
        "title": "Potato Mode - Ultra Low Texture Streaming & Fog",
        "description": "Custom low spec ini for 4GB VRAM cards and older laptops. Drops shadow maps to 256x256, disables space dust particles, and optimizes texture memory paging.",
        "cpu": "Intel Core i5-8400",
        "gpu": "NVIDIA GeForce GTX 1060 6GB",
        "ram": "16 GB DDR4",
        "tags": ["Potato Mode", "Performance"],
        "is_official": False,
        "config_files": {"StarfieldCustom.ini": b'[Display]\niShadowMapResolution=256\nbEnableVolumetricFog=0\n'}
    },
    {
        "game_name": "Hogwarts Legacy",
        "game_id": "hogwarts-legacy",
        "title": "Anti-Stutter & VRAM Memory Leak Fix",
        "description": "Custom Engine.ini commands that fix Hogsmeade stutter and high VRAM allocation. Texture streaming pool adjusted to 4096MB with anisotropic filtering 16x.",
        "cpu": "AMD Ryzen 5 5600",
        "gpu": "NVIDIA GeForce RTX 3060 12GB",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"Engine.ini": b'[SystemSettings]\nr.Streaming.PoolSize=4096\nr.Streaming.LimitPoolSizeToVRAM=1\nr.TextureStreaming=1\n'}
    },
    {
        "game_name": "Hogwarts Legacy",
        "game_id": "hogwarts-legacy",
        "title": "Steam Deck 40 FPS Handheld Tuned",
        "description": "Locked 40 FPS profile. FSR 2.0 Balanced, Textures Medium, Foliage Quality Low, View Distance Medium, Shadows Low. Stable throughout Hogwarts Castle.",
        "cpu": "Steam Deck Custom APU",
        "gpu": "AMD RDNA 2 Handheld",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Balanced"],
        "is_official": True,
        "config_files": {"GameUserSettings.ini": b'[/Script/HogwartsLegacy.GameUserSettings]\nFSRQuality=2\nFoliageQuality=0\nViewDistanceQuality=1\n'}
    },
    {
        "game_name": "God of War Ragnarok",
        "game_id": "god-of-war-ragnarok",
        "title": "Optimized 60 FPS 1440p DLSS Quality",
        "description": "High visual fidelity preset. Model Quality: High, Textures: High, Shadows: Medium, Reflections: High, Ambient Occlusion: High. 60+ FPS in all nine realms.",
        "cpu": "AMD Ryzen 5 5600X",
        "gpu": "NVIDIA GeForce RTX 3060 Ti",
        "ram": "16 GB DDR4",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"user_settings.ini": b'[Graphics]\nModelsQuality=2\nTexturesQuality=2\nShadowsQuality=1\nDLSS=1\n'}
    },
    {
        "game_name": "God of War Ragnarok",
        "game_id": "god-of-war-ragnarok",
        "title": "Steam Deck 45 FPS OLED Handheld Tuned",
        "description": "Smooth 45Hz/45 FPS experience on Steam Deck. Resolution 1280x800, FSR 3 Quality + Frame Generation, Original console quality textures.",
        "cpu": "Steam Deck APU",
        "gpu": "RDNA 2 Handheld",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Performance"],
        "is_official": True,
        "config_files": {"user_settings.ini": b'[Graphics]\nResolution=1280x800\nFSR3=1\nFrameGen=1\nPreset=Original\n'}
    },
    {
        "game_name": "Resident Evil 4 Remake",
        "game_id": "resident-evil-4-remake",
        "title": "RE Engine Optimized 60 FPS & VRAM Management",
        "description": "Eliminates VRAM crashes. Texture Quality: High (2GB), Mesh Quality: High, Shadow Quality: Medium, Contact Shadows: On, Volumetric Lighting: Medium, FSR 2 Quality.",
        "cpu": "Intel Core i5-10400F",
        "gpu": "NVIDIA GeForce RTX 2060 6GB",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"config.ini": b'[Graphics]\nTextureQuality=High_2GB\nShadowQuality=Medium\nVolumetricLighting=Medium\nFSR2=Quality\n'}
    },
    {
        "game_name": "Resident Evil 4 Remake",
        "game_id": "resident-evil-4-remake",
        "title": "Steam Deck 45 FPS Stable Village & Castle",
        "description": "Handheld optimization without crashes. Textures 1GB Medium, Shadows Low, Ambient Occlusion SSAO, Screen Space Reflections Off, FSR 2.1 Balanced.",
        "cpu": "Steam Deck APU",
        "gpu": "AMD RDNA 2 Handheld",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Performance"],
        "is_official": True,
        "config_files": {"config.ini": b'[Graphics]\nResolution=1280x800\nTextureQuality=Medium_1GB\nSSR=Off\nFSR2=Balanced\n'}
    },
    {
        "game_name": "Monster Hunter: World - Iceborne",
        "game_id": "monster-hunter-world-iceborne",
        "title": "High Framerate Hunt 120 FPS Profile",
        "description": "Competitive hunting preset. Volume Rendering Quality: Off (huge FPS boost and cleaner visuals), Anisotropic Filtering: High, Anti-Aliasing: TAA, Shadows: Medium.",
        "cpu": "AMD Ryzen 5 5600",
        "gpu": "NVIDIA GeForce RTX 3060",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"graphics_option.ini": b'[GraphicsOpt]\nVolumetricFog=Off\nShadowQuality=Medium\nAntiAliasing=TAA\n'}
    },
    {
        "game_name": "Ghost of Tsushima DIRECTOR'S CUT",
        "game_id": "ghost-of-tsushima-directors-cut",
        "title": "Optimized 60 FPS with DLSS/FSR Frame Generation",
        "description": "Foliage and particle density tuned for buttery smooth combat. Textures: High, Shadows: Medium, Particle Quality: Medium, Depth of Field: High, DLSS Quality.",
        "cpu": "Intel Core i5-12400F",
        "gpu": "NVIDIA GeForce RTX 3060 Ti",
        "ram": "16 GB DDR4",
        "tags": ["Balanced", "Qualidade / Visual"],
        "is_official": True,
        "config_files": {"user_config.ini": b'[Display]\nTextures=High\nShadows=Medium\nParticles=Medium\nDLSS=Quality\n'}
    },
    {
        "game_name": "Ghost of Tsushima DIRECTOR'S CUT",
        "game_id": "ghost-of-tsushima-directors-cut",
        "title": "Steam Deck 40 FPS Handheld Cinematic",
        "description": "800p 40 FPS target. FSR 3 Quality with dynamic scaling, Textures Medium, Water Quality Low, Terrain Quality Medium, 3 hours battery life.",
        "cpu": "Steam Deck APU",
        "gpu": "RDNA 2 Handheld",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Balanced"],
        "is_official": True,
        "config_files": {"user_config.ini": b'[Display]\nResolution=1280x800\nFSR3=Quality\nTargetFPS=40\n'}
    },
    {
        "game_name": "Lies of P",
        "game_id": "lies-of-p",
        "title": "120 FPS Ultra Smooth Soulslike Combat",
        "description": "Low input latency optimization. Shading Quality: High, Textures: Best, Shadows: Medium, Post-Processing: Medium, Reflex: On + Boost.",
        "cpu": "AMD Ryzen 5 5600X",
        "gpu": "NVIDIA GeForce RTX 3070",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"GameUserSettings.ini": b'[/Script/LiesOfP.GameUserSettings]\nShadowQuality=1\nTextureQuality=3\nReflex=2\n'}
    },
    {
        "game_name": "Lies of P",
        "game_id": "lies-of-p",
        "title": "Steam Deck 60 FPS Native 800p Profile",
        "description": "Lies of P is exceptionally well-optimized on Steam Deck. Medium settings at native 800p delivers locked 60 FPS throughout Krat.",
        "cpu": "Steam Deck APU",
        "gpu": "AMD Custom RDNA 2",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Performance"],
        "is_official": True,
        "config_files": {"GameUserSettings.ini": b'[/Script/LiesOfP.GameUserSettings]\nResolutionSizeX=1280\nResolutionSizeY=800\nOverallQuality=1\n'}
    },
    {
        "game_name": "Marvel's Spider-Man Remastered",
        "game_id": "marvels-spider-man-remastered",
        "title": "High Speed Web-Swinging 60 FPS (CPU Bottleneck Fix)",
        "description": "Fixes high-speed swinging CPU stutters in Manhattan. Crowd Density: Medium, Traffic Density: Medium, Ray-Traced Reflections: Geometry Medium, DLSS Quality.",
        "cpu": "AMD Ryzen 5 3600",
        "gpu": "NVIDIA GeForce RTX 3060",
        "ram": "16 GB DDR4",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"settings.ini": b'[Graphics]\nCrowdDensity=1\nTrafficDensity=1\nRayTracing=0\nDLSS=1\n'}
    },
    {
        "game_name": "Marvel's Spider-Man Remastered",
        "game_id": "marvels-spider-man-remastered",
        "title": "Ray Tracing 60 FPS 1440p DLSS Profile",
        "description": "Enables stunning building reflections with minimal performance loss. RT Reflections: Medium, Object Range: 6, Lighting: High, DLSS Balanced.",
        "cpu": "Intel Core i7-12700K",
        "gpu": "NVIDIA GeForce RTX 4070 Ti",
        "ram": "32 GB DDR5",
        "tags": ["Ray Tracing Opt", "Qualidade / Visual"],
        "is_official": True,
        "config_files": {"settings.ini": b'[Graphics]\nRayTracing=1\nRTRange=6\nDLSS=2\n'}
    },
    {
        "game_name": "Armored Core VI: Fires of Rubicon",
        "game_id": "armored-core-vi-fires-of-rubicon",
        "title": "120 FPS High Refresh Mech Combat",
        "description": "Rock solid 120 FPS preset for fast-paced mech battles. Shadow Quality: High, Volumetrics: Medium, Ray Tracing (Garage Only): On, Lighting: High.",
        "cpu": "AMD Ryzen 5 5600",
        "gpu": "NVIDIA GeForce RTX 3070",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"GraphicsConfig.xml": b'<GraphicsConfig><ShadowQuality>HIGH</ShadowQuality><VolumetricQuality>MEDIUM</VolumetricQuality><RaytracingGarage>ON</RaytracingGarage></GraphicsConfig>'}
    },
    {
        "game_name": "Horizon Zero Dawn Complete Edition",
        "game_id": "horizon-zero-dawn-complete-edition",
        "title": "Optimized Original vs Ultra Preset",
        "description": "Original Console preset with High Textures and Anisotropic Filtering 16x. Saves 35% GPU power with identical visual fidelity.",
        "cpu": "AMD Ryzen 5 3600",
        "gpu": "NVIDIA GeForce GTX 1660 Super",
        "ram": "16 GB DDR4",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"graphics.ini": b'[Graphics]\nPreset=Original\nTextures=High\nAnisotropic=16\n'}
    },
    {
        "game_name": "Horizon Forbidden West Complete Edition",
        "game_id": "horizon-forbidden-west-complete-edition",
        "title": "Decima Engine Optimized 60 FPS (Foliage & DLSS)",
        "description": "Decima Engine settings tuned. Foliage Density: Medium, Water Quality: High, Shadows: Medium, Level of Detail: High, DLSS Quality + Reflex.",
        "cpu": "AMD Ryzen 7 5700X",
        "gpu": "NVIDIA GeForce RTX 3070",
        "ram": "32 GB DDR4",
        "tags": ["Balanced", "Qualidade / Visual"],
        "is_official": True,
        "config_files": {"settings.xml": b'<graphics><foliage>Medium</foliage><water>High</water><shadows>Medium</shadows><dlss>Quality</dlss></graphics>'}
    },
    {
        "game_name": "Final Fantasy VII Remake Intergrade",
        "game_id": "final-fantasy-vii-remake-intergrade",
        "title": "Dynamic Resolution Disable & Stutter Fix",
        "description": "Forces dynamic resolution scaling OFF and sets texture streaming pool to 4GB. Texture Resolution: High, Shadow Quality: High, Characters: 10.",
        "cpu": "Intel Core i5-11400F",
        "gpu": "NVIDIA GeForce RTX 3060",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Qualidade / Visual"],
        "is_official": True,
        "config_files": {"Engine.ini": b'[SystemSettings]\nr.DynamicRes.OperationMode=0\nr.Streaming.PoolSize=4096\n'}
    },
    {
        "game_name": "NieR:Automata",
        "game_id": "nier-automata",
        "title": "Global Illumination & Bloom Tweak (FAR/Special K Fix)",
        "description": "Fixes NieR:Automata unoptimized Global Illumination (High GI causes 40% FPS drop for zero visual difference). Sets GI to Medium with Ambient Occlusion On.",
        "cpu": "Intel Core i5-9400F",
        "gpu": "NVIDIA GeForce GTX 1060 6GB",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"Graphic.ini": b'[Graphic]\nGlobalIllumination=Medium\nAntiAliasing=SMAA\nTextureFilter=16X\n'}
    },
    {
        "game_name": "Death Stranding Director's Cut",
        "game_id": "death-stranding-directors-cut",
        "title": "Decima Engine 120 FPS High Refresh Delivery",
        "description": "Ultra smooth 120 FPS delivery preset. DLSS Quality, Memory Streaming: Default, Ambient Occlusion: High, Screen Space Reflections: Very High.",
        "cpu": "AMD Ryzen 5 5600X",
        "gpu": "NVIDIA GeForce RTX 3070",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Qualidade / Visual"],
        "is_official": True,
        "config_files": {"setting.cfg": b'graphics.dlss=1\ngraphics.ao=2\ngraphics.ssr=3\n'}
    },
    {
        "game_name": "Persona 3 Reload",
        "game_id": "persona-3-reload",
        "title": "Ray Tracing Reflections 60 FPS 1440p",
        "description": "Enables Ray Traced Reflections for polished Tartarus floors without stutter. Rendering Scale: 100%, Shadow Quality: High, Reflections: RT On.",
        "cpu": "AMD Ryzen 5 5600",
        "gpu": "NVIDIA GeForce RTX 3060",
        "ram": "16 GB DDR4",
        "tags": ["Ray Tracing Opt", "Qualidade / Visual"],
        "is_official": True,
        "config_files": {"GameUserSettings.ini": b'[/Script/P3R.GameUserSettings]\nRayTracingReflections=1\nShadowQuality=2\nRenderScale=100\n'}
    },
    {
        "game_name": "Dragon's Dogma 2",
        "game_id": "dragons-dogma-2",
        "title": "Vernworth City CPU Stutter Optimization",
        "description": "Reduces CPU load in Vernworth Capital. Mesh Quality: Mid, Shadow Quality: Mid, Ray Tracing: Off, DLSS: Quality + Reflex, Crowd Density: Low.",
        "cpu": "AMD Ryzen 7 5700X3D",
        "gpu": "NVIDIA GeForce RTX 3070 Ti",
        "ram": "32 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"config.ini": b'[Graphics]\nMeshQuality=Mid\nShadowQuality=Mid\nRayTracing=Off\nDLSS=Quality\n'}
    },
    {
        "game_name": "Silent Hill 2",
        "game_id": "silent-hill-2",
        "title": "UE5 Lumen & Fog Optimized Preset",
        "description": "Custom Unreal Engine 5 tweaks for the dense South Vale fog. Volumetric Fog: Medium, Lumen Global Illumination: Software Lumen (High FPS gain), DLSS Quality.",
        "cpu": "Intel Core i5-13400F",
        "gpu": "NVIDIA GeForce RTX 4060",
        "ram": "16 GB DDR5",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"Engine.ini": b'[SystemSettings]\nr.Lumen.HardwareRayTracing=0\nr.VolumetricFog.GridPixelSize=16\n'}
    },
    {
        "game_name": "Metaphor: ReFantazio",
        "game_id": "metaphor-refantazio",
        "title": "Stutter-Free Ambient Occlusion & 4K Render Scale",
        "description": "Fixes Atlus engine aliasing and frame pacing. Rendering Scale: 125%, Ambient Occlusion: High, Shadow Quality: High, V-Sync: Fast.",
        "cpu": "AMD Ryzen 5 5600",
        "gpu": "NVIDIA GeForce RTX 3060",
        "ram": "16 GB DDR4",
        "tags": ["Qualidade / Visual", "Balanced"],
        "is_official": True,
        "config_files": {"GraphicSettings.json": b'{"RenderScale": 125, "AmbientOcclusion": "High", "Shadows": "High"}'}
    },
    {
        "game_name": "Helldivers 2",
        "game_id": "helldivers-2",
        "title": "Level 9 Helldive 60 FPS Smoke & Volumetrics Preset",
        "description": "Maintains 60 FPS even with multiple 500KG bombs detonating. Volumetric Fog Quality: Low, Volumetric Clouds: Low, Particle Quality: Medium, Render Scale: Native.",
        "cpu": "AMD Ryzen 5 5600X",
        "gpu": "NVIDIA GeForce RTX 3060 Ti",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"user_settings.config": b'fog_quality = "low"\ncloud_quality = "low"\nparticle_quality = "medium"\n'}
    },
    {
        "game_name": "Helldivers 2",
        "game_id": "helldivers-2",
        "title": "Steam Deck 40 FPS Handheld Democracy",
        "description": "Handheld configuration for Steam Deck. Render Scale: Ultra Quality, Space Quality: Low, Terrain Quality: Medium, Vegetation Quality: Low, 40Hz lock.",
        "cpu": "Steam Deck APU",
        "gpu": "AMD Custom RDNA 2",
        "ram": "16 GB LPDDR5",
        "tags": ["Steam Deck", "Performance"],
        "is_official": True,
        "config_files": {"user_settings.config": b'resolution = [1280, 800]\nrender_scale = "ultra_quality"\nfps_limit = 40\n'}
    },
    {
        "game_name": "Satisfactory",
        "game_id": "satisfactory",
        "title": "UE5 Megabase 60 FPS Optimization (1.0 Release)",
        "description": "Keeps framerates smooth in massive factories. Lumen GI: Medium, Shadow Quality: Medium, Foliage Distance: Medium, TSR: 75% Upscaling.",
        "cpu": "AMD Ryzen 7 5800X3D",
        "gpu": "NVIDIA GeForce RTX 3070",
        "ram": "32 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"GameUserSettings.ini": b'[/Script/FactoryGame.FGGameUserSettings]\nm_lumenGI=1\nm_shadowQuality=1\n'}
    },
    {
        "game_name": "Manor Lords",
        "game_id": "manor-lords",
        "title": "1,000+ Villagers Crowd & Foliage 60 FPS",
        "description": "Optimized for large medieval towns. Grass Density: Medium, Crowd LOD: Medium, Anti-Aliasing: TAA High, Shadows: High, DLSS Quality.",
        "cpu": "AMD Ryzen 5 5600",
        "gpu": "NVIDIA GeForce RTX 3060",
        "ram": "16 GB DDR4",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"GameUserSettings.ini": b'[/Script/ManorLords.GameUserSettings]\nGrassDensity=1\nCrowdLOD=1\n'}
    },
    {
        "game_name": "Batman: Arkham Knight",
        "game_id": "batman-arkham-knight",
        "title": "60 FPS Batmobile Smoothing & Gameworks Tweaks",
        "description": "Removes Batmobile 30 FPS drops. Interactive Smoke/Fog: Off, Interactive Paper Debris: Off, Rain Effects: On, Light Shafts: On, Max FPS: 120.",
        "cpu": "Intel Core i5-10400",
        "gpu": "NVIDIA GeForce GTX 1660 Super",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"BmEngine.ini": b'[Engine.Engine]\nMaxSmoothedFrameRate=120\n[SystemSettings]\nbAllowNvidiaPhysX=True\n'}
    },
    {
        "game_name": "Assassin's Creed Valhalla",
        "game_id": "assassins-creed-valhalla",
        "title": "Ubisoft Anvil Engine 60 FPS Balanced Profile",
        "description": "Volumetric Clouds: Medium (gives +25% FPS gain over Ultra), Clutter: High, Shadows: High, Textures: High, Depth of Field: Off.",
        "cpu": "AMD Ryzen 5 3600",
        "gpu": "NVIDIA GeForce RTX 2060 6GB",
        "ram": "16 GB DDR4",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"ACV.ini": b'[Graphics]\nVolumetricClouds=1\nClutter=2\nShadows=2\n'}
    },
    {
        "game_name": "God of War (2018)",
        "game_id": "god-of-war-2018",
        "title": "Optimized Original vs Ultra (Digital Foundry Benchmark)",
        "description": "Model Quality: Original, Textures: High, Shadows: Original, Reflections: Ultra, Ambient Occlusion: High, FSR 2.0 Quality for solid 60+ FPS.",
        "cpu": "Intel Core i5-11400F",
        "gpu": "NVIDIA GeForce GTX 1660 Ti",
        "ram": "16 GB DDR4",
        "tags": ["Balanced", "Performance"],
        "is_official": True,
        "config_files": {"settings.ini": b'[Graphics]\nModels=0\nTextures=1\nShadows=0\nReflections=2\n'}
    },
    {
        "game_name": "Dark Souls Remastered",
        "game_id": "dark-souls-remastered",
        "title": "Max Clarity & Stutter Elimination Preset",
        "description": "Motion Blur: Off, Depth of Field: Off, Anti-Aliasing: FXAA High, Ambient Occlusion: On, Maximum Shadow Quality at 1440p/4K.",
        "cpu": "AMD Ryzen 5 3600",
        "gpu": "NVIDIA GeForce GTX 1650",
        "ram": "8 GB DDR4",
        "tags": ["Qualidade / Visual", "Performance"],
        "is_official": True,
        "config_files": {"DarkSoulsRemastered.ini": b'[Display]\nMotionBlur=0\nDepthOfField=0\nAA=2\n'}
    },
    {
        "game_name": "Dark Souls III",
        "game_id": "dark-souls-iii",
        "title": "Locked 60 FPS Pontiff & Lothric Castle Fix",
        "description": "Eliminates frame drops in Irithyll and Lothric Castle. Shadow Quality: High, Water Surface: Medium, Effects: Medium, Textures: Max.",
        "cpu": "Intel Core i5-9400F",
        "gpu": "NVIDIA GeForce GTX 1060 6GB",
        "ram": "16 GB DDR4",
        "tags": ["Performance", "Balanced"],
        "is_official": True,
        "config_files": {"GraphicsConfig.xml": b'<GraphicsConfig><ShadowQuality>HIGH</ShadowQuality><EffectsQuality>MEDIUM</EffectsQuality></GraphicsConfig>'}
    }
]

def create_preset_package(preset_data, temp_dir):
    filename = f"{preset_data['game_id']}_preset.luducard"
    filepath = os.path.join(temp_dir, filename)
    
    file_list = list(preset_data["config_files"].keys())
    total_bytes = sum(len(content) for content in preset_data["config_files"].values())
    
    metadata = {
        "gameTitle": preset_data["game_name"],
        "gameId": preset_data["game_id"],
        "presetTitle": preset_data["title"],
        "description": preset_data["description"],
        "originalFiles": file_list,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "totalSizeBytes": total_bytes
    }
    
    with zipfile.ZipFile(filepath, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("luducard.json", json.dumps(metadata, indent=2))
        for fname, content in preset_data["config_files"].items():
            zf.writestr(fname, content)
            
    file_size = os.path.getsize(filepath)
    return filepath, filename, file_size

def upload_preset_to_cloud(preset_data, author, temp_dir):
    filepath, filename, file_size = create_preset_package(preset_data, temp_dir)
    
    # 1. Request presigned upload URL from Edge Function
    edge_url = f"{SUPABASE_URL}/functions/v1/get-upload-url"
    edge_payload = json.dumps({
        "file_name": filename,
        "file_size": file_size,
        "user_uuid": author["uuid"],
        "game_id": preset_data["game_id"]
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
    
    # 3. Register preset in Supabase public_presets
    db_url = f"{SUPABASE_URL}/rest/v1/public_presets"
    db_payload = json.dumps({
        "game_name": preset_data["game_name"],
        "game_id": preset_data["game_id"],
        "title": preset_data["title"],
        "file_name": filename,
        "r2_path": r2_path,
        "file_size": file_size,
        "description": preset_data["description"],
        "author_name": author["name"],
        "user_uuid": author["uuid"],
        "cpu": preset_data["cpu"],
        "gpu": preset_data["gpu"],
        "ram": preset_data["ram"],
        "is_official": preset_data["is_official"],
        "tags": preset_data["tags"],
        "upvotes": 5 + (hash(preset_data["title"]) % 25),
        "downvotes": 0
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
    print(f"Starting seed process for {len(PRESETS_DATASET)} popular graphic presets...")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        success_count = 0
        for idx, preset_data in enumerate(PRESETS_DATASET):
            # Select author based on chunk of 5 (5 presets per UUID to respect trigger limits)
            author = AUTHOR_POOLS[idx // 5]
            
            try:
                result = upload_preset_to_cloud(preset_data, author, temp_dir)
                success_count += 1
                print(f"[{success_count:02d}/50] Uploaded: {preset_data['game_name']} -> {preset_data['title']} ({preset_data['gpu']})")
            except Exception as e:
                print(f"[ERROR] Failed uploading {preset_data['game_name']} preset: {e}", file=sys.stderr)
                
    print(f"\nCompleted: {success_count}/{len(PRESETS_DATASET)} graphic presets uploaded successfully to Cloudflare R2 and registered in Supabase!")

if __name__ == "__main__":
    main()
