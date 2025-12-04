import { useRef, useEffect } from "react";
import useMacbookStore from "../../store/index.js";
import { OrbitControls } from "@react-three/drei";
import gsap from 'gsap';

import MacbookModel16 from "../models/Macbook-16.jsx";
import MacbookModel14 from "../models/Macbook-14.jsx";
import { useGSAP } from "@gsap/react";

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;

const fadeMeshes = (group, opacity) => {
    if(!group) return;

    group.traverse((child) => {
        if(child.isMesh && child.material) {
            child.material.transparent = true;
            gsap.to(child.material, { 
                opacity, 
                duration: ANIMATION_DURATION,
                onComplete: () => {
                    // When opacity is 0, hide the mesh completely
                    if (opacity === 0) {
                        child.visible = false;
                    } else {
                        child.visible = true;
                    }
                }
            });
        }
    });
};

const moveGroup = (group, x) => {
    if(!group) return;

    gsap.to(group.position, { 
        x, 
        duration: ANIMATION_DURATION,
        ease: "power2.out" // Smoother animation
    });
};

const ModelSwitcher = ({ scale, isMobile }) => {
    const { color } = useMacbookStore();
    
    const SCALE_LARGE_DESKTOP = 0.08;
    const SCALE_LARGE_MOBILE = 0.05;

    const smallMacbookRef = useRef();
    const largeMacbookRef = useRef();

    const showLargeMacbook = scale === SCALE_LARGE_DESKTOP || scale === SCALE_LARGE_MOBILE;

    // Update color when it changes
    useEffect(() => {
        const updateColor = (group) => {
            if (!group) return;
            
            group.traverse((child) => {
                if (child.isMesh && child.material && child.material.color) {
                    // Update materials that should change color
                    // Adjust these names based on your model structure
                    if (child.name.includes('Body') || 
                        child.name.includes('Case') || 
                        child.name.includes('Shell') ||
                        child.name.includes('Macbook')) {
                        child.material.color.set(color);
                        child.material.needsUpdate = true;
                    }
                }
            });
        };

        if (smallMacbookRef.current) updateColor(smallMacbookRef.current);
        if (largeMacbookRef.current) updateColor(largeMacbookRef.current);
    }, [color]);

    // Handle model switching animation
    useGSAP(() => {
        if (!smallMacbookRef.current || !largeMacbookRef.current) return;

        if (showLargeMacbook) {
            // Show 16", hide 14"
            moveGroup(smallMacbookRef.current, -OFFSET_DISTANCE);
            moveGroup(largeMacbookRef.current, 0);
            fadeMeshes(smallMacbookRef.current, 0);
            fadeMeshes(largeMacbookRef.current, 1);
        } else {
            // Show 14", hide 16"
            moveGroup(smallMacbookRef.current, 0);
            moveGroup(largeMacbookRef.current, OFFSET_DISTANCE);
            fadeMeshes(smallMacbookRef.current, 1);
            fadeMeshes(largeMacbookRef.current, 0);
        }
    }, [scale, showLargeMacbook]);

    return (
        <>
            {/* OrbitControls for free rotation without snap-back */}
            <OrbitControls 
    makeDefault
    enableZoom={false}  // This is the key - disables zoom
    enablePan={true}
    enableRotate={true}
    rotateSpeed={1.0}
    panSpeed={0.8}
    
    // Optional: Set distance limits
    minDistance={4}
    maxDistance={8}
    
    // Optional: Set angle limits
    minPolarAngle={0}      // Can look down from above
    maxPolarAngle={Math.PI/2}  // Cannot look up from below
/>
            
            {/* Large Macbook (16") */}
            <group ref={largeMacbookRef}>
                <MacbookModel16 
                    scale={isMobile ? 0.05 : 0.08} 
                    color={color}
                    position={[0, 0, 0]}
                />
            </group>

            {/* Small Macbook (14") */}
            <group ref={smallMacbookRef}>
                <MacbookModel14 
                    scale={isMobile ? 0.03 : 0.06} 
                    color={color}
                    position={[0, 0, 0]}
                />
            </group>
        </>
    );
};

export default ModelSwitcher;