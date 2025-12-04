import useMacbookStore from "../store";
import clsx from "clsx";
import {Canvas} from "@react-three/fiber";
import StudioLights from "./three/StudioLights.jsx";
import ModelSwitcher from './three/ModelSwitcher.jsx';
import {useMediaQuery} from "react-responsive";

const ProductViewer = () => {
    const { color, scale, setColor, setScale } = useMacbookStore();
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)'});

    // Updated color sequence: Starts with Silver, ends with Space Gray, Blue at 2nd last
    const colors = [
        { name: 'Silver', value: '#f2f2f2' }, // First
        { name: 'Sierra Orange', value: '#ff6b35' },
        { name: 'Deep Purple', value: '#5d3a7a' },
        { name: 'Pacific Blue', value: '#007aff' }, // Brighter blue at 2nd last
        { name: 'Space Gray', value: '#2e2c2e' } // Space Gray at last
    ];
    
    const currentColor = colors.find(c => c.value === color)?.name || colors[0].name;
    const currentSize = scale === 0.06 ? '14"' : '16"';

    return (
        <section id="product-viewer">
            <h2>Take a closer look.</h2>

            <div className="controls">
                <p className="info text-xl font-medium">
                    Macbook Pro {currentSize} in <span style={{ color: color, fontWeight: 'bold' }}>{currentColor}</span>
                </p>
                <div className="flex-center gap-5 mt-5">
                    <div className="color-control">
                        {colors.map((colorOption) => (
                            <div
                                key={colorOption.value}
                                onClick={() => setColor(colorOption.value)}
                                className={clsx(
                                    'color-option',
                                    color === colorOption.value && 'active',
                                    colorOption.value === '#f2f2f2' ? 'border border-gray-300' : ''
                                )}
                                style={{ 
                                    backgroundColor: colorOption.value,
                                    boxShadow: color === colorOption.value ? `0 0 0 3px ${colorOption.value}, 0 0 0 6px rgba(255,255,255,0.3)` : 'none'
                                }}
                                title={colorOption.name}
                            />
                        ))}
                    </div>

                    <div className="size-control">
                        <div
                            onClick={() => setScale(0.06)}
                            className={clsx(
                                'size-option',
                                scale === 0.06 ? 'bg-white text-black' : 'bg-transparent text-white'
                            )}
                        >
                            <p>14"</p>
                        </div>
                        <div
                            onClick={() => setScale(0.08)}
                            className={clsx(
                                'size-option',
                                scale === 0.08 ? 'bg-white text-black' : 'bg-transparent text-white'
                            )}
                        >
                            <p>16"</p>
                        </div>
                    </div>
                </div>
            </div>

            <Canvas id="canvas" camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 100}}>
                <StudioLights />
                <ModelSwitcher scale={isMobile ? scale - 0.03 : scale} isMobile={isMobile} />
            </Canvas>
        </section>
    )
}

export default ProductViewer;