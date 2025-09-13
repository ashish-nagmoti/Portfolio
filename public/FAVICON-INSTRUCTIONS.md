# Favicon and OpenGraph Image Instructions

This folder contains SVG templates for favicons and OpenGraph images that need to be converted to the proper formats for use in the website.

## Favicon Generation

1. Use the provided SVG files as templates:
   - `favicon.svg` - Main favicon template
   - `favicon-16x16.svg` - 16x16 favicon template
   - `favicon-32x32.svg` - 32x32 favicon template
   - `apple-touch-icon.svg` - Apple touch icon template
   - `android-chrome-192x192.svg` - Android chrome icon template
   - `android-chrome-512x512.svg` - Android chrome icon template
   - `safari-pinned-tab.svg` - Safari pinned tab template

2. Convert these SVG files to their respective PNG formats with the same names but .png extension.

3. You can use online tools to generate all the necessary favicon files:
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [Favicon.io](https://favicon.io/)

4. Generate and replace the following files:
   - `favicon.ico` - Multi-size icon file
   - `favicon-16x16.png` - 16x16 PNG
   - `favicon-32x32.png` - 32x32 PNG
   - `apple-touch-icon.png` - 180x180 PNG
   - `android-chrome-192x192.png` - 192x192 PNG
   - `android-chrome-512x512.png` - 512x512 PNG

## OpenGraph Image Generation

1. Use the provided SVG template:
   - `og-image.svg` - OpenGraph image template

2. Convert this SVG file to PNG format with dimensions 1200x630:
   - `og-image.png` - OpenGraph image for social sharing

3. You can use tools like Inkscape, GIMP, or online converters to do this.

4. The OpenGraph image is used when sharing your website on social media platforms like Facebook, Twitter, LinkedIn, etc.

## After Generation

Once you've generated all the necessary files, you can delete:
- This README file
- `favicon-instructions.txt`
- `og-image-instructions.txt`
- The SVG templates (if you wish, though keeping them might be useful for future updates)

The website's metadata has already been configured to use these files for favicons and social media sharing.
