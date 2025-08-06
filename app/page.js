'use client'

import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber'
import { TrackballControls } from '@react-three/drei'
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

function SceneLights({
    lightIntensity,
    lightPosX, lightPosY, lightPosZ,
    light2PosX, light2PosY, light2PosZ,
    dirLightRef1, dirLightRef2
}) {
    useFrame(() => {
        if (dirLightRef1.current) {
            dirLightRef1.current.position.set(lightPosX, lightPosY, lightPosZ)
        }
        if (dirLightRef2.current) {
            dirLightRef2.current.position.set(light2PosX, light2PosY, light2PosZ)
        }
    })

    return (
        <>
            <ambientLight intensity={lightIntensity * 0.4} />
            <directionalLight ref={dirLightRef1} intensity={lightIntensity * 1.5} />
            <directionalLight ref={dirLightRef2} intensity={lightIntensity * 1.0} />
        </>
    )
}

function CustomZoomHandler() {
    const { camera } = useThree()

    useEffect(() => {
        const onWheel = (e) => {
            e.preventDefault()
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
            camera.zoom *= zoomFactor
            camera.zoom = Math.min(Math.max(camera.zoom, 0.5), 100)
            camera.updateProjectionMatrix()
        }

        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
    }, [camera])

    return null
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

    const [lightPosX, setLightPosX] = useState(5)
    const [lightPosY, setLightPosY] = useState(5)
    const [lightPosZ, setLightPosZ] = useState(5)

    const [light2PosX, setLight2PosX] = useState(-5)
    const [light2PosY, setLight2PosY] = useState(-5)
    const [light2PosZ, setLight2PosZ] = useState(-5)

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
                <input type="range" min={-10} max={10} step={0.1} value={lightPosX} onChange={(e) => setLightPosX(parseFloat(e.target.value))} />
                <input type="range" min={-10} max={10} step={0.1} value={lightPosY} onChange={(e) => setLightPosY(parseFloat(e.target.value))} />
                <input type="range" min={-10} max={10} step={0.1} value={lightPosZ} onChange={(e) => setLightPosZ(parseFloat(e.target.value))} />

                <div style={{ marginTop: '10px' }}>🔦 Light 2 Position:</div>
                <input type="range" min={-10} max={10} step={0.1} value={light2PosX} onChange={(e) => setLight2PosX(parseFloat(e.target.value))} />
                <input type="range" min={-10} max={10} step={0.1} value={light2PosY} onChange={(e) => setLight2PosY(parseFloat(e.target.value))} />
                <input type="range" min={-10} max={10} step={0.1} value={light2PosZ} onChange={(e) => setLight2PosZ(parseFloat(e.target.value))} />
            </div>

            <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 15 }}>
                <CustomZoomHandler />

                <Suspense fallback={null}>
                    <SceneLights
                        lightIntensity={lightIntensity}
                        lightPosX={lightPosX}
                        lightPosY={lightPosY}
                        lightPosZ={lightPosZ}
                        light2PosX={light2PosX}
                        light2PosY={light2PosY}
                        light2PosZ={light2PosZ}
                        dirLightRef1={dirLightRef1}
                        dirLightRef2={dirLightRef2}
                    />
                    <Model url="/models/Upper.obj" color={color1} opacity={opacity1} visible={visible1} />
                    <Model url="/models/Lower.obj" color={color2} opacity={opacity2} visible={visible2} />
                    <Model url="/models/Crown21.obj" color={color3} opacity={opacity3} visible={visible3} />
                </Suspense>

                <TrackballControls
                    noZoom={true}
                    noPan={false}
                    staticMoving={true}
                    rotateSpeed={5}
                    panSpeed={0.8}
                />
            </Canvas>
        </div>
    )
}
