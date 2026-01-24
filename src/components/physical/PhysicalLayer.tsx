"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export default function PhysicalLayer() {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

                {/* Dynamic Light Stage */}
                <ambientLight intensity={0.15} />
                <PointLightStage />

                {/* The Liquid Glass Background */}
                <LiquidBlob />

                {/* Environment for realistic reflections */}
                <Environment preset="night" />

                {/* Post-Processing Stack */}
                <EffectComposer>
                    <Bloom
                        intensity={0.5}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        mipmapBlur
                    />
                    <Noise
                        opacity={0.04}
                        blendFunction={BlendFunction.OVERLAY}
                    />
                    <Vignette
                        eskil={false}
                        offset={0.1}
                        darkness={0.8}
                    />
                    <ChromaticAberration
                        offset={new THREE.Vector2(0.0005, 0.0005)}
                        blendFunction={BlendFunction.NORMAL}
                        radialModulation={false}
                        modulationOffset={0.5}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}

function PointLightStage() {
    const lightRef = useRef<THREE.PointLight>(null);
    const secondaryLightRef = useRef<THREE.PointLight>(null);

    // Mouse reactive lighting
    useFrame((state) => {
        if (lightRef.current) {
            const { x, y } = state.pointer;
            // Primary light follows cursor
            lightRef.current.position.set(x * 5, y * 5, 3);
        }
        if (secondaryLightRef.current) {
            const { x, y } = state.pointer;
            // Secondary light moves opposite for depth
            secondaryLightRef.current.position.set(-x * 3, -y * 3, 2);
        }
    });

    return (
        <>
            <pointLight
                ref={lightRef}
                intensity={15}
                distance={25}
                color="#00D4FF" // Cyan
                castShadow
            />
            <pointLight
                ref={secondaryLightRef}
                intensity={8}
                distance={20}
                color="#39FF14" // Green
            />
        </>
    );
}

function LiquidBlob() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Gentle rotation animation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
            <mesh ref={meshRef} scale={2.5}>
                <icosahedronGeometry args={[1, 4]} />
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    resolution={512}
                    transmission={1}
                    roughness={0.0}
                    thickness={3.5}
                    ior={1.5}
                    chromaticAberration={0.06}
                    anisotropy={0.1}
                    distortion={0.3}
                    distortionScale={0.3}
                    temporalDistortion={0.2}
                    color="#0a0a0a"
                />
            </mesh>
        </Float>
    );
}
