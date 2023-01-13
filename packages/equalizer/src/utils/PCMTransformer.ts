import { Transform, TransformOptions } from 'stream';

export type PCMType = `s${16 | 32}${'l' | 'b'}e`;

export interface PCMTransformerOptions extends TransformOptions {
    type?: PCMType;
}

export class PCMTransformer extends Transform {
    public readonly type: PCMType = 's16le';
    public bits: number;
    public bytes: number;
    public extremum: number;

    public constructor(options: PCMTransformerOptions = {}) {
        super(options);

        options.type ??= 's16le';

        switch (options.type) {
            case 's16be':
            case 's16le':
                this.type = options.type;
                this.bits = 16;
                break;
            case 's32be':
            case 's32le':
                this.type = options.type;
                this.bits = 32;
                break;
            default:
                throw new TypeError(`Expected type to be one of ${(['s16be', 's16le', 's32be', 's32le'] as PCMType[]).join(', ')}, got "${options.type}"`);
        }

        this.bytes = this.bits / 8;
        this.extremum = Math.pow(2, this.bits - 1);
    }

    public _readInt(buffer: Buffer, index: number) {
        const method = `readInt${this.type.substring(1).toUpperCase()}` as `readInt${16 | 32}${'L' | 'B'}E`;
        return buffer[method](index);
    }

    public _writeInt(buffer: Buffer, int: number, index: number) {
        const method = `writeInt${this.type.substring(1).toUpperCase()}` as `writeInt${16 | 32}${'L' | 'B'}E`;
        return buffer[method](int, index);
    }
}
