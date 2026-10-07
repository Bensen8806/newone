"use client"
import React, { useEffect, useRef } from 'react'

export default function SystemArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Extracted logic from ani.html
    const ns = 'http://www.w3.org/2000/svg';

    function createGearPath(cx: number, cy: number, rPitch: number, teeth: number, toothDepth = 8) {
        let path = "";
        const angleStep = (Math.PI * 2) / teeth;
        const rOuter = rPitch + toothDepth;
        const rInner = rPitch - toothDepth;

        for (let i = 0; i < teeth; i++) {
            const angle = i * angleStep;
            const nextAngle = (i + 1) * angleStep;
            
            const toothStart = angle + angleStep * 0.15;
            const toothTop1 = angle + angleStep * 0.35;
            const toothTop2 = angle + angleStep * 0.65;
            const toothEnd = angle + angleStep * 0.85;

            const x0 = cx + rInner * Math.cos(toothStart); const y0 = cy + rInner * Math.sin(toothStart);
            const x1 = cx + rOuter * Math.cos(toothTop1);  const y1 = cy + rOuter * Math.sin(toothTop1);
            const x2 = cx + rOuter * Math.cos(toothTop2);  const y2 = cy + rOuter * Math.sin(toothTop2);
            const x3 = cx + rInner * Math.cos(toothEnd);   const y3 = cy + rInner * Math.sin(toothEnd);
            const xNext = cx + rInner * Math.cos(nextAngle + angleStep * 0.15);
            const yNext = cy + rInner * Math.sin(nextAngle + angleStep * 0.15);

            if (i === 0) path += `M ${cx + rInner * Math.cos(0)} ${cy + rInner * Math.sin(0)} `;
            path += `L ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${xNext} ${yNext} `;
        }
        path += "Z";
        return path;
    }

    const doc = containerRef.current;
    
    const getEl = (id: string) => doc.querySelector(`#${id}`) as any;
    
    getEl('mech-gear1')?.setAttribute('d', createGearPath(210, 300, 45, 18));
    getEl('mech-gear2')?.setAttribute('d', createGearPath(290, 300, 35, 14));
    getEl('ui-gear-path')?.setAttribute('d', createGearPath(50, 50, 26, 10, 4));

    getEl('center-gear1')?.setAttribute('d', createGearPath(875, 540, 105, 24));
    getEl('center-gear2')?.setAttribute('d', createGearPath(1060, 540, 70, 16));
    getEl('center-gear3')?.setAttribute('d', createGearPath(1060, 417.5, 52.5, 12));
    getEl('center-gear5')?.setAttribute('d', createGearPath(1156.25, 417.5, 43.75, 10));

    const vernierTicks = getEl('vernier-ticks');
    if (vernierTicks) {
      for (let x = 1480; x <= 1720; x += 10) {
          const isMajor = (x - 1480) % 50 === 0;
          const yStart = 520;
          const yEnd = isMajor ? 535 : 528;
          const line = document.createElementNS(ns, 'line');
          line.setAttribute('x1', x.toString()); line.setAttribute('y1', yStart.toString());
          line.setAttribute('x2', x.toString()); line.setAttribute('y2', yEnd.toString());
          line.setAttribute('stroke', isMajor ? '#ffffff' : 'rgba(255,255,255,0.4)');
          line.setAttribute('stroke-width', '1.5');
          vernierTicks.appendChild(line);
      }
    }

    const ecArcs = getEl('ec-arcs');
    const numArcs = 4;
    const arcElements: SVGPathElement[] = [];
    if (ecArcs) {
      for (let i = 0; i < numArcs; i++) {
          const arc = document.createElementNS(ns, 'path');
          arc.setAttribute('fill', 'none');
          arc.setAttribute('stroke', '#ffffff');
          arc.setAttribute('stroke-width', '1.5');
          ecArcs.appendChild(arc);
          arcElements.push(arc);
      }
    }

    const sigPath = getEl('signal-wave');
    let sigD = `M 980 860 `;
    for(let x = 0; x <= 180; x += 2) {
        sigD += `L ${980 + x} ${860} `;
    }
    if (sigPath) sigPath.setAttribute('d', sigD);

    const serverLeds = getEl('server-leds');
    const ledArray: SVGCircleElement[] = [];
    if (serverLeds) {
      for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 3; col++) {
              const led = document.createElementNS(ns, 'circle');
              led.setAttribute('cx', (1365 + col * 15).toString());
              led.setAttribute('cy', (165 + row * 30).toString());
              led.setAttribute('r', '2');
              serverLeds.appendChild(led);
              ledArray.push(led);
          }
      }
    }

    const drawableElements = Array.from(doc.querySelectorAll('.drawable'));
    drawableElements.forEach((el: any) => {
        if (el.tagName === 'g') {
            el.style.opacity = 0; 
            el.dataset.type = 'group';
        } else {
            el.dataset.type = 'path';
            try {
                const existingDash = el.getAttribute('stroke-dasharray');
                if (existingDash && !el.id.includes('flow')) {
                     el.dataset.type = 'group'; 
                     el.style.opacity = 0;
                } else {
                    let len = el.getTotalLength();
                    el.dataset.len = len;
                    el.style.strokeDasharray = len;
                    el.style.strokeDashoffset = len;
                }
            } catch(e) {
                el.dataset.type = 'group';
                el.style.opacity = 0;
            }
        }
    });

    let targetProgress = 0;
    let currentProgress = 0;

    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
    const mapRange = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) => outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

    const onScroll = () => {
        // Map scroll to the overall page height
        const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        targetProgress = clamp(window.scrollY / maxScroll, 0, 1);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    // DOM Elements for Animation Loop
    const cameraRig = getEl('camera-rig');
    const uiPercentText = getEl('ui-percent');
    const uiGearSpin = getEl('ui-gear-spin');
    
    const eeeRotor = getEl('eee-rotor');
    const elecArcs = [getEl('arc1'), getEl('arc2'), getEl('arc3')];
    
    const gear1 = getEl('mech-gear1');
    const gear2 = getEl('mech-gear2');
    const mCrank = getEl('mech-crank');
    const mCrankPin = getEl('mech-crank-pin');
    const mRod = getEl('mech-rod');
    const mPiston = getEl('mech-piston');

    const railYLine = getEl('plotter-rail-y');
    const plotterHead = getEl('plotter-head');
    const plotterLaser = getEl('plotter-laser');
    const eventPoster = getEl('event-poster-art');
    const eventTicket = getEl('event-ticket');
    
    const civilDamper = getEl('civil-damper');
    
    const ecDish = getEl('ec-dish');
    const signalWave = getEl('signal-wave');
    
    const icReticle = getEl('ic-reticle');
    const vernierSlider = getEl('vernier-slider');
    const terminalCursor = getEl('terminal-cursor');
    
    const netPaths = [
        {x1:1470, y1:200, x2:1550, y2:150},
        {x1:1470, y1:200, x2:1520, y2:250},
        {x1:1630, y1:180, x2:1700, y2:120}
    ];
    const netPulses = [getEl('net-pulse-1'), getEl('net-pulse-2'), getEl('net-pulse-3')];

    const busFlows = getEl('data-flows')?.children;
    const centerGearsGrp = getEl('center-gears');
    const cGear1 = getEl('center-gear1');
    const cGear2 = getEl('center-gear2');
    const cGear3 = getEl('center-gear3');
    const cGear5 = getEl('center-gear5');
    const coreReveal = getEl('core-reveal');

    const camStops = [
        { p: 0.00, x: 960,  y: 540, s: 0.65 }, 
        { p: 0.08, x: 960,  y: 200, s: 1.50 }, // PWR
        { p: 0.16, x: 350,  y: 300, s: 1.50 }, // KIN
        { p: 0.24, x: 250,  y: 540, s: 1.50 }, // EVT
        { p: 0.32, x: 350,  y: 780, s: 1.50 }, // STR
        { p: 0.40, x: 960,  y: 850, s: 1.50 }, // RAD
        { p: 0.48, x: 1570, y: 780, s: 1.50 }, // GMB
        { p: 0.56, x: 1670, y: 540, s: 1.50 }, // VERNIER
        { p: 0.64, x: 1570, y: 220, s: 1.50 }, // LOG
        { p: 0.78, x: 960,  y: 540, s: 1.10 }, // Center Gears Look
        { p: 0.88, x: 960,  y: 540, s: 0.65 }, // Zoom Out slightly (Image Fades In)
        { p: 1.00, x: 960,  y: 540, s: 2.20 }  // Final Zoom Into Photo
    ];

    let rafId: number;
    function render() {
        currentProgress += (targetProgress - currentProgress) * 0.06; 
        if (Math.abs(targetProgress - currentProgress) < 0.0001) currentProgress = targetProgress;
        const p = currentProgress;

        if (uiPercentText) uiPercentText.textContent = Math.round(p * 100) + "%";
        if (uiGearSpin) uiGearSpin.setAttribute('transform', `rotate(${p * 1440}, 50, 50)`);

        const drawP = clamp(mapRange(p, 0.0, 0.10, 0, 1), 0, 1);
        drawableElements.forEach((el: any) => {
            if(el.dataset.type === 'path') el.style.strokeDashoffset = el.dataset.len * (1 - smoothstep(drawP));
            else el.style.opacity = drawP;
        });

        let startCam = camStops[0], endCam = camStops[1];
        for (let i = 0; i < camStops.length - 1; i++) {
            if (p >= camStops[i].p && p <= camStops[i + 1].p) {
                startCam = camStops[i];
                endCam = camStops[i + 1];
                break;
            }
        }
        if (p >= camStops[camStops.length - 1].p) startCam = endCam = camStops[camStops.length - 1];
        const camSegmentT = clamp((p - startCam.p) / (endCam.p - startCam.p || 1), 0, 1);
        const easeT = smoothstep(camSegmentT);
        const camX = lerp(startCam.x, endCam.x, easeT);
        const camY = lerp(startCam.y, endCam.y, easeT);
        const camS = lerp(startCam.s, endCam.s, easeT);
        if (cameraRig) cameraRig.setAttribute('transform', `translate(960, 540) scale(${camS}) translate(${-camX}, ${-camY})`);

        const rotorRot = p * 2160; 
        if (eeeRotor) eeeRotor.setAttribute('transform', `rotate(${rotorRot}, 860, 200)`);
        if (elecArcs[0]) elecArcs[0].setAttribute('opacity', (Math.sin(p * 2000) > 0.5) ? '1' : '0');
        if (elecArcs[1]) elecArcs[1].setAttribute('opacity', (Math.sin(p * 2300 + 1) > 0.5) ? '1' : '0');
        if (elecArcs[2]) elecArcs[2].setAttribute('opacity', (Math.sin(p * 1800 + 2) > 0.5) ? '1' : '0');

        const gear1Rot = p * 1440; 
        const ratio = 18 / 14;     
        const gear2Rot = -gear1Rot * ratio + 12.85; 
        if (gear1) gear1.setAttribute('transform', `rotate(${gear1Rot}, 210, 300)`);
        if (gear2) gear2.setAttribute('transform', `rotate(${gear2Rot}, 290, 300)`);
        
        const theta = gear2Rot * (Math.PI / 180); 
        const crankR = 40; const rodL = 100;
        const pinX = 290 + crankR * Math.cos(theta);
        const pinY = 300 + crankR * Math.sin(theta);
        
        if (mCrank) {
          mCrank.setAttribute('x2', pinX.toString()); mCrank.setAttribute('y2', pinY.toString());
        }
        if (mCrankPin) {
          mCrankPin.setAttribute('cx', pinX.toString()); mCrankPin.setAttribute('cy', pinY.toString());
        }
        
        const sliderX = 290 + crankR * Math.cos(theta) + Math.sqrt(rodL*rodL - Math.pow(crankR * Math.sin(theta), 2));
        if (mRod) {
          mRod.setAttribute('x1', pinX.toString()); mRod.setAttribute('y1', pinY.toString());
          mRod.setAttribute('x2', sliderX.toString()); mRod.setAttribute('y2', '300');
        }
        if (mPiston) mPiston.setAttribute('x', sliderX.toString());

        const railY = 520 + Math.sin(p * Math.PI * 30) * 60;
        const headX = 250 + Math.cos(p * Math.PI * 44) * 70; 
        if (railYLine) {
          railYLine.setAttribute('y1', railY.toString());
          railYLine.setAttribute('y2', railY.toString());
        }
        if (plotterHead) {
          plotterHead.setAttribute('x', (headX - 10).toString());
          plotterHead.setAttribute('y', (railY - 10).toString());
        }
        if (plotterLaser) {
          plotterLaser.setAttribute('cx', headX.toString());
          plotterLaser.setAttribute('cy', railY.toString());
        }
        if (eventPoster) eventPoster.setAttribute('opacity', (0.4 + Math.sin(p * Math.PI * 50) * 0.4).toString());
        const ticketExtrude = (p * 500) % 50; 
        if (eventTicket) eventTicket.setAttribute('height', ticketExtrude.toString());

        const damperAngle = Math.sin(p * Math.PI * 25) * 20; 
        if (civilDamper) civilDamper.setAttribute('transform', `translate(350, 820) rotate(${damperAngle})`);

        const dishAngle = Math.sin(p * Math.PI * 8) * 30; 
        if (ecDish) ecDish.setAttribute('transform', `rotate(${dishAngle}, 860, 855)`);
        
        const waveSpeed = p * 2000;
        const maxArcDist = 120;
        arcElements.forEach((arc, i) => {
            const currentDist = (waveSpeed + i * (maxArcDist / numArcs)) % maxArcDist;
            const arcWidth = 30 + currentDist * 1.5;
            const arcY = 810 - currentDist;
            arc.setAttribute('d', `M ${860 - arcWidth} ${arcY + currentDist*0.2} Q 860 ${arcY - currentDist*0.3} ${860 + arcWidth} ${arcY + currentDist*0.2}`);
            arc.setAttribute('opacity', clamp(1 - (currentDist / maxArcDist), 0, 1).toString());
        });

        let newSigD = `M 980 860 `;
        for(let x = 0; x <= 180; x += 2) {
            const freq = 0.05 + (Math.sin(p * 20) * 0.03);
            const amp = 10 + (Math.sin(p * 50) * 20);
            const y = 860 + Math.sin((x + p*1000) * freq) * amp;
            newSigD += `L ${980 + x} ${y} `;
        }
        if (signalWave) signalWave.setAttribute('d', newSigD);

        const reticleX = Math.sin(p * Math.PI * 16) * 30;
        const reticleY = Math.sin(p * Math.PI * 22) * 30;
        if (icReticle) icReticle.setAttribute('transform', `translate(${reticleX}, ${reticleY})`);

        const vernierMove = (Math.sin(p * Math.PI * 15) + 1) * 35;
        if (vernierSlider) vernierSlider.setAttribute('transform', `translate(${vernierMove}, 0)`);

        netPulses.forEach((pulse, i) => {
            if (!pulse) return;
            const t = (p * 15 + i * 0.3) % 1;
            const path = netPaths[i];
            pulse.setAttribute('cx', lerp(path.x1, path.x2, t).toString());
            pulse.setAttribute('cy', lerp(path.y1, path.y2, t).toString());
        });

        if (terminalCursor) terminalCursor.setAttribute('opacity', (Math.floor(p * 300) % 2 === 0) ? '1' : '0');
        
        ledArray.forEach((led, i) => {
            const isOn = Math.sin(p * 1500 + i * 45) > 0;
            led.setAttribute('opacity', isOn ? '1' : '0.2');
        });

        const flowOffset = -p * 3500;
        if (busFlows) {
          Array.from(busFlows).forEach((path: any) => {
              path.style.strokeDashoffset = flowOffset.toString();
          });
        }

        const cG1Rot = p * 1440;
        const cG2Rot = -cG1Rot * (24/16) + 11.25; 
        const cG3Rot = -cG2Rot * (16/12) + 15; 
        const cG5Rot = -cG3Rot * (12/10) + 18;

        if (cGear1) cGear1.setAttribute('transform', `rotate(${cG1Rot}, 875, 540)`);
        if (cGear2) cGear2.setAttribute('transform', `rotate(${cG2Rot}, 1060, 540)`);
        if (cGear3) cGear3.setAttribute('transform', `rotate(${cG3Rot}, 1060, 417.5)`);
        if (cGear5) cGear5.setAttribute('transform', `rotate(${cG5Rot}, 1156.25, 417.5)`);

        const revealP = clamp(mapRange(p, 0.85, 0.90, 0, 1), 0, 1);
        if (centerGearsGrp) centerGearsGrp.setAttribute('opacity', (1 - smoothstep(revealP)).toString());
        if (coreReveal) coreReveal.setAttribute('opacity', smoothstep(revealP).toString());

        rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-screen h-screen overflow-hidden flex items-center justify-center pointer-events-none" style={{ background: '#030406', zIndex: -1 }}>
      
      {/* CSS Background Grid */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
        `,
        backgroundSize: '12px 12px, 12px 12px, 60px 60px, 60px 60px',
        backgroundPosition: 'center center'
      }} />
      
      {/* Vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        background: 'radial-gradient(circle at center, transparent 10%, rgba(3,4,6,0.7) 100%)'
      }} />

        {/* UI Layer */}
        <div className="absolute inset-0 z-[10] pointer-events-none">
          <div className="absolute bottom-8 right-8 w-[60px] h-[60px]">
            <svg id="percent-svg" width="100%" height="100%" viewBox="0 0 100 100">
                <g id="ui-gear-spin">
                    <path id="ui-gear-path" fill="rgba(3,4,6,0.85)" stroke="#ff2a00" strokeWidth="2" />
                </g>
                <text id="ui-percent" x="50" y="52" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="900" fill="#fff">0%</text>
            </svg>
          </div>
        </div>

        {/* The World SVG */}
        <svg id="world" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="relative z-[2] w-full h-full">
            <defs>
                <filter id="pulse-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <clipPath id="ticket-clip">
                    <rect x="180" y="632" width="140" height="100" />
                </clipPath>
            </defs>
            
            <g id="camera-rig">
                {/* 0. CENTRAL BUS / PCB ROUTING TRACES */}
                <g id="system-bus" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" className="drawable early">
                    <rect x="760" y="340" width="400" height="400" strokeWidth="1" strokeDasharray="4 8" />
                    <path d="M 960 280 L 960 540 
                             M 450 300 L 550 300 L 600 350 L 760 350 L 960 540 
                             M 320 540 L 960 540 
                             M 450 780 L 550 780 L 600 730 L 760 730 L 960 540 
                             M 960 800 L 960 540 
                             M 1470 780 L 1370 780 L 1320 730 L 1160 730 L 960 540 
                             M 1470 540 L 960 540 
                             M 1470 300 L 1370 300 L 1320 350 L 1160 350 L 960 540" 
                          stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinejoin="round" />
                    <g id="data-flows" stroke="#ff2a00" strokeWidth="3" strokeLinecap="round" strokeDasharray="15 150" opacity="0.9" filter="url(#pulse-glow)" strokeLinejoin="round">
                        <path d="M 960 280 L 960 540" />
                        <path d="M 450 300 L 550 300 L 600 350 L 760 350 L 960 540" />
                        <path d="M 320 540 L 960 540" />
                        <path d="M 450 780 L 550 780 L 600 730 L 760 730 L 960 540" />
                        <path d="M 960 800 L 960 540" />
                        <path d="M 1470 780 L 1370 780 L 1320 730 L 1160 730 L 960 540" />
                        <path d="M 1470 540 L 960 540" />
                        <path d="M 1470 300 L 1370 300 L 1320 350 L 1160 350 L 960 540" />
                    </g>
                </g>

                {/* 1. NODE: POWER & ELECTRICITY */}
                <g id="node-power" fill="none" stroke="#fff" className="drawable late">
                    <circle cx="860" cy="200" r="70" strokeWidth="2" strokeDasharray="2 4" />
                    <g id="eee-rotor">
                        <circle cx="860" cy="200" r="45" strokeWidth="3" />
                        <path d="M 860 200 L 860 155 M 860 200 L 821 222 M 860 200 L 899 222" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
                    </g>
                    <rect x="980" y="150" width="80" height="100" strokeWidth="3" />
                    <rect x="990" y="160" width="60" height="80" strokeWidth="1" />
                    <path d="M 980 160 L 960 160 L 960 240 L 980 240" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M 1060 170 L 1080 170 L 1080 230 L 1060 230" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                    <g id="electricity-arcs" stroke="#ff4d00" strokeWidth="2" strokeLinejoin="round">
                        <path id="arc1" d="M 905 180 L 920 160 L 940 190 L 960 170 L 980 180" />
                        <path id="arc2" d="M 905 220 L 925 240 L 935 210 L 960 230 L 980 220" />
                        <path id="arc3" d="M 905 200 L 930 205 L 945 195 L 960 205 L 980 200" />
                    </g>
                </g>

                {/* 2. NODE: KINEMATICS & GEARS */}
                <g id="node-mech" fill="none" stroke="#fff" className="drawable late">
                    <path id="mech-gear1" strokeWidth="2" />
                    <path id="mech-gear2" strokeWidth="2" />
                    <circle cx="210" cy="300" r="10" strokeWidth="2" fill="#030406" />
                    <circle cx="290" cy="300" r="10" strokeWidth="2" fill="#030406" />
                    <g id="mech-kinematics">
                        <line id="mech-crank" x1="290" y1="300" x2="290" y2="260" stroke="#ff2a00" strokeWidth="4" />
                        <circle id="mech-crank-pin" cx="290" cy="260" r="6" fill="#030406" stroke="#ff2a00" strokeWidth="2" />
                        <line id="mech-rod" x1="290" y1="260" x2="410" y2="300" stroke="#fff" strokeWidth="3" />
                        <rect x="400" y="275" width="80" height="50" strokeWidth="2" />
                        <rect id="mech-piston" x="400" y="280" width="20" height="40" fill="#fff" stroke="none" />
                        <line x1="480" y1="290" x2="520" y2="290" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                        <line x1="480" y1="310" x2="520" y2="310" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    </g>
                </g>

                {/* 3. NODE: EVENT PLOTTER */}
                <g id="node-events" fill="none" stroke="#fff" className="drawable late">
                    <rect x="180" y="440" width="140" height="160" strokeWidth="2" />
                    <line x1="180" y1="460" x2="320" y2="460" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1="180" y1="580" x2="320" y2="580" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <g id="event-poster-art">
                        <path d="M 200 480 L 250 560 L 300 480 Z" stroke="#ff2a00" strokeWidth="2" />
                        <rect x="225" y="495" width="50" height="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    </g>
                    <line id="plotter-rail-y" x1="160" y1="520" x2="340" y2="520" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
                    <rect id="plotter-head" x="240" y="510" width="20" height="20" fill="#030406" stroke="#ff2a00" strokeWidth="2" />
                    <circle id="plotter-laser" cx="250" cy="520" r="3" fill="#ff2a00" stroke="none" />
                    <rect x="180" y="620" width="140" height="12" strokeWidth="2" fill="#030406" />
                    <g clipPath="url(#ticket-clip)">
                        <rect id="event-ticket" x="200" y="632" width="100" height="10" fill="#030406" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
                    </g>
                </g>

                {/* 4. NODE: STRUCTURAL MATRIX */}
                <g id="node-civil" fill="none" stroke="#fff" strokeWidth="2" className="drawable late">
                    <path d="M 180 750 L 520 750 L 470 820 L 230 820 Z" strokeWidth="2" />
                    <path d="M 230 820 L 350 750 L 470 820" strokeWidth="1.5" stroke="rgba(255,255,255,0.4)" />
                    <path d="M 350 750 L 350 820" strokeWidth="1.5" stroke="rgba(255,255,255,0.4)" />
                    <polygon points="170,750 190,750 180,740" fill="#fff" stroke="none" />
                    <polygon points="510,750 530,750 520,740" fill="#fff" stroke="none" />
                    <g id="civil-damper" transform="translate(350, 820)">
                        <line x1="0" y1="0" x2="0" y2="70" stroke="#ff2a00" strokeWidth="3" />
                        <circle cx="0" cy="70" r="15" fill="#030406" stroke="#ff2a00" strokeWidth="3" />
                        <circle cx="0" cy="70" r="5" fill="#fff" stroke="none" />
                    </g>
                </g>

                {/* 5. NODE: RADAR & SIGNAL PROPAGATION */}
                <g id="node-ec" fill="none" stroke="#fff" className="drawable late">
                    <path d="M 830 920 L 890 920 L 870 880 L 850 880 Z" strokeWidth="2" />
                    <g id="ec-dish">
                        <path d="M 820 830 Q 860 880 900 830" strokeWidth="4" stroke="#ff2a00" />
                        <line x1="860" y1="855" x2="860" y2="810" strokeWidth="2" />
                        <circle cx="860" cy="810" r="4" fill="#ff2a00" stroke="none" />
                    </g>
                    <g id="ec-arcs"></g>
                    <rect x="980" y="800" width="180" height="120" rx="8" strokeWidth="2" fill="#030406" />
                    <path d="M 980 840 L 1160 840 M 980 880 L 1160 880 M 1040 800 L 1040 920 M 1100 800 L 1100 920" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <path id="signal-wave" stroke="#ff2a00" strokeWidth="2" />
                </g>

                {/* 6. NODE: GIMBAL & INSTRUMENTATION */}
                <g id="node-ic" fill="none" stroke="#fff" className="drawable late">
                    <circle cx="1570" cy="780" r="80" strokeWidth="1" strokeDasharray="2 8" />
                    <circle cx="1570" cy="780" r="70" strokeWidth="2" />
                    <line x1="1490" y1="780" x2="1650" y2="780" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <line x1="1570" y1="700" x2="1570" y2="860" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <g id="ic-reticle">
                        <circle cx="1570" cy="780" r="25" stroke="#ff2a00" strokeWidth="2" />
                        <line x1="1570" y1="745" x2="1570" y2="765" stroke="#ff2a00" strokeWidth="2" />
                        <line x1="1570" y1="815" x2="1570" y2="795" stroke="#ff2a00" strokeWidth="2" />
                        <line x1="1535" y1="780" x2="1555" y2="780" stroke="#ff2a00" strokeWidth="2" />
                        <line x1="1605" y1="780" x2="1585" y2="780" stroke="#ff2a00" strokeWidth="2" />
                        <circle cx="1570" cy="780" r="3" fill="#ff2a00" stroke="none" />
                    </g>
                    <rect x="1450" y="730" width="10" height="100" strokeWidth="2" fill="#030406" />
                    <rect x="1680" y="730" width="10" height="100" strokeWidth="2" fill="#030406" />
                </g>

                {/* 7. NODE: VERNIER CALIPER */}
                <g id="node-vernier" fill="none" stroke="#fff" className="drawable late">
                    <rect x="1470" y="520" width="260" height="40" strokeWidth="2" fill="#030406" />
                    <g id="vernier-ticks"></g>
                    <g id="vernier-slider">
                        <path d="M 1470 510 L 1510 510 L 1510 610 L 1490 610 L 1470 590 Z" fill="#030406" stroke="#ff2a00" strokeWidth="2" />
                        <line x1="1480" y1="520" x2="1480" y2="560" stroke="#fff" strokeWidth="1" />
                        <line x1="1490" y1="520" x2="1490" y2="560" stroke="#fff" strokeWidth="1" />
                        <line x1="1500" y1="520" x2="1500" y2="560" stroke="#fff" strokeWidth="1" />
                    </g>
                    <path d="M 1730 510 L 1770 510 L 1770 590 L 1750 610 L 1730 610 Z" fill="#030406" stroke="#fff" strokeWidth="2" />
                </g>

                {/* 8. NODE: COMPUTERS & NETWORK GRAPH */}
                <g id="node-cs" fill="none" stroke="#fff" className="drawable late">
                    <g id="network-graph" strokeWidth="1.5">
                        <path d="M 1470 200 L 1550 150 L 1630 180 L 1700 120 L 1550 150" stroke="rgba(255,255,255,0.4)" />
                        <path d="M 1470 200 L 1520 250 L 1630 180" stroke="rgba(255,255,255,0.4)" />
                        <path d="M 1520 250 L 1600 280 L 1700 120" stroke="rgba(255,255,255,0.4)" />
                        
                        <circle cx="1470" cy="200" r="6" fill="#030406" stroke="#ff2a00" strokeWidth="2" />
                        <circle cx="1550" cy="150" r="4" fill="#030406" stroke="#fff" strokeWidth="2" />
                        <circle cx="1630" cy="180" r="8" fill="#030406" stroke="#ff2a00" strokeWidth="2" />
                        <circle cx="1700" cy="120" r="5" fill="#030406" stroke="#fff" strokeWidth="2" />
                        <circle cx="1520" cy="250" r="5" fill="#030406" stroke="#fff" strokeWidth="2" />
                        <circle cx="1600" cy="280" r="7" fill="#030406" stroke="#ff2a00" strokeWidth="2" />
                        
                        <circle id="net-pulse-1" r="3" fill="#ff2a00" stroke="none" />
                        <circle id="net-pulse-2" r="3" fill="#ff2a00" stroke="none" />
                        <circle id="net-pulse-3" r="3" fill="#ff2a00" stroke="none" />
                    </g>
                    <rect x="1350" y="150" width="70" height="180" strokeWidth="2" fill="#030406" />
                    <line x1="1350" y1="180" x2="1420" y2="180" strokeWidth="2" />
                    <line x1="1350" y1="210" x2="1420" y2="210" strokeWidth="2" />
                    <line x1="1350" y1="240" x2="1420" y2="240" strokeWidth="2" />
                    <line x1="1350" y1="270" x2="1420" y2="270" strokeWidth="2" />
                    <line x1="1350" y1="300" x2="1420" y2="300" strokeWidth="2" />
                    <g id="server-leds" fill="#ff2a00" stroke="none"></g>

                    <rect x="1450" y="280" width="110" height="80" rx="4" strokeWidth="2" fill="#030406" />
                    <rect x="1455" y="285" width="100" height="70" strokeWidth="1" fill="#010203" />
                    
                    <text x="1460" y="300" fontFamily="monospace" fontSize="8" fill="#ff2a00" stroke="none">printf("INIT");</text>
                    <text x="1460" y="315" fontFamily="monospace" fontSize="8" fill="rgba(255,255,255,0.4)" stroke="none">sys.boot()</text>
                    <text x="1460" y="330" fontFamily="monospace" fontSize="8" fill="rgba(255,255,255,0.4)" stroke="none">alloc(mem)</text>
                    <rect id="terminal-cursor" x="1460" y="338" width="5" height="8" fill="#ff2a00" stroke="none" />
                    <path d="M 1495 360 L 1515 360 L 1525 380 L 1485 380 Z" strokeWidth="2" />
                </g>

                {/* 9. CENTRAL CORE */}
                <g id="center-gears" fill="none" stroke="#fff">
                    <path id="center-gear1" strokeWidth="2" />
                    <path id="center-gear2" strokeWidth="2" />
                    <path id="center-gear3" strokeWidth="2" />
                    <path id="center-gear5" strokeWidth="2" />
                    
                    <circle cx="875" cy="540" r="15" strokeWidth="2" fill="#030406" />
                    <circle cx="1060" cy="540" r="10" strokeWidth="2" fill="#030406" />
                    <circle cx="1060" cy="417.5" r="8" strokeWidth="2" fill="#030406" />
                    <circle cx="1156.25" cy="417.5" r="6" strokeWidth="2" fill="#030406" />
                </g>

                <g id="core-reveal" opacity="0">
                    <rect x="760" y="340" width="400" height="400" fill="#030406" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                    <image href="/college potrait.jpeg" x="760" y="340" width="400" height="400" preserveAspectRatio="xMidYMid slice" />
                    <path d="M 750 350 L 750 330 L 770 330" fill="none" stroke="#ff2a00" strokeWidth="3" />
                    <path d="M 1170 350 L 1170 330 L 1150 330" fill="none" stroke="#ff2a00" strokeWidth="3" />
                    <path d="M 750 730 L 750 750 L 770 750" fill="none" stroke="#ff2a00" strokeWidth="3" />
                    <path d="M 1170 730 L 1170 750 L 1150 750" fill="none" stroke="#ff2a00" strokeWidth="3" />
                </g>
            </g>
        </svg>
    </div>
  )
}
