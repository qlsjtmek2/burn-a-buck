#!/usr/bin/env python3
"""
App Icon Generator for React Native/Expo Projects

Generates platform-specific icons from a single source icon:
- adaptive-icon.png (Android, 1024x1024, Safe Zone 66%)
- splash-icon.png (Splash screen, 400x400)
- favicon.png (Web, 32x32)

Usage:
    ./generate_icons.py                          # Default: assets/icon.png → assets/
    ./generate_icons.py path/to/icon.png         # Custom source
    ./generate_icons.py path/to/icon.png -o out/ # Custom output directory
"""

import argparse
import os
import sys
from pathlib import Path
from typing import Tuple

try:
    from PIL import Image
except ImportError:
    print("❌ Error: Pillow not installed.")
    print("   Install it with: pip install pillow")
    sys.exit(1)


def resize_with_aspect_ratio(img: Image.Image, target_size: Tuple[int, int]) -> Image.Image:
    """
    Resize image maintaining aspect ratio to fit within target_size.

    Args:
        img: Source PIL Image
        target_size: (width, height) tuple

    Returns:
        Resized PIL Image
    """
    img_width, img_height = img.size
    target_width, target_height = target_size

    # Calculate scaling factor to fit within target
    scale = min(target_width / img_width, target_height / img_height)

    new_width = int(img_width * scale)
    new_height = int(img_height * scale)

    return img.resize((new_width, new_height), Image.Resampling.LANCZOS)


def create_adaptive_icon(source_img: Image.Image, output_path: Path) -> None:
    """
    Create Android adaptive icon with 66% Safe Zone.

    Android adaptive icons are masked differently by each launcher (circular,
    square, rounded-square). Only the central 66% is guaranteed to be visible.

    Args:
        source_img: Source icon (should be 1024x1024 or similar)
        output_path: Output file path
    """
    canvas_size = 1024
    safe_zone_ratio = 0.66  # Android Safe Zone
    safe_size = int(canvas_size * safe_zone_ratio)

    # Resize icon to fit Safe Zone
    icon = resize_with_aspect_ratio(source_img, (safe_size, safe_size))

    # Create transparent canvas
    canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))

    # Center icon on canvas
    icon_x = (canvas_size - icon.width) // 2
    icon_y = (canvas_size - icon.height) // 2
    canvas.paste(icon, (icon_x, icon_y), icon if icon.mode == 'RGBA' else None)

    # Save
    canvas.save(output_path, 'PNG')
    print(f"✅ adaptive-icon.png created ({canvas_size}x{canvas_size}, Safe Zone: {safe_size}x{safe_size})")


def create_splash_icon(source_img: Image.Image, output_path: Path) -> None:
    """
    Create splash screen icon (400x400, transparent background).

    Args:
        source_img: Source icon
        output_path: Output file path
    """
    target_size = 400

    # Resize to fit within 400x400
    icon = resize_with_aspect_ratio(source_img, (target_size, target_size))

    # Create transparent canvas
    canvas = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))

    # Center icon
    icon_x = (target_size - icon.width) // 2
    icon_y = (target_size - icon.height) // 2
    canvas.paste(icon, (icon_x, icon_y), icon if icon.mode == 'RGBA' else None)

    # Save
    canvas.save(output_path, 'PNG')
    print(f"✅ splash-icon.png created ({target_size}x{target_size})")


def create_favicon(source_img: Image.Image, output_path: Path) -> None:
    """
    Create web favicon (32x32, opaque background).

    Favicons need opaque backgrounds. Uses white as fallback.

    Args:
        source_img: Source icon
        output_path: Output file path
    """
    target_size = 32

    # Resize to 32x32
    icon = resize_with_aspect_ratio(source_img, (target_size, target_size))

    # Create white background (favicons need opaque background)
    canvas = Image.new('RGB', (target_size, target_size), (255, 255, 255))

    # If icon has transparency, convert to RGB
    if icon.mode == 'RGBA':
        # Create white background and paste icon
        temp_canvas = Image.new('RGBA', (target_size, target_size), (255, 255, 255, 255))
        icon_x = (target_size - icon.width) // 2
        icon_y = (target_size - icon.height) // 2
        temp_canvas.paste(icon, (icon_x, icon_y), icon)
        icon = temp_canvas.convert('RGB')
    else:
        icon_x = (target_size - icon.width) // 2
        icon_y = (target_size - icon.height) // 2
        canvas.paste(icon, (icon_x, icon_y))
        icon = canvas

    # Save
    icon.save(output_path, 'PNG')
    print(f"✅ favicon.png created ({target_size}x{target_size})")


def main():
    parser = argparse.ArgumentParser(
        description='Generate app icons for React Native/Expo projects',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                          # Default: assets/icon.png → assets/
  %(prog)s path/to/icon.png         # Custom source
  %(prog)s path/to/icon.png -o out/ # Custom output directory
        """
    )
    parser.add_argument(
        'source',
        nargs='?',
        default='assets/icon.png',
        help='Source icon path (default: assets/icon.png)'
    )
    parser.add_argument(
        '-o', '--output',
        default='assets/',
        help='Output directory (default: assets/)'
    )

    args = parser.parse_args()

    # Resolve paths
    source_path = Path(args.source)
    output_dir = Path(args.output)

    # Validate source
    if not source_path.exists():
        print(f"❌ Error: Source icon not found: {source_path}")
        sys.exit(1)

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    # Load source icon
    print(f"📖 Loading source icon: {source_path}")
    try:
        source_img = Image.open(source_path)
    except Exception as e:
        print(f"❌ Error loading image: {e}")
        sys.exit(1)

    # Convert to RGBA if needed
    if source_img.mode != 'RGBA':
        source_img = source_img.convert('RGBA')

    print(f"   Source dimensions: {source_img.width}x{source_img.height}")
    print()

    # Generate icons
    print("🎨 Generating icons...")
    print()

    # 1. Adaptive icon (Android)
    adaptive_path = output_dir / 'adaptive-icon.png'
    create_adaptive_icon(source_img, adaptive_path)

    # 2. Splash icon
    splash_path = output_dir / 'splash-icon.png'
    create_splash_icon(source_img, splash_path)

    # 3. Favicon (web)
    favicon_path = output_dir / 'favicon.png'
    create_favicon(source_img, favicon_path)

    print()
    print("✨ Done! Generated icons:")
    print(f"   - {adaptive_path}")
    print(f"   - {splash_path}")
    print(f"   - {favicon_path}")
    print()
    print("💡 Next steps:")
    print("   1. Verify icons: ls -lh assets/*.png")
    print("   2. Update app.json background colors (splash.backgroundColor, android.adaptiveIcon.backgroundColor)")
    print("   3. Restart dev server: npx expo start --clear")


if __name__ == '__main__':
    main()
