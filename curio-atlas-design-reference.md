# Curio Atlas Design Reference

Source URL: http://127.0.0.1:4175/?theme=curio-atlas

## Font Family

Primary UI font:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Display / heading font:

```css
Georgia, "Times New Roman", serif
```

Social icon fallback:

```css
Arial, sans-serif
```

## Color Palette

Core theme tokens:

```css
--paper: #fbfaf5;
--paper-soft: #f4f2ec;
--atlas-ink: #20292c;
--atlas-muted: #858b8c;
--atlas-line: #e7e2d9;
--atlas-card: #fffefa;
--atlas-teal: #6b9299;
--atlas-teal-dark: #527b83;
--atlas-cream: #f3e7d3;
--aqua: #9eb8bb;
```

Main usage:

```css
Page background: #fbfaf5 / #f6f4ef / #e6e4dd;
Card background: #fffefa;
Primary text: #20292c;
Muted text: #858b8c, #606a6c, #4d5658;
Primary button: #668f96;
Icon button: #668f96;
Tag / pill background: #f3e7d3;
Border line: #e7e2d9;
```

Shadow:

```css
0 18px 42px rgba(52, 58, 55, 0.1)
```

## Font Sizes

Common sizes:

```css
Spec panel title: 34px;
Splash title: 34px;
Main onboarding headings: 30px / 34px;
Chat hero title: 32px;
Chat header title: 22px;
Parent/stat large numbers: 24px / 25px;
Body text: 14px - 16px;
Small labels: 10px - 12px;
Buttons: 13px - 15px;
Timer text: 11px - 13px;
Icon button glyphs: 28px - 34px;
```

Heading style:

```css
font-family: Georgia, "Times New Roman", serif;
font-weight: 800;
letter-spacing: 0;
color: #20292c;
```

Body style:

```css
font-family: Inter, system-ui, sans-serif;
color: #4d5658;
```

## Icons / Visual Symbols

Used in the app:

```text
Logo image: safe-searchai-logo.png
Back icon: ‹
Home icon: ⌂
Timer icon: ◷
Upload image icon: +
Voice icon: CSS-built microphone shape
Submit icon: SVG paper-plane arrow
Close icon: ×
Google icon: G text mark
Apple icon: inline SVG Apple mark
Facebook icon: f text mark
Profile avatar: ravin.jpg
Timer ring: CSS conic-gradient circle
Shield/check visuals: CSS shapes
Chat bubbles/report bars: CSS animation shapes
```

## Button / Component Style

Primary button:

```css
background: #668f96;
color: #fff;
box-shadow: 0 12px 24px rgba(82, 123, 131, 0.18);
border-radius: 999px;
```

Cards:

```css
background: #fffefa;
border: 1px solid #e7e2d9;
box-shadow: 0 18px 42px rgba(52, 58, 55, 0.1);
```

Pills / tags:

```css
background: #f3e7d3;
color: #6e5e42;
border-radius: 999px;
```
