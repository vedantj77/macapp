import {Canvas} from "@react-three/fiber";
import StudioLights from "./three/StudioLights.jsx";
import {features, featureSequence} from "../constants/index.js";
import clsx from "clsx";
import {Suspense, useEffect, useRef} from "react";
import {Html} from "@react-three/drei";
import MacbookModel from "./models/Macbook.jsx";
import {useMediaQuery} from "react-responsive";
import useMacbookStore from "../store/index.js";
import {useGSAP} from "@gsap/react";
import gsap from 'gsap';

const ModelScroll = () => {
    const groupRef = useRef(null);
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)'})
    const { setTexture } = useMacbookStore();

    // Pre-load all feature videos during component mount
    useEffect(() => {
        featureSequence.forEach((feature) => {
            const v = document.createElement('video');
            Object.assign(v, {
                src: feature.videoPath,
                muted: true,
                playsInline: true,
                preload: 'auto',
                crossOrigin: 'anonymous',
            });
            v.load();
        })
    }, []);

    useGSAP(() => {
        // 3D MODEL ROTATION ANIMATION
        const modelTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#features',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                pin: true,
            }
        });

        // SYNC THE FEATURE CONTENT
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#features',
                start: 'top center',
                end: 'bottom top',
                scrub: 1,
            }
        });

        // 3D SPIN - full rotation
        if(groupRef.current) {
            modelTimeline.to(groupRef.current.rotation, { 
                y: Math.PI * 2, 
                ease: 'power1.inOut',
                duration: 5 
            });
        }

        // Content & Texture Sync
        featureSequence.forEach((feature, index) => {
            const delay = feature.delay || (index * 1.5);
            timeline
                .call(() => {
                    if (feature.videoPath) {
                        setTexture(feature.videoPath);
                    }
                }, [], delay)
                .to(`.box${index + 1}`, { 
                    opacity: 1, 
                    y: 0,
                    duration: 1 
                }, delay + 0.5);
        });
    }, []);

    return (
        <group ref={groupRef}>
            <Suspense fallback={
                <Html center>
                    <div className="text-white text-xl">Loading Macbook...</div>
                </Html>
            }>
                <MacbookModel scale={isMobile ? 0.05 : 0.08} position={[0, -1, 0]} />
            </Suspense>
        </group>
    );
};

const Features = () => {
    return (
        <section id="features" className="relative h-screen">
            <h2 className="text-center text-4xl md:text-5xl text-white mb-10 pt-10">
                See it all in a new light.
            </h2>

            <Canvas 
                id="f-canvas" 
                camera={{ position: [0, 0, 5], fov: 50 }}
                className="absolute top-0 left-0 w-full h-3/4"
            >
                <StudioLights />
                <ambientLight intensity={0.5} />
                <ModelScroll />
            </Canvas>

            <div className="absolute inset-0 pointer-events-none mt-40">
                {features.map((feature, index) => (
                    <div 
                        key={feature.id} 
                        className={clsx(
                            'box absolute bg-black/70 backdrop-blur-lg p-6 rounded-2xl border border-white/10 max-w-xs transition-all duration-500',
                            `box${index + 1}`,
                            feature.styles
                        )}
                    >
                        {feature.icon && (
                            <img 
                                src={feature.icon} 
                                alt={feature.highlight} 
                                className="w-12 h-12 mb-4"
                            />
                        )}
                        <p className="text-gray-200 text-sm leading-relaxed">
                            <span className="text-white font-semibold text-lg block mb-1">
                                {feature.highlight}
                            </span>
                            {feature.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;