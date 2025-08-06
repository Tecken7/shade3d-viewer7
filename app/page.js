'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'
import { Suspense, useState, useRef, useEffect } from 'react'

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

function SceneLights({ lightIntensity, lightPos, light2Pos, ref1, ref2 }) {
    useEffect(() => {
        if (ref1.current) ref1.current.position.set(...lightPos)
        if (ref2.current) ref2.current.position.set(...light2Pos)
    }, [lightPos, light2Pos])

    return (
        <>
            <ambientLight intensity={lightIntensity * 0.4} />
            <directionalLight ref={ref1} position={lightPos} intensity={lightIntensity * 1.5} />
            <directionalLight ref={ref2} position={light2Pos} intensity={lightIntensity * 1.0} />
        </>
    )
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

    const [lightPos, setLightPos] = useState([5, 5, 5])
    const [light2Pos, setLight2Pos] = useState([-5, -5, -5])

    const dirLightRef1 = useRef()
    const dirLightRef2 = useRef()

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, color: 'white', fontFamily: 'sans-serif' }}>
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
                <input type="range" min={-10} max={10} step={0.1} value={lightPos[0]} onChange={(e) => setLightPos([parseFloat(e.target.value), lightPos[1], lightPos[2]])} />
                <input type="range" min={-10} max={10} step={0.1} value={lightPos[1]} onChange={(e) => setLightPos([lightPos[0], parseFloat(e.target.value), lightPos[2]])} />
                <input type="range" min={-10} max={10} step={0.1} value={lightPos[2]} onChange={(e) => setLightPos([lightPos[0], lightPos[1], parseFloat(e.target.value)])} />

                <div style={{ marginTop: '10px' }}>🔦 Light 2 Position:</div>
                <input type="range" min={-10} max={10} step={0.1} value={light2Pos[0]} onChange={(e) => setLight2Pos([parseFloat(e.target.value), light2Pos[1], light2Pos[2]])} />
                <input type="range" min={-10} max={10} step={0.1} value={light2Pos[1]} onChange={(e) => setLight2Pos([light2Pos[0], parseFloat(e.target.value), light2Pos[2]])} />
                <input type="range" min={-10} max={10} step={0.1} value={light2Pos[2]} onChange={(e) => setLight2Pos([light2Pos[0], light2Pos[1], parseFloat(e.target.value)])} />
            </div>

            <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 15 }}>
                <Suspense fallback={null}>
                    <SceneLights
                        lightIntensity={lightIntensity}
                        lightPos={lightPos}
                        light2Pos={light2Pos}
                        ref1={dirLightRef1}
                        ref2={dirLightRef2}
                    />
                    <Model url="/models/Upper.obj" color={color1} opacity={opacity1} visible={visible1} />
                    <Model url="/models/Lower.obj" color={color2} opacity={opacity2} visible={visible2} />
                    <Model url="/models/Crown21.obj" color={color3} opacity={opacity3} visible={visible3} />
                </Suspense>

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    zoomSpeed={1.5}
                    rotateSpeed={5}
                    minZoom={5}
                    maxZoom={200}
                />
            </Canvas>
        </div>
    )
}
