---
name: app-icon-generator
description: Generate app icons for React Native/Expo projects from a single source icon. Automatically creates adaptive-icon.png (Android), splash-icon.png (splash screen), and favicon.png (web) with proper dimensions and optimizations. Use when setting up app branding, updating icons, or creating multi-platform icon assets.
---

# App Icon Generator

## Purpose

This skill automates the generation of all required icon assets for React Native/Expo projects from a single source icon (typically `icon.png`). It creates platform-specific icons with proper dimensions, Safe Zone optimization for Android, and transparent backgrounds where needed.

## When to Use

Use this skill when:
- Setting up branding for a new React Native/Expo project
- Updating app icons across all platforms
- Converting a single icon design to multi-platform assets
- Creating splash screen and web favicon from main app icon
- Ensuring Android adaptive icon follows Safe Zone guidelines (66% safe area)

**Trigger keywords:** app icon, 앱 아이콘, adaptive icon, splash icon, favicon, icon generation, 아이콘 생성, multi-platform icons

## How to Use

### Prerequisites

The bundled Python script requires only Pillow:
```bash
pip install pillow
```

### Basic Usage

**1. Generate all icons from icon.png (default):**
```bash
.claude/skills/app-icon-generator/scripts/generate_icons.py
```

**2. Specify custom source icon:**
```bash
.claude/skills/app-icon-generator/scripts/generate_icons.py path/to/custom-icon.png
```

**3. Specify custom output directory:**
```bash
.claude/skills/app-icon-generator/scripts/generate_icons.py \
  assets/icon.png \
  -o output/directory/
```

### Output Files

The script generates three platform-specific icons:

**1. adaptive-icon.png** (Android Adaptive Icon)
- Dimensions: 1024x1024
- Format: PNG with alpha channel (transparent background)
- Safe Zone: Icon scaled to 66% (675x675) and centered
- **Purpose:** Android 8.0+ adaptive icons (circular, square, rounded-square masks)
- **Location:** `assets/adaptive-icon.png`

**2. splash-icon.png** (Splash Screen Icon)
- Dimensions: 400x400
- Format: PNG with alpha channel (transparent background)
- Scaling: Maintains aspect ratio, fits within 400x400
- **Purpose:** App splash screen (loading screen)
- **Location:** `assets/splash-icon.png`

**3. favicon.png** (Web Favicon)
- Dimensions: 32x32
- Format: PNG (opaque background - white fallback)
- Scaling: High-quality downsampling with LANCZOS
- **Purpose:** Browser tab icon for web builds
- **Location:** `assets/favicon.png`

### Example Workflow

**Setting up branding for new project:**
```bash
# 1. Place your main icon in assets/
cp ~/Downloads/my-app-icon.png assets/icon.png

# 2. Generate all platform-specific icons
.claude/skills/app-icon-generator/scripts/generate_icons.py

# 3. Verify generated files
ls -lh assets/*.png

# Output:
# - assets/icon.png (source, 1024x1024)
# - assets/adaptive-icon.png (Android, 1024x1024, Safe Zone)
# - assets/splash-icon.png (Splash, 400x400)
# - assets/favicon.png (Web, 32x32)
```

**Updating icons after rebrand:**
```bash
# 1. Update source icon
cp ~/new-branding/icon.png assets/icon.png

# 2. Regenerate all icons
.claude/skills/app-icon-generator/scripts/generate_icons.py

# 3. Update app.json background colors (if needed)
# Edit splash.backgroundColor and android.adaptiveIcon.backgroundColor
```

### Android Adaptive Icon Safe Zone

**Why Safe Zone Matters:**
- Android adaptive icons are masked differently by each device launcher
- Outer 17% may be cropped (circular, square, rounded-square masks)
- Only the central 66% is guaranteed to be visible

**This script's approach:**
1. Reads source icon (1024x1024)
2. Scales icon to 675x675 (66% of 1024)
3. Centers on transparent 1024x1024 canvas
4. Outer 17% padding ensures no important content is cropped

**Visual representation:**
```
┌─────────────────┐
│ ░░░░░░░░░░░░░░░ │ ← May be cropped (17%)
│ ░┌───────────┐░ │
│ ░│           │░ │
│ ░│   Icon    │░ │ ← Safe Zone (66%)
│ ░│           │░ │
│ ░└───────────┘░ │
│ ░░░░░░░░░░░░░░░ │ ← May be cropped (17%)
└─────────────────┘
```

### app.json Configuration

After generating icons, ensure your `app.json` is configured correctly:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#F59E0B"  // Your theme color
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F59E0B"  // Match splash backgroundColor
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### Technical Details

**Image Processing:**
- Uses Pillow (PIL) for high-quality image manipulation
- LANCZOS resampling for smooth downscaling
- Alpha channel preserved for transparency
- Automatic centering on canvas

**Aspect Ratio Handling:**
- Maintains aspect ratio during resize
- Non-square icons fit within target dimensions
- No stretching or distortion

**Safe Zone Calculation:**
- Android Safe Zone: 66% of canvas width/height
- Formula: `safe_size = canvas_size * 0.66`
- Example: 1024px × 0.66 = 675px (Safe Zone)

### Troubleshooting

**Issue: Script fails with import error**
```bash
# Install Pillow
pip install pillow
```

**Issue: Generated icons look too small**
- Ensure source icon is high resolution (≥1024x1024)
- Check source icon has no excessive padding
- Android adaptive icon intentionally scaled to 66% (Safe Zone)

**Issue: Favicon loses transparency**
- Intended behavior - favicons need opaque background
- White background used as fallback
- Edit script to change background color if needed

**Issue: Icons appear blurry**
- Source icon resolution too low
- Use 1024x1024 or higher source icon
- Script uses LANCZOS for high-quality downscaling

### Best Practices

1. **Source Icon Quality:**
   - Use 1024x1024 or larger PNG
   - Include minimal padding (icon should fill most of canvas)
   - Use transparent background if possible

2. **Theme Consistency:**
   - Set `splash.backgroundColor` to match your theme
   - Use same color for `android.adaptiveIcon.backgroundColor`
   - Reference colors from `src/theme/colors.ts`

3. **Testing:**
   - Test adaptive icon on multiple Android devices/launchers
   - Verify splash screen on different screen sizes
   - Check favicon in browser (web build)

4. **Version Control:**
   - Commit generated icons to git
   - Re-run script after icon updates
   - Update `app.json` background colors as needed

## Integration with Expo

**Development:**
- Changes take effect after restarting dev server
- Use `npx expo start --clear` to clear cache

**Production Build:**
- Icons bundled in EAS Build automatically
- No additional configuration needed

**OTA Updates:**
- Icon changes require new build (not OTA-updatable)
- Only code changes can be pushed via OTA

## Related Skills

- **app-visual-generator**: Generate AI prompts for icon designs
- **image-background-remover**: Remove backgrounds from icon images
- **app-deployment**: Build and deploy with new icons
