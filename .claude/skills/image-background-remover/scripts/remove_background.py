#!/usr/bin/env python3
"""
Image Background Remover Script

Removes background from an image and creates three versions:
1. Transparent background (object only, slightly smaller than square)
2. Solid ambient color background (512x512)
3. Gradient ambient color background (512x512)

Requirements:
- rembg (background removal)
- Pillow (image processing)
- numpy (color extraction)
- scikit-learn (color clustering)

Install: pip install rembg pillow numpy scikit-learn
"""

import argparse
import sys
from pathlib import Path
from typing import Tuple

try:
    from rembg import remove
    from PIL import Image, ImageDraw
    import numpy as np
    from sklearn.cluster import KMeans
except ImportError as e:
    print(f"Error: Missing required library. Install with:", file=sys.stderr)
    print("pip install rembg pillow numpy scikit-learn", file=sys.stderr)
    sys.exit(1)


def extract_ambient_color(image: Image.Image, n_colors: int = 5) -> Tuple[int, int, int]:
    """
    Extract the dominant ambient color from an image using K-means clustering.

    Args:
        image: PIL Image object
        n_colors: Number of colors to cluster (default: 5)

    Returns:
        RGB tuple of the dominant color
    """
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Resize for faster processing
    image_small = image.copy()
    image_small.thumbnail((100, 100))

    # Convert to numpy array
    pixels = np.array(image_small)
    pixels = pixels.reshape(-1, 3)

    # Remove very dark and very bright pixels (likely shadows/highlights)
    mask = (pixels.sum(axis=1) > 30) & (pixels.sum(axis=1) < 700)
    pixels = pixels[mask]

    if len(pixels) == 0:
        return (128, 128, 128)  # Default gray

    # Apply K-means clustering
    kmeans = KMeans(n_clusters=min(n_colors, len(pixels)), random_state=42, n_init=10)
    kmeans.fit(pixels)

    # Get cluster centers and their counts
    colors = kmeans.cluster_centers_
    labels = kmeans.labels_
    counts = np.bincount(labels)

    # Find the most common color (excluding extreme values)
    sorted_indices = np.argsort(counts)[::-1]
    for idx in sorted_indices:
        color = colors[idx]
        # Check if color is not too dark or too bright
        if 40 < color.sum() < 650:
            return tuple(map(int, color))

    # Fallback to most common color
    dominant_color = colors[counts.argmax()]
    return tuple(map(int, dominant_color))


def remove_background_from_image(input_path: str) -> Image.Image:
    """
    Remove background from image using rembg.

    Args:
        input_path: Path to input image

    Returns:
        PIL Image with transparent background (RGBA)
    """
    print(f"📂 Loading image: {input_path}")

    with open(input_path, 'rb') as input_file:
        input_data = input_file.read()

    print("🔄 Removing background...")
    output_data = remove(input_data)

    # Convert to PIL Image
    from io import BytesIO
    output_image = Image.open(BytesIO(output_data))

    return output_image


def create_transparent_version(image: Image.Image, target_size: int = 480) -> Image.Image:
    """
    Create version with transparent background, object slightly smaller than square.

    Args:
        image: Image with transparent background
        target_size: Target size (default: 480, slightly less than 512)

    Returns:
        Resized image with transparent background
    """
    # Get bounding box of non-transparent pixels
    bbox = image.getbbox()
    if bbox:
        image = image.crop(bbox)

    # Resize maintaining aspect ratio
    image.thumbnail((target_size, target_size), Image.Resampling.LANCZOS)

    return image


def create_solid_background_version(
    image: Image.Image,
    bg_color: Tuple[int, int, int],
    canvas_size: int = 512
) -> Image.Image:
    """
    Create version with solid ambient color background.

    Args:
        image: Image with transparent background
        bg_color: RGB color for background
        canvas_size: Canvas size (default: 512x512)

    Returns:
        Image with solid background
    """
    # Create canvas with solid color
    canvas = Image.new('RGB', (canvas_size, canvas_size), bg_color)

    # Get bounding box and resize object
    bbox = image.getbbox()
    if bbox:
        image_cropped = image.crop(bbox)
    else:
        image_cropped = image

    # Resize to fit canvas (leaving some padding)
    max_size = int(canvas_size * 0.85)
    image_cropped.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

    # Center the object on canvas
    x = (canvas_size - image_cropped.width) // 2
    y = (canvas_size - image_cropped.height) // 2

    # Paste with alpha channel for smooth edges
    canvas.paste(image_cropped, (x, y), image_cropped)

    return canvas


def create_gradient_background_version(
    image: Image.Image,
    bg_color: Tuple[int, int, int],
    canvas_size: int = 512
) -> Image.Image:
    """
    Create version with gradient ambient color background.

    Args:
        image: Image with transparent background
        bg_color: Base RGB color for gradient
        canvas_size: Canvas size (default: 512x512)

    Returns:
        Image with gradient background
    """
    # Create gradient background (lighter at top, darker at bottom)
    gradient = Image.new('RGB', (canvas_size, canvas_size))
    draw = ImageDraw.Draw(gradient)

    # Calculate lighter and darker versions of ambient color
    r, g, b = bg_color
    light_factor = 1.3
    dark_factor = 0.7

    color_light = (
        min(255, int(r * light_factor)),
        min(255, int(g * light_factor)),
        min(255, int(b * light_factor))
    )
    color_dark = (
        int(r * dark_factor),
        int(g * dark_factor),
        int(b * dark_factor)
    )

    # Draw gradient
    for y in range(canvas_size):
        # Interpolate between light and dark
        ratio = y / canvas_size
        color = (
            int(color_light[0] * (1 - ratio) + color_dark[0] * ratio),
            int(color_light[1] * (1 - ratio) + color_dark[1] * ratio),
            int(color_light[2] * (1 - ratio) + color_dark[2] * ratio)
        )
        draw.line([(0, y), (canvas_size, y)], fill=color)

    # Get bounding box and resize object
    bbox = image.getbbox()
    if bbox:
        image_cropped = image.crop(bbox)
    else:
        image_cropped = image

    # Resize to fit canvas (leaving some padding)
    max_size = int(canvas_size * 0.85)
    image_cropped.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

    # Center the object on canvas
    x = (canvas_size - image_cropped.width) // 2
    y = (canvas_size - image_cropped.height) // 2

    # Paste with alpha channel for smooth edges
    gradient.paste(image_cropped, (x, y), image_cropped)

    return gradient


def main():
    parser = argparse.ArgumentParser(
        description="Remove background and create styled versions of an image"
    )
    parser.add_argument("input", help="Input image path")
    parser.add_argument(
        "-o", "--output-dir",
        help="Output directory (default: same as input)",
        default=None
    )

    args = parser.parse_args()

    # Validate input
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"❌ Error: Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    # Determine output directory
    if args.output_dir:
        output_dir = Path(args.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
    else:
        output_dir = input_path.parent

    # Generate output filenames
    base_name = input_path.stem
    transparent_path = output_dir / f"{base_name}_transparent.png"
    solid_path = output_dir / f"{base_name}_solid.png"
    gradient_path = output_dir / f"{base_name}_gradient.png"

    # Step 1: Remove background
    image_no_bg = remove_background_from_image(str(input_path))

    # Step 2: Extract ambient color from original image
    print("🎨 Extracting ambient color...")
    original_image = Image.open(input_path)
    ambient_color = extract_ambient_color(original_image)
    print(f"   Ambient color: RGB{ambient_color}")

    # Step 3: Create transparent version
    print("✨ Creating transparent version...")
    transparent_version = create_transparent_version(image_no_bg, target_size=480)
    transparent_version.save(transparent_path, 'PNG')
    print(f"   ✅ Saved: {transparent_path}")

    # Step 4: Create solid background version
    print("🎨 Creating solid background version...")
    solid_version = create_solid_background_version(image_no_bg, ambient_color)
    solid_version.save(solid_path, 'PNG')
    print(f"   ✅ Saved: {solid_path}")

    # Step 5: Create gradient background version
    print("🌈 Creating gradient background version...")
    gradient_version = create_gradient_background_version(image_no_bg, ambient_color)
    gradient_version.save(gradient_path, 'PNG')
    print(f"   ✅ Saved: {gradient_path}")

    print("\n✨ All versions created successfully!")
    print(f"📁 Output directory: {output_dir}")


if __name__ == "__main__":
    main()
