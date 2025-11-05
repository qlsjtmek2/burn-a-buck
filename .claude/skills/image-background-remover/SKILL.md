---
name: image-background-remover
description: Remove backgrounds from images and create multiple styled versions (transparent, solid ambient color, gradient ambient color). This skill should be used when working with image processing, background removal, app icon creation, icon design, transparent backgrounds, or creating assets with ambient color backgrounds. Handles PNG, JPG, and other common image formats.
---

# Image Background Remover

## Purpose

This skill removes backgrounds from images using AI-powered background removal and creates three styled versions optimized for different use cases (app icons, marketing assets, design elements). It automatically extracts the ambient color from the original image and applies it to background variations.

## When to Use

Use this skill when:
- Creating app icons or logo variations
- Removing backgrounds from product photos
- Generating design assets with consistent branding
- Converting images for different background contexts
- Creating multiple styled versions of an image asset
- Preparing images for different platforms (transparent, solid, gradient)

**Trigger keywords:** background removal, 배경 제거, image processing, app icon, transparent background, ambient color, icon design, remove bg

## How to Use

### Prerequisites

The bundled Python script requires the following packages:
```bash
pip install rembg pillow numpy scikit-learn
```

**Note:** `rembg` uses AI models for background removal. First run may download model files (~170MB).

### Basic Usage

**1. Process an image (outputs to same directory):**
```bash
.claude/skills/image-background-remover/scripts/remove_background.py path/to/image.png
```

**2. Specify custom output directory:**
```bash
.claude/skills/image-background-remover/scripts/remove_background.py \
  path/to/image.png \
  -o output/directory/
```

### Output Files

The script generates three versions with the following naming pattern:

**1. Transparent version** (`{name}_transparent.png`)
- Background completely removed
- Object resized to ~480px (slightly smaller than 512x512)
- PNG format with alpha channel
- **Use for:** Overlaying on other backgrounds, flexible design elements

**2. Solid ambient color version** (`{name}_solid.png`)
- 512x512 canvas with solid background
- Background color extracted from original image (dominant non-extreme color)
- Object centered at ~85% of canvas size
- **Use for:** Consistent branding, simple backgrounds

**3. Gradient ambient color version** (`{name}_gradient.png`)
- 512x512 canvas with vertical gradient
- Gradient uses lighter shade at top, darker at bottom
- Based on extracted ambient color
- Object centered at ~85% of canvas size
- **Use for:** Premium look, modern design aesthetic

### Example Workflow

**Creating app icon variations:**
```bash
# User provides icon image
input_image="assets/icon-design.svg"

# Convert SVG to PNG first (if needed)
# Then run background removal
.claude/skills/image-background-remover/scripts/remove_background.py \
  assets/icon-design.png \
  -o assets/icons/

# Outputs:
# - assets/icons/icon-design_transparent.png
# - assets/icons/icon-design_solid.png
# - assets/icons/icon-design_gradient.png
```

**Processing product photos:**
```bash
# Remove background from product image
.claude/skills/image-background-remover/scripts/remove_background.py \
  photos/product.jpg \
  -o assets/processed/

# Use transparent version for web overlays
# Use solid version for consistent catalog
# Use gradient version for premium marketing
```

### Ambient Color Extraction

The script automatically extracts the dominant ambient color using K-means clustering:
- Analyzes the original image (not the background-removed version)
- Filters out extreme values (very dark/bright pixels)
- Selects the most representative color for backgrounds
- Falls back to neutral gray if extraction fails

**Example output:**
```
🎨 Extracting ambient color...
   Ambient color: RGB(245, 158, 11)
```

### Technical Details

**Background Removal:**
- Uses `rembg` library with U2-Net model
- Handles complex edges and hair details
- Works with various image formats (PNG, JPG, WebP)

**Image Processing:**
- Maintains aspect ratio during resizing
- Uses LANCZOS resampling for high quality
- Preserves alpha channel for smooth edges
- Centers objects automatically

**Color Extraction:**
- K-means clustering with 5 color groups
- Excludes shadows and highlights
- Samples from downscaled version for speed
- Returns most common non-extreme color

### Troubleshooting

**Issue: Script fails with import error**
```bash
# Install all required dependencies
pip install rembg pillow numpy scikit-learn
```

**Issue: First run is slow**
- `rembg` downloads AI model files (~170MB) on first use
- Subsequent runs are faster
- Model cached in `~/.u2net/`

**Issue: Ambient color looks wrong**
- Original image may have unusual color distribution
- Manually specify color if needed (script can be modified)
- Try preprocessing image to enhance dominant colors

**Issue: Object too small/large in output**
- Transparent version: Fixed at ~480px
- Solid/gradient versions: 85% of 512x512 canvas
- Modify `target_size` or `max_size` parameters in script if needed

### Advanced: Script Customization

The Python script can be modified for custom requirements:

**Adjust object size:**
```python
# In create_transparent_version()
target_size = 480  # Change this value (default: 480)

# In create_solid_background_version() and create_gradient_background_version()
max_size = int(canvas_size * 0.85)  # Change 0.85 to desired ratio
```

**Change canvas size:**
```python
# Modify canvas_size parameter (default: 512)
canvas_size = 1024  # For larger output
```

**Customize gradient direction:**
```python
# In create_gradient_background_version()
# Current: vertical gradient (top to bottom)
# For horizontal gradient, swap x and y in interpolation
```

## Resources

### scripts/

**remove_background.py** - Main background removal and styling script

Features:
- AI-powered background removal (rembg + U2-Net)
- Automatic ambient color extraction (K-means clustering)
- Three styled output versions (transparent, solid, gradient)
- Command-line interface with flexible options
- High-quality image processing (LANCZOS resampling)

Dependencies: `rembg`, `Pillow`, `numpy`, `scikit-learn`

---

**Skill Status**: COMPLETE ✅
**Line Count**: <500 (following 500-line rule) ✅
**Progressive Disclosure**: All technical details in main file (no references needed) ✅
