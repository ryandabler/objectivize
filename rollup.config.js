import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default [
    {
        input: './src/index.js',
        external: 'tupos',
        output: [
            {
                file: './lib/objectivize.esm.js',
                format: 'esm',
            },
        ],
    },
    {
        input: './src/index.js',
        output: [
            {
                file: './lib/objectivize.min.js',
                format: 'iife',
                name: 'objectivize',
            },
            {
                file: './lib/objectivize.umd.js',
                format: 'umd',
                name: 'objectivize',
            },
        ],
        plugins: [
            resolve(),
            terser({
                include: ['*min*'],
            }),
        ],
    },
];
