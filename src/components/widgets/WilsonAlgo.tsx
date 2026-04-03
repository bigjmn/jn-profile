"use client"

import { useState, useEffect, useRef } from "react"
import { Maze, wilsonsAlgorithm } from "@/lib/widgets/wilson"

export default function WilsonMaze(){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stepTime, setStepTime] = useState(10)

    const [mazeSize, setMazeSize] = useState(17)
    const [isTorus, setIsTorus] = useState(true)
    const controllerRef = useRef<AbortController | null>(null)

    const generateMaze = async () => {
        // Abort any existing generation
        if (controllerRef.current) {
            controllerRef.current.abort()
        }

        // Create a new controller for this generation
        const controller = new AbortController()
        controllerRef.current = controller

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const maze = new Maze(mazeSize, mazeSize, isTorus)
        try {
            const staken = await wilsonsAlgorithm(maze, ctx, controller.signal, stepTime)
            console.log(staken)
        } catch (e: unknown) {
            if (e instanceof Error && e.message.includes('aborted')) {
                console.log('Generation cancelled')
                return
            }
            throw e
        }
    }
    // useEffect(() => {
    //     const controller = new AbortController()
    //     const {signal:cancelSignal} = controller 
    //     const canvas = canvasRef.current; 
    //     if (!canvas) return; 
    //     const ctx = canvas.getContext('2d')
    //     if (!ctx) return; 

    //     const generateMaze = async () => {
    //         while (!cancelSignal.aborted){
    //             const maze = new Maze(mazeSize, mazeSize, isTorus)
    //             try {
    //                 const staken = await wilsonsAlgorithm(maze, ctx, cancelSignal, stepTime)
    //                 console.log(staken)
    //             } catch (e:unknown){
    //                 if (e instanceof Error && e.message.includes('aborted')){
    //                     continue
    //                 }
    //                 throw e;
    //             }
    //         }
    //     }
    //     generateMaze()
    //     return () => {
    //         controller.abort()
    //     }

    // }, [stepTime, mazeSize, isTorus])

    return (
        <div className="w-full flex justify-center flex-col lg:flex-row">
            <div className="w-full flex justify-center lg:flex-col lg:w-1/4">
            <label className="inline-flex items-center mb-5 cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isTorus} onChange={(e) => setIsTorus(e.target.checked)} />
                <div className="relative w-11 h-6 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                <span className="select-none ms-3 text-sm font-medium text-heading">Large toggle</span>
            </label>
            <label className="inline-flex items-center mb-5 cursor-pointer">
                <span className="select-none ms-3 text-sm font-medium text-heading">Maze Size</span>

                <input onClick={(e) => e.currentTarget.select()} type="number" placeholder="10" id="number-input" aria-describedby="helper-text-explanation" className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" value={mazeSize} onChange={e => setMazeSize(e.target.valueAsNumber)} />
            </label>
            <button type="button" onClick={generateMaze}>Generate!</button>
            </div>
            <div></div>
            <canvas ref={canvasRef} width={400} height={400} />
        </div>
    )
}