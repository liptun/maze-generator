import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    padding: 15px;
`;
const Canvas = styled.canvas`
    outline: 1px solid black;
`;

const MazeCanvas: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.canvas.width = 600;
                ctx.canvas.height = 600;
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(0, 0, 16, 16);
            }
        }
    }, [canvasRef]);
    return (
        <Wrapper>
            <Canvas ref={canvasRef} />
        </Wrapper>
    );
};

export default MazeCanvas;
