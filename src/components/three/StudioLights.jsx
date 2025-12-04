import { Environment, Lightformer } from "@react-three/drei";

const StudioLights = () => {
    return (
        <group name="lights">
            {/* Clean environment lighting without background */}
            <Environment 
                resolution={256}
                preset="city"
                background={false}
                blur={0.8}
            >
                {/* Clean minimal lightformers */}
                <Lightformer
                    form="rect"
                    intensity={1.2}
                    position={[0, 5, -5]}
                    scale={[15, 15]}
                    rotation-x={Math.PI / 4}
                    color="#e6e6e6"
                />
                
                <Lightformer
                    form="rect"
                    intensity={0.8}
                    position={[0, -2, 5]}
                    scale={[12, 12]}
                    rotation-x={-Math.PI / 4}
                    color="#e6e6e6"
                />
            </Environment>

            {/* Main key light */}
            <spotLight
                position={[4, 8, 4]}
                angle={0.3}
                penumbra={1}
                decay={1}
                intensity={Math.PI * 0.8}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
                color="#f5f5f5"
            />
            
            {/* Fill light from opposite side */}
            <spotLight
                position={[-3, 6, -3]}
                angle={0.4}
                penumbra={1}
                decay={1}
                intensity={Math.PI * 0.5}
                color="#f0f0f0"
            />
            
            {/* Back light for 180° rotation */}
            <directionalLight
                position={[0, 3, -6]}
                intensity={Math.PI * 0.4}
                color="#ffffffff"
            />
            
            {/* Bottom fill */}
            <pointLight
                position={[0, -3, 0]}
                intensity={Math.PI * 0.3}
                distance={15}
                decay={2}
                color="#dddddd"
            />
            
            {/* Side fill lights */}
            <pointLight
                position={[-6, 2, 0]}
                intensity={Math.PI * 0.25}
                distance={12}
                decay={2}
                color="#eeeeee"
            />
            
            <pointLight
                position={[6, 2, 0]}
                intensity={Math.PI * 0.25}
                distance={12}
                decay={2}
                color="#eeeeee"
            />
            
            {/* Soft ambient lighting */}
            <ambientLight intensity={0.3} color="#ffffff" />
            
            {/* Hemisphere light */}
            <hemisphereLight
                skyColor="#ffffff"
                groundColor="#666666"
                intensity={0.4}
            />
            
            {/* Rim light */}
            <rectAreaLight
                width={8}
                height={3}
                intensity={1.5}
                position={[0, 0, -7]}
                rotation={[0, 0, 0]}
                color="#ffffff"
            />
        </group>
    )
}

export default StudioLights;