import React, { useEffect, useState } from 'react';

export default function TracePage() {
  const [malePath, setMalePath] = useState('');
  const [femalePath, setFemalePath] = useState('');
  const [log, setLog] = useState('');

  useEffect(() => {
    async function runTrace() {
      try {
        const results = {};
        for (const gender of ['male', 'female']) {
          const img = new Image();
          img.src = gender === 'male' ? '/croquis-male.png' : '/croquis-female.png';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error(`Failed to load /croquis-${gender}.png`));
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const width = canvas.width;
          const height = canvas.height;

          // Helper to check if pixel is dark (part of line art)
          const isDark = (x, y) => {
            if (x < 0 || x >= width || y < 0 || y >= height) return false;
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            const a = data[idx+3];
            if (a < 50) return false; // transparent
            return r < 240 && g < 240 && b < 240; // dark enough
          };

          // Find segments for each row Y
          const rows = [];
          for (let y = 0; y < height; y++) {
            const segments = [];
            let inSeg = false;
            let startX = -1;
            for (let x = 0; x < width; x++) {
              if (isDark(x, y)) {
                if (!inSeg) {
                  inSeg = true;
                  startX = x;
                }
              } else {
                if (inSeg) {
                  inSeg = false;
                  segments.push({ start: startX, end: x - 1 });
                }
              }
            }
            if (inSeg) {
              segments.push({ start: startX, end: width - 1 });
            }
            rows.push(segments);
          }

          // Let's build outline points based on segment analysis
          // We normalize coords to 0-200 width and 0-350 height for standard TryOnModal viewport coordinates.
          const scaleX = 200 / width;
          const scaleY = 350 / height;

          const toX = (x) => (x * scaleX).toFixed(1);
          const toY = (y) => (y * scaleY).toFixed(1);

          // We trace three main elements: Torso, Left Arm, Right Arm.
          // Let's find shoulderSplitY: where we go from 1 segment to 3 segments.
          let shoulderSplitY = Math.round(height * 0.15); // fallback
          for (let y = Math.round(height * 0.1); y < height * 0.4; y++) {
            if (rows[y] && rows[y].length >= 3) {
              shoulderSplitY = y;
              break;
            }
          }

          // Let's find hipSplitY: where the legs start (split into 2 segments).
          let hipSplitY = Math.round(height * 0.5);
          for (let y = Math.round(height * 0.45); y < height * 0.7; y++) {
            if (rows[y] && rows[y].length === 2) {
              hipSplitY = y;
              break;
            }
          }

          // 1. Torso Path
          // Left side of torso goes from neck to shoulderSplitY (outer left) then down middle segments to waist/hips.
          const torsoLeftPts = [];
          const torsoRightPts = [];

          // Neck / Collar Y start: around 10%
          const neckY = Math.round(height * 0.12);
          const waistY = Math.round(height * 0.43);
          const crotchY = Math.round(height * 0.52);

          for (let y = neckY; y <= crotchY; y++) {
            const segs = rows[y];
            if (!segs || segs.length === 0) continue;

            if (y < shoulderSplitY) {
              // Single main segment (neck/chest transition)
              const main = segs[0];
              torsoLeftPts.push({ x: main.start, y });
              torsoRightPts.unshift({ x: main.end, y });
            } else {
              // Middle segment is torso
              let middleIdx = 1;
              if (segs.length === 2) {
                // If only 2 segments, decide based on width
                middleIdx = segs[0].end - segs[0].start > segs[1].end - segs[1].start ? 0 : 1;
              } else if (segs.length >= 3) {
                // Middle segment is torso (index 1 when length is 3)
                middleIdx = Math.floor(segs.length / 2);
              }
              const middle = segs[middleIdx];
              if (middle) {
                torsoLeftPts.push({ x: middle.start, y });
                torsoRightPts.unshift({ x: middle.end, y });
              }
            }
          }

          const torsoPath = [
            `M ${toX(torsoLeftPts[0].x)} ${toY(torsoLeftPts[0].y)}`,
            ...torsoLeftPts.slice(1).map(p => `L ${toX(p.x)} ${toY(p.y)}`),
            ...torsoRightPts.map(p => `L ${toX(p.x)} ${toY(p.y)}`),
            'Z'
          ].join(' ');

          // 2. Left Arm Path (on the viewer's left, which is croquis' right side)
          const leftArmLeftPts = [];
          const leftArmRightPts = [];
          const armEndY = Math.round(height * 0.62);

          for (let y = shoulderSplitY; y <= armEndY; y++) {
            const segs = rows[y];
            if (!segs || segs.length === 0) continue;
            // Left arm is the first segment
            const seg = segs[0];
            leftArmLeftPts.push({ x: seg.start, y });
            leftArmRightPts.unshift({ x: seg.end, y });
          }

          const leftArmPath = [
            `M ${toX(leftArmLeftPts[0].x)} ${toY(leftArmLeftPts[0].y)}`,
            ...leftArmLeftPts.slice(1).map(p => `L ${toX(p.x)} ${toY(p.y)}`),
            ...leftArmRightPts.map(p => `L ${toX(p.x)} ${toY(p.y)}`),
            'Z'
          ].join(' ');

          // 3. Right Arm Path (on the viewer's right)
          const rightArmLeftPts = [];
          const rightArmRightPts = [];

          for (let y = shoulderSplitY; y <= armEndY; y++) {
            const segs = rows[y];
            if (!segs || segs.length === 0) continue;
            // Right arm is the last segment
            const seg = segs[segs.length - 1];
            rightArmLeftPts.push({ x: seg.start, y });
            rightArmRightPts.unshift({ x: seg.end, y });
          }

          const rightArmPath = [
            `M ${toX(rightArmLeftPts[0].x)} ${toY(rightArmLeftPts[0].y)}`,
            ...rightArmLeftPts.slice(1).map(p => `L ${toX(p.x)} ${toY(p.y)}`),
            ...rightArmRightPts.map(p => `L ${toX(p.x)} ${toY(p.y)}`),
            'Z'
          ].join(' ');

          // 4. Legs Paths (only for male croquis which has legs, or female if available)
          let legsPath = '';
          if (gender === 'male') {
            const leftLegLeftPts = [];
            const leftLegRightPts = [];
            const rightLegLeftPts = [];
            const rightLegRightPts = [];
            const feetY = Math.round(height * 0.96);

            for (let y = crotchY; y <= feetY; y++) {
              const segs = rows[y];
              if (!segs || segs.length === 0) continue;

              if (segs.length >= 2) {
                const leftLeg = segs[0];
                const rightLeg = segs[segs.length - 1];
                leftLegLeftPts.push({ x: leftLeg.start, y });
                leftLegRightPts.unshift({ x: leftLeg.end, y });
                rightLegLeftPts.push({ x: rightLeg.start, y });
                rightLegRightPts.unshift({ x: rightLeg.end, y });
              } else {
                // If 1 segment, split down the middle
                const seg = segs[0];
                const mid = Math.round((seg.start + seg.end) / 2);
                leftLegLeftPts.push({ x: seg.start, y });
                leftLegRightPts.unshift({ x: mid - 2, y });
                rightLegLeftPts.push({ x: mid + 2, y });
                rightLegRightPts.unshift({ x: seg.end, y });
              }
            }

            const leftLegPath = [
              `M ${toX(leftLegLeftPts[0].x)} ${toY(leftLegLeftPts[0].y)}`,
              ...leftLegLeftPts.slice(1).map(p => `L ${toX(p.x)} ${toY(p.y)}`),
              ...leftLegRightPts.map(p => `L ${toX(p.x)} ${toY(p.y)}`),
              'Z'
            ].join(' ');

            const rightLegPath = [
              `M ${toX(rightLegLeftPts[0].x)} ${toY(rightLegLeftPts[0].y)}`,
              ...rightLegLeftPts.slice(1).map(p => `L ${toX(p.x)} ${toY(p.y)}`),
              ...rightLegRightPts.map(p => `L ${toX(p.x)} ${toY(p.y)}`),
              'Z'
            ].join(' ');

            legsPath = `${leftLegPath} ${rightLegPath}`;
          }

          // Combine sub-paths into compound path (leaves gaps automatically using evenodd or separate sub-paths)
          // For upper-body garments (hoodies/shirts): torso + left arm + right arm.
          const upperBodyCompound = `${torsoPath} ${leftArmPath} ${rightArmPath}`;
          // For full-body/lower-body garments: torso + left arm + right arm + legs.
          const fullBodyCompound = `${torsoPath} ${leftArmPath} ${rightArmPath} ${legsPath}`;

          results[gender] = {
            upper: upperBodyCompound,
            full: fullBodyCompound
          };
        }

        setMalePath(JSON.stringify(results['male'], null, 2));
        setFemalePath(JSON.stringify(results['female'], null, 2));
        setLog('Images scanned and paths generated successfully!');
      } catch (err) {
        setLog(`Error: ${err.message}`);
      }
    }
    runTrace();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'monospace', color: '#FAF7F2', background: '#0E0E0E', minHeight: '100vh' }}>
      <h1>Croquis Autotrace Page</h1>
      <p style={{ color: '#B87333', fontWeight: 'bold' }}>{log}</p>
      <div>
        <h3>Male Path Data (Upper & Full Body)</h3>
        <textarea style={{ width: '100%', height: 200, background: '#111', color: '#FAF7F2', fontFamily: 'monospace', fontSize: 11 }} value={malePath} readOnly />
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>Female Path Data (Upper & Full Body)</h3>
        <textarea style={{ width: '100%', height: 200, background: '#111', color: '#FAF7F2', fontFamily: 'monospace', fontSize: 11 }} value={femalePath} readOnly />
      </div>
    </div>
  );
}
