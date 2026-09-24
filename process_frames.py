import os
import glob
from PIL import Image, ImageEnhance, ImageFilter

INPUT_DIR = 'public/video-frames'
OUTPUT_DIR = 'public/video-frames-premium'
CLOUD_IMG = 'public/cloudy_background.jpg'
TRANSITION_FRAMES = 40

def enhance_image(img):
    # Apply premium contrast and color pop
    enhancer_contrast = ImageEnhance.Contrast(img)
    img = enhancer_contrast.enhance(1.2)
    enhancer_color = ImageEnhance.Color(img)
    img = enhancer_color.enhance(1.2)
    return img

def zoom_image(img, scale):
    width, height = img.size
    new_width = int(width * scale)
    new_height = int(height * scale)
    img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Crop back to center
    left = (new_width - width) / 2
    top = (new_height - height) / 2
    right = (new_width + width) / 2
    bottom = (new_height + height) / 2
    return img_resized.crop((left, top, right, bottom))

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # 1. Load and prep the cloud image
    cloud = Image.open(CLOUD_IMG).convert('RGB')
    
    # Ensure cloud is 1920x1080 to match video frames
    cloud = cloud.resize((1920, 1080), Image.Resampling.LANCZOS)

    # 2. Get video frames
    frames = sorted(glob.glob(os.path.join(INPUT_DIR, 'frame_*.png')))
    if not frames:
        print("No frames found!")
        return

    first_frame = Image.open(frames[0]).convert('RGB')
    first_frame_enhanced = enhance_image(first_frame)
    first_frame_enhanced = first_frame_enhanced.resize((1920, 1080), Image.Resampling.LANCZOS)

    last_frame = Image.open(frames[-1]).convert('RGB')
    last_frame_enhanced = enhance_image(last_frame)
    last_frame_enhanced = last_frame_enhanced.resize((1920, 1080), Image.Resampling.LANCZOS)

    current_idx = 1

    # 3. Generate Intro Transition (Cloud -> First Frame)
    print("Generating Intro Transition...")
    for i in range(TRANSITION_FRAMES):
        alpha = i / (TRANSITION_FRAMES - 1)
        # Slight zoom out on the cloud
        scale = 1.1 - (0.1 * alpha)
        cloud_zoomed = zoom_image(cloud, scale)
        
        # Blend
        blended = Image.blend(cloud_zoomed, first_frame_enhanced, alpha)
        blended.save(os.path.join(OUTPUT_DIR, f'frame_{current_idx:04d}.png'))
        current_idx += 1

    # 4. Enhance and copy main frames
    print("Enhancing Main Frames...")
    for frame_path in frames:
        img = Image.open(frame_path).convert('RGB')
        img_enhanced = enhance_image(img)
        img_enhanced = img_enhanced.resize((1920, 1080), Image.Resampling.LANCZOS)
        img_enhanced.save(os.path.join(OUTPUT_DIR, f'frame_{current_idx:04d}.png'))
        current_idx += 1

    # 5. Generate Outro Transition (Last Frame -> Cloud)
    print("Generating Outro Transition...")
    for i in range(TRANSITION_FRAMES):
        alpha = i / (TRANSITION_FRAMES - 1)
        # Slight zoom in on the cloud for outro
        scale = 1.0 + (0.1 * alpha)
        cloud_zoomed = zoom_image(cloud, scale)
        
        # Blend (alpha represents cloud, so we blend last_frame with cloud)
        blended = Image.blend(last_frame_enhanced, cloud_zoomed, alpha)
        blended.save(os.path.join(OUTPUT_DIR, f'frame_{current_idx:04d}.png'))
        current_idx += 1

    print(f"Done! Generated {current_idx - 1} frames.")

if __name__ == "__main__":
    main()
