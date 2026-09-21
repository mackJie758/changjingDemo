function encodeSign() {
    function x() {
        var e = new Uint32Array(1)
            , t = 4294967295;
        return crypto.getRandomValues(e)[0] / t
    }
    function R() {
        for (var e = "", t = 0; t < 16; t++)
            e += Math.floor(10 * x());
        return e
    }
    function ot(t) {
        const e = [];
        for (let r = 0, n = t.length; r < n; r++) {
            const n = t.codePointAt(r);
            if (n <= 127)
                e.push(n);
            else if (n <= 2047)
                e.push(192 | n >>> 6),
                    e.push(128 | 63 & n);
            else if (n <= 55295 || n >= 57344 && n <= 65535)
                e.push(224 | n >>> 12),
                    e.push(128 | n >>> 6 & 63),
                    e.push(128 | 63 & n);
            else {
                if (!(n >= 65536 && n <= 1114111))
                    throw e.push(n),
                    new Error("input is not supported");
                r++,
                    e.push(240 | n >>> 18 & 28),
                    e.push(128 | n >>> 12 & 63),
                    e.push(128 | n >>> 6 & 63),
                    e.push(128 | 63 & n)
            }
        }
        return e
    }
    function r(t, e) {
        const r = []
            , n = ~~(e / 8)
            , i = e % 8;
        for (let o = 0, a = t.length; o < a; o++)
            r[o] = (t[(o + n) % a] << i & 255) + (t[(o + n + 1) % a] >>> 8 - i & 255);
        return r
    }
    function n(t, e) {
        const r = [];

        for (let n = t.length - 1; n >= 0; n--)
            r[n] = 255 & (t[n] ^ e[n]);
        return r
    }
    function i(t, e) {
        const r = [];
        if (!e) {
            e = t
        }
        if (t.length > 10) {
            debugger
        }
        for (let n = t.length - 1; n >= 0; n--)
            r[n] = t[n] & e[n] & 255;
        return r
    }
    function o(t, e) {
        const r = [];
        for (let n = t.length - 1; n >= 0; n--)
            r[n] = 255 & (t[n] | e[n]);
        return r
    }
    function a(t, e) {
        const r = [];
        let n = 0;
        for (let i = t.length - 1; i >= 0; i--) {
            const o = t[i] + e[i] + n;
            o > 255 ? (n = 1,
                r[i] = 255 & o) : (n = 0,
                    r[i] = 255 & o)
        }
        return r
    }
    function s(t) {
        const e = [];
        for (let r = t.length - 1; r >= 0; r--)
            e[r] = 255 & ~t[r];
        return e
    }
    function u(t) {
        return n(n(t, r(t, 9)), r(t, 17))
    }
    function h(t) {
        return n(n(t, r(t, 15)), r(t, 23))
    }
    function f(t, e, r, a) {
        return a >= 0 && a <= 15 ? n(n(t, e), r) : o(o(i(t, e), i(t, r)), i(e, r))
    }
    function c(t, e, r, a) {
        return a >= 0 && a <= 15 ? n(n(t, e), r) : o(i(t, e), i(s(t), r))
    }
    function l(t, e) {
        const i = []
            , o = [];
        for (let r = 0; r < 16; r++) {
            const t = 4 * r;
            i.push(e.slice(t, t + 4))
        }
        for (let a = 16; a < 68; a++)
            i.push(n(n(h(n(n(i[a - 16], i[a - 9]), r(i[a - 3], 15))), r(i[a - 13], 7)), i[a - 6]));
        for (let r = 0; r < 64; r++)
            o.push(n(i[r], i[r + 4]));
        const s = [121, 204, 69, 25]
            , l = [122, 135, 157, 138];
        let d, p, m, v, b = t.slice(0, 4), g = t.slice(4, 8), y = t.slice(8, 12), w = t.slice(12, 16), M = t.slice(16, 20), _ = t.slice(20, 24), x = t.slice(24, 28), S = t.slice(28, 32);
        for (let h = 0; h < 64; h++) {
            const t = h >= 0 && h <= 15 ? s : l;
            d = r(a(a(r(b, 12), M), r(t, h)), 7),
                p = n(d, r(b, 12)),
                m = a(a(a(f(b, g, y, h), w), p), o[h]),
                v = a(a(a(c(M, _, x, h), S), d), i[h]),
                w = y,
                y = r(g, 9),
                g = b,
                b = m,
                S = x,
                x = r(_, 19),
                _ = M,
                M = u(v)
        }
        return n([].concat(b, g, y, w, M, _, x, S), t)
    }
    function tn(t) {
        let e = 8 * t.length
            , r = e % 512;
        r = r >= 448 ? 512 - r % 448 - 1 : 448 - r - 1;
        const n = new Array((r - 7) / 8);
        for (let u = 0, h = n.length; u < h; u++)
            n[u] = 0;
        const i = [];
        e = e.toString(2);
        for (let u = 7; u >= 0; u--)
            if (e.length > 8) {
                const t = e.length - 8;
                i[u] = parseInt(e.substr(t), 2),
                    e = e.substr(0, t)
            } else
                e.length > 0 ? (i[u] = parseInt(e, 2),
                    e = "") : i[u] = 0;
        const o = [].concat(t, [128], n, i)
            , a = o.length / 64;
        let s = [115, 128, 22, 111, 73, 20, 178, 185, 23, 36, 66, 215, 218, 138, 6, 0, 169, 111, 48, 188, 22, 49, 56, 170, 227, 141, 238, 77, 176, 251, 14, 78];
        for (let u = 0; u < a; u++) {
            const t = 64 * u
                , e = o.slice(t, t + 64);
            s = l(s, e)
        }
        return s
    }
    function iT(t) {
        return t.map(t => (t = t.toString(16),
            1 === t.length ? "0" + t : t)).join("")
    }
    function readUIntBE(t, e, r) {
        t |= 0,
            e |= 0
        var i = this.abuff[t + --e]
            , n = 1;
        while (e > 0 && (n *= 256))
            i += this.abuff[t + --e] * n;
        return i
    }
    var dateTime = new Date().getTime();
    var Nonce = R()
    var Timestamp = "Timestamp" + dateTime + "Nonce" + Nonce;
    var tTimestamp = ot(Timestamp)
    Sign = iT(tn(tTimestamp))
    var buffer = new ArrayBuffer(3)
    var unitArr = new Uint8Array(buffer)
    this.abuff = window.crypto.getRandomValues(unitArr)
    
    var readUIntBEString = readUIntBE(0, 2)
    var M = readUIntBEString.toString().padStart(6, "0")
    var $ = function (M) {
        for (var A = "", e = 0; e < M.length; e++)
            A += (M.charCodeAt(e) + 1).toString(28);
        return A
    }
    var amiSeedCode = $(M)// M.headers["ami-seed-code"] = $(M)
    var aCode = CryptoJS.SHA256(M).toString(CryptoJS.enc.Hex).substring(0, 32);
    return { dateTime,Nonce,Sign,amiSeedCode,aCode }
}