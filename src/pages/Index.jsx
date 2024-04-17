import { Box, Circle, Text, VStack } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

const ColorWheel = () => {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      drawColorWheel(canvas, ctx, 150);
    }
  }, []);

  const handleMouseMove = (event) => {
    const canvas = event.target;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const rgbToHex = (r, g, b) =>
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("");
    setSelectedColor(rgbToHex(imageData[0], imageData[1], imageData[2]));
  };

  const drawColorWheel = (canvas, ctx, radius) => {
    let image = ctx.createImageData(2 * radius, 2 * radius);
    let data = image.data;

    for (let x = -radius; x < radius; x++) {
      for (let y = -radius; y < radius; y++) {
        let [r, phi] = xyToPolar(x, y);

        if (r > radius) {
          continue;
        }

        let deg = radToDeg(phi);
        let [red, green, blue] = hslToRgb(deg, r / radius, 1);

        let index = (x + radius + (y + radius) * image.width) * 4;
        data[index] = red;
        data[index + 1] = green;
        data[index + 2] = blue;
        data[index + 3] = 255; // alpha
      }
    }

    ctx.putImageData(image, 0, 0);
  };

  const xyToPolar = (x, y) => {
    let r = Math.sqrt(x * x + y * y);
    let phi = Math.atan2(y, x);
    return [r, phi];
  };

  const radToDeg = (rad) => {
    return ((rad + Math.PI) / (2 * Math.PI)) * 360;
  };

  const hslToRgb = (h, s, l) => {
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [255 * (r + m), 255 * (g + m), 255 * (b + m)];
  };

  return (
    <VStack spacing={4}>
      <canvas width="300" height="300" onMouseMove={handleMouseMove} ref={canvasRef} />
      <Circle size="50px" bg={selectedColor} />
      <Text>{selectedColor}</Text>
    </VStack>
  );
};

export default ColorWheel;
