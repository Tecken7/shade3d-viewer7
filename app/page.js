'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'
import { Suspense, useState, useRef } from 'react'

function Model({ url, color, opacity, visible }) {
    const obj = useLoader(OBJLoader, url)
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        metalness: 0.5,
        roughness: 0.5,
        side: THREE.DoubleSide,
    })

    obj.traverse((child) => {
        if (child.isMesh) {
            child.material = material
        }
    })

    return visible ? <primitive object={obj} /> : null
}

export default function Page() {
    const [color1, setColor1] = useState('#f5f5dc')
    const [color2, setColor2] = useState('#f5f5dc')
    const [color3, setColor3] = useState('#ffffff')
    const [opacity1, setOpacity1] = useState(1)
    const [opacity2, setOpacity2] = useState(1)
    const [opacity3, setOpacity3] = useState(1)
    const [visible1, setVisible1] = useState(true)
    const [visible2, setVisible2] = useState(true)
    const [visible3, setVisible3] = useState(true)
    const [lightIntensity, setLightIntensity] = useState(1)

    const [lightPos1, setLightPos1] = useState({ x: 5, y: 5, z: 5 })
    const [lightPos2, setLightPos2] = useState({ x: -5, y: -5, z: -5 })

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{
                position: 'absolute', top: 10, left: 10, zIndex: 1,
                color: 'white', fontFamily: 'sans-serif'
            }}>
                <div>Upper:</div>
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
                <input type="range" min={0} max={1} step={0.01} value={opacity1} onChange={(e) => setOpacity1(parseFloat(e.target.value))} />
                <button onClick={() => setVisible1(!visible1)}>{visible1 ? '👁️' : '🚫'}</button>

                <div style={{ marginTop: '10px' }}>Lower:</div>
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
                <input type="range" min={0} max={1} step={0.01} value={opacity2} onChange={(e) => setOpacity2(parseFloat(e.target.value))} />
                <button onClick={() => setVisible2(!visible2)}>{visible2 ? '👁️' : '🚫'}</button>

                <div style={{ marginTop: '10px' }}>Crown21:</div>
                <input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} />
                <input type="range" min={0} max={1} step={0.01} value={opacity3} onChange={(e) => setOpacity3(parseFloat(e.target.value))} />
                <button onClick={() => setVisible3(!visible3)}>{visible3 ? '👁️' : '🚫'}</button>

                <div style={{ marginTop: '10px' }}>💡 Light Intensity:</div>
                <input type="range" min={0} max={2} step={0.01} value={lightIntensity} onChange={(e) => setLightIntensity(parseFloat(e.target.value))} />

                <div style={{ marginTop: '10px' }}>🔦 Light 1 Position:</div>
                <div>X:</div>
                <input type="range" min={-10} max={10} step={0.1} value={lightPos1.x} onChange={(e) => setLightPos1({ ...lightPos1, x: parseFloat(e.target.value) })} />
                <div>Y:</div>
                <input type="range" min={-10} max={10} step={0.1} value={lightPos1.y} onChange={(e) => setLightPos1({ ...lightPos1, y: parseFloat(e.target.value) })} />
                <div>Z:</div>
                <input type="range" min={-10} max={10} step={0.1} value={lightPos1.z} onChange={(e) => setLightPos1({ ...lightPos1, z: parseFloat(e.target.value) })} />

                <div style={{ marginTop: '10px' }}>🔦 Light 2 Position:</div>
                <div>X:</div>
                <input type="range" min={-10} max={10} step={0.1} value={lightPos2.x} onChange={(e) => setLightPos2({ ...lightPos2, x: parseFloat(e.target.value) })} />
                <div>Y:</div>
                <input type="range" min={-10} max={10} step={0.1} value={lightPos2.y} onChange={(e) => setLightPos2({ ...lightPos2, y: parseFloat(e.target.value) })} />
                <div>Z:</div>
                <input type="range" min={-10} max={10} step={0.1} value={lightPos2.z} onChange={(e) => setLightPos2({ ...lightPos2, z: parseFloat(e.target.value) })} />
            </div>

            <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 15 }}>
                <ambientLight intensity={lightIntensity * 0.4} />
                <directionalLight
                    position={[lightPos1.x, lightPos1.y, lightPos1.z]}
                    intensity={lightIntensity * 1.5}
                />
                <directionalLight
                    position={[lightPos2.x, lightPos2.y, lightPos2.z]}
                    intensity={lightIntensity * 1.0}
                />

                <Suspense fallback={null}>
                    <Model url="/models/Upper.obj" color={color1} opacity={opacity1} visible={visible1} />
                    <Model url="/models/Lower.obj" color={color2} opacity={opacity2} visible={visible2} />
                    <Model url="/models/Crown21.obj" color={color3} opacity={opacity3} visible={visible3} />
                </Suspense>

                <MapControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    zoomSpeed={1.2}
                    rotateSpeed={1.4}
                    panSpeed={0.8}
                />
            </Canvas>
        </div>
    )
}
