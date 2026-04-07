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
        <div className="w-full flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Options Panel */}
            <div className="w-full flex flex-col gap-4 lg:w-64 lg:flex-shrink-0">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isTorus} onChange={(e) => setIsTorus(e.target.checked)} />
                    <div className="relative w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-200 dark:peer-focus:ring-fuchsia-900 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-500"></div>
                    <span className="select-none text-sm font-medium text-slate-700 dark:text-slate-200">Torus Topology</span>
                </label>

                <div className="flex flex-col gap-2">
                    <label htmlFor="maze-size" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Maze Size
                    </label>
                    <input
                        id="maze-size"
                        onClick={(e) => e.currentTarget.select()}
                        type="number"
                        placeholder="17"
                        min="5"
                        max="50"
                        className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 shadow-sm"
                        value={mazeSize}
                        onChange={e => setMazeSize(e.target.valueAsNumber)}
                    />
                </div>

                <button
                    type="button"
                    onClick={generateMaze}
                    className="w-full px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                    Generate Maze
                </button>
            </div>

            {/* Canvas */}
            <div className="flex-1 flex justify-center items-center">
                <canvas ref={canvasRef} width={400} height={400} className="max-w-full h-auto" />
            </div>
        </div>
    )
}