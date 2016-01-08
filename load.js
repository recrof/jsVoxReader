function parseMagicaVox(data) {"use strict";
    var bin = new DataView(data),
        offset = 0,
        result = {};

    function readString(size) {
        var result = '',
            i, byte;
        for(i = 0; i < size; i++) {
            byte = bin.getUint8(offset);
            result += String.fromCharCode(byte);
            offset++;
        }
        return result;
    }
    function readByte() { return bin.getUint8(offset++) }
    function readInt(bigEndian) {
        var result = bin.getUint32(offset, !bigEndian);
        offset += 4;
        return result;
    }

    function readChunk() {
        var chunk = {},
            childBytesRemaining,
            childChunk,
            numVoxels,
            voxels,
            i;

        chunk.id = readString(4);
        chunk.length = readInt();
        chunk.childLength = readInt();

        if(chunk.id === 'MAIN' && chunk.childLength > 0) {
            childBytesRemaining = chunk.childLength;
            chunk.childs = [];
            while(childBytesRemaining > 0) {
                childChunk = readChunk();
                //console.log(childChunk);
                childBytesRemaining -= childChunk.length + 12; // 12 = id + len + childLen
                //console.log('remaining:', childBytesRemaining);
                chunk.childs.push(childChunk);
            }

        }
        else if(chunk.id === 'SIZE') {
            result.size = {
                x: readInt(),
                y: readInt(),
                z: readInt()
            }
        }
        else if(chunk.id === 'XYZI') {
            numVoxels = readInt();
            voxels = [];
            for(i = 0; i < numVoxels; i++) {
                voxels.push([readByte(), readByte(), readByte(), readByte()])
            }
            result.voxels.push(voxels);
        }
        else if(chunk.id === 'RGBA') {
            result.palette = [];
            for(i = 0; i < 256; i++) {
                result.palette.push(readInt(true));
            }
        } else {
            console.log('unsupported chunk type ', chunk.id);
            offset += chunk.length + chunk.childLength;
        }

        return chunk;
    }
    result.voxels = [];
    // RGBA info
    result.palette = [0x0, 0xffffffff, 0xffffccff, 0xffff99ff, 0xffff66ff, 0xffff33ff, 0xffff00ff, 0xffccffff, 0xffccccff, 0xffcc99ff, 0xffcc66ff, 0xffcc33ff, 0xffcc00ff, 0xff99ffff, 0xff99ccff, 0xff9999ff, 0xff9966ff, 0xff9933ff, 0xff9900ff, 0xff66ffff, 0xff66ccff, 0xff6699ff, 0xff6666ff, 0xff6633ff, 0xff6600ff, 0xff33ffff, 0xff33ccff, 0xff3399ff, 0xff3366ff, 0xff3333ff, 0xff3300ff, 0xff00ffff, 0xff00ccff, 0xff0099ff, 0xff0066ff, 0xff0033ff, 0xff0000ff, 0xccffffff, 0xccffccff, 0xccff99ff, 0xccff66ff, 0xccff33ff, 0xccff00ff, 0xccccffff, 0xccccccff, 0xcccc99ff, 0xcccc66ff, 0xcccc33ff, 0xcccc00ff, 0xcc99ffff, 0xcc99ccff, 0xcc9999ff, 0xcc9966ff, 0xcc9933ff, 0xcc9900ff, 0xcc66ffff, 0xcc66ccff, 0xcc6699ff, 0xcc6666ff, 0xcc6633ff, 0xcc6600ff, 0xcc33ffff, 0xcc33ccff, 0xcc3399ff, 0xcc3366ff, 0xcc3333ff, 0xcc3300ff, 0xcc00ffff, 0xcc00ccff, 0xcc0099ff, 0xcc0066ff, 0xcc0033ff, 0xcc0000ff, 0x99ffffff, 0x99ffccff, 0x99ff99ff, 0x99ff66ff, 0x99ff33ff, 0x99ff00ff, 0x99ccffff, 0x99ccccff, 0x99cc99ff, 0x99cc66ff, 0x99cc33ff, 0x99cc00ff, 0x9999ffff, 0x9999ccff, 0x999999ff, 0x999966ff, 0x999933ff, 0x999900ff, 0x9966ffff, 0x9966ccff, 0x996699ff, 0x996666ff, 0x996633ff, 0x996600ff, 0x9933ffff, 0x9933ccff, 0x993399ff, 0x993366ff, 0x993333ff, 0x993300ff, 0x9900ffff, 0x9900ccff, 0x990099ff, 0x990066ff, 0x990033ff, 0x990000ff, 0x66ffffff, 0x66ffccff, 0x66ff99ff, 0x66ff66ff, 0x66ff33ff, 0x66ff00ff, 0x66ccffff, 0x66ccccff, 0x66cc99ff, 0x66cc66ff, 0x66cc33ff, 0x66cc00ff, 0x6699ffff, 0x6699ccff, 0x669999ff, 0x669966ff, 0x669933ff, 0x669900ff, 0x6666ffff, 0x6666ccff, 0x666699ff, 0x666666ff, 0x666633ff, 0x666600ff, 0x6633ffff, 0x6633ccff, 0x663399ff, 0x663366ff, 0x663333ff, 0x663300ff, 0x6600ffff, 0x6600ccff, 0x660099ff, 0x660066ff, 0x660033ff, 0x660000ff, 0x33ffffff, 0x33ffccff, 0x33ff99ff, 0x33ff66ff, 0x33ff33ff, 0x33ff00ff, 0x33ccffff, 0x33ccccff, 0x33cc99ff, 0x33cc66ff, 0x33cc33ff, 0x33cc00ff, 0x3399ffff, 0x3399ccff, 0x339999ff, 0x339966ff, 0x339933ff, 0x339900ff, 0x3366ffff, 0x3366ccff, 0x336699ff, 0x336666ff, 0x336633ff, 0x336600ff, 0x3333ffff, 0x3333ccff, 0x333399ff, 0x333366ff, 0x333333ff, 0x333300ff, 0x3300ffff, 0x3300ccff, 0x330099ff, 0x330066ff, 0x330033ff, 0x330000ff, 0xffffff, 0xffccff, 0xff99ff, 0xff66ff, 0xff33ff, 0xff00ff, 0xccffff, 0xccccff, 0xcc99ff, 0xcc66ff, 0xcc33ff, 0xcc00ff, 0x99ffff, 0x99ccff, 0x9999ff, 0x9966ff, 0x9933ff, 0x9900ff, 0x66ffff, 0x66ccff, 0x6699ff, 0x6666ff, 0x6633ff, 0x6600ff, 0x33ffff, 0x33ccff, 0x3399ff, 0x3366ff, 0x3333ff, 0x3300ff, 0xffff, 0xccff, 0x99ff, 0x66ff, 0x33ff, 0xee0000ff, 0xdd0000ff, 0xbb0000ff, 0xaa0000ff, 0x880000ff, 0x770000ff, 0x550000ff, 0x440000ff, 0x220000ff, 0x110000ff, 0xee00ff, 0xdd00ff, 0xbb00ff, 0xaa00ff, 0x8800ff, 0x7700ff, 0x5500ff, 0x4400ff, 0x2200ff, 0x1100ff, 0xeeff, 0xddff, 0xbbff, 0xaaff, 0x88ff, 0x77ff, 0x55ff, 0x44ff, 0x22ff, 0x11ff, 0xeeeeeeff, 0xddddddff, 0xbbbbbbff, 0xaaaaaaff, 0x888888ff, 0x777777ff, 0x555555ff, 0x444444ff, 0x222222ff, 0x111111ff];

    result.type = readString(4);
    result.version = readInt();

    readChunk(); // main chunk

    return result;
}

