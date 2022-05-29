const _chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

export class Base64 {

    static btoa = (input: string = '') => {
        let str = input
        let output = ''

        for (let block = 0, charCode, i = 0, map = _chars;
            str.charAt(i | 0) || (map = '=', i % 1);
            output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

            charCode = str.charCodeAt(i += 3 / 4)

            if (charCode > 0xFF) {
                throw new Error("[Base64.btoa]: The string to be encoded contains characters outside of the Latin1 range.")
            }

            block = block << 8 | charCode
        }

        return output
    }

    static atob = (input: string = '') => {
        let str = input.replace(/=+$/, '')
        let output = ''

        if (str.length % 4 == 1) {
            throw new Error("[Base64.atob]: The string to be decoded is not correctly encoded.")
        }
        for (let bc = 0, bs = 0, buffer, i = 0;
            buffer = str.charAt(i++);

            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            buffer = _chars.indexOf(buffer)
        }

        return output
    }

    static arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = ''
        let bytes = new Uint8Array(buffer)
        let len = bytes.byteLength
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return this.btoa(binary)
    }

}
