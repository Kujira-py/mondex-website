'use client';
/* eslint-disable react-hooks/immutability -- R3F owns mutable GPU objects and this explicit ref controller; frame updates must not enter React state. */

import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei';
import { orbitPose } from '@/lib/orbit-motion';
import { ensembleMotion } from '@/lib/ensemble-motion';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';
import { featuredCards, type SceneController } from '@/lib/scene-state';
import { initialCards, sampleCard, separateCards, type CardPose } from '@/lib/card-motion';

type Props = {
  controller: RefObject<SceneController>;
  onReady: () => void;
  onFailure: () => void;
  onSelect: (index: number) => void;
};
const mix = THREE.MathUtils.lerp;
function cardGeometry() {
  const w = 2.35,
    h = 3.285,
    r = 0.095,
    x = -w / 2,
    y = -h / 2,
    s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ShapeGeometry(s, 8),
    v = g.attributes.position,
    uv = g.attributes.uv;
  for (let n = 0; n < v.count; n++) uv.setXY(n, (v.getX(n) + w / 2) / w, (v.getY(n) + h / 2) / h);
  return g;
}
// Original material: directional foil comes from the view vector, never a time-based rainbow loop.
function makeFoil(texture: THREE.Texture) {
  const uniforms = {
    uMap: { value: texture },
    uLight: { value: new THREE.Vector2(0.4, 0.65) },
    uStrength: { value: 0.07 },
  };
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vView;
    void main(){vUv=uv;vec4 view=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=normalize(-view.xyz);gl_Position=projectionMatrix*view;}
  `,
    fragmentShader: `
    uniform sampler2D uMap; uniform vec2 uLight; uniform float uStrength;
    varying vec2 vUv; varying vec3 vNormal; varying vec3 vView;
    void main(){
      vec4 art=texture2D(uMap,vUv);
      float angle=dot(normalize(vNormal),normalize(vView));
      float band=exp(-pow((vUv.x*.65+vUv.y*.38-uLight.x*.53-uLight.y*.35-.14)*7.,2.));
      vec3 pearl=.68+.32*cos(6.2831*(vec3(.06,.3,.52)+vUv.y*.27+vUv.x*.18+(1.-angle)*1.4+uLight.x*.21));
      float grain=fract(sin(dot(floor(vUv*1600.),vec2(12.73,71.19)))*43118.7);
      float sparkle=pow(grain,32.)*band;
      vec3 color=art.rgb+pearl*(band*.32+sparkle*.34)*uStrength;
      color+=vec3(.9,.93,1.)*pow(band,8.)*uStrength*.18;
      gl_FragColor=vec4(color,art.a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
    transparent: false,
    toneMapped: false,
  });
}
function Card({
  index,
  controller,
  onSelect,
  geometry,
  poses,
}: {
  index: number;
  controller: RefObject<SceneController>;
  onSelect: (i: number) => void;
  geometry: THREE.ShapeGeometry;
  poses: RefObject<CardPose[]>;
}) {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture(`/assets/card-${featuredCards[index].id}.webp`);
  const material = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return makeFoil(texture);
  }, [texture]);
  const { size, invalidate } = useThree();
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, dt) => {
    if (!group.current || !controller.current.motionEnabled || !controller.current.visible) return;
    const c = controller.current;
    const target = poses.current[index];
    const active =
      c.progress < 0.35 && (c.hover === index || (c.hover < 0 && c.selected === index));
    const g = group.current,
      alpha = 1 - Math.exp(-Math.min(dt, 0.04) * 9);
    g.position.set(target.x, target.y, target.z);
    g.rotation.set(target.rx, target.ry, target.rz);
    g.scale.setScalar(target.s);
    material.uniforms.uLight.value.set(
      0.5 + c.pointer.x * 0.5 + g.rotation.y,
      0.5 + c.pointer.y * 0.5,
    );
    const strength = active ? 0.8 : 0.14;
    const oldStrength = material.uniforms.uStrength.value;
    material.uniforms.uStrength.value = mix(oldStrength, strength, alpha);
    if (c.visible && !document.hidden && Math.abs(oldStrength - strength) > 0.001) invalidate();
  });
  const hover = (e: ThreeEvent<PointerEvent>, on: boolean) => {
    if (
      !controller.current.motionEnabled ||
      e.pointerType !== 'mouse' ||
      controller.current.progress > 0.35
    )
      return;
    e.stopPropagation();
    controller.current.hover = on ? index : -1;
    invalidate();
  };
  const initial = initialCards(size.width < 1001)[index];
  return (
    <group
      ref={group}
      name={`product-card-${index}`}
      position={[initial.x, initial.y, initial.z]}
      rotation={[initial.rx, initial.ry, initial.rz]}
      scale={initial.s}
    >
      <RoundedBox args={[2.355, 3.29, 0.045]} radius={0.04} smoothness={2}>
        <meshStandardMaterial color="#d6c5a5" roughness={0.47} metalness={0.4} />
      </RoundedBox>
      <mesh
        position={[0, 0, 0.027]}
        geometry={geometry}
        material={material}
        onPointerOver={(e) => hover(e, true)}
        onPointerOut={(e) => hover(e, false)}
        onClick={(e) => {
          if (controller.current.motionEnabled && controller.current.progress < 0.35) {
            e.stopPropagation();
            onSelect(index);
          }
        }}
      />
      <mesh position={[0, 0, -0.028]} rotation={[0, Math.PI, 0]} geometry={geometry}>
        <meshStandardMaterial color="#292434" roughness={0.45} metalness={0.5} />
      </mesh>
    </group>
  );
}
function Orbit({
  controller,
  motionTime,
}: {
  controller: RefObject<SceneController>;
  motionTime: RefObject<number>;
}) {
  const ref = useRef<THREE.Group>(null);
  const { size, invalidate } = useThree();
  const geometries = useMemo(() => {
    // Exact original SVG outlines: the inner ring is r=13.6, stroke=4.8 (16 / 11.2).
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg"><path d="M15.8685 77.7676 A44 44 0 0 1 77.7676 15.8685 L69.5776 24.0584 A32.5 32.5 0 0 0 24.0584 69.5776 Z"/><path d="M84.1315 22.2324 A44 44 0 0 1 22.2324 84.1315 L30.4224 75.9416 A32.5 32.5 0 0 0 75.9416 30.4224 Z"/><path d="M66 50 A16 16 0 1 1 34 50 A16 16 0 1 1 66 50 M61.2 50 A11.2 11.2 0 1 0 38.8 50 A11.2 11.2 0 1 0 61.2 50" fill-rule="evenodd"/></svg>';
    const stops = [
      [
        [0, '#A174F7'],
        [0.45, '#C2A2FF'],
        [1, '#FAF7FF'],
      ],
      [
        [0, '#FFFFFF'],
        [0.4, '#E2CCFF'],
        [1, '#AA7CF8'],
      ],
      [
        [0, '#AA7CF8'],
        [0.55, '#D1B5FF'],
        [1, '#FCF7FF'],
      ],
    ] as const;
    return new SVGLoader().parse(svg).paths.flatMap((path, index) =>
      path.toShapes().map((shape) => {
        // Small bevel preserves the original silhouette; only the edges catch light.
        const g = new THREE.ExtrudeGeometry(shape, {
          depth: 8,
          bevelEnabled: true,
          bevelThickness: 0.7,
          bevelSize: 0.45,
          bevelSegments: 4,
          curveSegments: 72,
        });
        g.computeBoundingBox();
        const bounds = g.boundingBox!;
        const positions = g.attributes.position;
        const colours = new Float32Array(positions.count * 3);
        const gradient = stops[index];
        for (let i = 0; i < positions.count; i++) {
          // SVG objectBoundingBox gradient: (0,0) → (.35,1).
          const x = (positions.getX(i) - bounds.min.x) / (bounds.max.x - bounds.min.x);
          const y = (positions.getY(i) - bounds.min.y) / (bounds.max.y - bounds.min.y);
          const t = THREE.MathUtils.clamp((x * 0.35 + y) / 1.1225, 0, 1);
          const a = t < gradient[1][0] ? gradient[0] : gradient[1];
          const b = t < gradient[1][0] ? gradient[1] : gradient[2];
          const color = new THREE.Color(a[1]).lerp(
            new THREE.Color(b[1]),
            (t - a[0]) / (b[0] - a[0]),
          );
          color.toArray(colours, i * 3);
        }
        g.setAttribute('color', new THREE.BufferAttribute(colours, 3));
        g.translate(-50, -50, -4);
        return g;
      }),
    );
  }, []);
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);
  useFrame((_, dt) => {
    if (
      !ref.current ||
      !controller.current.motionEnabled ||
      !controller.current.visible ||
      document.hidden
    )
      return;
    const c = controller.current;
    const p = orbitPose(c.progress, size.width < 1001, motionTime.current);
    // Match the cards' damped follow-through, including pointer movement and reversed scroll.
    const alpha = 1 - Math.exp(-Math.min(dt, 0.04) * 9);
    const g = ref.current;
    const target = [p.x, p.y, p.z, p.rx + c.pointer.y * 0.1, p.ry + c.pointer.x * 0.22, p.rz, p.s];
    const current = [
      g.position.x,
      g.position.y,
      g.position.z,
      g.rotation.x,
      g.rotation.y,
      g.rotation.z,
      g.scale.x,
    ];
    const next = current.map((value, i) => mix(value, target[i], alpha));
    g.position.set(next[0], next[1], next[2]);
    g.rotation.set(next[3], next[4], next[5]);
    g.scale.set(next[6], -next[6], next[6]);
    // Both the opening float and later chapter motion run only while visible and enabled.
    invalidate();
  });
  const initial = orbitPose(0, size.width < 1001);
  return (
    <group
      ref={ref}
      name="brand-orbit"
      position={[initial.x, initial.y, initial.z]}
      rotation={[initial.rx, initial.ry, initial.rz]}
      scale={[initial.s, -initial.s, initial.s]}
    >
      {geometries.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshBasicMaterial attach="material-0" vertexColors toneMapped={false} />
          <meshPhysicalMaterial
            attach="material-1"
            color="#ad85e5"
            metalness={0.24}
            roughness={0.32}
            clearcoat={1}
            clearcoatRoughness={0.2}
            envMapIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}
function ScanFrame({
  controller,
  poses,
}: {
  controller: RefObject<SceneController>;
  poses: RefObject<CardPose[]>;
}) {
  const ref = useRef<THREE.Group>(null),
    line = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  useFrame(() => {
    if (
      !ref.current ||
      !line.current ||
      !controller.current.motionEnabled ||
      !controller.current.visible
    )
      return;
    const p = controller.current.progress,
      mobile = size.width < 1001;
    const card = poses.current[2];
    ref.current.visible = p > 0.94 && p < 1.26;
    ref.current.position.set(card.x, card.y, 1);
    ref.current.scale.setScalar(card.s * (mobile ? 0.88 / 0.83 : 1.25 / 1.22));
    line.current.position.y = 1.66 - THREE.MathUtils.clamp((p - 0.8) / 0.45, 0, 1) * 3.3;
  });
  return (
    <group ref={ref} visible={false}>
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((y) => (
          <group key={`${x}${y}`} position={[x * 1.4, y * 1.86, 0]}>
            <mesh position={[-x * 0.2, 0, 0]}>
              <boxGeometry args={[0.44, 0.024, 0.02]} />
              <meshBasicMaterial color="#a996f5" />
            </mesh>
            <mesh position={[0, -y * 0.2, 0]}>
              <boxGeometry args={[0.024, 0.44, 0.02]} />
              <meshBasicMaterial color="#a996f5" />
            </mesh>
          </group>
        )),
      )}
      <mesh ref={line}>
        <planeGeometry args={[2.5, 0.024]} />
        <meshBasicMaterial color="#d1c2ff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
function World({ controller, onReady, onSelect, onFailure }: Props) {
  const { invalidate, gl, size } = useThree();
  const poses = useRef(initialCards(size.width < 1001));
  const readyFrames = useRef(0);
  const motionTime = useRef(0);
  useFrame((_, dt) => {
    // Let the actual textured world paint before replacing the matched HTML poster.
    if (readyFrames.current < 3) {
      readyFrames.current++;
      if (readyFrames.current === 3) onReady();
      else invalidate();
    }
    const c = controller.current;
    if (!c.motionEnabled || !c.visible || document.hidden) return;
    const mobile = size.width < 1001;
    if (readyFrames.current >= 3) motionTime.current += Math.min(dt, 0.05);
    const breath = ensembleMotion(c.progress, motionTime.current);
    const alpha = 1 - Math.exp(-Math.min(dt, 0.04) * 9);
    const targets = Array.from({ length: 5 }, (_, index) => {
      const target = sampleCard(index, c.progress, mobile);
      const interactive = c.progress < 0.14;
      const active = interactive && (c.hover === index || (c.hover < 0 && c.selected === index));
      if (mobile && interactive && c.selected >= 0) {
        if (index === c.selected) {
          target.x = 0;
          target.y = -1.45;
          target.s = Math.min(0.8, (size.width / size.height) * 1.65);
          target.rx = target.ry = target.rz = 0;
        } else {
          const side = index < c.selected ? -1 : 1;
          target.x = side * (1.8 + Math.abs(index - c.selected) * 0.35);
          target.s = 0.53;
          target.y = -1.6;
          target.rz = side * -0.1;
        }
      } else if (active) {
        // Lift within its own depth lane; a card never crosses a neighbour's plane.
        target.y += 0.36;
        target.ry = c.pointer.x * 0.13;
        target.rx = -c.pointer.y * 0.09;
        target.rz = 0;
        target.s *= 1.045;
      }
      // The whole card composition answers the mark with a smaller counter-motion.
      // Apply it before depth separation so every rendered card volume remains disjoint.
      target.x -= breath.sway * (mobile ? 0.025 : 0.045);
      target.y += breath.lift * (mobile ? 0.045 : 0.07);
      target.rz -= breath.sway * 0.008;
      target.y += breath.float * (mobile ? 0.075 : 0.09);
      target.rx += breath.float * 0.009;
      target.x += c.pointer.x * (mobile ? 0.04 : 0.15);
      target.y += c.pointer.y * 0.07;
      return target;
    });
    const safeTargets = separateCards(targets);
    const interpolated = poses.current.map(
      (current, i) =>
        Object.fromEntries(
          Object.keys(current).map((key) => [
            key,
            mix(current[key as keyof CardPose], safeTargets[i][key as keyof CardPose], alpha),
          ]),
        ) as CardPose,
    );
    // Rotation changes the occupied depth. Constrain the rendered frame as well as endpoints.
    poses.current = separateCards(interpolated);
    const unsettled = poses.current.some((p, i) =>
      Object.keys(p).some(
        (key) =>
          Math.abs(p[key as keyof CardPose] - safeTargets[i][key as keyof CardPose]) > 0.0002,
      ),
    );
    if (unsettled) invalidate();
  }, -1);
  const geometry = useMemo(() => cardGeometry(), []);
  useEffect(() => {
    const current = controller.current;
    current.invalidate = invalidate;
    invalidate();
    return () => {
      current.invalidate = () => {};
      geometry.dispose();
    };
  }, [controller, geometry, invalidate, onReady]);
  useEffect(() => {
    const listener = () => invalidate();
    gl.domElement.addEventListener('webglcontextrestored', listener);
    gl.domElement.addEventListener('webglcontextlost', onFailure);
    return () => {
      gl.domElement.removeEventListener('webglcontextrestored', listener);
      gl.domElement.removeEventListener('webglcontextlost', onFailure);
    };
  }, [gl, invalidate, onFailure]);
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[1, 5, 5]} intensity={2.2} />
      <Environment resolution={128} frames={1}>
        <Lightformer position={[-2, 0, 5]} scale={[5, 10, 1]} intensity={3} />
        <Lightformer position={[0, 5, 3]} scale={[8, 3, 1]} intensity={5} />
        <Lightformer
          position={[-5, 1, 4]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[2, 8, 1]}
          intensity={5}
        />
        <Lightformer
          position={[6, 0, 2]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[2, 7, 1]}
          intensity={3}
          color="#bba1ff"
        />
        <Lightformer position={[0, -4, 2]} scale={[9, 1, 1]} intensity={2} />
      </Environment>
      <Orbit controller={controller} motionTime={motionTime} />
      {featuredCards.map((c, i) => (
        <Card
          key={c.id}
          index={i}
          controller={controller}
          onSelect={onSelect}
          geometry={geometry}
          poses={poses}
        />
      ))}
      <ScanFrame controller={controller} poses={poses} />
    </>
  );
}
export default function ProductScene(props: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 12.8], fov: 40, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <World {...props} />
      </Suspense>
    </Canvas>
  );
}
