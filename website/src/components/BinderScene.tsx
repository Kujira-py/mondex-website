'use client';
/* eslint-disable react-hooks/immutability -- Three owns these GPU buffers and materials. */
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { additionalCards } from '@/lib/catalogue';

import {
  BINDER_DURATION,
  PAGE_W as W,
  PAGE_H as H,
  binderState,
  leafPoint,
} from '@/lib/binder-motion';
function pageTexture(images: THREE.Texture[], page: number, full: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1068;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#45374f';
  c.fillRect(0, 0, 768, 1068);
  for (let i = 0; i < 9; i++) {
    const x = 44 + (i % 3) * 235,
      y = 36 + Math.floor(i / 3) * 338;
    c.fillStyle = '#291f32';
    c.beginPath();
    c.roundRect(x, y, 212, 308, 12);
    c.fill();
    if (i !== 8 || full)
      c.drawImage(
        images[(page * 7 + i) % images.length].image as CanvasImageSource,
        x + 10,
        y + 12,
        192,
        269,
      );
    const g = c.createLinearGradient(x, y, x + 212, y + 308);
    g.addColorStop(0, '#ffffff25');
    g.addColorStop(0.25, '#ffffff00');
    g.addColorStop(0.7, '#bca2ea08');
    g.addColorStop(1, '#ffffff26');
    c.fillStyle = g;
    c.beginPath();
    c.roundRect(x, y, 212, 308, 12);
    c.fill();
    c.strokeStyle = '#e4d4f045';
    c.lineWidth = 2;
    c.stroke();
    c.strokeStyle = '#ffffff55';
    c.beginPath();
    c.moveTo(x + 8, y + 9);
    c.lineTo(x + 204, y + 9);
    c.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
function Leaf({
  images,
  textures,
  index,
  time,
}: {
  images: THREE.Texture[];
  textures: { full: THREE.CanvasTexture; empty: THREE.CanvasTexture; back: THREE.CanvasTexture }[];
  index: number;
  time: React.RefObject<number>;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(W, H, 48, 6);
    g.translate(W / 2, 0, 0);
    return g;
  }, []);
  // The inserted card stays on this physical leaf, even while it turns. No texture swap.
  const cardGeometry = useMemo(
    () => new THREE.PlaneGeometry((192 / 768) * W, (269 / 1068) * H, 12, 3),
    [],
  );
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const card = images[(index * 7 + 8) % images.length];
  useEffect(
    () => () => {
      geometry.dispose();
      cardGeometry.dispose();
    },
    [geometry, cardGeometry],
  );
  useFrame(() => {
    const state = binderState(time.current).leaves[index];
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const p = leafPoint(geometry.attributes.uv.getX(i), state.flip, state.right, state.left);
      positions.setX(i, p.x);
      positions.setZ(i, p.z);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    const verts = cardGeometry.attributes.position;
    for (let i = 0; i < verts.count; i++) {
      const u = (524 + cardGeometry.attributes.uv.getX(i) * 192) / 768;
      const y =
        (cardGeometry.attributes.uv.getY(i) - 0.5) * ((269 / 1068) * H) -
        1.020899 +
        (1 - state.fill) * 0.68;
      const p = leafPoint(u, state.flip, state.right, state.left);
      const offset = 0.003 + (1 - state.fill) * 0.24;
      verts.setXYZ(
        i,
        p.x + Math.sin(Math.PI * state.flip) * offset,
        y,
        p.z + Math.cos(Math.PI * state.flip) * offset,
      );
    }
    verts.needsUpdate = true;
    cardGeometry.computeVertexNormals();
    if (material.current) material.current.opacity = state.alpha;
  });
  return (
    <group name={`binder-leaf-${index}`}>
      <mesh geometry={geometry} frustumCulled={false}>
        <meshStandardMaterial map={textures[index].empty} roughness={0.52} side={THREE.FrontSide} />
      </mesh>
      <mesh geometry={geometry} frustumCulled={false}>
        <meshStandardMaterial
          map={textures[index + 2].back}
          roughness={0.52}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh geometry={cardGeometry} frustumCulled={false}>
        <meshBasicMaterial
          ref={material}
          map={card}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}
function Book({ running, reduced }: { running: boolean; reduced: boolean }) {
  const images = useTexture(additionalCards.map((c) => `/assets/card-${c.id}.webp`));
  const logo = useTexture('/assets/orbit.svg');
  const textures = useMemo(() => {
    images.forEach((image) => {
      image.colorSpace = THREE.SRGBColorSpace;
    });
    return Array.from({ length: 4 }, (_, p) => {
      const back = pageTexture(images, p, true);
      back.repeat.x = -1;
      back.offset.x = 1;
      return { full: pageTexture(images, p, true), empty: pageTexture(images, p, false), back };
    });
  }, [images]);
  const cover = useRef<THREE.Group>(null);
  const clock = useRef(0),
    time = useRef(0);
  const { size, camera, invalidate } = useThree();
  useEffect(() => {
    const c = camera as THREE.OrthographicCamera;
    c.zoom = Math.min(size.width / 5.8, size.height / 4.6);
    c.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  useEffect(() => {
    invalidate();
  }, [running, reduced, invalidate]);
  useEffect(
    () => () =>
      textures.forEach((t) => {
        t.full.dispose();
        t.empty.dispose();
        t.back.dispose();
      }),
    [textures],
  );
  useFrame((_, delta) => {
    if (running && !reduced && !document.hidden) clock.current += Math.min(delta, 0.05);
    time.current = reduced ? 21 : clock.current % BINDER_DURATION;
    const { open } = binderState(time.current);
    if (cover.current) {
      cover.current.rotation.y = -Math.PI * open;
      // Lid opens onto the table, below every leaf, and rises before closing.
      cover.current.position.z = 0.26 - open * 0.38;
    }
    if (running && !reduced && !document.hidden) invalidate();
  }, -1);
  return (
    <group name="binder-book" rotation={[0.26, -0.16, -0.08]} position={[0, -0.05, 0]}>
      <RoundedBox args={[2.6, 3.58, 0.11]} radius={0.06} position={[1.24, 0, -0.09]}>
        <meshStandardMaterial color="#79549d" roughness={0.66} />
      </RoundedBox>
      <group ref={cover} position={[0, 0, 0.26]}>
        <RoundedBox args={[2.6, 3.58, 0.07]} radius={0.05} position={[1.24, 0, 0]}>
          <meshStandardMaterial color="#8659af" roughness={0.48} />
        </RoundedBox>
        <mesh position={[1.25, 0.1, 0.041]}>
          <planeGeometry args={[0.7, 0.7]} />
          <meshBasicMaterial map={logo} transparent opacity={0.8} />
        </mesh>
        <mesh position={[1.24, 0, -0.04]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.43, 3.4]} />
          <meshStandardMaterial color="#513963" roughness={0.78} />
        </mesh>
      </group>
      <RoundedBox args={[0.2, 3.56, 0.12]} radius={0.04} position={[0, 0, -0.03]}>
        <meshStandardMaterial color="#4c2c65" roughness={0.7} />
      </RoundedBox>
      <mesh position={[W / 2, 0, 0.035]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={textures[2].full} roughness={0.52} />
      </mesh>
      {[0, 1].map((index) => (
        <Leaf key={index} index={index} images={images} textures={textures} time={time} />
      ))}
      {[-1.18, 0, 1.18].map((y) => (
        <mesh key={y} position={[0, y, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.025, 10, 36]} />
          <meshStandardMaterial color="#d9c7ed" metalness={0.72} roughness={0.23} />
        </mesh>
      ))}
    </group>
  );
}
function BinderFallback() {
  return (
    <div className="binder-fallback">
      {[0, 1].map((page) => (
        <div key={page}>
          {additionalCards.slice(page * 9, page * 9 + 9).map((c) => (
            <img
              key={c.id}
              src={`/assets/card-${c.id}.webp`}
              alt=""
              width="660"
              height="922"
              loading="lazy"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
class BinderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <BinderFallback /> : this.props.children;
  }
}
export default function BinderScene({ running, reduced }: { running: boolean; reduced: boolean }) {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        setSupported(!!probe);
        probe?.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        setSupported(false);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!supported) return <BinderFallback />;
  return (
    <BinderBoundary>
      <Canvas
        fallback={<BinderFallback />}
        orthographic
        camera={{ position: [0, 0, 10], zoom: 65 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[-3, 5, 8]} intensity={2.1} />
        <directionalLight position={[4, -1, 4]} color="#cbb3ff" intensity={0.8} />
        <Suspense fallback={null}>
          <Book running={running} reduced={reduced} />
        </Suspense>
      </Canvas>
    </BinderBoundary>
  );
}
