const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vendor-libs.js","assets/react-core.js","assets/react-core.css"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { d as safeBufferExports, e as src$2, r as require$$0, f as ed25519, B as Buffer$1, g as coerce, h as string, i as instance, t as tuple, l as literal, u as unknown, j as type, n as number, k as array, m as nullable, o as optional, p as boolean, q as record, v as union, w as secp256k1, x as BN, y as sha256, z as any, A as create, C as serialize_1, E as deserialize_1, F as deserializeUnchecked_1, R as RpcClient, G as CommonClient, W as WebSocket$1, H as EventEmitter, b as StandardConnect$1, S as StandardEvents$1, a as StandardDisconnect$1, I as base$2, J as requireCryptoBrowserify, _ as __vitePreload, K as registerWallet, L as src$3, M as src$4 } from "./vendor-libs.js";
import { a as getDefaultExportFromCjs$1 } from "./react-core.js";
var _Buffer = safeBufferExports.Buffer;
function base$1(ALPHABET2) {
  if (ALPHABET2.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET2.length; i++) {
    var x = ALPHABET2.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET2.length;
  var LEADER = ALPHABET2.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode2(source) {
    if (Array.isArray(source) || source instanceof Uint8Array) {
      source = _Buffer.from(source);
    }
    if (!_Buffer.isBuffer(source)) {
      throw new TypeError("Expected Buffer");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length = i2;
      pbegin++;
    }
    var it2 = size - length;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET2.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return _Buffer.alloc(0);
    }
    var psz = 0;
    var zeroes = 0;
    var length = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (psz < source.length) {
      var charCode = source.charCodeAt(psz);
      if (charCode > 255) {
        return;
      }
      var carry = BASE_MAP[charCode];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length = i2;
      psz++;
    }
    var it4 = size - length;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = _Buffer.allocUnsafe(zeroes + (size - it4));
    vch.fill(0, 0, zeroes);
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode(string2) {
    var buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error("Non-base" + BASE + " character");
  }
  return {
    encode: encode2,
    decodeUnsafe,
    decode
  };
}
var src$1 = base$1;
var basex$4 = src$1;
var ALPHABET$5 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bs58$7 = basex$4(ALPHABET$5);
const bs58$8 = /* @__PURE__ */ getDefaultExportFromCjs$1(bs58$7);
var basex$3 = src$2;
var ALPHABET$4 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bs58$6 = basex$3(ALPHABET$4);
var Layout$1 = {};
Object.defineProperty(Layout$1, "__esModule", { value: true });
Layout$1.s16 = Layout$1.s8 = Layout$1.nu64be = Layout$1.u48be = Layout$1.u40be = Layout$1.u32be = Layout$1.u24be = Layout$1.u16be = nu64 = Layout$1.nu64 = Layout$1.u48 = Layout$1.u40 = u32 = Layout$1.u32 = Layout$1.u24 = u16 = Layout$1.u16 = u8 = Layout$1.u8 = offset = Layout$1.offset = Layout$1.greedy = Layout$1.Constant = Layout$1.UTF8 = Layout$1.CString = Layout$1.Blob = Layout$1.Boolean = Layout$1.BitField = Layout$1.BitStructure = Layout$1.VariantLayout = Layout$1.Union = Layout$1.UnionLayoutDiscriminator = Layout$1.UnionDiscriminator = Layout$1.Structure = Layout$1.Sequence = Layout$1.DoubleBE = Layout$1.Double = Layout$1.FloatBE = Layout$1.Float = Layout$1.NearInt64BE = Layout$1.NearInt64 = Layout$1.NearUInt64BE = Layout$1.NearUInt64 = Layout$1.IntBE = Layout$1.Int = Layout$1.UIntBE = Layout$1.UInt = Layout$1.OffsetLayout = Layout$1.GreedyCount = Layout$1.ExternalLayout = Layout$1.bindConstructorLayout = Layout$1.nameWithProperty = Layout$1.Layout = Layout$1.uint8ArrayToBuffer = Layout$1.checkUint8Array = void 0;
Layout$1.constant = Layout$1.utf8 = Layout$1.cstr = blob = Layout$1.blob = Layout$1.unionLayoutDiscriminator = Layout$1.union = seq = Layout$1.seq = Layout$1.bits = struct = Layout$1.struct = Layout$1.f64be = Layout$1.f64 = Layout$1.f32be = Layout$1.f32 = Layout$1.ns64be = Layout$1.s48be = Layout$1.s40be = Layout$1.s32be = Layout$1.s24be = Layout$1.s16be = ns64 = Layout$1.ns64 = Layout$1.s48 = Layout$1.s40 = Layout$1.s32 = Layout$1.s24 = void 0;
const buffer_1 = require$$0;
function checkUint8Array(b) {
  if (!(b instanceof Uint8Array)) {
    throw new TypeError("b must be a Uint8Array");
  }
}
Layout$1.checkUint8Array = checkUint8Array;
function uint8ArrayToBuffer(b) {
  checkUint8Array(b);
  return buffer_1.Buffer.from(b.buffer, b.byteOffset, b.length);
}
Layout$1.uint8ArrayToBuffer = uint8ArrayToBuffer;
class Layout {
  constructor(span, property) {
    if (!Number.isInteger(span)) {
      throw new TypeError("span must be an integer");
    }
    this.span = span;
    this.property = property;
  }
  /** Function to create an Object into which decoded properties will
   * be written.
   *
   * Used only for layouts that {@link Layout#decode|decode} to Object
   * instances, which means:
   * * {@link Structure}
   * * {@link Union}
   * * {@link VariantLayout}
   * * {@link BitStructure}
   *
   * If left undefined the JavaScript representation of these layouts
   * will be Object instances.
   *
   * See {@link bindConstructorLayout}.
   */
  makeDestinationObject() {
    return {};
  }
  /**
   * Calculate the span of a specific instance of a layout.
   *
   * @param {Uint8Array} b - the buffer that contains an encoded instance.
   *
   * @param {Number} [offset] - the offset at which the encoded instance
   * starts.  If absent a zero offset is inferred.
   *
   * @return {Number} - the number of bytes covered by the layout
   * instance.  If this method is not overridden in a subclass the
   * definition-time constant {@link Layout#span|span} will be
   * returned.
   *
   * @throws {RangeError} - if the length of the value cannot be
   * determined.
   */
  getSpan(b, offset2) {
    if (0 > this.span) {
      throw new RangeError("indeterminate span");
    }
    return this.span;
  }
  /**
   * Replicate the layout using a new property.
   *
   * This function must be used to get a structurally-equivalent layout
   * with a different name since all {@link Layout} instances are
   * immutable.
   *
   * **NOTE** This is a shallow copy.  All fields except {@link
   * Layout#property|property} are strictly equal to the origin layout.
   *
   * @param {String} property - the value for {@link
   * Layout#property|property} in the replica.
   *
   * @returns {Layout} - the copy with {@link Layout#property|property}
   * set to `property`.
   */
  replicate(property) {
    const rv = Object.create(this.constructor.prototype);
    Object.assign(rv, this);
    rv.property = property;
    return rv;
  }
  /**
   * Create an object from layout properties and an array of values.
   *
   * **NOTE** This function returns `undefined` if invoked on a layout
   * that does not return its value as an Object.  Objects are
   * returned for things that are a {@link Structure}, which includes
   * {@link VariantLayout|variant layouts} if they are structures, and
   * excludes {@link Union}s.  If you want this feature for a union
   * you must use {@link Union.getVariant|getVariant} to select the
   * desired layout.
   *
   * @param {Array} values - an array of values that correspond to the
   * default order for properties.  As with {@link Layout#decode|decode}
   * layout elements that have no property name are skipped when
   * iterating over the array values.  Only the top-level properties are
   * assigned; arguments are not assigned to properties of contained
   * layouts.  Any unused values are ignored.
   *
   * @return {(Object|undefined)}
   */
  fromArray(values) {
    return void 0;
  }
}
Layout$1.Layout = Layout;
function nameWithProperty(name, lo) {
  if (lo.property) {
    return name + "[" + lo.property + "]";
  }
  return name;
}
Layout$1.nameWithProperty = nameWithProperty;
function bindConstructorLayout(Class, layout) {
  if ("function" !== typeof Class) {
    throw new TypeError("Class must be constructor");
  }
  if (Object.prototype.hasOwnProperty.call(Class, "layout_")) {
    throw new Error("Class is already bound to a layout");
  }
  if (!(layout && layout instanceof Layout)) {
    throw new TypeError("layout must be a Layout");
  }
  if (Object.prototype.hasOwnProperty.call(layout, "boundConstructor_")) {
    throw new Error("layout is already bound to a constructor");
  }
  Class.layout_ = layout;
  layout.boundConstructor_ = Class;
  layout.makeDestinationObject = () => new Class();
  Object.defineProperty(Class.prototype, "encode", {
    value(b, offset2) {
      return layout.encode(this, b, offset2);
    },
    writable: true
  });
  Object.defineProperty(Class, "decode", {
    value(b, offset2) {
      return layout.decode(b, offset2);
    },
    writable: true
  });
}
Layout$1.bindConstructorLayout = bindConstructorLayout;
class ExternalLayout extends Layout {
  /**
   * Return `true` iff the external layout decodes to an unsigned
   * integer layout.
   *
   * In that case it can be used as the source of {@link
   * Sequence#count|Sequence counts}, {@link Blob#length|Blob lengths},
   * or as {@link UnionLayoutDiscriminator#layout|external union
   * discriminators}.
   *
   * @abstract
   */
  isCount() {
    throw new Error("ExternalLayout is abstract");
  }
}
Layout$1.ExternalLayout = ExternalLayout;
class GreedyCount extends ExternalLayout {
  constructor(elementSpan = 1, property) {
    if (!Number.isInteger(elementSpan) || 0 >= elementSpan) {
      throw new TypeError("elementSpan must be a (positive) integer");
    }
    super(-1, property);
    this.elementSpan = elementSpan;
  }
  /** @override */
  isCount() {
    return true;
  }
  /** @override */
  decode(b, offset2 = 0) {
    checkUint8Array(b);
    const rem = b.length - offset2;
    return Math.floor(rem / this.elementSpan);
  }
  /** @override */
  encode(src2, b, offset2) {
    return 0;
  }
}
Layout$1.GreedyCount = GreedyCount;
class OffsetLayout extends ExternalLayout {
  constructor(layout, offset2 = 0, property) {
    if (!(layout instanceof Layout)) {
      throw new TypeError("layout must be a Layout");
    }
    if (!Number.isInteger(offset2)) {
      throw new TypeError("offset must be integer or undefined");
    }
    super(layout.span, property || layout.property);
    this.layout = layout;
    this.offset = offset2;
  }
  /** @override */
  isCount() {
    return this.layout instanceof UInt || this.layout instanceof UIntBE;
  }
  /** @override */
  decode(b, offset2 = 0) {
    return this.layout.decode(b, offset2 + this.offset);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    return this.layout.encode(src2, b, offset2 + this.offset);
  }
}
Layout$1.OffsetLayout = OffsetLayout;
class UInt extends Layout {
  constructor(span, property) {
    super(span, property);
    if (6 < this.span) {
      throw new RangeError("span must not exceed 6 bytes");
    }
  }
  /** @override */
  decode(b, offset2 = 0) {
    return uint8ArrayToBuffer(b).readUIntLE(offset2, this.span);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    uint8ArrayToBuffer(b).writeUIntLE(src2, offset2, this.span);
    return this.span;
  }
}
Layout$1.UInt = UInt;
class UIntBE extends Layout {
  constructor(span, property) {
    super(span, property);
    if (6 < this.span) {
      throw new RangeError("span must not exceed 6 bytes");
    }
  }
  /** @override */
  decode(b, offset2 = 0) {
    return uint8ArrayToBuffer(b).readUIntBE(offset2, this.span);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    uint8ArrayToBuffer(b).writeUIntBE(src2, offset2, this.span);
    return this.span;
  }
}
Layout$1.UIntBE = UIntBE;
class Int extends Layout {
  constructor(span, property) {
    super(span, property);
    if (6 < this.span) {
      throw new RangeError("span must not exceed 6 bytes");
    }
  }
  /** @override */
  decode(b, offset2 = 0) {
    return uint8ArrayToBuffer(b).readIntLE(offset2, this.span);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    uint8ArrayToBuffer(b).writeIntLE(src2, offset2, this.span);
    return this.span;
  }
}
Layout$1.Int = Int;
class IntBE extends Layout {
  constructor(span, property) {
    super(span, property);
    if (6 < this.span) {
      throw new RangeError("span must not exceed 6 bytes");
    }
  }
  /** @override */
  decode(b, offset2 = 0) {
    return uint8ArrayToBuffer(b).readIntBE(offset2, this.span);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    uint8ArrayToBuffer(b).writeIntBE(src2, offset2, this.span);
    return this.span;
  }
}
Layout$1.IntBE = IntBE;
const V2E32 = Math.pow(2, 32);
function divmodInt64(src2) {
  const hi32 = Math.floor(src2 / V2E32);
  const lo32 = src2 - hi32 * V2E32;
  return { hi32, lo32 };
}
function roundedInt64(hi32, lo32) {
  return hi32 * V2E32 + lo32;
}
class NearUInt64 extends Layout {
  constructor(property) {
    super(8, property);
  }
  /** @override */
  decode(b, offset2 = 0) {
    const buffer = uint8ArrayToBuffer(b);
    const lo32 = buffer.readUInt32LE(offset2);
    const hi32 = buffer.readUInt32LE(offset2 + 4);
    return roundedInt64(hi32, lo32);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    const split = divmodInt64(src2);
    const buffer = uint8ArrayToBuffer(b);
    buffer.writeUInt32LE(split.lo32, offset2);
    buffer.writeUInt32LE(split.hi32, offset2 + 4);
    return 8;
  }
}
Layout$1.NearUInt64 = NearUInt64;
class NearUInt64BE extends Layout {
  constructor(property) {
    super(8, property);
  }
  /** @override */
  decode(b, offset2 = 0) {
    const buffer = uint8ArrayToBuffer(b);
    const hi32 = buffer.readUInt32BE(offset2);
    const lo32 = buffer.readUInt32BE(offset2 + 4);
    return roundedInt64(hi32, lo32);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    const split = divmodInt64(src2);
    const buffer = uint8ArrayToBuffer(b);
    buffer.writeUInt32BE(split.hi32, offset2);
    buffer.writeUInt32BE(split.lo32, offset2 + 4);
    return 8;
  }
}
Layout$1.NearUInt64BE = NearUInt64BE;
class NearInt64 extends Layout {
  constructor(property) {
    super(8, property);
  }
  /** @override */
  decode(b, offset2 = 0) {
    const buffer = uint8ArrayToBuffer(b);
    const lo32 = buffer.readUInt32LE(offset2);
    const hi32 = buffer.readInt32LE(offset2 + 4);
    return roundedInt64(hi32, lo32);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    const split = divmodInt64(src2);
    const buffer = uint8ArrayToBuffer(b);
    buffer.writeUInt32LE(split.lo32, offset2);
    buffer.writeInt32LE(split.hi32, offset2 + 4);
    return 8;
  }
}
Layout$1.NearInt64 = NearInt64;
class NearInt64BE extends Layout {
  constructor(property) {
    super(8, property);
  }
  /** @override */
  decode(b, offset2 = 0) {
    const buffer = uint8ArrayToBuffer(b);
    const hi32 = buffer.readInt32BE(offset2);
    const lo32 = buffer.readUInt32BE(offset2 + 4);
    return roundedInt64(hi32, lo32);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    const split = divmodInt64(src2);
    const buffer = uint8ArrayToBuffer(b);
    buffer.writeInt32BE(split.hi32, offset2);
    buffer.writeUInt32BE(split.lo32, offset2 + 4);
    return 8;
  }
}
Layout$1.NearInt64BE = NearInt64BE;
class Float extends Layout {
  constructor(property) {
    super(4, property);
  }
  /** @override */
  decode(b, offset2 = 0) {
    return uint8ArrayToBuffer(b).readFloatLE(offset2);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    uint8ArrayToBuffer(b).writeFloatLE(src2, offset2);
    return 4;
  }
}
Layout$1.Float = Float;
class FloatBE extends Layout {
  constructor(property) {
    super(4, property);
  }
  /** @override */
  decode(b, offset2 = 0) {
    return uint8ArrayToBuffer(b).readFloatBE(offset2);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    uint8ArrayToBuffer(b).writeFloatBE(src2, offset2);
    return 4;
  }
}
Layout$1.FloatBE = FloatBE;
class Double extends Layout {
  constructor(property) {
    super(8, property);
  }
  /** @override */
  decode(b, offset2 = 0) {
    return uint8ArrayToBuffer(b).readDoubleLE(offset2);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    uint8ArrayToBuffer(b).writeDoubleLE(src2, offset2);
    return 8;
  }
}
Layout$1.Double = Double;
class DoubleBE extends Layout {
  constructor(property) {
    super(8, property);
  }
  /** @override */
  decode(b, offset2 = 0) {
    return uint8ArrayToBuffer(b).readDoubleBE(offset2);
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    uint8ArrayToBuffer(b).writeDoubleBE(src2, offset2);
    return 8;
  }
}
Layout$1.DoubleBE = DoubleBE;
class Sequence extends Layout {
  constructor(elementLayout, count, property) {
    if (!(elementLayout instanceof Layout)) {
      throw new TypeError("elementLayout must be a Layout");
    }
    if (!(count instanceof ExternalLayout && count.isCount() || Number.isInteger(count) && 0 <= count)) {
      throw new TypeError("count must be non-negative integer or an unsigned integer ExternalLayout");
    }
    let span = -1;
    if (!(count instanceof ExternalLayout) && 0 < elementLayout.span) {
      span = count * elementLayout.span;
    }
    super(span, property);
    this.elementLayout = elementLayout;
    this.count = count;
  }
  /** @override */
  getSpan(b, offset2 = 0) {
    if (0 <= this.span) {
      return this.span;
    }
    let span = 0;
    let count = this.count;
    if (count instanceof ExternalLayout) {
      count = count.decode(b, offset2);
    }
    if (0 < this.elementLayout.span) {
      span = count * this.elementLayout.span;
    } else {
      let idx = 0;
      while (idx < count) {
        span += this.elementLayout.getSpan(b, offset2 + span);
        ++idx;
      }
    }
    return span;
  }
  /** @override */
  decode(b, offset2 = 0) {
    const rv = [];
    let i = 0;
    let count = this.count;
    if (count instanceof ExternalLayout) {
      count = count.decode(b, offset2);
    }
    while (i < count) {
      rv.push(this.elementLayout.decode(b, offset2));
      offset2 += this.elementLayout.getSpan(b, offset2);
      i += 1;
    }
    return rv;
  }
  /** Implement {@link Layout#encode|encode} for {@link Sequence}.
   *
   * **NOTE** If `src` is shorter than {@link Sequence#count|count} then
   * the unused space in the buffer is left unchanged.  If `src` is
   * longer than {@link Sequence#count|count} the unneeded elements are
   * ignored.
   *
   * **NOTE** If {@link Layout#count|count} is an instance of {@link
   * ExternalLayout} then the length of `src` will be encoded as the
   * count after `src` is encoded. */
  encode(src2, b, offset2 = 0) {
    const elo = this.elementLayout;
    const span = src2.reduce((span2, v) => {
      return span2 + elo.encode(v, b, offset2 + span2);
    }, 0);
    if (this.count instanceof ExternalLayout) {
      this.count.encode(src2.length, b, offset2);
    }
    return span;
  }
}
Layout$1.Sequence = Sequence;
class Structure extends Layout {
  constructor(fields, property, decodePrefixes) {
    if (!(Array.isArray(fields) && fields.reduce((acc, v) => acc && v instanceof Layout, true))) {
      throw new TypeError("fields must be array of Layout instances");
    }
    if ("boolean" === typeof property && void 0 === decodePrefixes) {
      decodePrefixes = property;
      property = void 0;
    }
    for (const fd of fields) {
      if (0 > fd.span && void 0 === fd.property) {
        throw new Error("fields cannot contain unnamed variable-length layout");
      }
    }
    let span = -1;
    try {
      span = fields.reduce((span2, fd) => span2 + fd.getSpan(), 0);
    } catch (e) {
    }
    super(span, property);
    this.fields = fields;
    this.decodePrefixes = !!decodePrefixes;
  }
  /** @override */
  getSpan(b, offset2 = 0) {
    if (0 <= this.span) {
      return this.span;
    }
    let span = 0;
    try {
      span = this.fields.reduce((span2, fd) => {
        const fsp = fd.getSpan(b, offset2);
        offset2 += fsp;
        return span2 + fsp;
      }, 0);
    } catch (e) {
      throw new RangeError("indeterminate span");
    }
    return span;
  }
  /** @override */
  decode(b, offset2 = 0) {
    checkUint8Array(b);
    const dest = this.makeDestinationObject();
    for (const fd of this.fields) {
      if (void 0 !== fd.property) {
        dest[fd.property] = fd.decode(b, offset2);
      }
      offset2 += fd.getSpan(b, offset2);
      if (this.decodePrefixes && b.length === offset2) {
        break;
      }
    }
    return dest;
  }
  /** Implement {@link Layout#encode|encode} for {@link Structure}.
   *
   * If `src` is missing a property for a member with a defined {@link
   * Layout#property|property} the corresponding region of the buffer is
   * left unmodified. */
  encode(src2, b, offset2 = 0) {
    const firstOffset = offset2;
    let lastOffset = 0;
    let lastWrote = 0;
    for (const fd of this.fields) {
      let span = fd.span;
      lastWrote = 0 < span ? span : 0;
      if (void 0 !== fd.property) {
        const fv = src2[fd.property];
        if (void 0 !== fv) {
          lastWrote = fd.encode(fv, b, offset2);
          if (0 > span) {
            span = fd.getSpan(b, offset2);
          }
        }
      }
      lastOffset = offset2;
      offset2 += span;
    }
    return lastOffset + lastWrote - firstOffset;
  }
  /** @override */
  fromArray(values) {
    const dest = this.makeDestinationObject();
    for (const fd of this.fields) {
      if (void 0 !== fd.property && 0 < values.length) {
        dest[fd.property] = values.shift();
      }
    }
    return dest;
  }
  /**
   * Get access to the layout of a given property.
   *
   * @param {String} property - the structure member of interest.
   *
   * @return {Layout} - the layout associated with `property`, or
   * undefined if there is no such property.
   */
  layoutFor(property) {
    if ("string" !== typeof property) {
      throw new TypeError("property must be string");
    }
    for (const fd of this.fields) {
      if (fd.property === property) {
        return fd;
      }
    }
    return void 0;
  }
  /**
   * Get the offset of a structure member.
   *
   * @param {String} property - the structure member of interest.
   *
   * @return {Number} - the offset in bytes to the start of `property`
   * within the structure, or undefined if `property` is not a field
   * within the structure.  If the property is a member but follows a
   * variable-length structure member a negative number will be
   * returned.
   */
  offsetOf(property) {
    if ("string" !== typeof property) {
      throw new TypeError("property must be string");
    }
    let offset2 = 0;
    for (const fd of this.fields) {
      if (fd.property === property) {
        return offset2;
      }
      if (0 > fd.span) {
        offset2 = -1;
      } else if (0 <= offset2) {
        offset2 += fd.span;
      }
    }
    return void 0;
  }
}
Layout$1.Structure = Structure;
class UnionDiscriminator {
  constructor(property) {
    this.property = property;
  }
  /** Analog to {@link Layout#decode|Layout decode} for union discriminators.
   *
   * The implementation of this method need not reference the buffer if
   * variant information is available through other means. */
  decode(b, offset2) {
    throw new Error("UnionDiscriminator is abstract");
  }
  /** Analog to {@link Layout#decode|Layout encode} for union discriminators.
   *
   * The implementation of this method need not store the value if
   * variant information is maintained through other means. */
  encode(src2, b, offset2) {
    throw new Error("UnionDiscriminator is abstract");
  }
}
Layout$1.UnionDiscriminator = UnionDiscriminator;
class UnionLayoutDiscriminator extends UnionDiscriminator {
  constructor(layout, property) {
    if (!(layout instanceof ExternalLayout && layout.isCount())) {
      throw new TypeError("layout must be an unsigned integer ExternalLayout");
    }
    super(property || layout.property || "variant");
    this.layout = layout;
  }
  /** Delegate decoding to {@link UnionLayoutDiscriminator#layout|layout}. */
  decode(b, offset2) {
    return this.layout.decode(b, offset2);
  }
  /** Delegate encoding to {@link UnionLayoutDiscriminator#layout|layout}. */
  encode(src2, b, offset2) {
    return this.layout.encode(src2, b, offset2);
  }
}
Layout$1.UnionLayoutDiscriminator = UnionLayoutDiscriminator;
class Union extends Layout {
  constructor(discr, defaultLayout, property) {
    let discriminator;
    if (discr instanceof UInt || discr instanceof UIntBE) {
      discriminator = new UnionLayoutDiscriminator(new OffsetLayout(discr));
    } else if (discr instanceof ExternalLayout && discr.isCount()) {
      discriminator = new UnionLayoutDiscriminator(discr);
    } else if (!(discr instanceof UnionDiscriminator)) {
      throw new TypeError("discr must be a UnionDiscriminator or an unsigned integer layout");
    } else {
      discriminator = discr;
    }
    if (void 0 === defaultLayout) {
      defaultLayout = null;
    }
    if (!(null === defaultLayout || defaultLayout instanceof Layout)) {
      throw new TypeError("defaultLayout must be null or a Layout");
    }
    if (null !== defaultLayout) {
      if (0 > defaultLayout.span) {
        throw new Error("defaultLayout must have constant span");
      }
      if (void 0 === defaultLayout.property) {
        defaultLayout = defaultLayout.replicate("content");
      }
    }
    let span = -1;
    if (defaultLayout) {
      span = defaultLayout.span;
      if (0 <= span && (discr instanceof UInt || discr instanceof UIntBE)) {
        span += discriminator.layout.span;
      }
    }
    super(span, property);
    this.discriminator = discriminator;
    this.usesPrefixDiscriminator = discr instanceof UInt || discr instanceof UIntBE;
    this.defaultLayout = defaultLayout;
    this.registry = {};
    let boundGetSourceVariant = this.defaultGetSourceVariant.bind(this);
    this.getSourceVariant = function(src2) {
      return boundGetSourceVariant(src2);
    };
    this.configGetSourceVariant = function(gsv) {
      boundGetSourceVariant = gsv.bind(this);
    };
  }
  /** @override */
  getSpan(b, offset2 = 0) {
    if (0 <= this.span) {
      return this.span;
    }
    const vlo = this.getVariant(b, offset2);
    if (!vlo) {
      throw new Error("unable to determine span for unrecognized variant");
    }
    return vlo.getSpan(b, offset2);
  }
  /**
   * Method to infer a registered Union variant compatible with `src`.
   *
   * The first satisfied rule in the following sequence defines the
   * return value:
   * * If `src` has properties matching the Union discriminator and
   *   the default layout, `undefined` is returned regardless of the
   *   value of the discriminator property (this ensures the default
   *   layout will be used);
   * * If `src` has a property matching the Union discriminator, the
   *   value of the discriminator identifies a registered variant, and
   *   either (a) the variant has no layout, or (b) `src` has the
   *   variant's property, then the variant is returned (because the
   *   source satisfies the constraints of the variant it identifies);
   * * If `src` does not have a property matching the Union
   *   discriminator, but does have a property matching a registered
   *   variant, then the variant is returned (because the source
   *   matches a variant without an explicit conflict);
   * * An error is thrown (because we either can't identify a variant,
   *   or we were explicitly told the variant but can't satisfy it).
   *
   * @param {Object} src - an object presumed to be compatible with
   * the content of the Union.
   *
   * @return {(undefined|VariantLayout)} - as described above.
   *
   * @throws {Error} - if `src` cannot be associated with a default or
   * registered variant.
   */
  defaultGetSourceVariant(src2) {
    if (Object.prototype.hasOwnProperty.call(src2, this.discriminator.property)) {
      if (this.defaultLayout && this.defaultLayout.property && Object.prototype.hasOwnProperty.call(src2, this.defaultLayout.property)) {
        return void 0;
      }
      const vlo = this.registry[src2[this.discriminator.property]];
      if (vlo && (!vlo.layout || vlo.property && Object.prototype.hasOwnProperty.call(src2, vlo.property))) {
        return vlo;
      }
    } else {
      for (const tag in this.registry) {
        const vlo = this.registry[tag];
        if (vlo.property && Object.prototype.hasOwnProperty.call(src2, vlo.property)) {
          return vlo;
        }
      }
    }
    throw new Error("unable to infer src variant");
  }
  /** Implement {@link Layout#decode|decode} for {@link Union}.
   *
   * If the variant is {@link Union#addVariant|registered} the return
   * value is an instance of that variant, with no explicit
   * discriminator.  Otherwise the {@link Union#defaultLayout|default
   * layout} is used to decode the content. */
  decode(b, offset2 = 0) {
    let dest;
    const dlo = this.discriminator;
    const discr = dlo.decode(b, offset2);
    const clo = this.registry[discr];
    if (void 0 === clo) {
      const defaultLayout = this.defaultLayout;
      let contentOffset = 0;
      if (this.usesPrefixDiscriminator) {
        contentOffset = dlo.layout.span;
      }
      dest = this.makeDestinationObject();
      dest[dlo.property] = discr;
      dest[defaultLayout.property] = defaultLayout.decode(b, offset2 + contentOffset);
    } else {
      dest = clo.decode(b, offset2);
    }
    return dest;
  }
  /** Implement {@link Layout#encode|encode} for {@link Union}.
   *
   * This API assumes the `src` object is consistent with the union's
   * {@link Union#defaultLayout|default layout}.  To encode variants
   * use the appropriate variant-specific {@link VariantLayout#encode}
   * method. */
  encode(src2, b, offset2 = 0) {
    const vlo = this.getSourceVariant(src2);
    if (void 0 === vlo) {
      const dlo = this.discriminator;
      const clo = this.defaultLayout;
      let contentOffset = 0;
      if (this.usesPrefixDiscriminator) {
        contentOffset = dlo.layout.span;
      }
      dlo.encode(src2[dlo.property], b, offset2);
      return contentOffset + clo.encode(src2[clo.property], b, offset2 + contentOffset);
    }
    return vlo.encode(src2, b, offset2);
  }
  /** Register a new variant structure within a union.  The newly
   * created variant is returned.
   *
   * @param {Number} variant - initializer for {@link
   * VariantLayout#variant|variant}.
   *
   * @param {Layout} layout - initializer for {@link
   * VariantLayout#layout|layout}.
   *
   * @param {String} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {VariantLayout} */
  addVariant(variant, layout, property) {
    const rv = new VariantLayout(this, variant, layout, property);
    this.registry[variant] = rv;
    return rv;
  }
  /**
   * Get the layout associated with a registered variant.
   *
   * If `vb` does not produce a registered variant the function returns
   * `undefined`.
   *
   * @param {(Number|Uint8Array)} vb - either the variant number, or a
   * buffer from which the discriminator is to be read.
   *
   * @param {Number} offset - offset into `vb` for the start of the
   * union.  Used only when `vb` is an instance of {Uint8Array}.
   *
   * @return {({VariantLayout}|undefined)}
   */
  getVariant(vb, offset2 = 0) {
    let variant;
    if (vb instanceof Uint8Array) {
      variant = this.discriminator.decode(vb, offset2);
    } else {
      variant = vb;
    }
    return this.registry[variant];
  }
}
Layout$1.Union = Union;
class VariantLayout extends Layout {
  constructor(union2, variant, layout, property) {
    if (!(union2 instanceof Union)) {
      throw new TypeError("union must be a Union");
    }
    if (!Number.isInteger(variant) || 0 > variant) {
      throw new TypeError("variant must be a (non-negative) integer");
    }
    if ("string" === typeof layout && void 0 === property) {
      property = layout;
      layout = null;
    }
    if (layout) {
      if (!(layout instanceof Layout)) {
        throw new TypeError("layout must be a Layout");
      }
      if (null !== union2.defaultLayout && 0 <= layout.span && layout.span > union2.defaultLayout.span) {
        throw new Error("variant span exceeds span of containing union");
      }
      if ("string" !== typeof property) {
        throw new TypeError("variant must have a String property");
      }
    }
    let span = union2.span;
    if (0 > union2.span) {
      span = layout ? layout.span : 0;
      if (0 <= span && union2.usesPrefixDiscriminator) {
        span += union2.discriminator.layout.span;
      }
    }
    super(span, property);
    this.union = union2;
    this.variant = variant;
    this.layout = layout || null;
  }
  /** @override */
  getSpan(b, offset2 = 0) {
    if (0 <= this.span) {
      return this.span;
    }
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    let span = 0;
    if (this.layout) {
      span = this.layout.getSpan(b, offset2 + contentOffset);
    }
    return contentOffset + span;
  }
  /** @override */
  decode(b, offset2 = 0) {
    const dest = this.makeDestinationObject();
    if (this !== this.union.getVariant(b, offset2)) {
      throw new Error("variant mismatch");
    }
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    if (this.layout) {
      dest[this.property] = this.layout.decode(b, offset2 + contentOffset);
    } else if (this.property) {
      dest[this.property] = true;
    } else if (this.union.usesPrefixDiscriminator) {
      dest[this.union.discriminator.property] = this.variant;
    }
    return dest;
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    if (this.layout && !Object.prototype.hasOwnProperty.call(src2, this.property)) {
      throw new TypeError("variant lacks property " + this.property);
    }
    this.union.discriminator.encode(this.variant, b, offset2);
    let span = contentOffset;
    if (this.layout) {
      this.layout.encode(src2[this.property], b, offset2 + contentOffset);
      span += this.layout.getSpan(b, offset2 + contentOffset);
      if (0 <= this.union.span && span > this.union.span) {
        throw new Error("encoded variant overruns containing union");
      }
    }
    return span;
  }
  /** Delegate {@link Layout#fromArray|fromArray} to {@link
   * VariantLayout#layout|layout}. */
  fromArray(values) {
    if (this.layout) {
      return this.layout.fromArray(values);
    }
    return void 0;
  }
}
Layout$1.VariantLayout = VariantLayout;
function fixBitwiseResult(v) {
  if (0 > v) {
    v += 4294967296;
  }
  return v;
}
class BitStructure extends Layout {
  constructor(word, msb, property) {
    if (!(word instanceof UInt || word instanceof UIntBE)) {
      throw new TypeError("word must be a UInt or UIntBE layout");
    }
    if ("string" === typeof msb && void 0 === property) {
      property = msb;
      msb = false;
    }
    if (4 < word.span) {
      throw new RangeError("word cannot exceed 32 bits");
    }
    super(word.span, property);
    this.word = word;
    this.msb = !!msb;
    this.fields = [];
    let value = 0;
    this._packedSetValue = function(v) {
      value = fixBitwiseResult(v);
      return this;
    };
    this._packedGetValue = function() {
      return value;
    };
  }
  /** @override */
  decode(b, offset2 = 0) {
    const dest = this.makeDestinationObject();
    const value = this.word.decode(b, offset2);
    this._packedSetValue(value);
    for (const fd of this.fields) {
      if (void 0 !== fd.property) {
        dest[fd.property] = fd.decode(b);
      }
    }
    return dest;
  }
  /** Implement {@link Layout#encode|encode} for {@link BitStructure}.
   *
   * If `src` is missing a property for a member with a defined {@link
   * Layout#property|property} the corresponding region of the packed
   * value is left unmodified.  Unused bits are also left unmodified. */
  encode(src2, b, offset2 = 0) {
    const value = this.word.decode(b, offset2);
    this._packedSetValue(value);
    for (const fd of this.fields) {
      if (void 0 !== fd.property) {
        const fv = src2[fd.property];
        if (void 0 !== fv) {
          fd.encode(fv);
        }
      }
    }
    return this.word.encode(this._packedGetValue(), b, offset2);
  }
  /** Register a new bitfield with a containing bit structure.  The
   * resulting bitfield is returned.
   *
   * @param {Number} bits - initializer for {@link BitField#bits|bits}.
   *
   * @param {string} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {BitField} */
  addField(bits, property) {
    const bf = new BitField(this, bits, property);
    this.fields.push(bf);
    return bf;
  }
  /** As with {@link BitStructure#addField|addField} for single-bit
   * fields with `boolean` value representation.
   *
   * @param {string} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {Boolean} */
  // `Boolean` conflicts with the native primitive type
  // eslint-disable-next-line @typescript-eslint/ban-types
  addBoolean(property) {
    const bf = new Boolean(this, property);
    this.fields.push(bf);
    return bf;
  }
  /**
   * Get access to the bit field for a given property.
   *
   * @param {String} property - the bit field of interest.
   *
   * @return {BitField} - the field associated with `property`, or
   * undefined if there is no such property.
   */
  fieldFor(property) {
    if ("string" !== typeof property) {
      throw new TypeError("property must be string");
    }
    for (const fd of this.fields) {
      if (fd.property === property) {
        return fd;
      }
    }
    return void 0;
  }
}
Layout$1.BitStructure = BitStructure;
class BitField {
  constructor(container, bits, property) {
    if (!(container instanceof BitStructure)) {
      throw new TypeError("container must be a BitStructure");
    }
    if (!Number.isInteger(bits) || 0 >= bits) {
      throw new TypeError("bits must be positive integer");
    }
    const totalBits = 8 * container.span;
    const usedBits = container.fields.reduce((sum, fd) => sum + fd.bits, 0);
    if (bits + usedBits > totalBits) {
      throw new Error("bits too long for span remainder (" + (totalBits - usedBits) + " of " + totalBits + " remain)");
    }
    this.container = container;
    this.bits = bits;
    this.valueMask = (1 << bits) - 1;
    if (32 === bits) {
      this.valueMask = 4294967295;
    }
    this.start = usedBits;
    if (this.container.msb) {
      this.start = totalBits - usedBits - bits;
    }
    this.wordMask = fixBitwiseResult(this.valueMask << this.start);
    this.property = property;
  }
  /** Store a value into the corresponding subsequence of the containing
   * bit field. */
  decode(b, offset2) {
    const word = this.container._packedGetValue();
    const wordValue = fixBitwiseResult(word & this.wordMask);
    const value = wordValue >>> this.start;
    return value;
  }
  /** Store a value into the corresponding subsequence of the containing
   * bit field.
   *
   * **NOTE** This is not a specialization of {@link
   * Layout#encode|Layout.encode} and there is no return value. */
  encode(value) {
    if ("number" !== typeof value || !Number.isInteger(value) || value !== fixBitwiseResult(value & this.valueMask)) {
      throw new TypeError(nameWithProperty("BitField.encode", this) + " value must be integer not exceeding " + this.valueMask);
    }
    const word = this.container._packedGetValue();
    const wordValue = fixBitwiseResult(value << this.start);
    this.container._packedSetValue(fixBitwiseResult(word & ~this.wordMask) | wordValue);
  }
}
Layout$1.BitField = BitField;
class Boolean extends BitField {
  constructor(container, property) {
    super(container, 1, property);
  }
  /** Override {@link BitField#decode|decode} for {@link Boolean|Boolean}.
   *
   * @returns {boolean} */
  decode(b, offset2) {
    return !!super.decode(b, offset2);
  }
  /** @override */
  encode(value) {
    if ("boolean" === typeof value) {
      value = +value;
    }
    super.encode(value);
  }
}
Layout$1.Boolean = Boolean;
class Blob extends Layout {
  constructor(length, property) {
    if (!(length instanceof ExternalLayout && length.isCount() || Number.isInteger(length) && 0 <= length)) {
      throw new TypeError("length must be positive integer or an unsigned integer ExternalLayout");
    }
    let span = -1;
    if (!(length instanceof ExternalLayout)) {
      span = length;
    }
    super(span, property);
    this.length = length;
  }
  /** @override */
  getSpan(b, offset2) {
    let span = this.span;
    if (0 > span) {
      span = this.length.decode(b, offset2);
    }
    return span;
  }
  /** @override */
  decode(b, offset2 = 0) {
    let span = this.span;
    if (0 > span) {
      span = this.length.decode(b, offset2);
    }
    return uint8ArrayToBuffer(b).slice(offset2, offset2 + span);
  }
  /** Implement {@link Layout#encode|encode} for {@link Blob}.
   *
   * **NOTE** If {@link Layout#count|count} is an instance of {@link
   * ExternalLayout} then the length of `src` will be encoded as the
   * count after `src` is encoded. */
  encode(src2, b, offset2) {
    let span = this.length;
    if (this.length instanceof ExternalLayout) {
      span = src2.length;
    }
    if (!(src2 instanceof Uint8Array && span === src2.length)) {
      throw new TypeError(nameWithProperty("Blob.encode", this) + " requires (length " + span + ") Uint8Array as src");
    }
    if (offset2 + span > b.length) {
      throw new RangeError("encoding overruns Uint8Array");
    }
    const srcBuffer = uint8ArrayToBuffer(src2);
    uint8ArrayToBuffer(b).write(srcBuffer.toString("hex"), offset2, span, "hex");
    if (this.length instanceof ExternalLayout) {
      this.length.encode(span, b, offset2);
    }
    return span;
  }
}
Layout$1.Blob = Blob;
class CString extends Layout {
  constructor(property) {
    super(-1, property);
  }
  /** @override */
  getSpan(b, offset2 = 0) {
    checkUint8Array(b);
    let idx = offset2;
    while (idx < b.length && 0 !== b[idx]) {
      idx += 1;
    }
    return 1 + idx - offset2;
  }
  /** @override */
  decode(b, offset2 = 0) {
    const span = this.getSpan(b, offset2);
    return uint8ArrayToBuffer(b).slice(offset2, offset2 + span - 1).toString("utf-8");
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    if ("string" !== typeof src2) {
      src2 = String(src2);
    }
    const srcb = buffer_1.Buffer.from(src2, "utf8");
    const span = srcb.length;
    if (offset2 + span > b.length) {
      throw new RangeError("encoding overruns Buffer");
    }
    const buffer = uint8ArrayToBuffer(b);
    srcb.copy(buffer, offset2);
    buffer[offset2 + span] = 0;
    return span + 1;
  }
}
Layout$1.CString = CString;
class UTF8 extends Layout {
  constructor(maxSpan, property) {
    if ("string" === typeof maxSpan && void 0 === property) {
      property = maxSpan;
      maxSpan = void 0;
    }
    if (void 0 === maxSpan) {
      maxSpan = -1;
    } else if (!Number.isInteger(maxSpan)) {
      throw new TypeError("maxSpan must be an integer");
    }
    super(-1, property);
    this.maxSpan = maxSpan;
  }
  /** @override */
  getSpan(b, offset2 = 0) {
    checkUint8Array(b);
    return b.length - offset2;
  }
  /** @override */
  decode(b, offset2 = 0) {
    const span = this.getSpan(b, offset2);
    if (0 <= this.maxSpan && this.maxSpan < span) {
      throw new RangeError("text length exceeds maxSpan");
    }
    return uint8ArrayToBuffer(b).slice(offset2, offset2 + span).toString("utf-8");
  }
  /** @override */
  encode(src2, b, offset2 = 0) {
    if ("string" !== typeof src2) {
      src2 = String(src2);
    }
    const srcb = buffer_1.Buffer.from(src2, "utf8");
    const span = srcb.length;
    if (0 <= this.maxSpan && this.maxSpan < span) {
      throw new RangeError("text length exceeds maxSpan");
    }
    if (offset2 + span > b.length) {
      throw new RangeError("encoding overruns Buffer");
    }
    srcb.copy(uint8ArrayToBuffer(b), offset2);
    return span;
  }
}
Layout$1.UTF8 = UTF8;
class Constant extends Layout {
  constructor(value, property) {
    super(0, property);
    this.value = value;
  }
  /** @override */
  decode(b, offset2) {
    return this.value;
  }
  /** @override */
  encode(src2, b, offset2) {
    return 0;
  }
}
Layout$1.Constant = Constant;
Layout$1.greedy = (elementSpan, property) => new GreedyCount(elementSpan, property);
var offset = Layout$1.offset = (layout, offset2, property) => new OffsetLayout(layout, offset2, property);
var u8 = Layout$1.u8 = (property) => new UInt(1, property);
var u16 = Layout$1.u16 = (property) => new UInt(2, property);
Layout$1.u24 = (property) => new UInt(3, property);
var u32 = Layout$1.u32 = (property) => new UInt(4, property);
Layout$1.u40 = (property) => new UInt(5, property);
Layout$1.u48 = (property) => new UInt(6, property);
var nu64 = Layout$1.nu64 = (property) => new NearUInt64(property);
Layout$1.u16be = (property) => new UIntBE(2, property);
Layout$1.u24be = (property) => new UIntBE(3, property);
Layout$1.u32be = (property) => new UIntBE(4, property);
Layout$1.u40be = (property) => new UIntBE(5, property);
Layout$1.u48be = (property) => new UIntBE(6, property);
Layout$1.nu64be = (property) => new NearUInt64BE(property);
Layout$1.s8 = (property) => new Int(1, property);
Layout$1.s16 = (property) => new Int(2, property);
Layout$1.s24 = (property) => new Int(3, property);
Layout$1.s32 = (property) => new Int(4, property);
Layout$1.s40 = (property) => new Int(5, property);
Layout$1.s48 = (property) => new Int(6, property);
var ns64 = Layout$1.ns64 = (property) => new NearInt64(property);
Layout$1.s16be = (property) => new IntBE(2, property);
Layout$1.s24be = (property) => new IntBE(3, property);
Layout$1.s32be = (property) => new IntBE(4, property);
Layout$1.s40be = (property) => new IntBE(5, property);
Layout$1.s48be = (property) => new IntBE(6, property);
Layout$1.ns64be = (property) => new NearInt64BE(property);
Layout$1.f32 = (property) => new Float(property);
Layout$1.f32be = (property) => new FloatBE(property);
Layout$1.f64 = (property) => new Double(property);
Layout$1.f64be = (property) => new DoubleBE(property);
var struct = Layout$1.struct = (fields, property, decodePrefixes) => new Structure(fields, property, decodePrefixes);
Layout$1.bits = (word, msb, property) => new BitStructure(word, msb, property);
var seq = Layout$1.seq = (elementLayout, count, property) => new Sequence(elementLayout, count, property);
Layout$1.union = (discr, defaultLayout, property) => new Union(discr, defaultLayout, property);
Layout$1.unionLayoutDiscriminator = (layout, property) => new UnionLayoutDiscriminator(layout, property);
var blob = Layout$1.blob = (length, property) => new Blob(length, property);
Layout$1.cstr = (property) => new CString(property);
Layout$1.utf8 = (maxSpan, property) => new UTF8(maxSpan, property);
Layout$1.constant = (value, property) => new Constant(value, property);
var SOLANA_ERROR__CODECS__CANNOT_DECODE_EMPTY_BYTE_ARRAY = 8078e3;
var SOLANA_ERROR__CODECS__INVALID_BYTE_LENGTH = 8078001;
var SOLANA_ERROR__CODECS__ENCODER_DECODER_SIZE_COMPATIBILITY_MISMATCH = 8078004;
var SOLANA_ERROR__CODECS__ENCODER_DECODER_FIXED_SIZE_MISMATCH = 8078005;
var SOLANA_ERROR__CODECS__ENCODER_DECODER_MAX_SIZE_MISMATCH = 8078006;
var SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE = 8078011;
function encodeValue(value) {
  if (Array.isArray(value)) {
    const commaSeparatedValues = value.map(encodeValue).join(
      "%2C%20"
      /* ", " */
    );
    return "%5B" + commaSeparatedValues + /* "]" */
    "%5D";
  } else if (typeof value === "bigint") {
    return `${value}n`;
  } else {
    return encodeURIComponent(
      String(
        value != null && Object.getPrototypeOf(value) === null ? (
          // Plain objects with no prototype don't have a `toString` method.
          // Convert them before stringifying them.
          { ...value }
        ) : value
      )
    );
  }
}
function encodeObjectContextEntry([key, value]) {
  return `${key}=${encodeValue(value)}`;
}
function encodeContextObject(context) {
  const searchParamsString = Object.entries(context).map(encodeObjectContextEntry).join("&");
  return btoa(searchParamsString);
}
function getErrorMessage(code, context = {}) {
  {
    let decodingAdviceMessage = `Solana error #${code}; Decode this error by running \`npx @solana/errors decode -- ${code}`;
    if (Object.keys(context).length) {
      decodingAdviceMessage += ` '${encodeContextObject(context)}'`;
    }
    return `${decodingAdviceMessage}\``;
  }
}
var SolanaError = class extends Error {
  constructor(...[code, contextAndErrorOptions]) {
    let context;
    let errorOptions;
    if (contextAndErrorOptions) {
      const { cause, ...contextRest } = contextAndErrorOptions;
      if (cause) {
        errorOptions = { cause };
      }
      if (Object.keys(contextRest).length > 0) {
        context = contextRest;
      }
    }
    const message = getErrorMessage(code, context);
    super(message, errorOptions);
    /**
     * Indicates the root cause of this {@link SolanaError}, if any.
     *
     * For example, a transaction error might have an instruction error as its root cause. In this
     * case, you will be able to access the instruction error on the transaction error as `cause`.
     */
    __publicField(this, "cause", this.cause);
    /**
     * Contains context that can assist in understanding or recovering from a {@link SolanaError}.
     */
    __publicField(this, "context");
    this.context = {
      __code: code,
      ...context
    };
    this.name = "SolanaError";
  }
};
function getEncodedSize(value, encoder) {
  return "fixedSize" in encoder ? encoder.fixedSize : encoder.getSizeFromValue(value);
}
function createEncoder(encoder) {
  return Object.freeze({
    ...encoder,
    encode: (value) => {
      const bytes = new Uint8Array(getEncodedSize(value, encoder));
      encoder.write(value, bytes, 0);
      return bytes;
    }
  });
}
function createDecoder$1(decoder) {
  return Object.freeze({
    ...decoder,
    decode: (bytes, offset2 = 0) => decoder.read(bytes, offset2)[0]
  });
}
function isFixedSize(codec) {
  return "fixedSize" in codec && typeof codec.fixedSize === "number";
}
function combineCodec(encoder, decoder) {
  if (isFixedSize(encoder) !== isFixedSize(decoder)) {
    throw new SolanaError(SOLANA_ERROR__CODECS__ENCODER_DECODER_SIZE_COMPATIBILITY_MISMATCH);
  }
  if (isFixedSize(encoder) && isFixedSize(decoder) && encoder.fixedSize !== decoder.fixedSize) {
    throw new SolanaError(SOLANA_ERROR__CODECS__ENCODER_DECODER_FIXED_SIZE_MISMATCH, {
      decoderFixedSize: decoder.fixedSize,
      encoderFixedSize: encoder.fixedSize
    });
  }
  if (!isFixedSize(encoder) && !isFixedSize(decoder) && encoder.maxSize !== decoder.maxSize) {
    throw new SolanaError(SOLANA_ERROR__CODECS__ENCODER_DECODER_MAX_SIZE_MISMATCH, {
      decoderMaxSize: decoder.maxSize,
      encoderMaxSize: encoder.maxSize
    });
  }
  return {
    ...decoder,
    ...encoder,
    decode: decoder.decode,
    encode: encoder.encode,
    read: decoder.read,
    write: encoder.write
  };
}
function assertByteArrayIsNotEmptyForCodec(codecDescription, bytes, offset2 = 0) {
  if (bytes.length - offset2 <= 0) {
    throw new SolanaError(SOLANA_ERROR__CODECS__CANNOT_DECODE_EMPTY_BYTE_ARRAY, {
      codecDescription
    });
  }
}
function assertByteArrayHasEnoughBytesForCodec(codecDescription, expected, bytes, offset2 = 0) {
  const bytesLength = bytes.length - offset2;
  if (bytesLength < expected) {
    throw new SolanaError(SOLANA_ERROR__CODECS__INVALID_BYTE_LENGTH, {
      bytesLength,
      codecDescription,
      expected
    });
  }
}
function assertNumberIsBetweenForCodec(codecDescription, min, max, value) {
  if (value < min || value > max) {
    throw new SolanaError(SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE, {
      codecDescription,
      max,
      min,
      value
    });
  }
}
function isLittleEndian(config) {
  return (config == null ? void 0 : config.endian) === 1 ? false : true;
}
function numberEncoderFactory(input) {
  return createEncoder({
    fixedSize: input.size,
    write(value, bytes, offset2) {
      if (input.range) {
        assertNumberIsBetweenForCodec(input.name, input.range[0], input.range[1], value);
      }
      const arrayBuffer = new ArrayBuffer(input.size);
      input.set(new DataView(arrayBuffer), value, isLittleEndian(input.config));
      bytes.set(new Uint8Array(arrayBuffer), offset2);
      return offset2 + input.size;
    }
  });
}
function numberDecoderFactory(input) {
  return createDecoder$1({
    fixedSize: input.size,
    read(bytes, offset2 = 0) {
      assertByteArrayIsNotEmptyForCodec(input.name, bytes, offset2);
      assertByteArrayHasEnoughBytesForCodec(input.name, input.size, bytes, offset2);
      const view = new DataView(toArrayBuffer(bytes, offset2, input.size));
      return [input.get(view, isLittleEndian(input.config)), offset2 + input.size];
    }
  });
}
function toArrayBuffer(bytes, offset2, length) {
  const bytesOffset = bytes.byteOffset + (offset2 ?? 0);
  const bytesLength = length ?? bytes.byteLength;
  return bytes.buffer.slice(bytesOffset, bytesOffset + bytesLength);
}
var getU64Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u64",
  range: [0n, BigInt("0xffffffffffffffff")],
  set: (view, value, le) => view.setBigUint64(0, BigInt(value), le),
  size: 8
});
var getU64Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getBigUint64(0, le),
  name: "u64",
  size: 8
});
var getU64Codec = (config = {}) => combineCodec(getU64Encoder(config), getU64Decoder(config));
ed25519.utils.randomPrivateKey;
ed25519.getPublicKey;
function isOnCurve(publicKey2) {
  try {
    ed25519.ExtendedPoint.fromHex(publicKey2);
    return true;
  } catch {
    return false;
  }
}
const sign = (message, secretKey) => ed25519.sign(message, secretKey.slice(0, 32));
const verify = ed25519.verify;
const toBuffer = (arr) => {
  if (Buffer$1.isBuffer(arr)) {
    return arr;
  } else if (arr instanceof Uint8Array) {
    return Buffer$1.from(arr.buffer, arr.byteOffset, arr.byteLength);
  } else {
    return Buffer$1.from(arr);
  }
};
class Struct {
  constructor(properties) {
    Object.assign(this, properties);
  }
  encode() {
    return Buffer$1.from(serialize_1(SOLANA_SCHEMA, this));
  }
  static decode(data) {
    return deserialize_1(SOLANA_SCHEMA, this, data);
  }
  static decodeUnchecked(data) {
    return deserializeUnchecked_1(SOLANA_SCHEMA, this, data);
  }
}
const SOLANA_SCHEMA = /* @__PURE__ */ new Map();
var _PublicKey;
const MAX_SEED_LENGTH = 32;
const PUBLIC_KEY_LENGTH = 32;
function isPublicKeyData(value) {
  return value._bn !== void 0;
}
let uniquePublicKeyCounter = 1;
class PublicKey extends Struct {
  /**
   * Create a new PublicKey object
   * @param value ed25519 public key as buffer or base-58 encoded string
   */
  constructor(value) {
    super({});
    this._bn = void 0;
    if (isPublicKeyData(value)) {
      this._bn = value._bn;
    } else {
      if (typeof value === "string") {
        const decoded = bs58$8.decode(value);
        if (decoded.length != PUBLIC_KEY_LENGTH) {
          throw new Error(`Invalid public key input`);
        }
        this._bn = new BN(decoded);
      } else {
        this._bn = new BN(value);
      }
      if (this._bn.byteLength() > PUBLIC_KEY_LENGTH) {
        throw new Error(`Invalid public key input`);
      }
    }
  }
  /**
   * Returns a unique PublicKey for tests and benchmarks using a counter
   */
  static unique() {
    const key = new PublicKey(uniquePublicKeyCounter);
    uniquePublicKeyCounter += 1;
    return new PublicKey(key.toBuffer());
  }
  /**
   * Default public key value. The base58-encoded string representation is all ones (as seen below)
   * The underlying BN number is 32 bytes that are all zeros
   */
  /**
   * Checks if two publicKeys are equal
   */
  equals(publicKey2) {
    return this._bn.eq(publicKey2._bn);
  }
  /**
   * Return the base-58 representation of the public key
   */
  toBase58() {
    return bs58$8.encode(this.toBytes());
  }
  toJSON() {
    return this.toBase58();
  }
  /**
   * Return the byte array representation of the public key in big endian
   */
  toBytes() {
    const buf = this.toBuffer();
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  /**
   * Return the Buffer representation of the public key in big endian
   */
  toBuffer() {
    const b = this._bn.toArrayLike(Buffer$1);
    if (b.length === PUBLIC_KEY_LENGTH) {
      return b;
    }
    const zeroPad = Buffer$1.alloc(32);
    b.copy(zeroPad, 32 - b.length);
    return zeroPad;
  }
  get [Symbol.toStringTag]() {
    return `PublicKey(${this.toString()})`;
  }
  /**
   * Return the base-58 representation of the public key
   */
  toString() {
    return this.toBase58();
  }
  /**
   * Derive a public key from another key, a seed, and a program ID.
   * The program ID will also serve as the owner of the public key, giving
   * it permission to write data to the account.
   */
  /* eslint-disable require-await */
  static async createWithSeed(fromPublicKey, seed, programId) {
    const buffer = Buffer$1.concat([fromPublicKey.toBuffer(), Buffer$1.from(seed), programId.toBuffer()]);
    const publicKeyBytes = sha256(buffer);
    return new PublicKey(publicKeyBytes);
  }
  /**
   * Derive a program address from seeds and a program ID.
   */
  /* eslint-disable require-await */
  static createProgramAddressSync(seeds, programId) {
    let buffer = Buffer$1.alloc(0);
    seeds.forEach(function(seed) {
      if (seed.length > MAX_SEED_LENGTH) {
        throw new TypeError(`Max seed length exceeded`);
      }
      buffer = Buffer$1.concat([buffer, toBuffer(seed)]);
    });
    buffer = Buffer$1.concat([buffer, programId.toBuffer(), Buffer$1.from("ProgramDerivedAddress")]);
    const publicKeyBytes = sha256(buffer);
    if (isOnCurve(publicKeyBytes)) {
      throw new Error(`Invalid seeds, address must fall off the curve`);
    }
    return new PublicKey(publicKeyBytes);
  }
  /**
   * Async version of createProgramAddressSync
   * For backwards compatibility
   *
   * @deprecated Use {@link createProgramAddressSync} instead
   */
  /* eslint-disable require-await */
  static async createProgramAddress(seeds, programId) {
    return this.createProgramAddressSync(seeds, programId);
  }
  /**
   * Find a valid program address
   *
   * Valid program addresses must fall off the ed25519 curve.  This function
   * iterates a nonce until it finds one that when combined with the seeds
   * results in a valid program address.
   */
  static findProgramAddressSync(seeds, programId) {
    let nonce = 255;
    let address;
    while (nonce != 0) {
      try {
        const seedsWithNonce = seeds.concat(Buffer$1.from([nonce]));
        address = this.createProgramAddressSync(seedsWithNonce, programId);
      } catch (err) {
        if (err instanceof TypeError) {
          throw err;
        }
        nonce--;
        continue;
      }
      return [address, nonce];
    }
    throw new Error(`Unable to find a viable program address nonce`);
  }
  /**
   * Async version of findProgramAddressSync
   * For backwards compatibility
   *
   * @deprecated Use {@link findProgramAddressSync} instead
   */
  static async findProgramAddress(seeds, programId) {
    return this.findProgramAddressSync(seeds, programId);
  }
  /**
   * Check that a pubkey is on the ed25519 curve.
   */
  static isOnCurve(pubkeyData) {
    const pubkey = new PublicKey(pubkeyData);
    return isOnCurve(pubkey.toBytes());
  }
}
_PublicKey = PublicKey;
PublicKey.default = new _PublicKey("11111111111111111111111111111111");
SOLANA_SCHEMA.set(PublicKey, {
  kind: "struct",
  fields: [["_bn", "u256"]]
});
new PublicKey("BPFLoader1111111111111111111111111111111111");
const PACKET_DATA_SIZE = 1280 - 40 - 8;
const VERSION_PREFIX_MASK = 127;
const SIGNATURE_LENGTH_IN_BYTES$2 = 64;
class TransactionExpiredBlockheightExceededError extends Error {
  constructor(signature2) {
    super(`Signature ${signature2} has expired: block height exceeded.`);
    this.signature = void 0;
    this.signature = signature2;
  }
}
Object.defineProperty(TransactionExpiredBlockheightExceededError.prototype, "name", {
  value: "TransactionExpiredBlockheightExceededError"
});
class TransactionExpiredTimeoutError extends Error {
  constructor(signature2, timeoutSeconds) {
    super(`Transaction was not confirmed in ${timeoutSeconds.toFixed(2)} seconds. It is unknown if it succeeded or failed. Check signature ${signature2} using the Solana Explorer or CLI tools.`);
    this.signature = void 0;
    this.signature = signature2;
  }
}
Object.defineProperty(TransactionExpiredTimeoutError.prototype, "name", {
  value: "TransactionExpiredTimeoutError"
});
class TransactionExpiredNonceInvalidError extends Error {
  constructor(signature2) {
    super(`Signature ${signature2} has expired: the nonce is no longer valid.`);
    this.signature = void 0;
    this.signature = signature2;
  }
}
Object.defineProperty(TransactionExpiredNonceInvalidError.prototype, "name", {
  value: "TransactionExpiredNonceInvalidError"
});
class MessageAccountKeys {
  constructor(staticAccountKeys, accountKeysFromLookups) {
    this.staticAccountKeys = void 0;
    this.accountKeysFromLookups = void 0;
    this.staticAccountKeys = staticAccountKeys;
    this.accountKeysFromLookups = accountKeysFromLookups;
  }
  keySegments() {
    const keySegments = [this.staticAccountKeys];
    if (this.accountKeysFromLookups) {
      keySegments.push(this.accountKeysFromLookups.writable);
      keySegments.push(this.accountKeysFromLookups.readonly);
    }
    return keySegments;
  }
  get(index) {
    for (const keySegment of this.keySegments()) {
      if (index < keySegment.length) {
        return keySegment[index];
      } else {
        index -= keySegment.length;
      }
    }
    return;
  }
  get length() {
    return this.keySegments().flat().length;
  }
  compileInstructions(instructions) {
    const U8_MAX = 255;
    if (this.length > U8_MAX + 1) {
      throw new Error("Account index overflow encountered during compilation");
    }
    const keyIndexMap = /* @__PURE__ */ new Map();
    this.keySegments().flat().forEach((key, index) => {
      keyIndexMap.set(key.toBase58(), index);
    });
    const findKeyIndex = (key) => {
      const keyIndex = keyIndexMap.get(key.toBase58());
      if (keyIndex === void 0) throw new Error("Encountered an unknown instruction account key during compilation");
      return keyIndex;
    };
    return instructions.map((instruction) => {
      return {
        programIdIndex: findKeyIndex(instruction.programId),
        accountKeyIndexes: instruction.keys.map((meta) => findKeyIndex(meta.pubkey)),
        data: instruction.data
      };
    });
  }
}
const publicKey = (property = "publicKey") => {
  return blob(32, property);
};
const signature = (property = "signature") => {
  return blob(64, property);
};
const rustString = (property = "string") => {
  const rsl = struct([u32("length"), u32("lengthPadding"), blob(offset(u32(), -8), "chars")], property);
  const _decode = rsl.decode.bind(rsl);
  const _encode = rsl.encode.bind(rsl);
  const rslShim = rsl;
  rslShim.decode = (b, offset2) => {
    const data = _decode(b, offset2);
    return data["chars"].toString();
  };
  rslShim.encode = (str, b, offset2) => {
    const data = {
      chars: Buffer$1.from(str, "utf8")
    };
    return _encode(data, b, offset2);
  };
  rslShim.alloc = (str) => {
    return u32().span + u32().span + Buffer$1.from(str, "utf8").length;
  };
  return rslShim;
};
const authorized = (property = "authorized") => {
  return struct([publicKey("staker"), publicKey("withdrawer")], property);
};
const lockup = (property = "lockup") => {
  return struct([ns64("unixTimestamp"), ns64("epoch"), publicKey("custodian")], property);
};
const voteInit = (property = "voteInit") => {
  return struct([publicKey("nodePubkey"), publicKey("authorizedVoter"), publicKey("authorizedWithdrawer"), u8("commission")], property);
};
const voteAuthorizeWithSeedArgs = (property = "voteAuthorizeWithSeedArgs") => {
  return struct([u32("voteAuthorizationType"), publicKey("currentAuthorityDerivedKeyOwnerPubkey"), rustString("currentAuthorityDerivedKeySeed"), publicKey("newAuthorized")], property);
};
function getAlloc(type2, fields) {
  const getItemAlloc = (item) => {
    if (item.span >= 0) {
      return item.span;
    } else if (typeof item.alloc === "function") {
      return item.alloc(fields[item.property]);
    } else if ("count" in item && "elementLayout" in item) {
      const field = fields[item.property];
      if (Array.isArray(field)) {
        return field.length * getItemAlloc(item.elementLayout);
      }
    } else if ("fields" in item) {
      return getAlloc({
        layout: item
      }, fields[item.property]);
    }
    return 0;
  };
  let alloc = 0;
  type2.layout.fields.forEach((item) => {
    alloc += getItemAlloc(item);
  });
  return alloc;
}
function decodeLength(bytes) {
  let len = 0;
  let size = 0;
  for (; ; ) {
    let elem = bytes.shift();
    len |= (elem & 127) << size * 7;
    size += 1;
    if ((elem & 128) === 0) {
      break;
    }
  }
  return len;
}
function encodeLength(bytes, len) {
  let rem_len = len;
  for (; ; ) {
    let elem = rem_len & 127;
    rem_len >>= 7;
    if (rem_len == 0) {
      bytes.push(elem);
      break;
    } else {
      elem |= 128;
      bytes.push(elem);
    }
  }
}
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}
class CompiledKeys {
  constructor(payer, keyMetaMap) {
    this.payer = void 0;
    this.keyMetaMap = void 0;
    this.payer = payer;
    this.keyMetaMap = keyMetaMap;
  }
  static compile(instructions, payer) {
    const keyMetaMap = /* @__PURE__ */ new Map();
    const getOrInsertDefault = (pubkey) => {
      const address = pubkey.toBase58();
      let keyMeta = keyMetaMap.get(address);
      if (keyMeta === void 0) {
        keyMeta = {
          isSigner: false,
          isWritable: false,
          isInvoked: false
        };
        keyMetaMap.set(address, keyMeta);
      }
      return keyMeta;
    };
    const payerKeyMeta = getOrInsertDefault(payer);
    payerKeyMeta.isSigner = true;
    payerKeyMeta.isWritable = true;
    for (const ix of instructions) {
      getOrInsertDefault(ix.programId).isInvoked = true;
      for (const accountMeta of ix.keys) {
        const keyMeta = getOrInsertDefault(accountMeta.pubkey);
        keyMeta.isSigner || (keyMeta.isSigner = accountMeta.isSigner);
        keyMeta.isWritable || (keyMeta.isWritable = accountMeta.isWritable);
      }
    }
    return new CompiledKeys(payer, keyMetaMap);
  }
  getMessageComponents() {
    const mapEntries = [...this.keyMetaMap.entries()];
    assert(mapEntries.length <= 256, "Max static account keys length exceeded");
    const writableSigners = mapEntries.filter(([, meta]) => meta.isSigner && meta.isWritable);
    const readonlySigners = mapEntries.filter(([, meta]) => meta.isSigner && !meta.isWritable);
    const writableNonSigners = mapEntries.filter(([, meta]) => !meta.isSigner && meta.isWritable);
    const readonlyNonSigners = mapEntries.filter(([, meta]) => !meta.isSigner && !meta.isWritable);
    const header = {
      numRequiredSignatures: writableSigners.length + readonlySigners.length,
      numReadonlySignedAccounts: readonlySigners.length,
      numReadonlyUnsignedAccounts: readonlyNonSigners.length
    };
    {
      assert(writableSigners.length > 0, "Expected at least one writable signer key");
      const [payerAddress] = writableSigners[0];
      assert(payerAddress === this.payer.toBase58(), "Expected first writable signer key to be the fee payer");
    }
    const staticAccountKeys = [...writableSigners.map(([address]) => new PublicKey(address)), ...readonlySigners.map(([address]) => new PublicKey(address)), ...writableNonSigners.map(([address]) => new PublicKey(address)), ...readonlyNonSigners.map(([address]) => new PublicKey(address))];
    return [header, staticAccountKeys];
  }
  extractTableLookup(lookupTable) {
    const [writableIndexes, drainedWritableKeys] = this.drainKeysFoundInLookupTable(lookupTable.state.addresses, (keyMeta) => !keyMeta.isSigner && !keyMeta.isInvoked && keyMeta.isWritable);
    const [readonlyIndexes, drainedReadonlyKeys] = this.drainKeysFoundInLookupTable(lookupTable.state.addresses, (keyMeta) => !keyMeta.isSigner && !keyMeta.isInvoked && !keyMeta.isWritable);
    if (writableIndexes.length === 0 && readonlyIndexes.length === 0) {
      return;
    }
    return [{
      accountKey: lookupTable.key,
      writableIndexes,
      readonlyIndexes
    }, {
      writable: drainedWritableKeys,
      readonly: drainedReadonlyKeys
    }];
  }
  /** @internal */
  drainKeysFoundInLookupTable(lookupTableEntries, keyMetaFilter) {
    const lookupTableIndexes = new Array();
    const drainedKeys = new Array();
    for (const [address, keyMeta] of this.keyMetaMap.entries()) {
      if (keyMetaFilter(keyMeta)) {
        const key = new PublicKey(address);
        const lookupTableIndex = lookupTableEntries.findIndex((entry) => entry.equals(key));
        if (lookupTableIndex >= 0) {
          assert(lookupTableIndex < 256, "Max lookup table index exceeded");
          lookupTableIndexes.push(lookupTableIndex);
          drainedKeys.push(key);
          this.keyMetaMap.delete(address);
        }
      }
    }
    return [lookupTableIndexes, drainedKeys];
  }
}
const END_OF_BUFFER_ERROR_MESSAGE = "Reached end of buffer unexpectedly";
function guardedShift(byteArray) {
  if (byteArray.length === 0) {
    throw new Error(END_OF_BUFFER_ERROR_MESSAGE);
  }
  return byteArray.shift();
}
function guardedSplice(byteArray, ...args) {
  const [start] = args;
  if (args.length === 2 ? start + (args[1] ?? 0) > byteArray.length : start >= byteArray.length) {
    throw new Error(END_OF_BUFFER_ERROR_MESSAGE);
  }
  return byteArray.splice(...args);
}
class Message {
  constructor(args) {
    this.header = void 0;
    this.accountKeys = void 0;
    this.recentBlockhash = void 0;
    this.instructions = void 0;
    this.indexToProgramIds = /* @__PURE__ */ new Map();
    this.header = args.header;
    this.accountKeys = args.accountKeys.map((account) => new PublicKey(account));
    this.recentBlockhash = args.recentBlockhash;
    this.instructions = args.instructions;
    this.instructions.forEach((ix) => this.indexToProgramIds.set(ix.programIdIndex, this.accountKeys[ix.programIdIndex]));
  }
  get version() {
    return "legacy";
  }
  get staticAccountKeys() {
    return this.accountKeys;
  }
  get compiledInstructions() {
    return this.instructions.map((ix) => ({
      programIdIndex: ix.programIdIndex,
      accountKeyIndexes: ix.accounts,
      data: bs58$8.decode(ix.data)
    }));
  }
  get addressTableLookups() {
    return [];
  }
  getAccountKeys() {
    return new MessageAccountKeys(this.staticAccountKeys);
  }
  static compile(args) {
    const compiledKeys = CompiledKeys.compile(args.instructions, args.payerKey);
    const [header, staticAccountKeys] = compiledKeys.getMessageComponents();
    const accountKeys = new MessageAccountKeys(staticAccountKeys);
    const instructions = accountKeys.compileInstructions(args.instructions).map((ix) => ({
      programIdIndex: ix.programIdIndex,
      accounts: ix.accountKeyIndexes,
      data: bs58$8.encode(ix.data)
    }));
    return new Message({
      header,
      accountKeys: staticAccountKeys,
      recentBlockhash: args.recentBlockhash,
      instructions
    });
  }
  isAccountSigner(index) {
    return index < this.header.numRequiredSignatures;
  }
  isAccountWritable(index) {
    const numSignedAccounts = this.header.numRequiredSignatures;
    if (index >= this.header.numRequiredSignatures) {
      const unsignedAccountIndex = index - numSignedAccounts;
      const numUnsignedAccounts = this.accountKeys.length - numSignedAccounts;
      const numWritableUnsignedAccounts = numUnsignedAccounts - this.header.numReadonlyUnsignedAccounts;
      return unsignedAccountIndex < numWritableUnsignedAccounts;
    } else {
      const numWritableSignedAccounts = numSignedAccounts - this.header.numReadonlySignedAccounts;
      return index < numWritableSignedAccounts;
    }
  }
  isProgramId(index) {
    return this.indexToProgramIds.has(index);
  }
  programIds() {
    return [...this.indexToProgramIds.values()];
  }
  nonProgramIds() {
    return this.accountKeys.filter((_, index) => !this.isProgramId(index));
  }
  serialize() {
    const numKeys = this.accountKeys.length;
    let keyCount = [];
    encodeLength(keyCount, numKeys);
    const instructions = this.instructions.map((instruction) => {
      const {
        accounts,
        programIdIndex
      } = instruction;
      const data = Array.from(bs58$8.decode(instruction.data));
      let keyIndicesCount = [];
      encodeLength(keyIndicesCount, accounts.length);
      let dataCount = [];
      encodeLength(dataCount, data.length);
      return {
        programIdIndex,
        keyIndicesCount: Buffer$1.from(keyIndicesCount),
        keyIndices: accounts,
        dataLength: Buffer$1.from(dataCount),
        data
      };
    });
    let instructionCount = [];
    encodeLength(instructionCount, instructions.length);
    let instructionBuffer = Buffer$1.alloc(PACKET_DATA_SIZE);
    Buffer$1.from(instructionCount).copy(instructionBuffer);
    let instructionBufferLength = instructionCount.length;
    instructions.forEach((instruction) => {
      const instructionLayout = struct([u8("programIdIndex"), blob(instruction.keyIndicesCount.length, "keyIndicesCount"), seq(u8("keyIndex"), instruction.keyIndices.length, "keyIndices"), blob(instruction.dataLength.length, "dataLength"), seq(u8("userdatum"), instruction.data.length, "data")]);
      const length2 = instructionLayout.encode(instruction, instructionBuffer, instructionBufferLength);
      instructionBufferLength += length2;
    });
    instructionBuffer = instructionBuffer.slice(0, instructionBufferLength);
    const signDataLayout = struct([blob(1, "numRequiredSignatures"), blob(1, "numReadonlySignedAccounts"), blob(1, "numReadonlyUnsignedAccounts"), blob(keyCount.length, "keyCount"), seq(publicKey("key"), numKeys, "keys"), publicKey("recentBlockhash")]);
    const transaction = {
      numRequiredSignatures: Buffer$1.from([this.header.numRequiredSignatures]),
      numReadonlySignedAccounts: Buffer$1.from([this.header.numReadonlySignedAccounts]),
      numReadonlyUnsignedAccounts: Buffer$1.from([this.header.numReadonlyUnsignedAccounts]),
      keyCount: Buffer$1.from(keyCount),
      keys: this.accountKeys.map((key) => toBuffer(key.toBytes())),
      recentBlockhash: bs58$8.decode(this.recentBlockhash)
    };
    let signData = Buffer$1.alloc(2048);
    const length = signDataLayout.encode(transaction, signData);
    instructionBuffer.copy(signData, length);
    return signData.slice(0, length + instructionBuffer.length);
  }
  /**
   * Decode a compiled message into a Message object.
   */
  static from(buffer) {
    let byteArray = [...buffer];
    const numRequiredSignatures = guardedShift(byteArray);
    if (numRequiredSignatures !== (numRequiredSignatures & VERSION_PREFIX_MASK)) {
      throw new Error("Versioned messages must be deserialized with VersionedMessage.deserialize()");
    }
    const numReadonlySignedAccounts = guardedShift(byteArray);
    const numReadonlyUnsignedAccounts = guardedShift(byteArray);
    const accountCount = decodeLength(byteArray);
    let accountKeys = [];
    for (let i = 0; i < accountCount; i++) {
      const account = guardedSplice(byteArray, 0, PUBLIC_KEY_LENGTH);
      accountKeys.push(new PublicKey(Buffer$1.from(account)));
    }
    const recentBlockhash = guardedSplice(byteArray, 0, PUBLIC_KEY_LENGTH);
    const instructionCount = decodeLength(byteArray);
    let instructions = [];
    for (let i = 0; i < instructionCount; i++) {
      const programIdIndex = guardedShift(byteArray);
      const accountCount2 = decodeLength(byteArray);
      const accounts = guardedSplice(byteArray, 0, accountCount2);
      const dataLength = decodeLength(byteArray);
      const dataSlice = guardedSplice(byteArray, 0, dataLength);
      const data = bs58$8.encode(Buffer$1.from(dataSlice));
      instructions.push({
        programIdIndex,
        accounts,
        data
      });
    }
    const messageArgs = {
      header: {
        numRequiredSignatures,
        numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts
      },
      recentBlockhash: bs58$8.encode(Buffer$1.from(recentBlockhash)),
      accountKeys,
      instructions
    };
    return new Message(messageArgs);
  }
}
class MessageV0 {
  constructor(args) {
    this.header = void 0;
    this.staticAccountKeys = void 0;
    this.recentBlockhash = void 0;
    this.compiledInstructions = void 0;
    this.addressTableLookups = void 0;
    this.header = args.header;
    this.staticAccountKeys = args.staticAccountKeys;
    this.recentBlockhash = args.recentBlockhash;
    this.compiledInstructions = args.compiledInstructions;
    this.addressTableLookups = args.addressTableLookups;
  }
  get version() {
    return 0;
  }
  get numAccountKeysFromLookups() {
    let count = 0;
    for (const lookup of this.addressTableLookups) {
      count += lookup.readonlyIndexes.length + lookup.writableIndexes.length;
    }
    return count;
  }
  getAccountKeys(args) {
    let accountKeysFromLookups;
    if (args && "accountKeysFromLookups" in args && args.accountKeysFromLookups) {
      if (this.numAccountKeysFromLookups != args.accountKeysFromLookups.writable.length + args.accountKeysFromLookups.readonly.length) {
        throw new Error("Failed to get account keys because of a mismatch in the number of account keys from lookups");
      }
      accountKeysFromLookups = args.accountKeysFromLookups;
    } else if (args && "addressLookupTableAccounts" in args && args.addressLookupTableAccounts) {
      accountKeysFromLookups = this.resolveAddressTableLookups(args.addressLookupTableAccounts);
    } else if (this.addressTableLookups.length > 0) {
      throw new Error("Failed to get account keys because address table lookups were not resolved");
    }
    return new MessageAccountKeys(this.staticAccountKeys, accountKeysFromLookups);
  }
  isAccountSigner(index) {
    return index < this.header.numRequiredSignatures;
  }
  isAccountWritable(index) {
    const numSignedAccounts = this.header.numRequiredSignatures;
    const numStaticAccountKeys = this.staticAccountKeys.length;
    if (index >= numStaticAccountKeys) {
      const lookupAccountKeysIndex = index - numStaticAccountKeys;
      const numWritableLookupAccountKeys = this.addressTableLookups.reduce((count, lookup) => count + lookup.writableIndexes.length, 0);
      return lookupAccountKeysIndex < numWritableLookupAccountKeys;
    } else if (index >= this.header.numRequiredSignatures) {
      const unsignedAccountIndex = index - numSignedAccounts;
      const numUnsignedAccounts = numStaticAccountKeys - numSignedAccounts;
      const numWritableUnsignedAccounts = numUnsignedAccounts - this.header.numReadonlyUnsignedAccounts;
      return unsignedAccountIndex < numWritableUnsignedAccounts;
    } else {
      const numWritableSignedAccounts = numSignedAccounts - this.header.numReadonlySignedAccounts;
      return index < numWritableSignedAccounts;
    }
  }
  resolveAddressTableLookups(addressLookupTableAccounts) {
    const accountKeysFromLookups = {
      writable: [],
      readonly: []
    };
    for (const tableLookup of this.addressTableLookups) {
      const tableAccount = addressLookupTableAccounts.find((account) => account.key.equals(tableLookup.accountKey));
      if (!tableAccount) {
        throw new Error(`Failed to find address lookup table account for table key ${tableLookup.accountKey.toBase58()}`);
      }
      for (const index of tableLookup.writableIndexes) {
        if (index < tableAccount.state.addresses.length) {
          accountKeysFromLookups.writable.push(tableAccount.state.addresses[index]);
        } else {
          throw new Error(`Failed to find address for index ${index} in address lookup table ${tableLookup.accountKey.toBase58()}`);
        }
      }
      for (const index of tableLookup.readonlyIndexes) {
        if (index < tableAccount.state.addresses.length) {
          accountKeysFromLookups.readonly.push(tableAccount.state.addresses[index]);
        } else {
          throw new Error(`Failed to find address for index ${index} in address lookup table ${tableLookup.accountKey.toBase58()}`);
        }
      }
    }
    return accountKeysFromLookups;
  }
  static compile(args) {
    const compiledKeys = CompiledKeys.compile(args.instructions, args.payerKey);
    const addressTableLookups = new Array();
    const accountKeysFromLookups = {
      writable: new Array(),
      readonly: new Array()
    };
    const lookupTableAccounts = args.addressLookupTableAccounts || [];
    for (const lookupTable of lookupTableAccounts) {
      const extractResult = compiledKeys.extractTableLookup(lookupTable);
      if (extractResult !== void 0) {
        const [addressTableLookup, {
          writable,
          readonly
        }] = extractResult;
        addressTableLookups.push(addressTableLookup);
        accountKeysFromLookups.writable.push(...writable);
        accountKeysFromLookups.readonly.push(...readonly);
      }
    }
    const [header, staticAccountKeys] = compiledKeys.getMessageComponents();
    const accountKeys = new MessageAccountKeys(staticAccountKeys, accountKeysFromLookups);
    const compiledInstructions = accountKeys.compileInstructions(args.instructions);
    return new MessageV0({
      header,
      staticAccountKeys,
      recentBlockhash: args.recentBlockhash,
      compiledInstructions,
      addressTableLookups
    });
  }
  serialize() {
    const encodedStaticAccountKeysLength = Array();
    encodeLength(encodedStaticAccountKeysLength, this.staticAccountKeys.length);
    const serializedInstructions = this.serializeInstructions();
    const encodedInstructionsLength = Array();
    encodeLength(encodedInstructionsLength, this.compiledInstructions.length);
    const serializedAddressTableLookups = this.serializeAddressTableLookups();
    const encodedAddressTableLookupsLength = Array();
    encodeLength(encodedAddressTableLookupsLength, this.addressTableLookups.length);
    const messageLayout = struct([u8("prefix"), struct([u8("numRequiredSignatures"), u8("numReadonlySignedAccounts"), u8("numReadonlyUnsignedAccounts")], "header"), blob(encodedStaticAccountKeysLength.length, "staticAccountKeysLength"), seq(publicKey(), this.staticAccountKeys.length, "staticAccountKeys"), publicKey("recentBlockhash"), blob(encodedInstructionsLength.length, "instructionsLength"), blob(serializedInstructions.length, "serializedInstructions"), blob(encodedAddressTableLookupsLength.length, "addressTableLookupsLength"), blob(serializedAddressTableLookups.length, "serializedAddressTableLookups")]);
    const serializedMessage = new Uint8Array(PACKET_DATA_SIZE);
    const MESSAGE_VERSION_0_PREFIX = 1 << 7;
    const serializedMessageLength = messageLayout.encode({
      prefix: MESSAGE_VERSION_0_PREFIX,
      header: this.header,
      staticAccountKeysLength: new Uint8Array(encodedStaticAccountKeysLength),
      staticAccountKeys: this.staticAccountKeys.map((key) => key.toBytes()),
      recentBlockhash: bs58$8.decode(this.recentBlockhash),
      instructionsLength: new Uint8Array(encodedInstructionsLength),
      serializedInstructions,
      addressTableLookupsLength: new Uint8Array(encodedAddressTableLookupsLength),
      serializedAddressTableLookups
    }, serializedMessage);
    return serializedMessage.slice(0, serializedMessageLength);
  }
  serializeInstructions() {
    let serializedLength = 0;
    const serializedInstructions = new Uint8Array(PACKET_DATA_SIZE);
    for (const instruction of this.compiledInstructions) {
      const encodedAccountKeyIndexesLength = Array();
      encodeLength(encodedAccountKeyIndexesLength, instruction.accountKeyIndexes.length);
      const encodedDataLength = Array();
      encodeLength(encodedDataLength, instruction.data.length);
      const instructionLayout = struct([u8("programIdIndex"), blob(encodedAccountKeyIndexesLength.length, "encodedAccountKeyIndexesLength"), seq(u8(), instruction.accountKeyIndexes.length, "accountKeyIndexes"), blob(encodedDataLength.length, "encodedDataLength"), blob(instruction.data.length, "data")]);
      serializedLength += instructionLayout.encode({
        programIdIndex: instruction.programIdIndex,
        encodedAccountKeyIndexesLength: new Uint8Array(encodedAccountKeyIndexesLength),
        accountKeyIndexes: instruction.accountKeyIndexes,
        encodedDataLength: new Uint8Array(encodedDataLength),
        data: instruction.data
      }, serializedInstructions, serializedLength);
    }
    return serializedInstructions.slice(0, serializedLength);
  }
  serializeAddressTableLookups() {
    let serializedLength = 0;
    const serializedAddressTableLookups = new Uint8Array(PACKET_DATA_SIZE);
    for (const lookup of this.addressTableLookups) {
      const encodedWritableIndexesLength = Array();
      encodeLength(encodedWritableIndexesLength, lookup.writableIndexes.length);
      const encodedReadonlyIndexesLength = Array();
      encodeLength(encodedReadonlyIndexesLength, lookup.readonlyIndexes.length);
      const addressTableLookupLayout = struct([publicKey("accountKey"), blob(encodedWritableIndexesLength.length, "encodedWritableIndexesLength"), seq(u8(), lookup.writableIndexes.length, "writableIndexes"), blob(encodedReadonlyIndexesLength.length, "encodedReadonlyIndexesLength"), seq(u8(), lookup.readonlyIndexes.length, "readonlyIndexes")]);
      serializedLength += addressTableLookupLayout.encode({
        accountKey: lookup.accountKey.toBytes(),
        encodedWritableIndexesLength: new Uint8Array(encodedWritableIndexesLength),
        writableIndexes: lookup.writableIndexes,
        encodedReadonlyIndexesLength: new Uint8Array(encodedReadonlyIndexesLength),
        readonlyIndexes: lookup.readonlyIndexes
      }, serializedAddressTableLookups, serializedLength);
    }
    return serializedAddressTableLookups.slice(0, serializedLength);
  }
  static deserialize(serializedMessage) {
    let byteArray = [...serializedMessage];
    const prefix = guardedShift(byteArray);
    const maskedPrefix = prefix & VERSION_PREFIX_MASK;
    assert(prefix !== maskedPrefix, `Expected versioned message but received legacy message`);
    const version = maskedPrefix;
    assert(version === 0, `Expected versioned message with version 0 but found version ${version}`);
    const header = {
      numRequiredSignatures: guardedShift(byteArray),
      numReadonlySignedAccounts: guardedShift(byteArray),
      numReadonlyUnsignedAccounts: guardedShift(byteArray)
    };
    const staticAccountKeys = [];
    const staticAccountKeysLength = decodeLength(byteArray);
    for (let i = 0; i < staticAccountKeysLength; i++) {
      staticAccountKeys.push(new PublicKey(guardedSplice(byteArray, 0, PUBLIC_KEY_LENGTH)));
    }
    const recentBlockhash = bs58$8.encode(guardedSplice(byteArray, 0, PUBLIC_KEY_LENGTH));
    const instructionCount = decodeLength(byteArray);
    const compiledInstructions = [];
    for (let i = 0; i < instructionCount; i++) {
      const programIdIndex = guardedShift(byteArray);
      const accountKeyIndexesLength = decodeLength(byteArray);
      const accountKeyIndexes = guardedSplice(byteArray, 0, accountKeyIndexesLength);
      const dataLength = decodeLength(byteArray);
      const data = new Uint8Array(guardedSplice(byteArray, 0, dataLength));
      compiledInstructions.push({
        programIdIndex,
        accountKeyIndexes,
        data
      });
    }
    const addressTableLookupsCount = decodeLength(byteArray);
    const addressTableLookups = [];
    for (let i = 0; i < addressTableLookupsCount; i++) {
      const accountKey = new PublicKey(guardedSplice(byteArray, 0, PUBLIC_KEY_LENGTH));
      const writableIndexesLength = decodeLength(byteArray);
      const writableIndexes = guardedSplice(byteArray, 0, writableIndexesLength);
      const readonlyIndexesLength = decodeLength(byteArray);
      const readonlyIndexes = guardedSplice(byteArray, 0, readonlyIndexesLength);
      addressTableLookups.push({
        accountKey,
        writableIndexes,
        readonlyIndexes
      });
    }
    return new MessageV0({
      header,
      staticAccountKeys,
      recentBlockhash,
      compiledInstructions,
      addressTableLookups
    });
  }
}
const VersionedMessage = {
  deserializeMessageVersion(serializedMessage) {
    const prefix = serializedMessage[0];
    const maskedPrefix = prefix & VERSION_PREFIX_MASK;
    if (maskedPrefix === prefix) {
      return "legacy";
    }
    return maskedPrefix;
  },
  deserialize: (serializedMessage) => {
    const version = VersionedMessage.deserializeMessageVersion(serializedMessage);
    if (version === "legacy") {
      return Message.from(serializedMessage);
    }
    if (version === 0) {
      return MessageV0.deserialize(serializedMessage);
    } else {
      throw new Error(`Transaction message version ${version} deserialization is not supported`);
    }
  }
};
let TransactionStatus = /* @__PURE__ */ function(TransactionStatus2) {
  TransactionStatus2[TransactionStatus2["BLOCKHEIGHT_EXCEEDED"] = 0] = "BLOCKHEIGHT_EXCEEDED";
  TransactionStatus2[TransactionStatus2["PROCESSED"] = 1] = "PROCESSED";
  TransactionStatus2[TransactionStatus2["TIMED_OUT"] = 2] = "TIMED_OUT";
  TransactionStatus2[TransactionStatus2["NONCE_INVALID"] = 3] = "NONCE_INVALID";
  return TransactionStatus2;
}({});
const DEFAULT_SIGNATURE = Buffer$1.alloc(SIGNATURE_LENGTH_IN_BYTES$2).fill(0);
class TransactionInstruction {
  constructor(opts) {
    this.keys = void 0;
    this.programId = void 0;
    this.data = Buffer$1.alloc(0);
    this.programId = opts.programId;
    this.keys = opts.keys;
    if (opts.data) {
      this.data = opts.data;
    }
  }
  /**
   * @internal
   */
  toJSON() {
    return {
      keys: this.keys.map(({
        pubkey,
        isSigner,
        isWritable
      }) => ({
        pubkey: pubkey.toJSON(),
        isSigner,
        isWritable
      })),
      programId: this.programId.toJSON(),
      data: [...this.data]
    };
  }
}
class Transaction {
  /**
   * The first (payer) Transaction signature
   *
   * @returns {Buffer | null} Buffer of payer's signature
   */
  get signature() {
    if (this.signatures.length > 0) {
      return this.signatures[0].signature;
    }
    return null;
  }
  /**
   * The transaction fee payer
   */
  // Construct a transaction with a blockhash and lastValidBlockHeight
  // Construct a transaction using a durable nonce
  /**
   * @deprecated `TransactionCtorFields` has been deprecated and will be removed in a future version.
   * Please supply a `TransactionBlockhashCtor` instead.
   */
  /**
   * Construct an empty Transaction
   */
  constructor(opts) {
    this.signatures = [];
    this.feePayer = void 0;
    this.instructions = [];
    this.recentBlockhash = void 0;
    this.lastValidBlockHeight = void 0;
    this.nonceInfo = void 0;
    this.minNonceContextSlot = void 0;
    this._message = void 0;
    this._json = void 0;
    if (!opts) {
      return;
    }
    if (opts.feePayer) {
      this.feePayer = opts.feePayer;
    }
    if (opts.signatures) {
      this.signatures = opts.signatures;
    }
    if (Object.prototype.hasOwnProperty.call(opts, "nonceInfo")) {
      const {
        minContextSlot,
        nonceInfo
      } = opts;
      this.minNonceContextSlot = minContextSlot;
      this.nonceInfo = nonceInfo;
    } else if (Object.prototype.hasOwnProperty.call(opts, "lastValidBlockHeight")) {
      const {
        blockhash,
        lastValidBlockHeight
      } = opts;
      this.recentBlockhash = blockhash;
      this.lastValidBlockHeight = lastValidBlockHeight;
    } else {
      const {
        recentBlockhash,
        nonceInfo
      } = opts;
      if (nonceInfo) {
        this.nonceInfo = nonceInfo;
      }
      this.recentBlockhash = recentBlockhash;
    }
  }
  /**
   * @internal
   */
  toJSON() {
    return {
      recentBlockhash: this.recentBlockhash || null,
      feePayer: this.feePayer ? this.feePayer.toJSON() : null,
      nonceInfo: this.nonceInfo ? {
        nonce: this.nonceInfo.nonce,
        nonceInstruction: this.nonceInfo.nonceInstruction.toJSON()
      } : null,
      instructions: this.instructions.map((instruction) => instruction.toJSON()),
      signers: this.signatures.map(({
        publicKey: publicKey2
      }) => {
        return publicKey2.toJSON();
      })
    };
  }
  /**
   * Add one or more instructions to this Transaction
   *
   * @param {Array< Transaction | TransactionInstruction | TransactionInstructionCtorFields >} items - Instructions to add to the Transaction
   */
  add(...items) {
    if (items.length === 0) {
      throw new Error("No instructions");
    }
    items.forEach((item) => {
      if ("instructions" in item) {
        this.instructions = this.instructions.concat(item.instructions);
      } else if ("data" in item && "programId" in item && "keys" in item) {
        this.instructions.push(item);
      } else {
        this.instructions.push(new TransactionInstruction(item));
      }
    });
    return this;
  }
  /**
   * Compile transaction data
   */
  compileMessage() {
    if (this._message && JSON.stringify(this.toJSON()) === JSON.stringify(this._json)) {
      return this._message;
    }
    let recentBlockhash;
    let instructions;
    if (this.nonceInfo) {
      recentBlockhash = this.nonceInfo.nonce;
      if (this.instructions[0] != this.nonceInfo.nonceInstruction) {
        instructions = [this.nonceInfo.nonceInstruction, ...this.instructions];
      } else {
        instructions = this.instructions;
      }
    } else {
      recentBlockhash = this.recentBlockhash;
      instructions = this.instructions;
    }
    if (!recentBlockhash) {
      throw new Error("Transaction recentBlockhash required");
    }
    if (instructions.length < 1) {
      console.warn("No instructions provided");
    }
    let feePayer;
    if (this.feePayer) {
      feePayer = this.feePayer;
    } else if (this.signatures.length > 0 && this.signatures[0].publicKey) {
      feePayer = this.signatures[0].publicKey;
    } else {
      throw new Error("Transaction fee payer required");
    }
    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i].programId === void 0) {
        throw new Error(`Transaction instruction index ${i} has undefined program id`);
      }
    }
    const programIds = [];
    const accountMetas = [];
    instructions.forEach((instruction) => {
      instruction.keys.forEach((accountMeta) => {
        accountMetas.push({
          ...accountMeta
        });
      });
      const programId = instruction.programId.toString();
      if (!programIds.includes(programId)) {
        programIds.push(programId);
      }
    });
    programIds.forEach((programId) => {
      accountMetas.push({
        pubkey: new PublicKey(programId),
        isSigner: false,
        isWritable: false
      });
    });
    const uniqueMetas = [];
    accountMetas.forEach((accountMeta) => {
      const pubkeyString = accountMeta.pubkey.toString();
      const uniqueIndex = uniqueMetas.findIndex((x) => {
        return x.pubkey.toString() === pubkeyString;
      });
      if (uniqueIndex > -1) {
        uniqueMetas[uniqueIndex].isWritable = uniqueMetas[uniqueIndex].isWritable || accountMeta.isWritable;
        uniqueMetas[uniqueIndex].isSigner = uniqueMetas[uniqueIndex].isSigner || accountMeta.isSigner;
      } else {
        uniqueMetas.push(accountMeta);
      }
    });
    uniqueMetas.sort(function(x, y) {
      if (x.isSigner !== y.isSigner) {
        return x.isSigner ? -1 : 1;
      }
      if (x.isWritable !== y.isWritable) {
        return x.isWritable ? -1 : 1;
      }
      const options = {
        localeMatcher: "best fit",
        usage: "sort",
        sensitivity: "variant",
        ignorePunctuation: false,
        numeric: false,
        caseFirst: "lower"
      };
      return x.pubkey.toBase58().localeCompare(y.pubkey.toBase58(), "en", options);
    });
    const feePayerIndex = uniqueMetas.findIndex((x) => {
      return x.pubkey.equals(feePayer);
    });
    if (feePayerIndex > -1) {
      const [payerMeta] = uniqueMetas.splice(feePayerIndex, 1);
      payerMeta.isSigner = true;
      payerMeta.isWritable = true;
      uniqueMetas.unshift(payerMeta);
    } else {
      uniqueMetas.unshift({
        pubkey: feePayer,
        isSigner: true,
        isWritable: true
      });
    }
    for (const signature2 of this.signatures) {
      const uniqueIndex = uniqueMetas.findIndex((x) => {
        return x.pubkey.equals(signature2.publicKey);
      });
      if (uniqueIndex > -1) {
        if (!uniqueMetas[uniqueIndex].isSigner) {
          uniqueMetas[uniqueIndex].isSigner = true;
          console.warn("Transaction references a signature that is unnecessary, only the fee payer and instruction signer accounts should sign a transaction. This behavior is deprecated and will throw an error in the next major version release.");
        }
      } else {
        throw new Error(`unknown signer: ${signature2.publicKey.toString()}`);
      }
    }
    let numRequiredSignatures = 0;
    let numReadonlySignedAccounts = 0;
    let numReadonlyUnsignedAccounts = 0;
    const signedKeys = [];
    const unsignedKeys = [];
    uniqueMetas.forEach(({
      pubkey,
      isSigner,
      isWritable
    }) => {
      if (isSigner) {
        signedKeys.push(pubkey.toString());
        numRequiredSignatures += 1;
        if (!isWritable) {
          numReadonlySignedAccounts += 1;
        }
      } else {
        unsignedKeys.push(pubkey.toString());
        if (!isWritable) {
          numReadonlyUnsignedAccounts += 1;
        }
      }
    });
    const accountKeys = signedKeys.concat(unsignedKeys);
    const compiledInstructions = instructions.map((instruction) => {
      const {
        data,
        programId
      } = instruction;
      return {
        programIdIndex: accountKeys.indexOf(programId.toString()),
        accounts: instruction.keys.map((meta) => accountKeys.indexOf(meta.pubkey.toString())),
        data: bs58$8.encode(data)
      };
    });
    compiledInstructions.forEach((instruction) => {
      assert(instruction.programIdIndex >= 0);
      instruction.accounts.forEach((keyIndex) => assert(keyIndex >= 0));
    });
    return new Message({
      header: {
        numRequiredSignatures,
        numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts
      },
      accountKeys,
      recentBlockhash,
      instructions: compiledInstructions
    });
  }
  /**
   * @internal
   */
  _compile() {
    const message = this.compileMessage();
    const signedKeys = message.accountKeys.slice(0, message.header.numRequiredSignatures);
    if (this.signatures.length === signedKeys.length) {
      const valid = this.signatures.every((pair, index) => {
        return signedKeys[index].equals(pair.publicKey);
      });
      if (valid) return message;
    }
    this.signatures = signedKeys.map((publicKey2) => ({
      signature: null,
      publicKey: publicKey2
    }));
    return message;
  }
  /**
   * Get a buffer of the Transaction data that need to be covered by signatures
   */
  serializeMessage() {
    return this._compile().serialize();
  }
  /**
   * Get the estimated fee associated with a transaction
   *
   * @param {Connection} connection Connection to RPC Endpoint.
   *
   * @returns {Promise<number | null>} The estimated fee for the transaction
   */
  async getEstimatedFee(connection) {
    return (await connection.getFeeForMessage(this.compileMessage())).value;
  }
  /**
   * Specify the public keys which will be used to sign the Transaction.
   * The first signer will be used as the transaction fee payer account.
   *
   * Signatures can be added with either `partialSign` or `addSignature`
   *
   * @deprecated Deprecated since v0.84.0. Only the fee payer needs to be
   * specified and it can be set in the Transaction constructor or with the
   * `feePayer` property.
   */
  setSigners(...signers) {
    if (signers.length === 0) {
      throw new Error("No signers");
    }
    const seen = /* @__PURE__ */ new Set();
    this.signatures = signers.filter((publicKey2) => {
      const key = publicKey2.toString();
      if (seen.has(key)) {
        return false;
      } else {
        seen.add(key);
        return true;
      }
    }).map((publicKey2) => ({
      signature: null,
      publicKey: publicKey2
    }));
  }
  /**
   * Sign the Transaction with the specified signers. Multiple signatures may
   * be applied to a Transaction. The first signature is considered "primary"
   * and is used identify and confirm transactions.
   *
   * If the Transaction `feePayer` is not set, the first signer will be used
   * as the transaction fee payer account.
   *
   * Transaction fields should not be modified after the first call to `sign`,
   * as doing so may invalidate the signature and cause the Transaction to be
   * rejected.
   *
   * The Transaction must be assigned a valid `recentBlockhash` before invoking this method
   *
   * @param {Array<Signer>} signers Array of signers that will sign the transaction
   */
  sign(...signers) {
    if (signers.length === 0) {
      throw new Error("No signers");
    }
    const seen = /* @__PURE__ */ new Set();
    const uniqueSigners = [];
    for (const signer of signers) {
      const key = signer.publicKey.toString();
      if (seen.has(key)) {
        continue;
      } else {
        seen.add(key);
        uniqueSigners.push(signer);
      }
    }
    this.signatures = uniqueSigners.map((signer) => ({
      signature: null,
      publicKey: signer.publicKey
    }));
    const message = this._compile();
    this._partialSign(message, ...uniqueSigners);
  }
  /**
   * Partially sign a transaction with the specified accounts. All accounts must
   * correspond to either the fee payer or a signer account in the transaction
   * instructions.
   *
   * All the caveats from the `sign` method apply to `partialSign`
   *
   * @param {Array<Signer>} signers Array of signers that will sign the transaction
   */
  partialSign(...signers) {
    if (signers.length === 0) {
      throw new Error("No signers");
    }
    const seen = /* @__PURE__ */ new Set();
    const uniqueSigners = [];
    for (const signer of signers) {
      const key = signer.publicKey.toString();
      if (seen.has(key)) {
        continue;
      } else {
        seen.add(key);
        uniqueSigners.push(signer);
      }
    }
    const message = this._compile();
    this._partialSign(message, ...uniqueSigners);
  }
  /**
   * @internal
   */
  _partialSign(message, ...signers) {
    const signData = message.serialize();
    signers.forEach((signer) => {
      const signature2 = sign(signData, signer.secretKey);
      this._addSignature(signer.publicKey, toBuffer(signature2));
    });
  }
  /**
   * Add an externally created signature to a transaction. The public key
   * must correspond to either the fee payer or a signer account in the transaction
   * instructions.
   *
   * @param {PublicKey} pubkey Public key that will be added to the transaction.
   * @param {Buffer} signature An externally created signature to add to the transaction.
   */
  addSignature(pubkey, signature2) {
    this._compile();
    this._addSignature(pubkey, signature2);
  }
  /**
   * @internal
   */
  _addSignature(pubkey, signature2) {
    assert(signature2.length === 64);
    const index = this.signatures.findIndex((sigpair) => pubkey.equals(sigpair.publicKey));
    if (index < 0) {
      throw new Error(`unknown signer: ${pubkey.toString()}`);
    }
    this.signatures[index].signature = Buffer$1.from(signature2);
  }
  /**
   * Verify signatures of a Transaction
   * Optional parameter specifies if we're expecting a fully signed Transaction or a partially signed one.
   * If no boolean is provided, we expect a fully signed Transaction by default.
   *
   * @param {boolean} [requireAllSignatures=true] Require a fully signed Transaction
   */
  verifySignatures(requireAllSignatures = true) {
    const signatureErrors = this._getMessageSignednessErrors(this.serializeMessage(), requireAllSignatures);
    return !signatureErrors;
  }
  /**
   * @internal
   */
  _getMessageSignednessErrors(message, requireAllSignatures) {
    const errors = {};
    for (const {
      signature: signature2,
      publicKey: publicKey2
    } of this.signatures) {
      if (signature2 === null) {
        if (requireAllSignatures) {
          (errors.missing || (errors.missing = [])).push(publicKey2);
        }
      } else {
        if (!verify(signature2, message, publicKey2.toBytes())) {
          (errors.invalid || (errors.invalid = [])).push(publicKey2);
        }
      }
    }
    return errors.invalid || errors.missing ? errors : void 0;
  }
  /**
   * Serialize the Transaction in the wire format.
   *
   * @param {Buffer} [config] Config of transaction.
   *
   * @returns {Buffer} Signature of transaction in wire format.
   */
  serialize(config) {
    const {
      requireAllSignatures,
      verifySignatures
    } = Object.assign({
      requireAllSignatures: true,
      verifySignatures: true
    }, config);
    const signData = this.serializeMessage();
    if (verifySignatures) {
      const sigErrors = this._getMessageSignednessErrors(signData, requireAllSignatures);
      if (sigErrors) {
        let errorMessage = "Signature verification failed.";
        if (sigErrors.invalid) {
          errorMessage += `
Invalid signature for public key${sigErrors.invalid.length === 1 ? "" : "(s)"} [\`${sigErrors.invalid.map((p) => p.toBase58()).join("`, `")}\`].`;
        }
        if (sigErrors.missing) {
          errorMessage += `
Missing signature for public key${sigErrors.missing.length === 1 ? "" : "(s)"} [\`${sigErrors.missing.map((p) => p.toBase58()).join("`, `")}\`].`;
        }
        throw new Error(errorMessage);
      }
    }
    return this._serialize(signData);
  }
  /**
   * @internal
   */
  _serialize(signData) {
    const {
      signatures
    } = this;
    const signatureCount = [];
    encodeLength(signatureCount, signatures.length);
    const transactionLength = signatureCount.length + signatures.length * 64 + signData.length;
    const wireTransaction = Buffer$1.alloc(transactionLength);
    assert(signatures.length < 256);
    Buffer$1.from(signatureCount).copy(wireTransaction, 0);
    signatures.forEach(({
      signature: signature2
    }, index) => {
      if (signature2 !== null) {
        assert(signature2.length === 64, `signature has invalid length`);
        Buffer$1.from(signature2).copy(wireTransaction, signatureCount.length + index * 64);
      }
    });
    signData.copy(wireTransaction, signatureCount.length + signatures.length * 64);
    assert(wireTransaction.length <= PACKET_DATA_SIZE, `Transaction too large: ${wireTransaction.length} > ${PACKET_DATA_SIZE}`);
    return wireTransaction;
  }
  /**
   * Deprecated method
   * @internal
   */
  get keys() {
    assert(this.instructions.length === 1);
    return this.instructions[0].keys.map((keyObj) => keyObj.pubkey);
  }
  /**
   * Deprecated method
   * @internal
   */
  get programId() {
    assert(this.instructions.length === 1);
    return this.instructions[0].programId;
  }
  /**
   * Deprecated method
   * @internal
   */
  get data() {
    assert(this.instructions.length === 1);
    return this.instructions[0].data;
  }
  /**
   * Parse a wire transaction into a Transaction object.
   *
   * @param {Buffer | Uint8Array | Array<number>} buffer Signature of wire Transaction
   *
   * @returns {Transaction} Transaction associated with the signature
   */
  static from(buffer) {
    let byteArray = [...buffer];
    const signatureCount = decodeLength(byteArray);
    let signatures = [];
    for (let i = 0; i < signatureCount; i++) {
      const signature2 = guardedSplice(byteArray, 0, SIGNATURE_LENGTH_IN_BYTES$2);
      signatures.push(bs58$8.encode(Buffer$1.from(signature2)));
    }
    return Transaction.populate(Message.from(byteArray), signatures);
  }
  /**
   * Populate Transaction object from message and signatures
   *
   * @param {Message} message Message of transaction
   * @param {Array<string>} signatures List of signatures to assign to the transaction
   *
   * @returns {Transaction} The populated Transaction
   */
  static populate(message, signatures = []) {
    const transaction = new Transaction();
    transaction.recentBlockhash = message.recentBlockhash;
    if (message.header.numRequiredSignatures > 0) {
      transaction.feePayer = message.accountKeys[0];
    }
    signatures.forEach((signature2, index) => {
      const sigPubkeyPair = {
        signature: signature2 == bs58$8.encode(DEFAULT_SIGNATURE) ? null : bs58$8.decode(signature2),
        publicKey: message.accountKeys[index]
      };
      transaction.signatures.push(sigPubkeyPair);
    });
    message.instructions.forEach((instruction) => {
      const keys = instruction.accounts.map((account) => {
        const pubkey = message.accountKeys[account];
        return {
          pubkey,
          isSigner: transaction.signatures.some((keyObj) => keyObj.publicKey.toString() === pubkey.toString()) || message.isAccountSigner(account),
          isWritable: message.isAccountWritable(account)
        };
      });
      transaction.instructions.push(new TransactionInstruction({
        keys,
        programId: message.accountKeys[instruction.programIdIndex],
        data: bs58$8.decode(instruction.data)
      }));
    });
    transaction._message = message;
    transaction._json = transaction.toJSON();
    return transaction;
  }
}
class VersionedTransaction {
  get version() {
    return this.message.version;
  }
  constructor(message, signatures) {
    this.signatures = void 0;
    this.message = void 0;
    if (signatures !== void 0) {
      assert(signatures.length === message.header.numRequiredSignatures, "Expected signatures length to be equal to the number of required signatures");
      this.signatures = signatures;
    } else {
      const defaultSignatures = [];
      for (let i = 0; i < message.header.numRequiredSignatures; i++) {
        defaultSignatures.push(new Uint8Array(SIGNATURE_LENGTH_IN_BYTES$2));
      }
      this.signatures = defaultSignatures;
    }
    this.message = message;
  }
  serialize() {
    const serializedMessage = this.message.serialize();
    const encodedSignaturesLength = Array();
    encodeLength(encodedSignaturesLength, this.signatures.length);
    const transactionLayout = struct([blob(encodedSignaturesLength.length, "encodedSignaturesLength"), seq(signature(), this.signatures.length, "signatures"), blob(serializedMessage.length, "serializedMessage")]);
    const serializedTransaction = new Uint8Array(2048);
    const serializedTransactionLength = transactionLayout.encode({
      encodedSignaturesLength: new Uint8Array(encodedSignaturesLength),
      signatures: this.signatures,
      serializedMessage
    }, serializedTransaction);
    return serializedTransaction.slice(0, serializedTransactionLength);
  }
  static deserialize(serializedTransaction) {
    let byteArray = [...serializedTransaction];
    const signatures = [];
    const signaturesLength = decodeLength(byteArray);
    for (let i = 0; i < signaturesLength; i++) {
      signatures.push(new Uint8Array(guardedSplice(byteArray, 0, SIGNATURE_LENGTH_IN_BYTES$2)));
    }
    const message = VersionedMessage.deserialize(new Uint8Array(byteArray));
    return new VersionedTransaction(message, signatures);
  }
  sign(signers) {
    const messageData = this.message.serialize();
    const signerPubkeys = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures);
    for (const signer of signers) {
      const signerIndex = signerPubkeys.findIndex((pubkey) => pubkey.equals(signer.publicKey));
      assert(signerIndex >= 0, `Cannot sign with non signer key ${signer.publicKey.toBase58()}`);
      this.signatures[signerIndex] = sign(messageData, signer.secretKey);
    }
  }
  addSignature(publicKey2, signature2) {
    assert(signature2.byteLength === 64, "Signature must be 64 bytes long");
    const signerPubkeys = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures);
    const signerIndex = signerPubkeys.findIndex((pubkey) => pubkey.equals(publicKey2));
    assert(signerIndex >= 0, `Can not add signature; \`${publicKey2.toBase58()}\` is not required to sign this transaction`);
    this.signatures[signerIndex] = signature2;
  }
}
const NUM_TICKS_PER_SECOND = 160;
const DEFAULT_TICKS_PER_SLOT = 64;
const NUM_SLOTS_PER_SECOND = NUM_TICKS_PER_SECOND / DEFAULT_TICKS_PER_SLOT;
const MS_PER_SLOT = 1e3 / NUM_SLOTS_PER_SECOND;
new PublicKey("SysvarC1ock11111111111111111111111111111111");
new PublicKey("SysvarEpochSchedu1e111111111111111111111111");
new PublicKey("Sysvar1nstructions1111111111111111111111111");
const SYSVAR_RECENT_BLOCKHASHES_PUBKEY = new PublicKey("SysvarRecentB1ockHashes11111111111111111111");
const SYSVAR_RENT_PUBKEY = new PublicKey("SysvarRent111111111111111111111111111111111");
new PublicKey("SysvarRewards111111111111111111111111111111");
new PublicKey("SysvarS1otHashes111111111111111111111111111");
new PublicKey("SysvarS1otHistory11111111111111111111111111");
new PublicKey("SysvarStakeHistory1111111111111111111111111");
class SendTransactionError extends Error {
  constructor({
    action,
    signature: signature2,
    transactionMessage,
    logs
  }) {
    const maybeLogsOutput = logs ? `Logs: 
${JSON.stringify(logs.slice(-10), null, 2)}. ` : "";
    const guideText = "\nCatch the `SendTransactionError` and call `getLogs()` on it for full details.";
    let message;
    switch (action) {
      case "send":
        message = `Transaction ${signature2} resulted in an error. 
${transactionMessage}. ` + maybeLogsOutput + guideText;
        break;
      case "simulate":
        message = `Simulation failed. 
Message: ${transactionMessage}. 
` + maybeLogsOutput + guideText;
        break;
      default: {
        message = `Unknown action '${/* @__PURE__ */ ((a) => a)(action)}'`;
      }
    }
    super(message);
    this.signature = void 0;
    this.transactionMessage = void 0;
    this.transactionLogs = void 0;
    this.signature = signature2;
    this.transactionMessage = transactionMessage;
    this.transactionLogs = logs ? logs : void 0;
  }
  get transactionError() {
    return {
      message: this.transactionMessage,
      logs: Array.isArray(this.transactionLogs) ? this.transactionLogs : void 0
    };
  }
  /* @deprecated Use `await getLogs()` instead */
  get logs() {
    const cachedLogs = this.transactionLogs;
    if (cachedLogs != null && typeof cachedLogs === "object" && "then" in cachedLogs) {
      return void 0;
    }
    return cachedLogs;
  }
  async getLogs(connection) {
    if (!Array.isArray(this.transactionLogs)) {
      this.transactionLogs = new Promise((resolve, reject) => {
        connection.getTransaction(this.signature).then((tx) => {
          if (tx && tx.meta && tx.meta.logMessages) {
            const logs = tx.meta.logMessages;
            this.transactionLogs = logs;
            resolve(logs);
          } else {
            reject(new Error("Log messages not found"));
          }
        }).catch(reject);
      });
    }
    return await this.transactionLogs;
  }
}
class SolanaJSONRPCError extends Error {
  constructor({
    code,
    message,
    data
  }, customMessage) {
    super(customMessage != null ? `${customMessage}: ${message}` : message);
    this.code = void 0;
    this.data = void 0;
    this.code = code;
    this.data = data;
    this.name = "SolanaJSONRPCError";
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function encodeData(type2, fields) {
  const allocLength = type2.layout.span >= 0 ? type2.layout.span : getAlloc(type2, fields);
  const data = Buffer$1.alloc(allocLength);
  const layoutFields = Object.assign({
    instruction: type2.index
  }, fields);
  type2.layout.encode(layoutFields, data);
  return data;
}
const FeeCalculatorLayout = nu64("lamportsPerSignature");
const NonceAccountLayout = struct([u32("version"), u32("state"), publicKey("authorizedPubkey"), publicKey("nonce"), struct([FeeCalculatorLayout], "feeCalculator")]);
const NONCE_ACCOUNT_LENGTH = NonceAccountLayout.span;
class NonceAccount {
  /**
   * @internal
   */
  constructor(args) {
    this.authorizedPubkey = void 0;
    this.nonce = void 0;
    this.feeCalculator = void 0;
    this.authorizedPubkey = args.authorizedPubkey;
    this.nonce = args.nonce;
    this.feeCalculator = args.feeCalculator;
  }
  /**
   * Deserialize NonceAccount from the account data.
   *
   * @param buffer account data
   * @return NonceAccount
   */
  static fromAccountData(buffer) {
    const nonceAccount = NonceAccountLayout.decode(toBuffer(buffer), 0);
    return new NonceAccount({
      authorizedPubkey: new PublicKey(nonceAccount.authorizedPubkey),
      nonce: new PublicKey(nonceAccount.nonce).toString(),
      feeCalculator: nonceAccount.feeCalculator
    });
  }
}
function u64(property) {
  const layout = blob(8, property);
  const decode = layout.decode.bind(layout);
  const encode2 = layout.encode.bind(layout);
  const bigIntLayout = layout;
  const codec = getU64Codec();
  bigIntLayout.decode = (buffer, offset2) => {
    const src2 = decode(buffer, offset2);
    return codec.decode(src2);
  };
  bigIntLayout.encode = (bigInt, buffer, offset2) => {
    const src2 = codec.encode(bigInt);
    return encode2(src2, buffer, offset2);
  };
  return bigIntLayout;
}
const SYSTEM_INSTRUCTION_LAYOUTS = Object.freeze({
  Create: {
    index: 0,
    layout: struct([u32("instruction"), ns64("lamports"), ns64("space"), publicKey("programId")])
  },
  Assign: {
    index: 1,
    layout: struct([u32("instruction"), publicKey("programId")])
  },
  Transfer: {
    index: 2,
    layout: struct([u32("instruction"), u64("lamports")])
  },
  CreateWithSeed: {
    index: 3,
    layout: struct([u32("instruction"), publicKey("base"), rustString("seed"), ns64("lamports"), ns64("space"), publicKey("programId")])
  },
  AdvanceNonceAccount: {
    index: 4,
    layout: struct([u32("instruction")])
  },
  WithdrawNonceAccount: {
    index: 5,
    layout: struct([u32("instruction"), ns64("lamports")])
  },
  InitializeNonceAccount: {
    index: 6,
    layout: struct([u32("instruction"), publicKey("authorized")])
  },
  AuthorizeNonceAccount: {
    index: 7,
    layout: struct([u32("instruction"), publicKey("authorized")])
  },
  Allocate: {
    index: 8,
    layout: struct([u32("instruction"), ns64("space")])
  },
  AllocateWithSeed: {
    index: 9,
    layout: struct([u32("instruction"), publicKey("base"), rustString("seed"), ns64("space"), publicKey("programId")])
  },
  AssignWithSeed: {
    index: 10,
    layout: struct([u32("instruction"), publicKey("base"), rustString("seed"), publicKey("programId")])
  },
  TransferWithSeed: {
    index: 11,
    layout: struct([u32("instruction"), u64("lamports"), rustString("seed"), publicKey("programId")])
  },
  UpgradeNonceAccount: {
    index: 12,
    layout: struct([u32("instruction")])
  }
});
class SystemProgram {
  /**
   * @internal
   */
  constructor() {
  }
  /**
   * Public key that identifies the System program
   */
  /**
   * Generate a transaction instruction that creates a new account
   */
  static createAccount(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.Create;
    const data = encodeData(type2, {
      lamports: params.lamports,
      space: params.space,
      programId: toBuffer(params.programId.toBuffer())
    });
    return new TransactionInstruction({
      keys: [{
        pubkey: params.fromPubkey,
        isSigner: true,
        isWritable: true
      }, {
        pubkey: params.newAccountPubkey,
        isSigner: true,
        isWritable: true
      }],
      programId: this.programId,
      data
    });
  }
  /**
   * Generate a transaction instruction that transfers lamports from one account to another
   */
  static transfer(params) {
    let data;
    let keys;
    if ("basePubkey" in params) {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.TransferWithSeed;
      data = encodeData(type2, {
        lamports: BigInt(params.lamports),
        seed: params.seed,
        programId: toBuffer(params.programId.toBuffer())
      });
      keys = [{
        pubkey: params.fromPubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.basePubkey,
        isSigner: true,
        isWritable: false
      }, {
        pubkey: params.toPubkey,
        isSigner: false,
        isWritable: true
      }];
    } else {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.Transfer;
      data = encodeData(type2, {
        lamports: BigInt(params.lamports)
      });
      keys = [{
        pubkey: params.fromPubkey,
        isSigner: true,
        isWritable: true
      }, {
        pubkey: params.toPubkey,
        isSigner: false,
        isWritable: true
      }];
    }
    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data
    });
  }
  /**
   * Generate a transaction instruction that assigns an account to a program
   */
  static assign(params) {
    let data;
    let keys;
    if ("basePubkey" in params) {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.AssignWithSeed;
      data = encodeData(type2, {
        base: toBuffer(params.basePubkey.toBuffer()),
        seed: params.seed,
        programId: toBuffer(params.programId.toBuffer())
      });
      keys = [{
        pubkey: params.accountPubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.basePubkey,
        isSigner: true,
        isWritable: false
      }];
    } else {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.Assign;
      data = encodeData(type2, {
        programId: toBuffer(params.programId.toBuffer())
      });
      keys = [{
        pubkey: params.accountPubkey,
        isSigner: true,
        isWritable: true
      }];
    }
    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data
    });
  }
  /**
   * Generate a transaction instruction that creates a new account at
   *   an address generated with `from`, a seed, and programId
   */
  static createAccountWithSeed(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.CreateWithSeed;
    const data = encodeData(type2, {
      base: toBuffer(params.basePubkey.toBuffer()),
      seed: params.seed,
      lamports: params.lamports,
      space: params.space,
      programId: toBuffer(params.programId.toBuffer())
    });
    let keys = [{
      pubkey: params.fromPubkey,
      isSigner: true,
      isWritable: true
    }, {
      pubkey: params.newAccountPubkey,
      isSigner: false,
      isWritable: true
    }];
    if (!params.basePubkey.equals(params.fromPubkey)) {
      keys.push({
        pubkey: params.basePubkey,
        isSigner: true,
        isWritable: false
      });
    }
    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data
    });
  }
  /**
   * Generate a transaction that creates a new Nonce account
   */
  static createNonceAccount(params) {
    const transaction = new Transaction();
    if ("basePubkey" in params && "seed" in params) {
      transaction.add(SystemProgram.createAccountWithSeed({
        fromPubkey: params.fromPubkey,
        newAccountPubkey: params.noncePubkey,
        basePubkey: params.basePubkey,
        seed: params.seed,
        lamports: params.lamports,
        space: NONCE_ACCOUNT_LENGTH,
        programId: this.programId
      }));
    } else {
      transaction.add(SystemProgram.createAccount({
        fromPubkey: params.fromPubkey,
        newAccountPubkey: params.noncePubkey,
        lamports: params.lamports,
        space: NONCE_ACCOUNT_LENGTH,
        programId: this.programId
      }));
    }
    const initParams = {
      noncePubkey: params.noncePubkey,
      authorizedPubkey: params.authorizedPubkey
    };
    transaction.add(this.nonceInitialize(initParams));
    return transaction;
  }
  /**
   * Generate an instruction to initialize a Nonce account
   */
  static nonceInitialize(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.InitializeNonceAccount;
    const data = encodeData(type2, {
      authorized: toBuffer(params.authorizedPubkey.toBuffer())
    });
    const instructionData = {
      keys: [{
        pubkey: params.noncePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false
      }],
      programId: this.programId,
      data
    };
    return new TransactionInstruction(instructionData);
  }
  /**
   * Generate an instruction to advance the nonce in a Nonce account
   */
  static nonceAdvance(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.AdvanceNonceAccount;
    const data = encodeData(type2);
    const instructionData = {
      keys: [{
        pubkey: params.noncePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: params.authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    };
    return new TransactionInstruction(instructionData);
  }
  /**
   * Generate a transaction instruction that withdraws lamports from a Nonce account
   */
  static nonceWithdraw(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.WithdrawNonceAccount;
    const data = encodeData(type2, {
      lamports: params.lamports
    });
    return new TransactionInstruction({
      keys: [{
        pubkey: params.noncePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.toPubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: params.authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    });
  }
  /**
   * Generate a transaction instruction that authorizes a new PublicKey as the authority
   * on a Nonce account.
   */
  static nonceAuthorize(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.AuthorizeNonceAccount;
    const data = encodeData(type2, {
      authorized: toBuffer(params.newAuthorizedPubkey.toBuffer())
    });
    return new TransactionInstruction({
      keys: [{
        pubkey: params.noncePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    });
  }
  /**
   * Generate a transaction instruction that allocates space in an account without funding
   */
  static allocate(params) {
    let data;
    let keys;
    if ("basePubkey" in params) {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.AllocateWithSeed;
      data = encodeData(type2, {
        base: toBuffer(params.basePubkey.toBuffer()),
        seed: params.seed,
        space: params.space,
        programId: toBuffer(params.programId.toBuffer())
      });
      keys = [{
        pubkey: params.accountPubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.basePubkey,
        isSigner: true,
        isWritable: false
      }];
    } else {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.Allocate;
      data = encodeData(type2, {
        space: params.space
      });
      keys = [{
        pubkey: params.accountPubkey,
        isSigner: true,
        isWritable: true
      }];
    }
    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data
    });
  }
}
SystemProgram.programId = new PublicKey("11111111111111111111111111111111");
new PublicKey("BPFLoader2111111111111111111111111111111111");
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var fastStableStringify$1;
var hasRequiredFastStableStringify;
function requireFastStableStringify() {
  if (hasRequiredFastStableStringify) return fastStableStringify$1;
  hasRequiredFastStableStringify = 1;
  var objToString = Object.prototype.toString;
  var objKeys = Object.keys || function(obj) {
    var keys = [];
    for (var name in obj) {
      keys.push(name);
    }
    return keys;
  };
  function stringify(val, isArrayProp) {
    var i, max, str, keys, key, propVal, toStr;
    if (val === true) {
      return "true";
    }
    if (val === false) {
      return "false";
    }
    switch (typeof val) {
      case "object":
        if (val === null) {
          return null;
        } else if (val.toJSON && typeof val.toJSON === "function") {
          return stringify(val.toJSON(), isArrayProp);
        } else {
          toStr = objToString.call(val);
          if (toStr === "[object Array]") {
            str = "[";
            max = val.length - 1;
            for (i = 0; i < max; i++) {
              str += stringify(val[i], true) + ",";
            }
            if (max > -1) {
              str += stringify(val[i], true);
            }
            return str + "]";
          } else if (toStr === "[object Object]") {
            keys = objKeys(val).sort();
            max = keys.length;
            str = "";
            i = 0;
            while (i < max) {
              key = keys[i];
              propVal = stringify(val[key], false);
              if (propVal !== void 0) {
                if (str) {
                  str += ",";
                }
                str += JSON.stringify(key) + ":" + propVal;
              }
              i++;
            }
            return "{" + str + "}";
          } else {
            return JSON.stringify(val);
          }
        }
      case "function":
      case "undefined":
        return isArrayProp ? null : void 0;
      case "string":
        return JSON.stringify(val);
      default:
        return isFinite(val) ? val : null;
    }
  }
  fastStableStringify$1 = function(val) {
    var returnVal = stringify(val, false);
    if (returnVal !== void 0) {
      return "" + returnVal;
    }
  };
  return fastStableStringify$1;
}
var fastStableStringifyExports = /* @__PURE__ */ requireFastStableStringify();
var fastStableStringify = /* @__PURE__ */ getDefaultExportFromCjs(fastStableStringifyExports);
const MINIMUM_SLOT_PER_EPOCH = 32;
function trailingZeros(n) {
  let trailingZeros2 = 0;
  while (n > 1) {
    n /= 2;
    trailingZeros2++;
  }
  return trailingZeros2;
}
function nextPowerOfTwo(n) {
  if (n === 0) return 1;
  n--;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  n |= n >> 32;
  return n + 1;
}
class EpochSchedule {
  constructor(slotsPerEpoch, leaderScheduleSlotOffset, warmup, firstNormalEpoch, firstNormalSlot) {
    this.slotsPerEpoch = void 0;
    this.leaderScheduleSlotOffset = void 0;
    this.warmup = void 0;
    this.firstNormalEpoch = void 0;
    this.firstNormalSlot = void 0;
    this.slotsPerEpoch = slotsPerEpoch;
    this.leaderScheduleSlotOffset = leaderScheduleSlotOffset;
    this.warmup = warmup;
    this.firstNormalEpoch = firstNormalEpoch;
    this.firstNormalSlot = firstNormalSlot;
  }
  getEpoch(slot) {
    return this.getEpochAndSlotIndex(slot)[0];
  }
  getEpochAndSlotIndex(slot) {
    if (slot < this.firstNormalSlot) {
      const epoch = trailingZeros(nextPowerOfTwo(slot + MINIMUM_SLOT_PER_EPOCH + 1)) - trailingZeros(MINIMUM_SLOT_PER_EPOCH) - 1;
      const epochLen = this.getSlotsInEpoch(epoch);
      const slotIndex = slot - (epochLen - MINIMUM_SLOT_PER_EPOCH);
      return [epoch, slotIndex];
    } else {
      const normalSlotIndex = slot - this.firstNormalSlot;
      const normalEpochIndex = Math.floor(normalSlotIndex / this.slotsPerEpoch);
      const epoch = this.firstNormalEpoch + normalEpochIndex;
      const slotIndex = normalSlotIndex % this.slotsPerEpoch;
      return [epoch, slotIndex];
    }
  }
  getFirstSlotInEpoch(epoch) {
    if (epoch <= this.firstNormalEpoch) {
      return (Math.pow(2, epoch) - 1) * MINIMUM_SLOT_PER_EPOCH;
    } else {
      return (epoch - this.firstNormalEpoch) * this.slotsPerEpoch + this.firstNormalSlot;
    }
  }
  getLastSlotInEpoch(epoch) {
    return this.getFirstSlotInEpoch(epoch) + this.getSlotsInEpoch(epoch) - 1;
  }
  getSlotsInEpoch(epoch) {
    if (epoch < this.firstNormalEpoch) {
      return Math.pow(2, epoch + trailingZeros(MINIMUM_SLOT_PER_EPOCH));
    } else {
      return this.slotsPerEpoch;
    }
  }
}
var fetchImpl = globalThis.fetch;
class RpcWebSocketClient extends CommonClient {
  constructor(address, options, generate_request_id) {
    const webSocketFactory = (url) => {
      const rpc = WebSocket$1(url, {
        autoconnect: true,
        max_reconnects: 5,
        reconnect: true,
        reconnect_interval: 1e3,
        ...options
      });
      if ("socket" in rpc) {
        this.underlyingSocket = rpc.socket;
      } else {
        this.underlyingSocket = rpc;
      }
      return rpc;
    };
    super(webSocketFactory, address, options, generate_request_id);
    this.underlyingSocket = void 0;
  }
  call(...args) {
    var _a;
    const readyState = (_a = this.underlyingSocket) == null ? void 0 : _a.readyState;
    if (readyState === 1) {
      return super.call(...args);
    }
    return Promise.reject(new Error("Tried to call a JSON-RPC method `" + args[0] + "` but the socket was not `CONNECTING` or `OPEN` (`readyState` was " + readyState + ")"));
  }
  notify(...args) {
    var _a;
    const readyState = (_a = this.underlyingSocket) == null ? void 0 : _a.readyState;
    if (readyState === 1) {
      return super.notify(...args);
    }
    return Promise.reject(new Error("Tried to send a JSON-RPC notification `" + args[0] + "` but the socket was not `CONNECTING` or `OPEN` (`readyState` was " + readyState + ")"));
  }
}
function decodeData(type2, data) {
  let decoded;
  try {
    decoded = type2.layout.decode(data);
  } catch (err) {
    throw new Error("invalid instruction; " + err);
  }
  if (decoded.typeIndex !== type2.index) {
    throw new Error(`invalid account data; account type mismatch ${decoded.typeIndex} != ${type2.index}`);
  }
  return decoded;
}
const LOOKUP_TABLE_META_SIZE = 56;
class AddressLookupTableAccount {
  constructor(args) {
    this.key = void 0;
    this.state = void 0;
    this.key = args.key;
    this.state = args.state;
  }
  isActive() {
    const U64_MAX = BigInt("0xffffffffffffffff");
    return this.state.deactivationSlot === U64_MAX;
  }
  static deserialize(accountData) {
    const meta = decodeData(LookupTableMetaLayout, accountData);
    const serializedAddressesLen = accountData.length - LOOKUP_TABLE_META_SIZE;
    assert(serializedAddressesLen >= 0, "lookup table is invalid");
    assert(serializedAddressesLen % 32 === 0, "lookup table is invalid");
    const numSerializedAddresses = serializedAddressesLen / 32;
    const {
      addresses
    } = struct([seq(publicKey(), numSerializedAddresses, "addresses")]).decode(accountData.slice(LOOKUP_TABLE_META_SIZE));
    return {
      deactivationSlot: meta.deactivationSlot,
      lastExtendedSlot: meta.lastExtendedSlot,
      lastExtendedSlotStartIndex: meta.lastExtendedStartIndex,
      authority: meta.authority.length !== 0 ? new PublicKey(meta.authority[0]) : void 0,
      addresses: addresses.map((address) => new PublicKey(address))
    };
  }
}
const LookupTableMetaLayout = {
  index: 1,
  layout: struct([
    u32("typeIndex"),
    u64("deactivationSlot"),
    nu64("lastExtendedSlot"),
    u8("lastExtendedStartIndex"),
    u8(),
    // option
    seq(publicKey(), offset(u8(), -1), "authority")
  ])
};
const URL_RE = /^[^:]+:\/\/([^:[]+|\[[^\]]+\])(:\d+)?(.*)/i;
function makeWebsocketUrl(endpoint) {
  const matches = endpoint.match(URL_RE);
  if (matches == null) {
    throw TypeError(`Failed to validate endpoint URL \`${endpoint}\``);
  }
  const [
    _,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    hostish,
    portWithColon,
    rest
  ] = matches;
  const protocol = endpoint.startsWith("https:") ? "wss:" : "ws:";
  const startPort = portWithColon == null ? null : parseInt(portWithColon.slice(1), 10);
  const websocketPort = (
    // Only shift the port by +1 as a convention for ws(s) only if given endpoint
    // is explicitly specifying the endpoint port (HTTP-based RPC), assuming
    // we're directly trying to connect to agave-validator's ws listening port.
    // When the endpoint omits the port, we're connecting to the protocol
    // default ports: http(80) or https(443) and it's assumed we're behind a reverse
    // proxy which manages WebSocket upgrade and backend port redirection.
    startPort == null ? "" : `:${startPort + 1}`
  );
  return `${protocol}//${hostish}${websocketPort}${rest}`;
}
const PublicKeyFromString = coerce(instance(PublicKey), string(), (value) => new PublicKey(value));
const RawAccountDataResult = tuple([string(), literal("base64")]);
const BufferFromRawAccountData = coerce(instance(Buffer$1), RawAccountDataResult, (value) => Buffer$1.from(value[0], "base64"));
const BLOCKHASH_CACHE_TIMEOUT_MS = 30 * 1e3;
function assertEndpointUrl(putativeUrl) {
  if (/^https?:/.test(putativeUrl) === false) {
    throw new TypeError("Endpoint URL must start with `http:` or `https:`.");
  }
  return putativeUrl;
}
function extractCommitmentFromConfig(commitmentOrConfig) {
  let commitment;
  let config;
  if (typeof commitmentOrConfig === "string") {
    commitment = commitmentOrConfig;
  } else if (commitmentOrConfig) {
    const {
      commitment: specifiedCommitment,
      ...specifiedConfig
    } = commitmentOrConfig;
    commitment = specifiedCommitment;
    config = specifiedConfig;
  }
  return {
    commitment,
    config
  };
}
function applyDefaultMemcmpEncodingToFilters(filters) {
  return filters.map((filter) => "memcmp" in filter ? {
    ...filter,
    memcmp: {
      ...filter.memcmp,
      encoding: filter.memcmp.encoding ?? "base58"
    }
  } : filter);
}
function createRpcResult(result) {
  return union([type({
    jsonrpc: literal("2.0"),
    id: string(),
    result
  }), type({
    jsonrpc: literal("2.0"),
    id: string(),
    error: type({
      code: unknown(),
      message: string(),
      data: optional(any())
    })
  })]);
}
const UnknownRpcResult = createRpcResult(unknown());
function jsonRpcResult(schema) {
  return coerce(createRpcResult(schema), UnknownRpcResult, (value) => {
    if ("error" in value) {
      return value;
    } else {
      return {
        ...value,
        result: create(value.result, schema)
      };
    }
  });
}
function jsonRpcResultAndContext(value) {
  return jsonRpcResult(type({
    context: type({
      slot: number()
    }),
    value
  }));
}
function notificationResultAndContext(value) {
  return type({
    context: type({
      slot: number()
    }),
    value
  });
}
function versionedMessageFromResponse(version, response) {
  if (version === 0) {
    return new MessageV0({
      header: response.header,
      staticAccountKeys: response.accountKeys.map((accountKey) => new PublicKey(accountKey)),
      recentBlockhash: response.recentBlockhash,
      compiledInstructions: response.instructions.map((ix) => ({
        programIdIndex: ix.programIdIndex,
        accountKeyIndexes: ix.accounts,
        data: bs58$8.decode(ix.data)
      })),
      addressTableLookups: response.addressTableLookups
    });
  } else {
    return new Message(response);
  }
}
const GetInflationGovernorResult = type({
  foundation: number(),
  foundationTerm: number(),
  initial: number(),
  taper: number(),
  terminal: number()
});
const GetInflationRewardResult = jsonRpcResult(array(nullable(type({
  epoch: number(),
  effectiveSlot: number(),
  amount: number(),
  postBalance: number(),
  commission: optional(nullable(number()))
}))));
const GetRecentPrioritizationFeesResult = array(type({
  slot: number(),
  prioritizationFee: number()
}));
const GetInflationRateResult = type({
  total: number(),
  validator: number(),
  foundation: number(),
  epoch: number()
});
const GetEpochInfoResult = type({
  epoch: number(),
  slotIndex: number(),
  slotsInEpoch: number(),
  absoluteSlot: number(),
  blockHeight: optional(number()),
  transactionCount: optional(number())
});
const GetEpochScheduleResult = type({
  slotsPerEpoch: number(),
  leaderScheduleSlotOffset: number(),
  warmup: boolean(),
  firstNormalEpoch: number(),
  firstNormalSlot: number()
});
const GetLeaderScheduleResult = record(string(), array(number()));
const TransactionErrorResult = nullable(union([type({}), string()]));
const SignatureStatusResult = type({
  err: TransactionErrorResult
});
const SignatureReceivedResult = literal("receivedSignature");
const VersionResult = type({
  "solana-core": string(),
  "feature-set": optional(number())
});
const ParsedInstructionStruct = type({
  program: string(),
  programId: PublicKeyFromString,
  parsed: unknown()
});
const PartiallyDecodedInstructionStruct = type({
  programId: PublicKeyFromString,
  accounts: array(PublicKeyFromString),
  data: string()
});
const SimulatedTransactionResponseStruct = jsonRpcResultAndContext(type({
  err: nullable(union([type({}), string()])),
  logs: nullable(array(string())),
  accounts: optional(nullable(array(nullable(type({
    executable: boolean(),
    owner: string(),
    lamports: number(),
    data: array(string()),
    rentEpoch: optional(number())
  }))))),
  unitsConsumed: optional(number()),
  returnData: optional(nullable(type({
    programId: string(),
    data: tuple([string(), literal("base64")])
  }))),
  innerInstructions: optional(nullable(array(type({
    index: number(),
    instructions: array(union([ParsedInstructionStruct, PartiallyDecodedInstructionStruct]))
  }))))
}));
const BlockProductionResponseStruct = jsonRpcResultAndContext(type({
  byIdentity: record(string(), array(number())),
  range: type({
    firstSlot: number(),
    lastSlot: number()
  })
}));
function createRpcClient(url, httpHeaders, customFetch, fetchMiddleware, disableRetryOnRateLimit, httpAgent) {
  const fetch = customFetch ? customFetch : fetchImpl;
  let agent;
  {
    if (httpAgent != null) {
      console.warn("You have supplied an `httpAgent` when creating a `Connection` in a browser environment.It has been ignored; `httpAgent` is only used in Node environments.");
    }
  }
  let fetchWithMiddleware;
  if (fetchMiddleware) {
    fetchWithMiddleware = async (info, init) => {
      const modifiedFetchArgs = await new Promise((resolve, reject) => {
        try {
          fetchMiddleware(info, init, (modifiedInfo, modifiedInit) => resolve([modifiedInfo, modifiedInit]));
        } catch (error) {
          reject(error);
        }
      });
      return await fetch(...modifiedFetchArgs);
    };
  }
  const clientBrowser = new RpcClient(async (request, callback) => {
    const options = {
      method: "POST",
      body: request,
      agent,
      headers: Object.assign({
        "Content-Type": "application/json"
      }, httpHeaders || {}, COMMON_HTTP_HEADERS)
    };
    try {
      let too_many_requests_retries = 5;
      let res;
      let waitTime = 500;
      for (; ; ) {
        if (fetchWithMiddleware) {
          res = await fetchWithMiddleware(url, options);
        } else {
          res = await fetch(url, options);
        }
        if (res.status !== 429) {
          break;
        }
        if (disableRetryOnRateLimit === true) {
          break;
        }
        too_many_requests_retries -= 1;
        if (too_many_requests_retries === 0) {
          break;
        }
        console.error(`Server responded with ${res.status} ${res.statusText}.  Retrying after ${waitTime}ms delay...`);
        await sleep(waitTime);
        waitTime *= 2;
      }
      const text = await res.text();
      if (res.ok) {
        callback(null, text);
      } else {
        callback(new Error(`${res.status} ${res.statusText}: ${text}`));
      }
    } catch (err) {
      if (err instanceof Error) callback(err);
    }
  }, {});
  return clientBrowser;
}
function createRpcRequest(client) {
  return (method, args) => {
    return new Promise((resolve, reject) => {
      client.request(method, args, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  };
}
function createRpcBatchRequest(client) {
  return (requests) => {
    return new Promise((resolve, reject) => {
      if (requests.length === 0) resolve([]);
      const batch = requests.map((params) => {
        return client.request(params.methodName, params.args);
      });
      client.request(batch, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  };
}
const GetInflationGovernorRpcResult = jsonRpcResult(GetInflationGovernorResult);
const GetInflationRateRpcResult = jsonRpcResult(GetInflationRateResult);
const GetRecentPrioritizationFeesRpcResult = jsonRpcResult(GetRecentPrioritizationFeesResult);
const GetEpochInfoRpcResult = jsonRpcResult(GetEpochInfoResult);
const GetEpochScheduleRpcResult = jsonRpcResult(GetEpochScheduleResult);
const GetLeaderScheduleRpcResult = jsonRpcResult(GetLeaderScheduleResult);
const SlotRpcResult = jsonRpcResult(number());
const GetSupplyRpcResult = jsonRpcResultAndContext(type({
  total: number(),
  circulating: number(),
  nonCirculating: number(),
  nonCirculatingAccounts: array(PublicKeyFromString)
}));
const TokenAmountResult = type({
  amount: string(),
  uiAmount: nullable(number()),
  decimals: number(),
  uiAmountString: optional(string())
});
const GetTokenLargestAccountsResult = jsonRpcResultAndContext(array(type({
  address: PublicKeyFromString,
  amount: string(),
  uiAmount: nullable(number()),
  decimals: number(),
  uiAmountString: optional(string())
})));
const GetTokenAccountsByOwner = jsonRpcResultAndContext(array(type({
  pubkey: PublicKeyFromString,
  account: type({
    executable: boolean(),
    owner: PublicKeyFromString,
    lamports: number(),
    data: BufferFromRawAccountData,
    rentEpoch: number()
  })
})));
const ParsedAccountDataResult = type({
  program: string(),
  parsed: unknown(),
  space: number()
});
const GetParsedTokenAccountsByOwner = jsonRpcResultAndContext(array(type({
  pubkey: PublicKeyFromString,
  account: type({
    executable: boolean(),
    owner: PublicKeyFromString,
    lamports: number(),
    data: ParsedAccountDataResult,
    rentEpoch: number()
  })
})));
const GetLargestAccountsRpcResult = jsonRpcResultAndContext(array(type({
  lamports: number(),
  address: PublicKeyFromString
})));
const AccountInfoResult = type({
  executable: boolean(),
  owner: PublicKeyFromString,
  lamports: number(),
  data: BufferFromRawAccountData,
  rentEpoch: number()
});
const KeyedAccountInfoResult = type({
  pubkey: PublicKeyFromString,
  account: AccountInfoResult
});
const ParsedOrRawAccountData = coerce(union([instance(Buffer$1), ParsedAccountDataResult]), union([RawAccountDataResult, ParsedAccountDataResult]), (value) => {
  if (Array.isArray(value)) {
    return create(value, BufferFromRawAccountData);
  } else {
    return value;
  }
});
const ParsedAccountInfoResult = type({
  executable: boolean(),
  owner: PublicKeyFromString,
  lamports: number(),
  data: ParsedOrRawAccountData,
  rentEpoch: number()
});
const KeyedParsedAccountInfoResult = type({
  pubkey: PublicKeyFromString,
  account: ParsedAccountInfoResult
});
const StakeActivationResult = type({
  state: union([literal("active"), literal("inactive"), literal("activating"), literal("deactivating")]),
  active: number(),
  inactive: number()
});
const GetConfirmedSignaturesForAddress2RpcResult = jsonRpcResult(array(type({
  signature: string(),
  slot: number(),
  err: TransactionErrorResult,
  memo: nullable(string()),
  blockTime: optional(nullable(number()))
})));
const GetSignaturesForAddressRpcResult = jsonRpcResult(array(type({
  signature: string(),
  slot: number(),
  err: TransactionErrorResult,
  memo: nullable(string()),
  blockTime: optional(nullable(number()))
})));
const AccountNotificationResult = type({
  subscription: number(),
  result: notificationResultAndContext(AccountInfoResult)
});
const ProgramAccountInfoResult = type({
  pubkey: PublicKeyFromString,
  account: AccountInfoResult
});
const ProgramAccountNotificationResult = type({
  subscription: number(),
  result: notificationResultAndContext(ProgramAccountInfoResult)
});
const SlotInfoResult = type({
  parent: number(),
  slot: number(),
  root: number()
});
const SlotNotificationResult = type({
  subscription: number(),
  result: SlotInfoResult
});
const SlotUpdateResult = union([type({
  type: union([literal("firstShredReceived"), literal("completed"), literal("optimisticConfirmation"), literal("root")]),
  slot: number(),
  timestamp: number()
}), type({
  type: literal("createdBank"),
  parent: number(),
  slot: number(),
  timestamp: number()
}), type({
  type: literal("frozen"),
  slot: number(),
  timestamp: number(),
  stats: type({
    numTransactionEntries: number(),
    numSuccessfulTransactions: number(),
    numFailedTransactions: number(),
    maxTransactionsPerEntry: number()
  })
}), type({
  type: literal("dead"),
  slot: number(),
  timestamp: number(),
  err: string()
})]);
const SlotUpdateNotificationResult = type({
  subscription: number(),
  result: SlotUpdateResult
});
const SignatureNotificationResult = type({
  subscription: number(),
  result: notificationResultAndContext(union([SignatureStatusResult, SignatureReceivedResult]))
});
const RootNotificationResult = type({
  subscription: number(),
  result: number()
});
const ContactInfoResult = type({
  pubkey: string(),
  gossip: nullable(string()),
  tpu: nullable(string()),
  rpc: nullable(string()),
  version: nullable(string())
});
const VoteAccountInfoResult = type({
  votePubkey: string(),
  nodePubkey: string(),
  activatedStake: number(),
  epochVoteAccount: boolean(),
  epochCredits: array(tuple([number(), number(), number()])),
  commission: number(),
  lastVote: number(),
  rootSlot: nullable(number())
});
const GetVoteAccounts = jsonRpcResult(type({
  current: array(VoteAccountInfoResult),
  delinquent: array(VoteAccountInfoResult)
}));
const ConfirmationStatus = union([literal("processed"), literal("confirmed"), literal("finalized")]);
const SignatureStatusResponse = type({
  slot: number(),
  confirmations: nullable(number()),
  err: TransactionErrorResult,
  confirmationStatus: optional(ConfirmationStatus)
});
const GetSignatureStatusesRpcResult = jsonRpcResultAndContext(array(nullable(SignatureStatusResponse)));
const GetMinimumBalanceForRentExemptionRpcResult = jsonRpcResult(number());
const AddressTableLookupStruct = type({
  accountKey: PublicKeyFromString,
  writableIndexes: array(number()),
  readonlyIndexes: array(number())
});
const ConfirmedTransactionResult = type({
  signatures: array(string()),
  message: type({
    accountKeys: array(string()),
    header: type({
      numRequiredSignatures: number(),
      numReadonlySignedAccounts: number(),
      numReadonlyUnsignedAccounts: number()
    }),
    instructions: array(type({
      accounts: array(number()),
      data: string(),
      programIdIndex: number()
    })),
    recentBlockhash: string(),
    addressTableLookups: optional(array(AddressTableLookupStruct))
  })
});
const AnnotatedAccountKey = type({
  pubkey: PublicKeyFromString,
  signer: boolean(),
  writable: boolean(),
  source: optional(union([literal("transaction"), literal("lookupTable")]))
});
const ConfirmedTransactionAccountsModeResult = type({
  accountKeys: array(AnnotatedAccountKey),
  signatures: array(string())
});
const ParsedInstructionResult = type({
  parsed: unknown(),
  program: string(),
  programId: PublicKeyFromString
});
const RawInstructionResult = type({
  accounts: array(PublicKeyFromString),
  data: string(),
  programId: PublicKeyFromString
});
const InstructionResult = union([RawInstructionResult, ParsedInstructionResult]);
const UnknownInstructionResult = union([type({
  parsed: unknown(),
  program: string(),
  programId: string()
}), type({
  accounts: array(string()),
  data: string(),
  programId: string()
})]);
const ParsedOrRawInstruction = coerce(InstructionResult, UnknownInstructionResult, (value) => {
  if ("accounts" in value) {
    return create(value, RawInstructionResult);
  } else {
    return create(value, ParsedInstructionResult);
  }
});
const ParsedConfirmedTransactionResult = type({
  signatures: array(string()),
  message: type({
    accountKeys: array(AnnotatedAccountKey),
    instructions: array(ParsedOrRawInstruction),
    recentBlockhash: string(),
    addressTableLookups: optional(nullable(array(AddressTableLookupStruct)))
  })
});
const TokenBalanceResult = type({
  accountIndex: number(),
  mint: string(),
  owner: optional(string()),
  programId: optional(string()),
  uiTokenAmount: TokenAmountResult
});
const LoadedAddressesResult = type({
  writable: array(PublicKeyFromString),
  readonly: array(PublicKeyFromString)
});
const ConfirmedTransactionMetaResult = type({
  err: TransactionErrorResult,
  fee: number(),
  innerInstructions: optional(nullable(array(type({
    index: number(),
    instructions: array(type({
      accounts: array(number()),
      data: string(),
      programIdIndex: number()
    }))
  })))),
  preBalances: array(number()),
  postBalances: array(number()),
  logMessages: optional(nullable(array(string()))),
  preTokenBalances: optional(nullable(array(TokenBalanceResult))),
  postTokenBalances: optional(nullable(array(TokenBalanceResult))),
  loadedAddresses: optional(LoadedAddressesResult),
  computeUnitsConsumed: optional(number()),
  costUnits: optional(number())
});
const ParsedConfirmedTransactionMetaResult = type({
  err: TransactionErrorResult,
  fee: number(),
  innerInstructions: optional(nullable(array(type({
    index: number(),
    instructions: array(ParsedOrRawInstruction)
  })))),
  preBalances: array(number()),
  postBalances: array(number()),
  logMessages: optional(nullable(array(string()))),
  preTokenBalances: optional(nullable(array(TokenBalanceResult))),
  postTokenBalances: optional(nullable(array(TokenBalanceResult))),
  loadedAddresses: optional(LoadedAddressesResult),
  computeUnitsConsumed: optional(number()),
  costUnits: optional(number())
});
const TransactionVersionStruct = union([literal(0), literal("legacy")]);
const RewardsResult = type({
  pubkey: string(),
  lamports: number(),
  postBalance: nullable(number()),
  rewardType: nullable(string()),
  commission: optional(nullable(number()))
});
const GetBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number(),
  transactions: array(type({
    transaction: ConfirmedTransactionResult,
    meta: nullable(ConfirmedTransactionMetaResult),
    version: optional(TransactionVersionStruct)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number()),
  blockHeight: nullable(number())
})));
const GetNoneModeBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number(),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number()),
  blockHeight: nullable(number())
})));
const GetAccountsModeBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number(),
  transactions: array(type({
    transaction: ConfirmedTransactionAccountsModeResult,
    meta: nullable(ConfirmedTransactionMetaResult),
    version: optional(TransactionVersionStruct)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number()),
  blockHeight: nullable(number())
})));
const GetParsedBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number(),
  transactions: array(type({
    transaction: ParsedConfirmedTransactionResult,
    meta: nullable(ParsedConfirmedTransactionMetaResult),
    version: optional(TransactionVersionStruct)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number()),
  blockHeight: nullable(number())
})));
const GetParsedAccountsModeBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number(),
  transactions: array(type({
    transaction: ConfirmedTransactionAccountsModeResult,
    meta: nullable(ParsedConfirmedTransactionMetaResult),
    version: optional(TransactionVersionStruct)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number()),
  blockHeight: nullable(number())
})));
const GetParsedNoneModeBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number(),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number()),
  blockHeight: nullable(number())
})));
const GetConfirmedBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number(),
  transactions: array(type({
    transaction: ConfirmedTransactionResult,
    meta: nullable(ConfirmedTransactionMetaResult)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number())
})));
const GetBlockSignaturesRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number(),
  signatures: array(string()),
  blockTime: nullable(number())
})));
const GetTransactionRpcResult = jsonRpcResult(nullable(type({
  slot: number(),
  meta: nullable(ConfirmedTransactionMetaResult),
  blockTime: optional(nullable(number())),
  transaction: ConfirmedTransactionResult,
  version: optional(TransactionVersionStruct)
})));
const GetParsedTransactionRpcResult = jsonRpcResult(nullable(type({
  slot: number(),
  transaction: ParsedConfirmedTransactionResult,
  meta: nullable(ParsedConfirmedTransactionMetaResult),
  blockTime: optional(nullable(number())),
  version: optional(TransactionVersionStruct)
})));
const GetLatestBlockhashRpcResult = jsonRpcResultAndContext(type({
  blockhash: string(),
  lastValidBlockHeight: number()
}));
const IsBlockhashValidRpcResult = jsonRpcResultAndContext(boolean());
const PerfSampleResult = type({
  slot: number(),
  numTransactions: number(),
  numSlots: number(),
  samplePeriodSecs: number()
});
const GetRecentPerformanceSamplesRpcResult = jsonRpcResult(array(PerfSampleResult));
const GetFeeCalculatorRpcResult = jsonRpcResultAndContext(nullable(type({
  feeCalculator: type({
    lamportsPerSignature: number()
  })
})));
const RequestAirdropRpcResult = jsonRpcResult(string());
const SendTransactionRpcResult = jsonRpcResult(string());
const LogsResult = type({
  err: TransactionErrorResult,
  logs: array(string()),
  signature: string()
});
const LogsNotificationResult = type({
  result: notificationResultAndContext(LogsResult),
  subscription: number()
});
const COMMON_HTTP_HEADERS = {
  "solana-client": `js/${"1.0.0-maintenance"}`
};
class Connection {
  /**
   * Establish a JSON RPC connection
   *
   * @param endpoint URL to the fullnode JSON RPC endpoint
   * @param commitmentOrConfig optional default commitment level or optional ConnectionConfig configuration object
   */
  constructor(endpoint, _commitmentOrConfig) {
    this._commitment = void 0;
    this._confirmTransactionInitialTimeout = void 0;
    this._rpcEndpoint = void 0;
    this._rpcWsEndpoint = void 0;
    this._rpcClient = void 0;
    this._rpcRequest = void 0;
    this._rpcBatchRequest = void 0;
    this._rpcWebSocket = void 0;
    this._rpcWebSocketConnected = false;
    this._rpcWebSocketHeartbeat = null;
    this._rpcWebSocketIdleTimeout = null;
    this._rpcWebSocketGeneration = 0;
    this._disableBlockhashCaching = false;
    this._pollingBlockhash = false;
    this._blockhashInfo = {
      latestBlockhash: null,
      lastFetch: 0,
      transactionSignatures: [],
      simulatedSignatures: []
    };
    this._nextClientSubscriptionId = 0;
    this._subscriptionDisposeFunctionsByClientSubscriptionId = {};
    this._subscriptionHashByClientSubscriptionId = {};
    this._subscriptionStateChangeCallbacksByHash = {};
    this._subscriptionCallbacksByServerSubscriptionId = {};
    this._subscriptionsByHash = {};
    this._subscriptionsAutoDisposedByRpc = /* @__PURE__ */ new Set();
    this.getBlockHeight = /* @__PURE__ */ (() => {
      const requestPromises = {};
      return async (commitmentOrConfig) => {
        const {
          commitment,
          config
        } = extractCommitmentFromConfig(commitmentOrConfig);
        const args = this._buildArgs([], commitment, void 0, config);
        const requestHash = fastStableStringify(args);
        requestPromises[requestHash] = requestPromises[requestHash] ?? (async () => {
          try {
            const unsafeRes = await this._rpcRequest("getBlockHeight", args);
            const res = create(unsafeRes, jsonRpcResult(number()));
            if ("error" in res) {
              throw new SolanaJSONRPCError(res.error, "failed to get block height information");
            }
            return res.result;
          } finally {
            delete requestPromises[requestHash];
          }
        })();
        return await requestPromises[requestHash];
      };
    })();
    let wsEndpoint;
    let httpHeaders;
    let fetch;
    let fetchMiddleware;
    let disableRetryOnRateLimit;
    let httpAgent;
    if (_commitmentOrConfig && typeof _commitmentOrConfig === "string") {
      this._commitment = _commitmentOrConfig;
    } else if (_commitmentOrConfig) {
      this._commitment = _commitmentOrConfig.commitment;
      this._confirmTransactionInitialTimeout = _commitmentOrConfig.confirmTransactionInitialTimeout;
      wsEndpoint = _commitmentOrConfig.wsEndpoint;
      httpHeaders = _commitmentOrConfig.httpHeaders;
      fetch = _commitmentOrConfig.fetch;
      fetchMiddleware = _commitmentOrConfig.fetchMiddleware;
      disableRetryOnRateLimit = _commitmentOrConfig.disableRetryOnRateLimit;
      httpAgent = _commitmentOrConfig.httpAgent;
    }
    this._rpcEndpoint = assertEndpointUrl(endpoint);
    this._rpcWsEndpoint = wsEndpoint || makeWebsocketUrl(endpoint);
    this._rpcClient = createRpcClient(endpoint, httpHeaders, fetch, fetchMiddleware, disableRetryOnRateLimit, httpAgent);
    this._rpcRequest = createRpcRequest(this._rpcClient);
    this._rpcBatchRequest = createRpcBatchRequest(this._rpcClient);
    this._rpcWebSocket = new RpcWebSocketClient(this._rpcWsEndpoint, {
      autoconnect: false,
      max_reconnects: Infinity
    });
    this._rpcWebSocket.on("open", this._wsOnOpen.bind(this));
    this._rpcWebSocket.on("error", this._wsOnError.bind(this));
    this._rpcWebSocket.on("close", this._wsOnClose.bind(this));
    this._rpcWebSocket.on("accountNotification", this._wsOnAccountNotification.bind(this));
    this._rpcWebSocket.on("programNotification", this._wsOnProgramAccountNotification.bind(this));
    this._rpcWebSocket.on("slotNotification", this._wsOnSlotNotification.bind(this));
    this._rpcWebSocket.on("slotsUpdatesNotification", this._wsOnSlotUpdatesNotification.bind(this));
    this._rpcWebSocket.on("signatureNotification", this._wsOnSignatureNotification.bind(this));
    this._rpcWebSocket.on("rootNotification", this._wsOnRootNotification.bind(this));
    this._rpcWebSocket.on("logsNotification", this._wsOnLogsNotification.bind(this));
  }
  /**
   * The default commitment used for requests
   */
  get commitment() {
    return this._commitment;
  }
  /**
   * The RPC endpoint
   */
  get rpcEndpoint() {
    return this._rpcEndpoint;
  }
  /**
   * Fetch the balance for the specified public key, return with context
   */
  async getBalanceAndContext(publicKey2, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([publicKey2.toBase58()], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("getBalance", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(number()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get balance for ${publicKey2.toBase58()}`);
    }
    return res.result;
  }
  /**
   * Fetch the balance for the specified public key
   */
  async getBalance(publicKey2, commitmentOrConfig) {
    return await this.getBalanceAndContext(publicKey2, commitmentOrConfig).then((x) => x.value).catch((e) => {
      throw new Error("failed to get balance of account " + publicKey2.toBase58() + ": " + e);
    });
  }
  /**
   * Fetch the estimated production time of a block
   */
  async getBlockTime(slot) {
    const unsafeRes = await this._rpcRequest("getBlockTime", [slot]);
    const res = create(unsafeRes, jsonRpcResult(nullable(number())));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get block time for slot ${slot}`);
    }
    return res.result;
  }
  /**
   * Fetch the lowest slot that the node has information about in its ledger.
   * This value may increase over time if the node is configured to purge older ledger data
   */
  async getMinimumLedgerSlot() {
    const unsafeRes = await this._rpcRequest("minimumLedgerSlot", []);
    const res = create(unsafeRes, jsonRpcResult(number()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get minimum ledger slot");
    }
    return res.result;
  }
  /**
   * Fetch the slot of the lowest confirmed block that has not been purged from the ledger
   */
  async getFirstAvailableBlock() {
    const unsafeRes = await this._rpcRequest("getFirstAvailableBlock", []);
    const res = create(unsafeRes, SlotRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get first available block");
    }
    return res.result;
  }
  /**
   * Fetch information about the current supply
   */
  async getSupply(config) {
    let configArg = {};
    if (typeof config === "string") {
      configArg = {
        commitment: config
      };
    } else if (config) {
      configArg = {
        ...config,
        commitment: config && config.commitment || this.commitment
      };
    } else {
      configArg = {
        commitment: this.commitment
      };
    }
    const unsafeRes = await this._rpcRequest("getSupply", [configArg]);
    const res = create(unsafeRes, GetSupplyRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get supply");
    }
    return res.result;
  }
  /**
   * Fetch the current supply of a token mint
   */
  async getTokenSupply(tokenMintAddress, commitment) {
    const args = this._buildArgs([tokenMintAddress.toBase58()], commitment);
    const unsafeRes = await this._rpcRequest("getTokenSupply", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(TokenAmountResult));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get token supply");
    }
    return res.result;
  }
  /**
   * Fetch the current balance of a token account
   */
  async getTokenAccountBalance(tokenAddress, commitment) {
    const args = this._buildArgs([tokenAddress.toBase58()], commitment);
    const unsafeRes = await this._rpcRequest("getTokenAccountBalance", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(TokenAmountResult));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get token account balance");
    }
    return res.result;
  }
  /**
   * Fetch all the token accounts owned by the specified account
   *
   * @return {Promise<RpcResponseAndContext<GetProgramAccountsResponse>}
   */
  async getTokenAccountsByOwner(ownerAddress, filter, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    let _args = [ownerAddress.toBase58()];
    if ("mint" in filter) {
      _args.push({
        mint: filter.mint.toBase58()
      });
    } else {
      _args.push({
        programId: filter.programId.toBase58()
      });
    }
    const args = this._buildArgs(_args, commitment, "base64", config);
    const unsafeRes = await this._rpcRequest("getTokenAccountsByOwner", args);
    const res = create(unsafeRes, GetTokenAccountsByOwner);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get token accounts owned by account ${ownerAddress.toBase58()}`);
    }
    return res.result;
  }
  /**
   * Fetch parsed token accounts owned by the specified account
   *
   * @return {Promise<RpcResponseAndContext<Array<{pubkey: PublicKey, account: AccountInfo<ParsedAccountData>}>>>}
   */
  async getParsedTokenAccountsByOwner(ownerAddress, filter, commitment) {
    let _args = [ownerAddress.toBase58()];
    if ("mint" in filter) {
      _args.push({
        mint: filter.mint.toBase58()
      });
    } else {
      _args.push({
        programId: filter.programId.toBase58()
      });
    }
    const args = this._buildArgs(_args, commitment, "jsonParsed");
    const unsafeRes = await this._rpcRequest("getTokenAccountsByOwner", args);
    const res = create(unsafeRes, GetParsedTokenAccountsByOwner);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get token accounts owned by account ${ownerAddress.toBase58()}`);
    }
    return res.result;
  }
  /**
   * Fetch the 20 largest accounts with their current balances
   */
  async getLargestAccounts(config) {
    const arg = {
      ...config,
      commitment: config && config.commitment || this.commitment
    };
    const args = arg.filter || arg.commitment ? [arg] : [];
    const unsafeRes = await this._rpcRequest("getLargestAccounts", args);
    const res = create(unsafeRes, GetLargestAccountsRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get largest accounts");
    }
    return res.result;
  }
  /**
   * Fetch the 20 largest token accounts with their current balances
   * for a given mint.
   */
  async getTokenLargestAccounts(mintAddress, commitment) {
    const args = this._buildArgs([mintAddress.toBase58()], commitment);
    const unsafeRes = await this._rpcRequest("getTokenLargestAccounts", args);
    const res = create(unsafeRes, GetTokenLargestAccountsResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get token largest accounts");
    }
    return res.result;
  }
  /**
   * Fetch all the account info for the specified public key, return with context
   */
  async getAccountInfoAndContext(publicKey2, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([publicKey2.toBase58()], commitment, "base64", config);
    const unsafeRes = await this._rpcRequest("getAccountInfo", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(nullable(AccountInfoResult)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get info about account ${publicKey2.toBase58()}`);
    }
    return res.result;
  }
  /**
   * Fetch parsed account info for the specified public key
   */
  async getParsedAccountInfo(publicKey2, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([publicKey2.toBase58()], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getAccountInfo", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(nullable(ParsedAccountInfoResult)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get info about account ${publicKey2.toBase58()}`);
    }
    return res.result;
  }
  /**
   * Fetch all the account info for the specified public key
   */
  async getAccountInfo(publicKey2, commitmentOrConfig) {
    try {
      const res = await this.getAccountInfoAndContext(publicKey2, commitmentOrConfig);
      return res.value;
    } catch (e) {
      throw new Error("failed to get info about account " + publicKey2.toBase58() + ": " + e);
    }
  }
  /**
   * Fetch all the account info for multiple accounts specified by an array of public keys, return with context
   */
  async getMultipleParsedAccounts(publicKeys, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const keys = publicKeys.map((key) => key.toBase58());
    const args = this._buildArgs([keys], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getMultipleAccounts", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(array(nullable(ParsedAccountInfoResult))));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get info for accounts ${keys}`);
    }
    return res.result;
  }
  /**
   * Fetch all the account info for multiple accounts specified by an array of public keys, return with context
   */
  async getMultipleAccountsInfoAndContext(publicKeys, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const keys = publicKeys.map((key) => key.toBase58());
    const args = this._buildArgs([keys], commitment, "base64", config);
    const unsafeRes = await this._rpcRequest("getMultipleAccounts", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(array(nullable(AccountInfoResult))));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get info for accounts ${keys}`);
    }
    return res.result;
  }
  /**
   * Fetch all the account info for multiple accounts specified by an array of public keys
   */
  async getMultipleAccountsInfo(publicKeys, commitmentOrConfig) {
    const res = await this.getMultipleAccountsInfoAndContext(publicKeys, commitmentOrConfig);
    return res.value;
  }
  /**
   * Returns epoch activation information for a stake account that has been delegated
   *
   * @deprecated Deprecated since RPC v1.18; will be removed in a future version.
   */
  async getStakeActivation(publicKey2, commitmentOrConfig, epoch) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([publicKey2.toBase58()], commitment, void 0, {
      ...config,
      epoch: epoch != null ? epoch : config == null ? void 0 : config.epoch
    });
    const unsafeRes = await this._rpcRequest("getStakeActivation", args);
    const res = create(unsafeRes, jsonRpcResult(StakeActivationResult));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get Stake Activation ${publicKey2.toBase58()}`);
    }
    return res.result;
  }
  /**
   * Fetch all the accounts owned by the specified program id
   *
   * @return {Promise<Array<{pubkey: PublicKey, account: AccountInfo<Buffer>}>>}
   */
  // eslint-disable-next-line no-dupe-class-members
  // eslint-disable-next-line no-dupe-class-members
  async getProgramAccounts(programId, configOrCommitment) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(configOrCommitment);
    const {
      encoding,
      ...configWithoutEncoding
    } = config || {};
    const args = this._buildArgs([programId.toBase58()], commitment, encoding || "base64", {
      ...configWithoutEncoding,
      ...configWithoutEncoding.filters ? {
        filters: applyDefaultMemcmpEncodingToFilters(configWithoutEncoding.filters)
      } : null
    });
    const unsafeRes = await this._rpcRequest("getProgramAccounts", args);
    const baseSchema = array(KeyedAccountInfoResult);
    const res = configWithoutEncoding.withContext === true ? create(unsafeRes, jsonRpcResultAndContext(baseSchema)) : create(unsafeRes, jsonRpcResult(baseSchema));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get accounts owned by program ${programId.toBase58()}`);
    }
    return res.result;
  }
  /**
   * Fetch and parse all the accounts owned by the specified program id
   *
   * @return {Promise<Array<{pubkey: PublicKey, account: AccountInfo<Buffer | ParsedAccountData>}>>}
   */
  async getParsedProgramAccounts(programId, configOrCommitment) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(configOrCommitment);
    const args = this._buildArgs([programId.toBase58()], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getProgramAccounts", args);
    const res = create(unsafeRes, jsonRpcResult(array(KeyedParsedAccountInfoResult)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get accounts owned by program ${programId.toBase58()}`);
    }
    return res.result;
  }
  /** @deprecated Instead, call `confirmTransaction` and pass in {@link TransactionConfirmationStrategy} */
  // eslint-disable-next-line no-dupe-class-members
  // eslint-disable-next-line no-dupe-class-members
  async confirmTransaction(strategy, commitment) {
    var _a;
    let rawSignature;
    if (typeof strategy == "string") {
      rawSignature = strategy;
    } else {
      const config = strategy;
      if ((_a = config.abortSignal) == null ? void 0 : _a.aborted) {
        return Promise.reject(config.abortSignal.reason);
      }
      rawSignature = config.signature;
    }
    let decodedSignature;
    try {
      decodedSignature = bs58$8.decode(rawSignature);
    } catch (err) {
      throw new Error("signature must be base58 encoded: " + rawSignature);
    }
    assert(decodedSignature.length === 64, "signature has invalid length");
    if (typeof strategy === "string") {
      return await this.confirmTransactionUsingLegacyTimeoutStrategy({
        commitment: commitment || this.commitment,
        signature: rawSignature
      });
    } else if ("lastValidBlockHeight" in strategy) {
      return await this.confirmTransactionUsingBlockHeightExceedanceStrategy({
        commitment: commitment || this.commitment,
        strategy
      });
    } else {
      return await this.confirmTransactionUsingDurableNonceStrategy({
        commitment: commitment || this.commitment,
        strategy
      });
    }
  }
  getCancellationPromise(signal) {
    return new Promise((_, reject) => {
      if (signal == null) {
        return;
      }
      if (signal.aborted) {
        reject(signal.reason);
      } else {
        signal.addEventListener("abort", () => {
          reject(signal.reason);
        });
      }
    });
  }
  getTransactionConfirmationPromise({
    commitment,
    signature: signature2
  }) {
    let signatureSubscriptionId;
    let disposeSignatureSubscriptionStateChangeObserver;
    let done = false;
    const confirmationPromise = new Promise((resolve, reject) => {
      try {
        signatureSubscriptionId = this.onSignature(signature2, (result, context) => {
          signatureSubscriptionId = void 0;
          const response = {
            context,
            value: result
          };
          resolve({
            __type: TransactionStatus.PROCESSED,
            response
          });
        }, commitment);
        const subscriptionSetupPromise = new Promise((resolveSubscriptionSetup) => {
          if (signatureSubscriptionId == null) {
            resolveSubscriptionSetup();
          } else {
            disposeSignatureSubscriptionStateChangeObserver = this._onSubscriptionStateChange(signatureSubscriptionId, (nextState) => {
              if (nextState === "subscribed") {
                resolveSubscriptionSetup();
              }
            });
          }
        });
        (async () => {
          await subscriptionSetupPromise;
          if (done) return;
          const response = await this.getSignatureStatus(signature2);
          if (done) return;
          if (response == null) {
            return;
          }
          const {
            context,
            value
          } = response;
          if (value == null) {
            return;
          }
          if (value == null ? void 0 : value.err) {
            reject(value.err);
          } else {
            switch (commitment) {
              case "confirmed":
              case "single":
              case "singleGossip": {
                if (value.confirmationStatus === "processed") {
                  return;
                }
                break;
              }
              case "finalized":
              case "max":
              case "root": {
                if (value.confirmationStatus === "processed" || value.confirmationStatus === "confirmed") {
                  return;
                }
                break;
              }
              case "processed":
              case "recent":
            }
            done = true;
            resolve({
              __type: TransactionStatus.PROCESSED,
              response: {
                context,
                value
              }
            });
          }
        })();
      } catch (err) {
        reject(err);
      }
    });
    const abortConfirmation = () => {
      if (disposeSignatureSubscriptionStateChangeObserver) {
        disposeSignatureSubscriptionStateChangeObserver();
        disposeSignatureSubscriptionStateChangeObserver = void 0;
      }
      if (signatureSubscriptionId != null) {
        this.removeSignatureListener(signatureSubscriptionId);
        signatureSubscriptionId = void 0;
      }
    };
    return {
      abortConfirmation,
      confirmationPromise
    };
  }
  async confirmTransactionUsingBlockHeightExceedanceStrategy({
    commitment,
    strategy: {
      abortSignal,
      lastValidBlockHeight,
      signature: signature2
    }
  }) {
    let done = false;
    const expiryPromise = new Promise((resolve) => {
      const checkBlockHeight = async () => {
        try {
          const blockHeight = await this.getBlockHeight(commitment);
          return blockHeight;
        } catch (_e) {
          return -1;
        }
      };
      (async () => {
        let currentBlockHeight = await checkBlockHeight();
        if (done) return;
        while (currentBlockHeight <= lastValidBlockHeight) {
          await sleep(1e3);
          if (done) return;
          currentBlockHeight = await checkBlockHeight();
          if (done) return;
        }
        resolve({
          __type: TransactionStatus.BLOCKHEIGHT_EXCEEDED
        });
      })();
    });
    const {
      abortConfirmation,
      confirmationPromise
    } = this.getTransactionConfirmationPromise({
      commitment,
      signature: signature2
    });
    const cancellationPromise = this.getCancellationPromise(abortSignal);
    let result;
    try {
      const outcome = await Promise.race([cancellationPromise, confirmationPromise, expiryPromise]);
      if (outcome.__type === TransactionStatus.PROCESSED) {
        result = outcome.response;
      } else {
        throw new TransactionExpiredBlockheightExceededError(signature2);
      }
    } finally {
      done = true;
      abortConfirmation();
    }
    return result;
  }
  async confirmTransactionUsingDurableNonceStrategy({
    commitment,
    strategy: {
      abortSignal,
      minContextSlot,
      nonceAccountPubkey,
      nonceValue,
      signature: signature2
    }
  }) {
    let done = false;
    const expiryPromise = new Promise((resolve) => {
      let currentNonceValue = nonceValue;
      let lastCheckedSlot = null;
      const getCurrentNonceValue = async () => {
        try {
          const {
            context,
            value: nonceAccount
          } = await this.getNonceAndContext(nonceAccountPubkey, {
            commitment,
            minContextSlot
          });
          lastCheckedSlot = context.slot;
          return nonceAccount == null ? void 0 : nonceAccount.nonce;
        } catch (e) {
          return currentNonceValue;
        }
      };
      (async () => {
        currentNonceValue = await getCurrentNonceValue();
        if (done) return;
        while (true) {
          if (nonceValue !== currentNonceValue) {
            resolve({
              __type: TransactionStatus.NONCE_INVALID,
              slotInWhichNonceDidAdvance: lastCheckedSlot
            });
            return;
          }
          await sleep(2e3);
          if (done) return;
          currentNonceValue = await getCurrentNonceValue();
          if (done) return;
        }
      })();
    });
    const {
      abortConfirmation,
      confirmationPromise
    } = this.getTransactionConfirmationPromise({
      commitment,
      signature: signature2
    });
    const cancellationPromise = this.getCancellationPromise(abortSignal);
    let result;
    try {
      const outcome = await Promise.race([cancellationPromise, confirmationPromise, expiryPromise]);
      if (outcome.__type === TransactionStatus.PROCESSED) {
        result = outcome.response;
      } else {
        let signatureStatus;
        while (true) {
          const status = await this.getSignatureStatus(signature2);
          if (status == null) {
            break;
          }
          if (status.context.slot < (outcome.slotInWhichNonceDidAdvance ?? minContextSlot)) {
            await sleep(400);
            continue;
          }
          signatureStatus = status;
          break;
        }
        if (signatureStatus == null ? void 0 : signatureStatus.value) {
          const commitmentForStatus = commitment || "finalized";
          const {
            confirmationStatus
          } = signatureStatus.value;
          switch (commitmentForStatus) {
            case "processed":
            case "recent":
              if (confirmationStatus !== "processed" && confirmationStatus !== "confirmed" && confirmationStatus !== "finalized") {
                throw new TransactionExpiredNonceInvalidError(signature2);
              }
              break;
            case "confirmed":
            case "single":
            case "singleGossip":
              if (confirmationStatus !== "confirmed" && confirmationStatus !== "finalized") {
                throw new TransactionExpiredNonceInvalidError(signature2);
              }
              break;
            case "finalized":
            case "max":
            case "root":
              if (confirmationStatus !== "finalized") {
                throw new TransactionExpiredNonceInvalidError(signature2);
              }
              break;
            default:
              /* @__PURE__ */ ((_) => {
              })(commitmentForStatus);
          }
          result = {
            context: signatureStatus.context,
            value: {
              err: signatureStatus.value.err
            }
          };
        } else {
          throw new TransactionExpiredNonceInvalidError(signature2);
        }
      }
    } finally {
      done = true;
      abortConfirmation();
    }
    return result;
  }
  async confirmTransactionUsingLegacyTimeoutStrategy({
    commitment,
    signature: signature2
  }) {
    let timeoutId;
    const expiryPromise = new Promise((resolve) => {
      let timeoutMs = this._confirmTransactionInitialTimeout || 60 * 1e3;
      switch (commitment) {
        case "processed":
        case "recent":
        case "single":
        case "confirmed":
        case "singleGossip": {
          timeoutMs = this._confirmTransactionInitialTimeout || 30 * 1e3;
          break;
        }
      }
      timeoutId = setTimeout(() => resolve({
        __type: TransactionStatus.TIMED_OUT,
        timeoutMs
      }), timeoutMs);
    });
    const {
      abortConfirmation,
      confirmationPromise
    } = this.getTransactionConfirmationPromise({
      commitment,
      signature: signature2
    });
    let result;
    try {
      const outcome = await Promise.race([confirmationPromise, expiryPromise]);
      if (outcome.__type === TransactionStatus.PROCESSED) {
        result = outcome.response;
      } else {
        throw new TransactionExpiredTimeoutError(signature2, outcome.timeoutMs / 1e3);
      }
    } finally {
      clearTimeout(timeoutId);
      abortConfirmation();
    }
    return result;
  }
  /**
   * Return the list of nodes that are currently participating in the cluster
   */
  async getClusterNodes() {
    const unsafeRes = await this._rpcRequest("getClusterNodes", []);
    const res = create(unsafeRes, jsonRpcResult(array(ContactInfoResult)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get cluster nodes");
    }
    return res.result;
  }
  /**
   * Return the list of nodes that are currently participating in the cluster
   */
  async getVoteAccounts(commitment) {
    const args = this._buildArgs([], commitment);
    const unsafeRes = await this._rpcRequest("getVoteAccounts", args);
    const res = create(unsafeRes, GetVoteAccounts);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get vote accounts");
    }
    return res.result;
  }
  /**
   * Fetch the current slot that the node is processing
   */
  async getSlot(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("getSlot", args);
    const res = create(unsafeRes, jsonRpcResult(number()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get slot");
    }
    return res.result;
  }
  /**
   * Fetch the current slot leader of the cluster
   */
  async getSlotLeader(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("getSlotLeader", args);
    const res = create(unsafeRes, jsonRpcResult(string()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get slot leader");
    }
    return res.result;
  }
  /**
   * Fetch `limit` number of slot leaders starting from `startSlot`
   *
   * @param startSlot fetch slot leaders starting from this slot
   * @param limit number of slot leaders to return
   */
  async getSlotLeaders(startSlot, limit) {
    const args = [startSlot, limit];
    const unsafeRes = await this._rpcRequest("getSlotLeaders", args);
    const res = create(unsafeRes, jsonRpcResult(array(PublicKeyFromString)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get slot leaders");
    }
    return res.result;
  }
  /**
   * Fetch the current status of a signature
   */
  async getSignatureStatus(signature2, config) {
    const {
      context,
      value: values
    } = await this.getSignatureStatuses([signature2], config);
    assert(values.length === 1);
    const value = values[0];
    return {
      context,
      value
    };
  }
  /**
   * Fetch the current statuses of a batch of signatures
   */
  async getSignatureStatuses(signatures, config) {
    const params = [signatures];
    if (config) {
      params.push(config);
    }
    const unsafeRes = await this._rpcRequest("getSignatureStatuses", params);
    const res = create(unsafeRes, GetSignatureStatusesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get signature status");
    }
    return res.result;
  }
  /**
   * Fetch the current transaction count of the cluster
   */
  async getTransactionCount(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("getTransactionCount", args);
    const res = create(unsafeRes, jsonRpcResult(number()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get transaction count");
    }
    return res.result;
  }
  /**
   * Fetch the current total currency supply of the cluster in lamports
   *
   * @deprecated Deprecated since RPC v1.2.8. Please use {@link getSupply} instead.
   */
  async getTotalSupply(commitment) {
    const result = await this.getSupply({
      commitment,
      excludeNonCirculatingAccountsList: true
    });
    return result.value.total;
  }
  /**
   * Fetch the cluster InflationGovernor parameters
   */
  async getInflationGovernor(commitment) {
    const args = this._buildArgs([], commitment);
    const unsafeRes = await this._rpcRequest("getInflationGovernor", args);
    const res = create(unsafeRes, GetInflationGovernorRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get inflation");
    }
    return res.result;
  }
  /**
   * Fetch the inflation reward for a list of addresses for an epoch
   */
  async getInflationReward(addresses, epoch, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([addresses.map((pubkey) => pubkey.toBase58())], commitment, void 0, {
      ...config,
      epoch: epoch != null ? epoch : config == null ? void 0 : config.epoch
    });
    const unsafeRes = await this._rpcRequest("getInflationReward", args);
    const res = create(unsafeRes, GetInflationRewardResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get inflation reward");
    }
    return res.result;
  }
  /**
   * Fetch the specific inflation values for the current epoch
   */
  async getInflationRate() {
    const unsafeRes = await this._rpcRequest("getInflationRate", []);
    const res = create(unsafeRes, GetInflationRateRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get inflation rate");
    }
    return res.result;
  }
  /**
   * Fetch the Epoch Info parameters
   */
  async getEpochInfo(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("getEpochInfo", args);
    const res = create(unsafeRes, GetEpochInfoRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get epoch info");
    }
    return res.result;
  }
  /**
   * Fetch the Epoch Schedule parameters
   */
  async getEpochSchedule() {
    const unsafeRes = await this._rpcRequest("getEpochSchedule", []);
    const res = create(unsafeRes, GetEpochScheduleRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get epoch schedule");
    }
    const epochSchedule = res.result;
    return new EpochSchedule(epochSchedule.slotsPerEpoch, epochSchedule.leaderScheduleSlotOffset, epochSchedule.warmup, epochSchedule.firstNormalEpoch, epochSchedule.firstNormalSlot);
  }
  /**
   * Fetch the leader schedule for the current epoch
   * @return {Promise<RpcResponseAndContext<LeaderSchedule>>}
   */
  async getLeaderSchedule() {
    const unsafeRes = await this._rpcRequest("getLeaderSchedule", []);
    const res = create(unsafeRes, GetLeaderScheduleRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get leader schedule");
    }
    return res.result;
  }
  /**
   * Fetch the minimum balance needed to exempt an account of `dataLength`
   * size from rent
   */
  async getMinimumBalanceForRentExemption(dataLength, commitment) {
    const args = this._buildArgs([dataLength], commitment);
    const unsafeRes = await this._rpcRequest("getMinimumBalanceForRentExemption", args);
    const res = create(unsafeRes, GetMinimumBalanceForRentExemptionRpcResult);
    if ("error" in res) {
      console.warn("Unable to fetch minimum balance for rent exemption");
      return 0;
    }
    return res.result;
  }
  /**
   * Fetch a recent blockhash from the cluster, return with context
   * @return {Promise<RpcResponseAndContext<{blockhash: Blockhash, feeCalculator: FeeCalculator}>>}
   *
   * @deprecated Deprecated since RPC v1.9.0. Please use {@link getLatestBlockhash} instead.
   */
  async getRecentBlockhashAndContext(commitment) {
    const {
      context,
      value: {
        blockhash
      }
    } = await this.getLatestBlockhashAndContext(commitment);
    const feeCalculator = {
      get lamportsPerSignature() {
        throw new Error("The capability to fetch `lamportsPerSignature` using the `getRecentBlockhash` API is no longer offered by the network. Use the `getFeeForMessage` API to obtain the fee for a given message.");
      },
      toJSON() {
        return {};
      }
    };
    return {
      context,
      value: {
        blockhash,
        feeCalculator
      }
    };
  }
  /**
   * Fetch recent performance samples
   * @return {Promise<Array<PerfSample>>}
   */
  async getRecentPerformanceSamples(limit) {
    const unsafeRes = await this._rpcRequest("getRecentPerformanceSamples", limit ? [limit] : []);
    const res = create(unsafeRes, GetRecentPerformanceSamplesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get recent performance samples");
    }
    return res.result;
  }
  /**
   * Fetch the fee calculator for a recent blockhash from the cluster, return with context
   *
   * @deprecated Deprecated since RPC v1.9.0. Please use {@link getFeeForMessage} instead.
   */
  async getFeeCalculatorForBlockhash(blockhash, commitment) {
    const args = this._buildArgs([blockhash], commitment);
    const unsafeRes = await this._rpcRequest("getFeeCalculatorForBlockhash", args);
    const res = create(unsafeRes, GetFeeCalculatorRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get fee calculator");
    }
    const {
      context,
      value
    } = res.result;
    return {
      context,
      value: value !== null ? value.feeCalculator : null
    };
  }
  /**
   * Fetch the fee for a message from the cluster, return with context
   */
  async getFeeForMessage(message, commitment) {
    const wireMessage = toBuffer(message.serialize()).toString("base64");
    const args = this._buildArgs([wireMessage], commitment);
    const unsafeRes = await this._rpcRequest("getFeeForMessage", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(nullable(number())));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get fee for message");
    }
    if (res.result === null) {
      throw new Error("invalid blockhash");
    }
    return res.result;
  }
  /**
   * Fetch a list of prioritization fees from recent blocks.
   */
  async getRecentPrioritizationFees(config) {
    var _a;
    const accounts = (_a = config == null ? void 0 : config.lockedWritableAccounts) == null ? void 0 : _a.map((key) => key.toBase58());
    const args = (accounts == null ? void 0 : accounts.length) ? [accounts] : [];
    const unsafeRes = await this._rpcRequest("getRecentPrioritizationFees", args);
    const res = create(unsafeRes, GetRecentPrioritizationFeesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get recent prioritization fees");
    }
    return res.result;
  }
  /**
   * Fetch a recent blockhash from the cluster
   * @return {Promise<{blockhash: Blockhash, feeCalculator: FeeCalculator}>}
   *
   * @deprecated Deprecated since RPC v1.8.0. Please use {@link getLatestBlockhash} instead.
   */
  async getRecentBlockhash(commitment) {
    try {
      const res = await this.getRecentBlockhashAndContext(commitment);
      return res.value;
    } catch (e) {
      throw new Error("failed to get recent blockhash: " + e);
    }
  }
  /**
   * Fetch the latest blockhash from the cluster
   * @return {Promise<BlockhashWithExpiryBlockHeight>}
   */
  async getLatestBlockhash(commitmentOrConfig) {
    try {
      const res = await this.getLatestBlockhashAndContext(commitmentOrConfig);
      return res.value;
    } catch (e) {
      throw new Error("failed to get recent blockhash: " + e);
    }
  }
  /**
   * Fetch the latest blockhash from the cluster
   * @return {Promise<BlockhashWithExpiryBlockHeight>}
   */
  async getLatestBlockhashAndContext(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("getLatestBlockhash", args);
    const res = create(unsafeRes, GetLatestBlockhashRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get latest blockhash");
    }
    return res.result;
  }
  /**
   * Returns whether a blockhash is still valid or not
   */
  async isBlockhashValid(blockhash, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const args = this._buildArgs([blockhash], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("isBlockhashValid", args);
    const res = create(unsafeRes, IsBlockhashValidRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to determine if the blockhash `" + blockhash + "`is valid");
    }
    return res.result;
  }
  /**
   * Fetch the node version
   */
  async getVersion() {
    const unsafeRes = await this._rpcRequest("getVersion", []);
    const res = create(unsafeRes, jsonRpcResult(VersionResult));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get version");
    }
    return res.result;
  }
  /**
   * Fetch the genesis hash
   */
  async getGenesisHash() {
    const unsafeRes = await this._rpcRequest("getGenesisHash", []);
    const res = create(unsafeRes, jsonRpcResult(string()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get genesis hash");
    }
    return res.result;
  }
  /**
   * Fetch a processed block from the cluster.
   *
   * @deprecated Instead, call `getBlock` using a `GetVersionedBlockConfig` by
   * setting the `maxSupportedTransactionVersion` property.
   */
  /**
   * @deprecated Instead, call `getBlock` using a `GetVersionedBlockConfig` by
   * setting the `maxSupportedTransactionVersion` property.
   */
  // eslint-disable-next-line no-dupe-class-members
  /**
   * @deprecated Instead, call `getBlock` using a `GetVersionedBlockConfig` by
   * setting the `maxSupportedTransactionVersion` property.
   */
  // eslint-disable-next-line no-dupe-class-members
  /**
   * Fetch a processed block from the cluster.
   */
  // eslint-disable-next-line no-dupe-class-members
  // eslint-disable-next-line no-dupe-class-members
  // eslint-disable-next-line no-dupe-class-members
  /**
   * Fetch a processed block from the cluster.
   */
  // eslint-disable-next-line no-dupe-class-members
  async getBlock(slot, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const args = this._buildArgsAtLeastConfirmed([slot], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("getBlock", args);
    try {
      switch (config == null ? void 0 : config.transactionDetails) {
        case "accounts": {
          const res = create(unsafeRes, GetAccountsModeBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
        case "none": {
          const res = create(unsafeRes, GetNoneModeBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
        default: {
          const res = create(unsafeRes, GetBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          const {
            result
          } = res;
          return result ? {
            ...result,
            transactions: result.transactions.map(({
              transaction,
              meta,
              version
            }) => ({
              meta,
              transaction: {
                ...transaction,
                message: versionedMessageFromResponse(version, transaction.message)
              },
              version
            }))
          } : null;
        }
      }
    } catch (e) {
      throw new SolanaJSONRPCError(e, "failed to get confirmed block");
    }
  }
  /**
   * Fetch parsed transaction details for a confirmed or finalized block
   */
  // eslint-disable-next-line no-dupe-class-members
  // eslint-disable-next-line no-dupe-class-members
  // eslint-disable-next-line no-dupe-class-members
  async getParsedBlock(slot, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const args = this._buildArgsAtLeastConfirmed([slot], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getBlock", args);
    try {
      switch (config == null ? void 0 : config.transactionDetails) {
        case "accounts": {
          const res = create(unsafeRes, GetParsedAccountsModeBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
        case "none": {
          const res = create(unsafeRes, GetParsedNoneModeBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
        default: {
          const res = create(unsafeRes, GetParsedBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
      }
    } catch (e) {
      throw new SolanaJSONRPCError(e, "failed to get block");
    }
  }
  /*
   * Returns recent block production information from the current or previous epoch
   */
  async getBlockProduction(configOrCommitment) {
    let extra;
    let commitment;
    if (typeof configOrCommitment === "string") {
      commitment = configOrCommitment;
    } else if (configOrCommitment) {
      const {
        commitment: c,
        ...rest
      } = configOrCommitment;
      commitment = c;
      extra = rest;
    }
    const args = this._buildArgs([], commitment, "base64", extra);
    const unsafeRes = await this._rpcRequest("getBlockProduction", args);
    const res = create(unsafeRes, BlockProductionResponseStruct);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get block production information");
    }
    return res.result;
  }
  /**
   * Fetch a confirmed or finalized transaction from the cluster.
   *
   * @deprecated Instead, call `getTransaction` using a
   * `GetVersionedTransactionConfig` by setting the
   * `maxSupportedTransactionVersion` property.
   */
  /**
   * Fetch a confirmed or finalized transaction from the cluster.
   */
  // eslint-disable-next-line no-dupe-class-members
  /**
   * Fetch a confirmed or finalized transaction from the cluster.
   */
  // eslint-disable-next-line no-dupe-class-members
  async getTransaction(signature2, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const args = this._buildArgsAtLeastConfirmed([signature2], commitment, void 0, config);
    const unsafeRes = await this._rpcRequest("getTransaction", args);
    const res = create(unsafeRes, GetTransactionRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get transaction");
    }
    const result = res.result;
    if (!result) return result;
    return {
      ...result,
      transaction: {
        ...result.transaction,
        message: versionedMessageFromResponse(result.version, result.transaction.message)
      }
    };
  }
  /**
   * Fetch parsed transaction details for a confirmed or finalized transaction
   */
  async getParsedTransaction(signature2, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgsAtLeastConfirmed([signature2], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getTransaction", args);
    const res = create(unsafeRes, GetParsedTransactionRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get transaction");
    }
    return res.result;
  }
  /**
   * Fetch parsed transaction details for a batch of confirmed transactions
   */
  async getParsedTransactions(signatures, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const batch = signatures.map((signature2) => {
      const args = this._buildArgsAtLeastConfirmed([signature2], commitment, "jsonParsed", config);
      return {
        methodName: "getTransaction",
        args
      };
    });
    const unsafeRes = await this._rpcBatchRequest(batch);
    const res = unsafeRes.map((unsafeRes2) => {
      const res2 = create(unsafeRes2, GetParsedTransactionRpcResult);
      if ("error" in res2) {
        throw new SolanaJSONRPCError(res2.error, "failed to get transactions");
      }
      return res2.result;
    });
    return res;
  }
  /**
   * Fetch transaction details for a batch of confirmed transactions.
   * Similar to {@link getParsedTransactions} but returns a {@link TransactionResponse}.
   *
   * @deprecated Instead, call `getTransactions` using a
   * `GetVersionedTransactionConfig` by setting the
   * `maxSupportedTransactionVersion` property.
   */
  /**
   * Fetch transaction details for a batch of confirmed transactions.
   * Similar to {@link getParsedTransactions} but returns a {@link
   * VersionedTransactionResponse}.
   */
  // eslint-disable-next-line no-dupe-class-members
  /**
   * Fetch transaction details for a batch of confirmed transactions.
   * Similar to {@link getParsedTransactions} but returns a {@link
   * VersionedTransactionResponse}.
   */
  // eslint-disable-next-line no-dupe-class-members
  async getTransactions(signatures, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const batch = signatures.map((signature2) => {
      const args = this._buildArgsAtLeastConfirmed([signature2], commitment, void 0, config);
      return {
        methodName: "getTransaction",
        args
      };
    });
    const unsafeRes = await this._rpcBatchRequest(batch);
    const res = unsafeRes.map((unsafeRes2) => {
      const res2 = create(unsafeRes2, GetTransactionRpcResult);
      if ("error" in res2) {
        throw new SolanaJSONRPCError(res2.error, "failed to get transactions");
      }
      const result = res2.result;
      if (!result) return result;
      return {
        ...result,
        transaction: {
          ...result.transaction,
          message: versionedMessageFromResponse(result.version, result.transaction.message)
        }
      };
    });
    return res;
  }
  /**
   * Fetch a list of Transactions and transaction statuses from the cluster
   * for a confirmed block.
   *
   * @deprecated Deprecated since RPC v1.7.0. Please use {@link getBlock} instead.
   */
  async getConfirmedBlock(slot, commitment) {
    const args = this._buildArgsAtLeastConfirmed([slot], commitment);
    const unsafeRes = await this._rpcRequest("getBlock", args);
    const res = create(unsafeRes, GetConfirmedBlockRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get confirmed block");
    }
    const result = res.result;
    if (!result) {
      throw new Error("Confirmed block " + slot + " not found");
    }
    const block = {
      ...result,
      transactions: result.transactions.map(({
        transaction,
        meta
      }) => {
        const message = new Message(transaction.message);
        return {
          meta,
          transaction: {
            ...transaction,
            message
          }
        };
      })
    };
    return {
      ...block,
      transactions: block.transactions.map(({
        transaction,
        meta
      }) => {
        return {
          meta,
          transaction: Transaction.populate(transaction.message, transaction.signatures)
        };
      })
    };
  }
  /**
   * Fetch confirmed blocks between two slots
   */
  async getBlocks(startSlot, endSlot, commitment) {
    const args = this._buildArgsAtLeastConfirmed(endSlot !== void 0 ? [startSlot, endSlot] : [startSlot], commitment);
    const unsafeRes = await this._rpcRequest("getBlocks", args);
    const res = create(unsafeRes, jsonRpcResult(array(number())));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get blocks");
    }
    return res.result;
  }
  /**
   * Fetch a list of Signatures from the cluster for a block, excluding rewards
   */
  async getBlockSignatures(slot, commitment) {
    const args = this._buildArgsAtLeastConfirmed([slot], commitment, void 0, {
      transactionDetails: "signatures",
      rewards: false
    });
    const unsafeRes = await this._rpcRequest("getBlock", args);
    const res = create(unsafeRes, GetBlockSignaturesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get block");
    }
    const result = res.result;
    if (!result) {
      throw new Error("Block " + slot + " not found");
    }
    return result;
  }
  /**
   * Fetch a list of Signatures from the cluster for a confirmed block, excluding rewards
   *
   * @deprecated Deprecated since RPC v1.7.0. Please use {@link getBlockSignatures} instead.
   */
  async getConfirmedBlockSignatures(slot, commitment) {
    const args = this._buildArgsAtLeastConfirmed([slot], commitment, void 0, {
      transactionDetails: "signatures",
      rewards: false
    });
    const unsafeRes = await this._rpcRequest("getBlock", args);
    const res = create(unsafeRes, GetBlockSignaturesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get confirmed block");
    }
    const result = res.result;
    if (!result) {
      throw new Error("Confirmed block " + slot + " not found");
    }
    return result;
  }
  /**
   * Fetch a transaction details for a confirmed transaction
   *
   * @deprecated Deprecated since RPC v1.7.0. Please use {@link getTransaction} instead.
   */
  async getConfirmedTransaction(signature2, commitment) {
    const args = this._buildArgsAtLeastConfirmed([signature2], commitment);
    const unsafeRes = await this._rpcRequest("getTransaction", args);
    const res = create(unsafeRes, GetTransactionRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get transaction");
    }
    const result = res.result;
    if (!result) return result;
    const message = new Message(result.transaction.message);
    const signatures = result.transaction.signatures;
    return {
      ...result,
      transaction: Transaction.populate(message, signatures)
    };
  }
  /**
   * Fetch parsed transaction details for a confirmed transaction
   *
   * @deprecated Deprecated since RPC v1.7.0. Please use {@link getParsedTransaction} instead.
   */
  async getParsedConfirmedTransaction(signature2, commitment) {
    const args = this._buildArgsAtLeastConfirmed([signature2], commitment, "jsonParsed");
    const unsafeRes = await this._rpcRequest("getTransaction", args);
    const res = create(unsafeRes, GetParsedTransactionRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get confirmed transaction");
    }
    return res.result;
  }
  /**
   * Fetch parsed transaction details for a batch of confirmed transactions
   *
   * @deprecated Deprecated since RPC v1.7.0. Please use {@link getParsedTransactions} instead.
   */
  async getParsedConfirmedTransactions(signatures, commitment) {
    const batch = signatures.map((signature2) => {
      const args = this._buildArgsAtLeastConfirmed([signature2], commitment, "jsonParsed");
      return {
        methodName: "getTransaction",
        args
      };
    });
    const unsafeRes = await this._rpcBatchRequest(batch);
    const res = unsafeRes.map((unsafeRes2) => {
      const res2 = create(unsafeRes2, GetParsedTransactionRpcResult);
      if ("error" in res2) {
        throw new SolanaJSONRPCError(res2.error, "failed to get confirmed transactions");
      }
      return res2.result;
    });
    return res;
  }
  /**
   * Fetch a list of all the confirmed signatures for transactions involving an address
   * within a specified slot range. Max range allowed is 10,000 slots.
   *
   * @deprecated Deprecated since RPC v1.3. Please use {@link getConfirmedSignaturesForAddress2} instead.
   *
   * @param address queried address
   * @param startSlot start slot, inclusive
   * @param endSlot end slot, inclusive
   */
  async getConfirmedSignaturesForAddress(address, startSlot, endSlot) {
    let options = {};
    let firstAvailableBlock = await this.getFirstAvailableBlock();
    while (!("until" in options)) {
      startSlot--;
      if (startSlot <= 0 || startSlot < firstAvailableBlock) {
        break;
      }
      try {
        const block = await this.getConfirmedBlockSignatures(startSlot, "finalized");
        if (block.signatures.length > 0) {
          options.until = block.signatures[block.signatures.length - 1].toString();
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("skipped")) {
          continue;
        } else {
          throw err;
        }
      }
    }
    let highestConfirmedRoot = await this.getSlot("finalized");
    while (!("before" in options)) {
      endSlot++;
      if (endSlot > highestConfirmedRoot) {
        break;
      }
      try {
        const block = await this.getConfirmedBlockSignatures(endSlot);
        if (block.signatures.length > 0) {
          options.before = block.signatures[block.signatures.length - 1].toString();
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("skipped")) {
          continue;
        } else {
          throw err;
        }
      }
    }
    const confirmedSignatureInfo = await this.getConfirmedSignaturesForAddress2(address, options);
    return confirmedSignatureInfo.map((info) => info.signature);
  }
  /**
   * Returns confirmed signatures for transactions involving an
   * address backwards in time from the provided signature or most recent confirmed block
   *
   * @deprecated Deprecated since RPC v1.7.0. Please use {@link getSignaturesForAddress} instead.
   */
  async getConfirmedSignaturesForAddress2(address, options, commitment) {
    const args = this._buildArgsAtLeastConfirmed([address.toBase58()], commitment, void 0, options);
    const unsafeRes = await this._rpcRequest("getConfirmedSignaturesForAddress2", args);
    const res = create(unsafeRes, GetConfirmedSignaturesForAddress2RpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get confirmed signatures for address");
    }
    return res.result;
  }
  /**
   * Returns confirmed signatures for transactions involving an
   * address backwards in time from the provided signature or most recent confirmed block
   *
   *
   * @param address queried address
   * @param options
   */
  async getSignaturesForAddress(address, options, commitment) {
    const args = this._buildArgsAtLeastConfirmed([address.toBase58()], commitment, void 0, options);
    const unsafeRes = await this._rpcRequest("getSignaturesForAddress", args);
    const res = create(unsafeRes, GetSignaturesForAddressRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get signatures for address");
    }
    return res.result;
  }
  async getAddressLookupTable(accountKey, config) {
    const {
      context,
      value: accountInfo
    } = await this.getAccountInfoAndContext(accountKey, config);
    let value = null;
    if (accountInfo !== null) {
      value = new AddressLookupTableAccount({
        key: accountKey,
        state: AddressLookupTableAccount.deserialize(accountInfo.data)
      });
    }
    return {
      context,
      value
    };
  }
  /**
   * Fetch the contents of a Nonce account from the cluster, return with context
   */
  async getNonceAndContext(nonceAccount, commitmentOrConfig) {
    const {
      context,
      value: accountInfo
    } = await this.getAccountInfoAndContext(nonceAccount, commitmentOrConfig);
    let value = null;
    if (accountInfo !== null) {
      value = NonceAccount.fromAccountData(accountInfo.data);
    }
    return {
      context,
      value
    };
  }
  /**
   * Fetch the contents of a Nonce account from the cluster
   */
  async getNonce(nonceAccount, commitmentOrConfig) {
    return await this.getNonceAndContext(nonceAccount, commitmentOrConfig).then((x) => x.value).catch((e) => {
      throw new Error("failed to get nonce for account " + nonceAccount.toBase58() + ": " + e);
    });
  }
  /**
   * Request an allocation of lamports to the specified address
   *
   * ```typescript
   * import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
   *
   * (async () => {
   *   const connection = new Connection("https://api.testnet.solana.com", "confirmed");
   *   const myAddress = new PublicKey("2nr1bHFT86W9tGnyvmYW4vcHKsQB3sVQfnddasz4kExM");
   *   const signature = await connection.requestAirdrop(myAddress, LAMPORTS_PER_SOL);
   *   await connection.confirmTransaction(signature);
   * })();
   * ```
   */
  async requestAirdrop(to, lamports) {
    const unsafeRes = await this._rpcRequest("requestAirdrop", [to.toBase58(), lamports]);
    const res = create(unsafeRes, RequestAirdropRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `airdrop to ${to.toBase58()} failed`);
    }
    return res.result;
  }
  /**
   * @internal
   */
  async _blockhashWithExpiryBlockHeight(disableCache) {
    if (!disableCache) {
      while (this._pollingBlockhash) {
        await sleep(100);
      }
      const timeSinceFetch = Date.now() - this._blockhashInfo.lastFetch;
      const expired = timeSinceFetch >= BLOCKHASH_CACHE_TIMEOUT_MS;
      if (this._blockhashInfo.latestBlockhash !== null && !expired) {
        return this._blockhashInfo.latestBlockhash;
      }
    }
    return await this._pollNewBlockhash();
  }
  /**
   * @internal
   */
  async _pollNewBlockhash() {
    this._pollingBlockhash = true;
    try {
      const startTime = Date.now();
      const cachedLatestBlockhash = this._blockhashInfo.latestBlockhash;
      const cachedBlockhash = cachedLatestBlockhash ? cachedLatestBlockhash.blockhash : null;
      for (let i = 0; i < 50; i++) {
        const latestBlockhash = await this.getLatestBlockhash("finalized");
        if (cachedBlockhash !== latestBlockhash.blockhash) {
          this._blockhashInfo = {
            latestBlockhash,
            lastFetch: Date.now(),
            transactionSignatures: [],
            simulatedSignatures: []
          };
          return latestBlockhash;
        }
        await sleep(MS_PER_SLOT / 2);
      }
      throw new Error(`Unable to obtain a new blockhash after ${Date.now() - startTime}ms`);
    } finally {
      this._pollingBlockhash = false;
    }
  }
  /**
   * get the stake minimum delegation
   */
  async getStakeMinimumDelegation(config) {
    const {
      commitment,
      config: configArg
    } = extractCommitmentFromConfig(config);
    const args = this._buildArgs([], commitment, "base64", configArg);
    const unsafeRes = await this._rpcRequest("getStakeMinimumDelegation", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(number()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get stake minimum delegation`);
    }
    return res.result;
  }
  /**
   * Simulate a transaction
   *
   * @deprecated Instead, call {@link simulateTransaction} with {@link
   * VersionedTransaction} and {@link SimulateTransactionConfig} parameters
   */
  /**
   * Simulate a transaction
   */
  // eslint-disable-next-line no-dupe-class-members
  /**
   * Simulate a transaction
   */
  // eslint-disable-next-line no-dupe-class-members
  async simulateTransaction(transactionOrMessage, configOrSigners, includeAccounts) {
    if ("message" in transactionOrMessage) {
      const versionedTx = transactionOrMessage;
      const wireTransaction2 = versionedTx.serialize();
      const encodedTransaction2 = Buffer$1.from(wireTransaction2).toString("base64");
      if (Array.isArray(configOrSigners) || includeAccounts !== void 0) {
        throw new Error("Invalid arguments");
      }
      const config2 = configOrSigners || {};
      config2.encoding = "base64";
      if (!("commitment" in config2)) {
        config2.commitment = this.commitment;
      }
      if (configOrSigners && typeof configOrSigners === "object" && "innerInstructions" in configOrSigners) {
        config2.innerInstructions = configOrSigners.innerInstructions;
      }
      const args2 = [encodedTransaction2, config2];
      const unsafeRes2 = await this._rpcRequest("simulateTransaction", args2);
      const res2 = create(unsafeRes2, SimulatedTransactionResponseStruct);
      if ("error" in res2) {
        throw new Error("failed to simulate transaction: " + res2.error.message);
      }
      return res2.result;
    }
    let transaction;
    if (transactionOrMessage instanceof Transaction) {
      let originalTx = transactionOrMessage;
      transaction = new Transaction();
      transaction.feePayer = originalTx.feePayer;
      transaction.instructions = transactionOrMessage.instructions;
      transaction.nonceInfo = originalTx.nonceInfo;
      transaction.signatures = originalTx.signatures;
    } else {
      transaction = Transaction.populate(transactionOrMessage);
      transaction._message = transaction._json = void 0;
    }
    if (configOrSigners !== void 0 && !Array.isArray(configOrSigners)) {
      throw new Error("Invalid arguments");
    }
    const signers = configOrSigners;
    if (transaction.nonceInfo && signers) {
      transaction.sign(...signers);
    } else {
      let disableCache = this._disableBlockhashCaching;
      for (; ; ) {
        const latestBlockhash = await this._blockhashWithExpiryBlockHeight(disableCache);
        transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
        transaction.recentBlockhash = latestBlockhash.blockhash;
        if (!signers) break;
        transaction.sign(...signers);
        if (!transaction.signature) {
          throw new Error("!signature");
        }
        const signature2 = transaction.signature.toString("base64");
        if (!this._blockhashInfo.simulatedSignatures.includes(signature2) && !this._blockhashInfo.transactionSignatures.includes(signature2)) {
          this._blockhashInfo.simulatedSignatures.push(signature2);
          break;
        } else {
          disableCache = true;
        }
      }
    }
    const message = transaction._compile();
    const signData = message.serialize();
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config = {
      encoding: "base64",
      commitment: this.commitment
    };
    if (includeAccounts) {
      const addresses = (Array.isArray(includeAccounts) ? includeAccounts : message.nonProgramIds()).map((key) => key.toBase58());
      config["accounts"] = {
        encoding: "base64",
        addresses
      };
    }
    if (signers) {
      config.sigVerify = true;
    }
    if (configOrSigners && typeof configOrSigners === "object" && "innerInstructions" in configOrSigners) {
      config.innerInstructions = configOrSigners.innerInstructions;
    }
    const args = [encodedTransaction, config];
    const unsafeRes = await this._rpcRequest("simulateTransaction", args);
    const res = create(unsafeRes, SimulatedTransactionResponseStruct);
    if ("error" in res) {
      let logs;
      if ("data" in res.error) {
        logs = res.error.data.logs;
        if (logs && Array.isArray(logs)) {
          const traceIndent = "\n    ";
          const logTrace = traceIndent + logs.join(traceIndent);
          console.error(res.error.message, logTrace);
        }
      }
      throw new SendTransactionError({
        action: "simulate",
        signature: "",
        transactionMessage: res.error.message,
        logs
      });
    }
    return res.result;
  }
  /**
   * Sign and send a transaction
   *
   * @deprecated Instead, call {@link sendTransaction} with a {@link
   * VersionedTransaction}
   */
  /**
   * Send a signed transaction
   */
  // eslint-disable-next-line no-dupe-class-members
  /**
   * Sign and send a transaction
   */
  // eslint-disable-next-line no-dupe-class-members
  async sendTransaction(transaction, signersOrOptions, options) {
    if ("version" in transaction) {
      if (signersOrOptions && Array.isArray(signersOrOptions)) {
        throw new Error("Invalid arguments");
      }
      const wireTransaction2 = transaction.serialize();
      return await this.sendRawTransaction(wireTransaction2, signersOrOptions);
    }
    if (signersOrOptions === void 0 || !Array.isArray(signersOrOptions)) {
      throw new Error("Invalid arguments");
    }
    const signers = signersOrOptions;
    if (transaction.nonceInfo) {
      transaction.sign(...signers);
    } else {
      let disableCache = this._disableBlockhashCaching;
      for (; ; ) {
        const latestBlockhash = await this._blockhashWithExpiryBlockHeight(disableCache);
        transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.sign(...signers);
        if (!transaction.signature) {
          throw new Error("!signature");
        }
        const signature2 = transaction.signature.toString("base64");
        if (!this._blockhashInfo.transactionSignatures.includes(signature2)) {
          this._blockhashInfo.transactionSignatures.push(signature2);
          break;
        } else {
          disableCache = true;
        }
      }
    }
    const wireTransaction = transaction.serialize();
    return await this.sendRawTransaction(wireTransaction, options);
  }
  /**
   * Send a transaction that has already been signed and serialized into the
   * wire format
   */
  async sendRawTransaction(rawTransaction, options) {
    const encodedTransaction = toBuffer(rawTransaction).toString("base64");
    const result = await this.sendEncodedTransaction(encodedTransaction, options);
    return result;
  }
  /**
   * Send a transaction that has already been signed, serialized into the
   * wire format, and encoded as a base64 string
   */
  async sendEncodedTransaction(encodedTransaction, options) {
    const config = {
      encoding: "base64"
    };
    const skipPreflight = options && options.skipPreflight;
    const preflightCommitment = skipPreflight === true ? "processed" : options && options.preflightCommitment || this.commitment;
    if (options && options.maxRetries != null) {
      config.maxRetries = options.maxRetries;
    }
    if (options && options.minContextSlot != null) {
      config.minContextSlot = options.minContextSlot;
    }
    if (skipPreflight) {
      config.skipPreflight = skipPreflight;
    }
    if (preflightCommitment) {
      config.preflightCommitment = preflightCommitment;
    }
    const args = [encodedTransaction, config];
    const unsafeRes = await this._rpcRequest("sendTransaction", args);
    const res = create(unsafeRes, SendTransactionRpcResult);
    if ("error" in res) {
      let logs = void 0;
      if ("data" in res.error) {
        logs = res.error.data.logs;
      }
      throw new SendTransactionError({
        action: skipPreflight ? "send" : "simulate",
        signature: "",
        transactionMessage: res.error.message,
        logs
      });
    }
    return res.result;
  }
  /**
   * @internal
   */
  _wsOnOpen() {
    this._rpcWebSocketConnected = true;
    this._rpcWebSocketHeartbeat = setInterval(() => {
      (async () => {
        try {
          await this._rpcWebSocket.notify("ping");
        } catch {
        }
      })();
    }, 5e3);
    this._updateSubscriptions();
  }
  /**
   * @internal
   */
  _wsOnError(err) {
    this._rpcWebSocketConnected = false;
    console.error("ws error:", err.message);
  }
  /**
   * @internal
   */
  _wsOnClose(code) {
    this._rpcWebSocketConnected = false;
    this._rpcWebSocketGeneration = (this._rpcWebSocketGeneration + 1) % Number.MAX_SAFE_INTEGER;
    if (this._rpcWebSocketIdleTimeout) {
      clearTimeout(this._rpcWebSocketIdleTimeout);
      this._rpcWebSocketIdleTimeout = null;
    }
    if (this._rpcWebSocketHeartbeat) {
      clearInterval(this._rpcWebSocketHeartbeat);
      this._rpcWebSocketHeartbeat = null;
    }
    if (code === 1e3) {
      this._updateSubscriptions();
      return;
    }
    this._subscriptionCallbacksByServerSubscriptionId = {};
    Object.entries(this._subscriptionsByHash).forEach(([hash, subscription]) => {
      this._setSubscription(hash, {
        ...subscription,
        state: "pending"
      });
    });
  }
  /**
   * @internal
   */
  _setSubscription(hash, nextSubscription) {
    var _a;
    const prevState = (_a = this._subscriptionsByHash[hash]) == null ? void 0 : _a.state;
    this._subscriptionsByHash[hash] = nextSubscription;
    if (prevState !== nextSubscription.state) {
      const stateChangeCallbacks = this._subscriptionStateChangeCallbacksByHash[hash];
      if (stateChangeCallbacks) {
        stateChangeCallbacks.forEach((cb) => {
          try {
            cb(nextSubscription.state);
          } catch {
          }
        });
      }
    }
  }
  /**
   * @internal
   */
  _onSubscriptionStateChange(clientSubscriptionId, callback) {
    var _a;
    const hash = this._subscriptionHashByClientSubscriptionId[clientSubscriptionId];
    if (hash == null) {
      return () => {
      };
    }
    const stateChangeCallbacks = (_a = this._subscriptionStateChangeCallbacksByHash)[hash] || (_a[hash] = /* @__PURE__ */ new Set());
    stateChangeCallbacks.add(callback);
    return () => {
      stateChangeCallbacks.delete(callback);
      if (stateChangeCallbacks.size === 0) {
        delete this._subscriptionStateChangeCallbacksByHash[hash];
      }
    };
  }
  /**
   * @internal
   */
  async _updateSubscriptions() {
    if (Object.keys(this._subscriptionsByHash).length === 0) {
      if (this._rpcWebSocketConnected) {
        this._rpcWebSocketConnected = false;
        this._rpcWebSocketIdleTimeout = setTimeout(() => {
          this._rpcWebSocketIdleTimeout = null;
          try {
            this._rpcWebSocket.close();
          } catch (err) {
            if (err instanceof Error) {
              console.log(`Error when closing socket connection: ${err.message}`);
            }
          }
        }, 500);
      }
      return;
    }
    if (this._rpcWebSocketIdleTimeout !== null) {
      clearTimeout(this._rpcWebSocketIdleTimeout);
      this._rpcWebSocketIdleTimeout = null;
      this._rpcWebSocketConnected = true;
    }
    if (!this._rpcWebSocketConnected) {
      this._rpcWebSocket.connect();
      return;
    }
    const activeWebSocketGeneration = this._rpcWebSocketGeneration;
    const isCurrentConnectionStillActive = () => {
      return activeWebSocketGeneration === this._rpcWebSocketGeneration;
    };
    await Promise.all(
      // Don't be tempted to change this to `Object.entries`. We call
      // `_updateSubscriptions` recursively when processing the state,
      // so it's important that we look up the *current* version of
      // each subscription, every time we process a hash.
      Object.keys(this._subscriptionsByHash).map(async (hash) => {
        const subscription = this._subscriptionsByHash[hash];
        if (subscription === void 0) {
          return;
        }
        switch (subscription.state) {
          case "pending":
          case "unsubscribed":
            if (subscription.callbacks.size === 0) {
              delete this._subscriptionsByHash[hash];
              if (subscription.state === "unsubscribed") {
                delete this._subscriptionCallbacksByServerSubscriptionId[subscription.serverSubscriptionId];
              }
              await this._updateSubscriptions();
              return;
            }
            await (async () => {
              const {
                args,
                method
              } = subscription;
              try {
                this._setSubscription(hash, {
                  ...subscription,
                  state: "subscribing"
                });
                const serverSubscriptionId = await this._rpcWebSocket.call(method, args);
                this._setSubscription(hash, {
                  ...subscription,
                  serverSubscriptionId,
                  state: "subscribed"
                });
                this._subscriptionCallbacksByServerSubscriptionId[serverSubscriptionId] = subscription.callbacks;
                await this._updateSubscriptions();
              } catch (e) {
                console.error(`Received ${e instanceof Error ? "" : "JSON-RPC "}error calling \`${method}\``, {
                  args,
                  error: e
                });
                if (!isCurrentConnectionStillActive()) {
                  return;
                }
                this._setSubscription(hash, {
                  ...subscription,
                  state: "pending"
                });
                await this._updateSubscriptions();
              }
            })();
            break;
          case "subscribed":
            if (subscription.callbacks.size === 0) {
              await (async () => {
                const {
                  serverSubscriptionId,
                  unsubscribeMethod
                } = subscription;
                if (this._subscriptionsAutoDisposedByRpc.has(serverSubscriptionId)) {
                  this._subscriptionsAutoDisposedByRpc.delete(serverSubscriptionId);
                } else {
                  this._setSubscription(hash, {
                    ...subscription,
                    state: "unsubscribing"
                  });
                  this._setSubscription(hash, {
                    ...subscription,
                    state: "unsubscribing"
                  });
                  try {
                    await this._rpcWebSocket.call(unsubscribeMethod, [serverSubscriptionId]);
                  } catch (e) {
                    if (e instanceof Error) {
                      console.error(`${unsubscribeMethod} error:`, e.message);
                    }
                    if (!isCurrentConnectionStillActive()) {
                      return;
                    }
                    this._setSubscription(hash, {
                      ...subscription,
                      state: "subscribed"
                    });
                    await this._updateSubscriptions();
                    return;
                  }
                }
                this._setSubscription(hash, {
                  ...subscription,
                  state: "unsubscribed"
                });
                await this._updateSubscriptions();
              })();
            }
            break;
        }
      })
    );
  }
  /**
   * @internal
   */
  _handleServerNotification(serverSubscriptionId, callbackArgs) {
    const callbacks = this._subscriptionCallbacksByServerSubscriptionId[serverSubscriptionId];
    if (callbacks === void 0) {
      return;
    }
    callbacks.forEach((cb) => {
      try {
        cb(
          ...callbackArgs
        );
      } catch (e) {
        console.error(e);
      }
    });
  }
  /**
   * @internal
   */
  _wsOnAccountNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, AccountNotificationResult);
    this._handleServerNotification(subscription, [result.value, result.context]);
  }
  /**
   * @internal
   */
  _makeSubscription(subscriptionConfig, args) {
    const clientSubscriptionId = this._nextClientSubscriptionId++;
    const hash = fastStableStringify([subscriptionConfig.method, args]);
    const existingSubscription = this._subscriptionsByHash[hash];
    if (existingSubscription === void 0) {
      this._subscriptionsByHash[hash] = {
        ...subscriptionConfig,
        args,
        callbacks: /* @__PURE__ */ new Set([subscriptionConfig.callback]),
        state: "pending"
      };
    } else {
      existingSubscription.callbacks.add(subscriptionConfig.callback);
    }
    this._subscriptionHashByClientSubscriptionId[clientSubscriptionId] = hash;
    this._subscriptionDisposeFunctionsByClientSubscriptionId[clientSubscriptionId] = async () => {
      delete this._subscriptionDisposeFunctionsByClientSubscriptionId[clientSubscriptionId];
      delete this._subscriptionHashByClientSubscriptionId[clientSubscriptionId];
      const subscription = this._subscriptionsByHash[hash];
      assert(subscription !== void 0, `Could not find a \`Subscription\` when tearing down client subscription #${clientSubscriptionId}`);
      subscription.callbacks.delete(subscriptionConfig.callback);
      await this._updateSubscriptions();
    };
    this._updateSubscriptions();
    return clientSubscriptionId;
  }
  /**
   * Register a callback to be invoked whenever the specified account changes
   *
   * @param publicKey Public key of the account to monitor
   * @param callback Function to invoke whenever the account is changed
   * @param config
   * @return subscription id
   */
  /** @deprecated Instead, pass in an {@link AccountSubscriptionConfig} */
  // eslint-disable-next-line no-dupe-class-members
  // eslint-disable-next-line no-dupe-class-members
  onAccountChange(publicKey2, callback, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs(
      [publicKey2.toBase58()],
      commitment || this._commitment || "finalized",
      // Apply connection/server default.
      "base64",
      config
    );
    return this._makeSubscription({
      callback,
      method: "accountSubscribe",
      unsubscribeMethod: "accountUnsubscribe"
    }, args);
  }
  /**
   * Deregister an account notification callback
   *
   * @param clientSubscriptionId client subscription id to deregister
   */
  async removeAccountChangeListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "account change");
  }
  /**
   * @internal
   */
  _wsOnProgramAccountNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, ProgramAccountNotificationResult);
    this._handleServerNotification(subscription, [{
      accountId: result.value.pubkey,
      accountInfo: result.value.account
    }, result.context]);
  }
  /**
   * Register a callback to be invoked whenever accounts owned by the
   * specified program change
   *
   * @param programId Public key of the program to monitor
   * @param callback Function to invoke whenever the account is changed
   * @param config
   * @return subscription id
   */
  /** @deprecated Instead, pass in a {@link ProgramAccountSubscriptionConfig} */
  // eslint-disable-next-line no-dupe-class-members
  // eslint-disable-next-line no-dupe-class-members
  onProgramAccountChange(programId, callback, commitmentOrConfig, maybeFilters) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs(
      [programId.toBase58()],
      commitment || this._commitment || "finalized",
      // Apply connection/server default.
      "base64",
      config ? config : maybeFilters ? {
        filters: applyDefaultMemcmpEncodingToFilters(maybeFilters)
      } : void 0
      /* extra */
    );
    return this._makeSubscription({
      callback,
      method: "programSubscribe",
      unsubscribeMethod: "programUnsubscribe"
    }, args);
  }
  /**
   * Deregister an account notification callback
   *
   * @param clientSubscriptionId client subscription id to deregister
   */
  async removeProgramAccountChangeListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "program account change");
  }
  /**
   * Registers a callback to be invoked whenever logs are emitted.
   */
  onLogs(filter, callback, commitment) {
    const args = this._buildArgs(
      [typeof filter === "object" ? {
        mentions: [filter.toString()]
      } : filter],
      commitment || this._commitment || "finalized"
      // Apply connection/server default.
    );
    return this._makeSubscription({
      callback,
      method: "logsSubscribe",
      unsubscribeMethod: "logsUnsubscribe"
    }, args);
  }
  /**
   * Deregister a logs callback.
   *
   * @param clientSubscriptionId client subscription id to deregister.
   */
  async removeOnLogsListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "logs");
  }
  /**
   * @internal
   */
  _wsOnLogsNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, LogsNotificationResult);
    this._handleServerNotification(subscription, [result.value, result.context]);
  }
  /**
   * @internal
   */
  _wsOnSlotNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, SlotNotificationResult);
    this._handleServerNotification(subscription, [result]);
  }
  /**
   * Register a callback to be invoked upon slot changes
   *
   * @param callback Function to invoke whenever the slot changes
   * @return subscription id
   */
  onSlotChange(callback) {
    return this._makeSubscription(
      {
        callback,
        method: "slotSubscribe",
        unsubscribeMethod: "slotUnsubscribe"
      },
      []
      /* args */
    );
  }
  /**
   * Deregister a slot notification callback
   *
   * @param clientSubscriptionId client subscription id to deregister
   */
  async removeSlotChangeListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "slot change");
  }
  /**
   * @internal
   */
  _wsOnSlotUpdatesNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, SlotUpdateNotificationResult);
    this._handleServerNotification(subscription, [result]);
  }
  /**
   * Register a callback to be invoked upon slot updates. {@link SlotUpdate}'s
   * may be useful to track live progress of a cluster.
   *
   * @param callback Function to invoke whenever the slot updates
   * @return subscription id
   */
  onSlotUpdate(callback) {
    return this._makeSubscription(
      {
        callback,
        method: "slotsUpdatesSubscribe",
        unsubscribeMethod: "slotsUpdatesUnsubscribe"
      },
      []
      /* args */
    );
  }
  /**
   * Deregister a slot update notification callback
   *
   * @param clientSubscriptionId client subscription id to deregister
   */
  async removeSlotUpdateListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "slot update");
  }
  /**
   * @internal
   */
  async _unsubscribeClientSubscription(clientSubscriptionId, subscriptionName) {
    const dispose = this._subscriptionDisposeFunctionsByClientSubscriptionId[clientSubscriptionId];
    if (dispose) {
      await dispose();
    } else {
      console.warn(`Ignored unsubscribe request because an active subscription with id \`${clientSubscriptionId}\` for '${subscriptionName}' events could not be found.`);
    }
  }
  _buildArgs(args, override, encoding, extra) {
    const commitment = override || this._commitment;
    if (commitment || encoding || extra) {
      let options = {};
      if (encoding) {
        options.encoding = encoding;
      }
      if (commitment) {
        options.commitment = commitment;
      }
      if (extra) {
        options = Object.assign(options, extra);
      }
      args.push(options);
    }
    return args;
  }
  /**
   * @internal
   */
  _buildArgsAtLeastConfirmed(args, override, encoding, extra) {
    const commitment = override || this._commitment;
    if (commitment && !["confirmed", "finalized"].includes(commitment)) {
      throw new Error("Using Connection with default commitment: `" + this._commitment + "`, but method requires at least `confirmed`");
    }
    return this._buildArgs(args, override, encoding, extra);
  }
  /**
   * @internal
   */
  _wsOnSignatureNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, SignatureNotificationResult);
    if (result.value !== "receivedSignature") {
      this._subscriptionsAutoDisposedByRpc.add(subscription);
    }
    this._handleServerNotification(subscription, result.value === "receivedSignature" ? [{
      type: "received"
    }, result.context] : [{
      type: "status",
      result: result.value
    }, result.context]);
  }
  /**
   * Register a callback to be invoked upon signature updates
   *
   * @param signature Transaction signature string in base 58
   * @param callback Function to invoke on signature notifications
   * @param commitment Specify the commitment level signature must reach before notification
   * @return subscription id
   */
  onSignature(signature2, callback, commitment) {
    const args = this._buildArgs(
      [signature2],
      commitment || this._commitment || "finalized"
      // Apply connection/server default.
    );
    const clientSubscriptionId = this._makeSubscription({
      callback: (notification, context) => {
        if (notification.type === "status") {
          callback(notification.result, context);
          try {
            this.removeSignatureListener(clientSubscriptionId);
          } catch (_err) {
          }
        }
      },
      method: "signatureSubscribe",
      unsubscribeMethod: "signatureUnsubscribe"
    }, args);
    return clientSubscriptionId;
  }
  /**
   * Register a callback to be invoked when a transaction is
   * received and/or processed.
   *
   * @param signature Transaction signature string in base 58
   * @param callback Function to invoke on signature notifications
   * @param options Enable received notifications and set the commitment
   *   level that signature must reach before notification
   * @return subscription id
   */
  onSignatureWithOptions(signature2, callback, options) {
    const {
      commitment,
      ...extra
    } = {
      ...options,
      commitment: options && options.commitment || this._commitment || "finalized"
      // Apply connection/server default.
    };
    const args = this._buildArgs([signature2], commitment, void 0, extra);
    const clientSubscriptionId = this._makeSubscription({
      callback: (notification, context) => {
        callback(notification, context);
        try {
          this.removeSignatureListener(clientSubscriptionId);
        } catch (_err) {
        }
      },
      method: "signatureSubscribe",
      unsubscribeMethod: "signatureUnsubscribe"
    }, args);
    return clientSubscriptionId;
  }
  /**
   * Deregister a signature notification callback
   *
   * @param clientSubscriptionId client subscription id to deregister
   */
  async removeSignatureListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "signature result");
  }
  /**
   * @internal
   */
  _wsOnRootNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, RootNotificationResult);
    this._handleServerNotification(subscription, [result]);
  }
  /**
   * Register a callback to be invoked upon root changes
   *
   * @param callback Function to invoke whenever the root changes
   * @return subscription id
   */
  onRootChange(callback) {
    return this._makeSubscription(
      {
        callback,
        method: "rootSubscribe",
        unsubscribeMethod: "rootUnsubscribe"
      },
      []
      /* args */
    );
  }
  /**
   * Deregister a root notification callback
   *
   * @param clientSubscriptionId client subscription id to deregister
   */
  async removeRootChangeListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "root change");
  }
}
Object.freeze({
  CreateLookupTable: {
    index: 0,
    layout: struct([u32("instruction"), u64("recentSlot"), u8("bumpSeed")])
  },
  FreezeLookupTable: {
    index: 1,
    layout: struct([u32("instruction")])
  },
  ExtendLookupTable: {
    index: 2,
    layout: struct([u32("instruction"), u64(), seq(publicKey(), offset(u32(), -8), "addresses")])
  },
  DeactivateLookupTable: {
    index: 3,
    layout: struct([u32("instruction")])
  },
  CloseLookupTable: {
    index: 4,
    layout: struct([u32("instruction")])
  }
});
new PublicKey("AddressLookupTab1e1111111111111111111111111");
Object.freeze({
  RequestUnits: {
    index: 0,
    layout: struct([u8("instruction"), u32("units"), u32("additionalFee")])
  },
  RequestHeapFrame: {
    index: 1,
    layout: struct([u8("instruction"), u32("bytes")])
  },
  SetComputeUnitLimit: {
    index: 2,
    layout: struct([u8("instruction"), u32("units")])
  },
  SetComputeUnitPrice: {
    index: 3,
    layout: struct([u8("instruction"), u64("microLamports")])
  }
});
new PublicKey("ComputeBudget111111111111111111111111111111");
struct([u8("numSignatures"), u8("padding"), u16("signatureOffset"), u16("signatureInstructionIndex"), u16("publicKeyOffset"), u16("publicKeyInstructionIndex"), u16("messageDataOffset"), u16("messageDataSize"), u16("messageInstructionIndex")]);
new PublicKey("Ed25519SigVerify111111111111111111111111111");
secp256k1.utils.isValidPrivateKey;
struct([u8("numSignatures"), u16("signatureOffset"), u8("signatureInstructionIndex"), u16("ethAddressOffset"), u8("ethAddressInstructionIndex"), u16("messageDataOffset"), u16("messageDataSize"), u8("messageInstructionIndex"), blob(20, "ethAddress"), blob(64, "signature"), u8("recoveryId")]);
new PublicKey("KeccakSecp256k11111111111111111111111111111");
var _Lockup;
new PublicKey("StakeConfig11111111111111111111111111111111");
class Lockup {
  /**
   * Create a new Lockup object
   */
  constructor(unixTimestamp, epoch, custodian) {
    this.unixTimestamp = void 0;
    this.epoch = void 0;
    this.custodian = void 0;
    this.unixTimestamp = unixTimestamp;
    this.epoch = epoch;
    this.custodian = custodian;
  }
  /**
   * Default, inactive Lockup value
   */
}
_Lockup = Lockup;
Lockup.default = new _Lockup(0, 0, PublicKey.default);
Object.freeze({
  Initialize: {
    index: 0,
    layout: struct([u32("instruction"), authorized(), lockup()])
  },
  Authorize: {
    index: 1,
    layout: struct([u32("instruction"), publicKey("newAuthorized"), u32("stakeAuthorizationType")])
  },
  Delegate: {
    index: 2,
    layout: struct([u32("instruction")])
  },
  Split: {
    index: 3,
    layout: struct([u32("instruction"), ns64("lamports")])
  },
  Withdraw: {
    index: 4,
    layout: struct([u32("instruction"), ns64("lamports")])
  },
  Deactivate: {
    index: 5,
    layout: struct([u32("instruction")])
  },
  Merge: {
    index: 7,
    layout: struct([u32("instruction")])
  },
  AuthorizeWithSeed: {
    index: 8,
    layout: struct([u32("instruction"), publicKey("newAuthorized"), u32("stakeAuthorizationType"), rustString("authoritySeed"), publicKey("authorityOwner")])
  }
});
new PublicKey("Stake11111111111111111111111111111111111111");
Object.freeze({
  InitializeAccount: {
    index: 0,
    layout: struct([u32("instruction"), voteInit()])
  },
  Authorize: {
    index: 1,
    layout: struct([u32("instruction"), publicKey("newAuthorized"), u32("voteAuthorizationType")])
  },
  Withdraw: {
    index: 3,
    layout: struct([u32("instruction"), ns64("lamports")])
  },
  UpdateValidatorIdentity: {
    index: 4,
    layout: struct([u32("instruction")])
  },
  AuthorizeWithSeed: {
    index: 10,
    layout: struct([u32("instruction"), voteAuthorizeWithSeedArgs()])
  }
});
new PublicKey("Vote111111111111111111111111111111111111111");
new PublicKey("Va1idator1nfo111111111111111111111111111111");
type({
  name: string(),
  website: optional(string()),
  details: optional(string()),
  iconUrl: optional(string()),
  keybaseUsername: optional(string())
});
new PublicKey("Vote111111111111111111111111111111111111111");
struct([
  publicKey("nodePubkey"),
  publicKey("authorizedWithdrawer"),
  u8("commission"),
  nu64(),
  // votes.length
  seq(struct([nu64("slot"), u32("confirmationCount")]), offset(u32(), -8), "votes"),
  u8("rootSlotValid"),
  nu64("rootSlot"),
  nu64(),
  // authorizedVoters.length
  seq(struct([nu64("epoch"), publicKey("authorizedVoter")]), offset(u32(), -8), "authorizedVoters"),
  struct([seq(struct([publicKey("authorizedPubkey"), nu64("epochOfLastAuthorizedSwitch"), nu64("targetEpoch")]), 32, "buf"), nu64("idx"), u8("isEmpty")], "priorVoters"),
  nu64(),
  // epochCredits.length
  seq(struct([nu64("epoch"), nu64("credits"), nu64("prevCredits")]), offset(u32(), -8), "epochCredits"),
  struct([nu64("slot"), nu64("timestamp")], "lastTimestamp")
]);
class WalletError extends Error {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(message, error) {
    super(message);
    this.error = error;
  }
}
class WalletNotReadyError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotReadyError";
  }
}
class WalletLoadError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletLoadError";
  }
}
class WalletConfigError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletConfigError";
  }
}
class WalletConnectionError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletConnectionError";
  }
}
class WalletDisconnectedError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletDisconnectedError";
  }
}
class WalletDisconnectionError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletDisconnectionError";
  }
}
class WalletAccountError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletAccountError";
  }
}
class WalletPublicKeyError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletPublicKeyError";
  }
}
class WalletNotConnectedError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletNotConnectedError";
  }
}
class WalletSendTransactionError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSendTransactionError";
  }
}
class WalletSignTransactionError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignTransactionError";
  }
}
class WalletSignMessageError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignMessageError";
  }
}
class WalletSignInError extends WalletError {
  constructor() {
    super(...arguments);
    this.name = "WalletSignInError";
  }
}
var WalletReadyState;
(function(WalletReadyState2) {
  WalletReadyState2["Installed"] = "Installed";
  WalletReadyState2["NotDetected"] = "NotDetected";
  WalletReadyState2["Loadable"] = "Loadable";
  WalletReadyState2["Unsupported"] = "Unsupported";
})(WalletReadyState || (WalletReadyState = {}));
class BaseWalletAdapter extends EventEmitter {
  get connected() {
    return !!this.publicKey;
  }
  async autoConnect() {
    await this.connect();
  }
  async prepareTransaction(transaction, connection, options = {}) {
    const publicKey2 = this.publicKey;
    if (!publicKey2)
      throw new WalletNotConnectedError();
    transaction.feePayer = transaction.feePayer || publicKey2;
    transaction.recentBlockhash = transaction.recentBlockhash || (await connection.getLatestBlockhash({
      commitment: options.preflightCommitment,
      minContextSlot: options.minContextSlot
    })).blockhash;
    return transaction;
  }
}
function scopePollingDetectionStrategy(detect) {
  if (typeof window === "undefined" || typeof document === "undefined")
    return;
  const disposers = [];
  function detectAndDispose() {
    const detected = detect();
    if (detected) {
      for (const dispose of disposers) {
        dispose();
      }
    }
  }
  const interval = (
    // TODO: #334 Replace with idle callback strategy.
    setInterval(detectAndDispose, 1e3)
  );
  disposers.push(() => clearInterval(interval));
  if (
    // Implies that `DOMContentLoaded` has not yet fired.
    document.readyState === "loading"
  ) {
    document.addEventListener("DOMContentLoaded", detectAndDispose, { once: true });
    disposers.push(() => document.removeEventListener("DOMContentLoaded", detectAndDispose));
  }
  if (
    // If the `complete` state has been reached, we're too late.
    document.readyState !== "complete"
  ) {
    window.addEventListener("load", detectAndDispose, { once: true });
    disposers.push(() => window.removeEventListener("load", detectAndDispose));
  }
  detectAndDispose();
}
function isIosAndRedirectable() {
  if (!navigator)
    return false;
  const userAgent = navigator.userAgent.toLowerCase();
  const isIos = userAgent.includes("iphone") || userAgent.includes("ipad");
  const isSafari = userAgent.includes("safari");
  return isIos && isSafari;
}
function isVersionedTransaction$1(transaction) {
  return "version" in transaction;
}
class BaseSignerWalletAdapter extends BaseWalletAdapter {
  async sendTransaction(transaction, connection, options = {}) {
    let emit = true;
    try {
      if (isVersionedTransaction$1(transaction)) {
        if (!this.supportedTransactionVersions)
          throw new WalletSendTransactionError(`Sending versioned transactions isn't supported by this wallet`);
        if (!this.supportedTransactionVersions.has(transaction.version))
          throw new WalletSendTransactionError(`Sending transaction version ${transaction.version} isn't supported by this wallet`);
        try {
          transaction = await this.signTransaction(transaction);
          const rawTransaction = transaction.serialize();
          return await connection.sendRawTransaction(rawTransaction, options);
        } catch (error) {
          if (error instanceof WalletSignTransactionError) {
            emit = false;
            throw error;
          }
          throw new WalletSendTransactionError(error == null ? void 0 : error.message, error);
        }
      } else {
        try {
          const { signers, ...sendOptions } = options;
          transaction = await this.prepareTransaction(transaction, connection, sendOptions);
          (signers == null ? void 0 : signers.length) && transaction.partialSign(...signers);
          transaction = await this.signTransaction(transaction);
          const rawTransaction = transaction.serialize();
          return await connection.sendRawTransaction(rawTransaction, sendOptions);
        } catch (error) {
          if (error instanceof WalletSignTransactionError) {
            emit = false;
            throw error;
          }
          throw new WalletSendTransactionError(error == null ? void 0 : error.message, error);
        }
      }
    } catch (error) {
      if (emit) {
        this.emit("error", error);
      }
      throw error;
    }
  }
  async signAllTransactions(transactions) {
    for (const transaction of transactions) {
      if (isVersionedTransaction$1(transaction)) {
        if (!this.supportedTransactionVersions)
          throw new WalletSignTransactionError(`Signing versioned transactions isn't supported by this wallet`);
        if (!this.supportedTransactionVersions.has(transaction.version))
          throw new WalletSignTransactionError(`Signing transaction version ${transaction.version} isn't supported by this wallet`);
      }
    }
    const signedTransactions = [];
    for (const transaction of transactions) {
      signedTransactions.push(await this.signTransaction(transaction));
    }
    return signedTransactions;
  }
}
class BaseMessageSignerWalletAdapter extends BaseSignerWalletAdapter {
}
class BaseSignInMessageSignerWalletAdapter extends BaseMessageSignerWalletAdapter {
}
const SolanaSignAndSendTransaction = "solana:signAndSendTransaction";
const SolanaSignIn = "solana:signIn";
const SolanaSignMessage = "solana:signMessage";
const SolanaSignTransaction = "solana:signTransaction";
function isWalletAdapterCompatibleStandardWallet(wallet) {
  return StandardConnect$1 in wallet.features && StandardEvents$1 in wallet.features && (SolanaSignAndSendTransaction in wallet.features || SolanaSignTransaction in wallet.features);
}
var WalletAdapterNetwork;
(function(WalletAdapterNetwork2) {
  WalletAdapterNetwork2["Mainnet"] = "mainnet-beta";
  WalletAdapterNetwork2["Testnet"] = "testnet";
  WalletAdapterNetwork2["Devnet"] = "devnet";
})(WalletAdapterNetwork || (WalletAdapterNetwork = {}));
function getCommitment(commitment) {
  switch (commitment) {
    case "processed":
    case "confirmed":
    case "finalized":
    case void 0:
      return commitment;
    case "recent":
      return "processed";
    case "single":
    case "singleGossip":
      return "confirmed";
    case "max":
    case "root":
      return "finalized";
    default:
      return void 0;
  }
}
const SOLANA_MAINNET_CHAIN = "solana:mainnet";
const SOLANA_DEVNET_CHAIN = "solana:devnet";
const SOLANA_TESTNET_CHAIN = "solana:testnet";
const SOLANA_LOCALNET_CHAIN = "solana:localnet";
const MAINNET_ENDPOINT = "https://api.mainnet-beta.solana.com";
function getChainForEndpoint(endpoint) {
  if (endpoint.includes(MAINNET_ENDPOINT))
    return SOLANA_MAINNET_CHAIN;
  if (/\bdevnet\b/i.test(endpoint))
    return SOLANA_DEVNET_CHAIN;
  if (/\btestnet\b/i.test(endpoint))
    return SOLANA_TESTNET_CHAIN;
  if (/\blocalhost\b/i.test(endpoint) || /\b127\.0\.0\.1\b/.test(endpoint))
    return SOLANA_LOCALNET_CHAIN;
  return SOLANA_MAINNET_CHAIN;
}
function createSignInMessageText(input) {
  let message = `${input.domain} wants you to sign in with your Solana account:
`;
  message += `${input.address}`;
  if (input.statement) {
    message += `

${input.statement}`;
  }
  const fields = [];
  if (input.uri) {
    fields.push(`URI: ${input.uri}`);
  }
  if (input.version) {
    fields.push(`Version: ${input.version}`);
  }
  if (input.chainId) {
    fields.push(`Chain ID: ${input.chainId}`);
  }
  if (input.nonce) {
    fields.push(`Nonce: ${input.nonce}`);
  }
  if (input.issuedAt) {
    fields.push(`Issued At: ${input.issuedAt}`);
  }
  if (input.expirationTime) {
    fields.push(`Expiration Time: ${input.expirationTime}`);
  }
  if (input.notBefore) {
    fields.push(`Not Before: ${input.notBefore}`);
  }
  if (input.requestId) {
    fields.push(`Request ID: ${input.requestId}`);
  }
  if (input.resources) {
    fields.push(`Resources:`);
    for (const resource of input.resources) {
      fields.push(`- ${resource}`);
    }
  }
  if (fields.length) {
    message += `

${fields.join("\n")}`;
  }
  return message;
}
function createDecoder(decoder) {
  return Object.freeze({
    ...decoder,
    decode: (bytes, offset2 = 0) => decoder.read(bytes, offset2)[0]
  });
}
var getBaseXDecoder = (alphabet4) => {
  return createDecoder({
    read(rawBytes, offset2) {
      const bytes = offset2 === 0 ? rawBytes : rawBytes.slice(offset2);
      if (bytes.length === 0) return ["", 0];
      let trailIndex = bytes.findIndex((n) => n !== 0);
      trailIndex = trailIndex === -1 ? bytes.length : trailIndex;
      const leadingZeroes = alphabet4[0].repeat(trailIndex);
      if (trailIndex === bytes.length) return [leadingZeroes, rawBytes.length];
      const base10Number = bytes.slice(trailIndex).reduce((sum, byte) => sum * 256n + BigInt(byte), 0n);
      const tailChars = getBaseXFromBigInt(base10Number, alphabet4);
      return [leadingZeroes + tailChars, rawBytes.length];
    }
  });
};
function getBaseXFromBigInt(value, alphabet4) {
  const base2 = BigInt(alphabet4.length);
  const tailChars = [];
  while (value > 0n) {
    tailChars.unshift(alphabet4[Number(value % base2)]);
    value /= base2;
  }
  return tailChars.join("");
}
var alphabet2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var getBase58Decoder = () => getBaseXDecoder(alphabet2);
const SolanaMobileWalletAdapterErrorCode = {
  ERROR_ASSOCIATION_PORT_OUT_OF_RANGE: "ERROR_ASSOCIATION_PORT_OUT_OF_RANGE",
  ERROR_FORBIDDEN_WALLET_BASE_URL: "ERROR_FORBIDDEN_WALLET_BASE_URL",
  ERROR_SECURE_CONTEXT_REQUIRED: "ERROR_SECURE_CONTEXT_REQUIRED",
  ERROR_SESSION_CLOSED: "ERROR_SESSION_CLOSED",
  ERROR_SESSION_TIMEOUT: "ERROR_SESSION_TIMEOUT",
  ERROR_WALLET_NOT_FOUND: "ERROR_WALLET_NOT_FOUND",
  ERROR_INVALID_PROTOCOL_VERSION: "ERROR_INVALID_PROTOCOL_VERSION"
};
class SolanaMobileWalletAdapterError extends Error {
  constructor(...args) {
    const [code, message, data] = args;
    super(message);
    this.code = code;
    this.data = data;
    this.name = "SolanaMobileWalletAdapterError";
  }
}
class SolanaMobileWalletAdapterProtocolError extends Error {
  constructor(...args) {
    const [jsonRpcMessageId, code, message, data] = args;
    super(message);
    this.code = code;
    this.data = data;
    this.jsonRpcMessageId = jsonRpcMessageId;
    this.name = "SolanaMobileWalletAdapterProtocolError";
  }
}
function __awaiter$2(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
function encode(input) {
  return window.btoa(input);
}
function fromUint8Array$1$1(byteArray, urlsafe) {
  const base64 = window.btoa(String.fromCharCode.call(null, ...byteArray));
  return base64;
}
function toUint8Array$1(base64EncodedByteArray) {
  return new Uint8Array(window.atob(base64EncodedByteArray).split("").map((c) => c.charCodeAt(0)));
}
function createHelloReq(ecdhPublicKey, associationKeypairPrivateKey) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const publicKeyBuffer = yield crypto.subtle.exportKey("raw", ecdhPublicKey);
    const signatureBuffer = yield crypto.subtle.sign({ hash: "SHA-256", name: "ECDSA" }, associationKeypairPrivateKey, publicKeyBuffer);
    const response = new Uint8Array(publicKeyBuffer.byteLength + signatureBuffer.byteLength);
    response.set(new Uint8Array(publicKeyBuffer), 0);
    response.set(new Uint8Array(signatureBuffer), publicKeyBuffer.byteLength);
    return response;
  });
}
function createSIWSMessage(payload) {
  return createSignInMessageText(payload);
}
function createSIWSMessageBase64Url(payload) {
  return encode(createSIWSMessage(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const SolanaSignTransactions = "solana:signTransactions";
const SolanaCloneAuthorization = "solana:cloneAuthorization";
function fromUint8Array$2(byteArray) {
  return getBase58Decoder().decode(byteArray);
}
function base64ToBase58(base64EncodedString) {
  return fromUint8Array$2(toUint8Array$1(base64EncodedString));
}
function createMobileWalletProxy(protocolVersion, protocolRequestHandler) {
  return new Proxy({}, {
    get(target, p) {
      if (p === "then") {
        return null;
      }
      if (target[p] == null) {
        target[p] = function(inputParams) {
          return __awaiter$2(this, void 0, void 0, function* () {
            const { method, params } = handleMobileWalletRequest(p, inputParams, protocolVersion);
            const result = yield protocolRequestHandler(method, params);
            if (method === "authorize" && params.sign_in_payload && !result.sign_in_result) {
              result["sign_in_result"] = yield signInFallback(params.sign_in_payload, result, protocolRequestHandler);
            }
            return handleMobileWalletResponse(p, result, protocolVersion);
          });
        };
      }
      return target[p];
    },
    defineProperty() {
      return false;
    },
    deleteProperty() {
      return false;
    }
  });
}
function handleMobileWalletRequest(methodName, methodParams, protocolVersion) {
  let params = methodParams;
  let method = methodName.toString().replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).toLowerCase();
  switch (methodName) {
    case "authorize": {
      let { chain } = params;
      if (protocolVersion === "legacy") {
        switch (chain) {
          case "solana:testnet": {
            chain = "testnet";
            break;
          }
          case "solana:devnet": {
            chain = "devnet";
            break;
          }
          case "solana:mainnet": {
            chain = "mainnet-beta";
            break;
          }
          default: {
            chain = params.cluster;
          }
        }
        params.cluster = chain;
      } else {
        switch (chain) {
          case "testnet":
          case "devnet": {
            chain = `solana:${chain}`;
            break;
          }
          case "mainnet-beta": {
            chain = "solana:mainnet";
            break;
          }
        }
        params.chain = chain;
      }
    }
    case "reauthorize": {
      const { auth_token, identity } = params;
      if (auth_token) {
        switch (protocolVersion) {
          case "legacy": {
            method = "reauthorize";
            params = { auth_token, identity };
            break;
          }
          default: {
            method = "authorize";
            break;
          }
        }
      }
      break;
    }
  }
  return { method, params };
}
function handleMobileWalletResponse(method, response, protocolVersion) {
  switch (method) {
    case "getCapabilities": {
      const capabilities = response;
      switch (protocolVersion) {
        case "legacy": {
          const features = [SolanaSignTransactions];
          if (capabilities.supports_clone_authorization === true) {
            features.push(SolanaCloneAuthorization);
          }
          return Object.assign(Object.assign({}, capabilities), { features });
        }
        case "v1": {
          return Object.assign(Object.assign({}, capabilities), { supports_sign_and_send_transactions: true, supports_clone_authorization: capabilities.features.includes(SolanaCloneAuthorization) });
        }
      }
    }
  }
  return response;
}
function signInFallback(signInPayload, authorizationResult, protocolRequestHandler) {
  var _a;
  return __awaiter$2(this, void 0, void 0, function* () {
    const domain = (_a = signInPayload.domain) !== null && _a !== void 0 ? _a : window.location.host;
    const address = authorizationResult.accounts[0].address;
    const siwsMessage = createSIWSMessageBase64Url(Object.assign(Object.assign({}, signInPayload), { domain, address: base64ToBase58(address) }));
    const signMessageResult = yield protocolRequestHandler("sign_messages", {
      addresses: [address],
      payloads: [siwsMessage]
    });
    const signedPayload = toUint8Array$1(signMessageResult.signed_payloads[0]);
    const signedMessage = fromUint8Array$1$1(signedPayload.slice(0, signedPayload.length - 64));
    const signature2 = fromUint8Array$1$1(signedPayload.slice(signedPayload.length - 64));
    const signInResult = {
      address,
      // Workaround: some wallets have been observed to only reply with the message signature.
      // This is non-compliant with the spec, but in the interest of maximizing compatibility,
      // detect this case and reuse the original message.
      signed_message: signedMessage.length == 0 ? siwsMessage : signedMessage,
      signature: signature2
    };
    return signInResult;
  });
}
const SEQUENCE_NUMBER_BYTES = 4;
function createSequenceNumberVector(sequenceNumber) {
  if (sequenceNumber >= 4294967296) {
    throw new Error("Outbound sequence number overflow. The maximum sequence number is 32-bytes.");
  }
  const byteArray = new ArrayBuffer(SEQUENCE_NUMBER_BYTES);
  const view = new DataView(byteArray);
  view.setUint32(
    0,
    sequenceNumber,
    /* littleEndian */
    false
  );
  return new Uint8Array(byteArray);
}
const INITIALIZATION_VECTOR_BYTES = 12;
const ENCODED_PUBLIC_KEY_LENGTH_BYTES = 65;
function encryptMessage(plaintext, sequenceNumber, sharedSecret) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const sequenceNumberVector = createSequenceNumberVector(sequenceNumber);
    const initializationVector = new Uint8Array(INITIALIZATION_VECTOR_BYTES);
    crypto.getRandomValues(initializationVector);
    const ciphertext = yield crypto.subtle.encrypt(getAlgorithmParams(sequenceNumberVector, initializationVector), sharedSecret, new TextEncoder().encode(plaintext));
    const response = new Uint8Array(sequenceNumberVector.byteLength + initializationVector.byteLength + ciphertext.byteLength);
    response.set(new Uint8Array(sequenceNumberVector), 0);
    response.set(new Uint8Array(initializationVector), sequenceNumberVector.byteLength);
    response.set(new Uint8Array(ciphertext), sequenceNumberVector.byteLength + initializationVector.byteLength);
    return response;
  });
}
function decryptMessage(message, sharedSecret) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const sequenceNumberVector = message.slice(0, SEQUENCE_NUMBER_BYTES);
    const initializationVector = message.slice(SEQUENCE_NUMBER_BYTES, SEQUENCE_NUMBER_BYTES + INITIALIZATION_VECTOR_BYTES);
    const ciphertext = message.slice(SEQUENCE_NUMBER_BYTES + INITIALIZATION_VECTOR_BYTES);
    const plaintextBuffer = yield crypto.subtle.decrypt(getAlgorithmParams(sequenceNumberVector, initializationVector), sharedSecret, ciphertext);
    const plaintext = getUtf8Decoder().decode(plaintextBuffer);
    return plaintext;
  });
}
function getAlgorithmParams(sequenceNumber, initializationVector) {
  return {
    additionalData: sequenceNumber,
    iv: initializationVector,
    name: "AES-GCM",
    tagLength: 128
    // 16 byte tag => 128 bits
  };
}
let _utf8Decoder;
function getUtf8Decoder() {
  if (_utf8Decoder === void 0) {
    _utf8Decoder = new TextDecoder("utf-8");
  }
  return _utf8Decoder;
}
function generateAssociationKeypair() {
  return __awaiter$2(this, void 0, void 0, function* () {
    return yield crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256"
      },
      false,
      ["sign"]
      /* keyUsages */
    );
  });
}
function generateECDHKeypair() {
  return __awaiter$2(this, void 0, void 0, function* () {
    return yield crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256"
      },
      false,
      ["deriveKey", "deriveBits"]
      /* keyUsages */
    );
  });
}
function arrayBufferToBase64String(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let ii = 0; ii < len; ii++) {
    binary += String.fromCharCode(bytes[ii]);
  }
  return window.btoa(binary);
}
function getRandomAssociationPort() {
  return assertAssociationPort(49152 + Math.floor(Math.random() * (65535 - 49152 + 1)));
}
function assertAssociationPort(port) {
  if (port < 49152 || port > 65535) {
    throw new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_ASSOCIATION_PORT_OUT_OF_RANGE, `Association port number must be between 49152 and 65535. ${port} given.`, { port });
  }
  return port;
}
function getStringWithURLUnsafeCharactersReplaced(unsafeBase64EncodedString) {
  return unsafeBase64EncodedString.replace(/[/+=]/g, (m) => ({
    "/": "_",
    "+": "-",
    "=": "."
  })[m]);
}
const INTENT_NAME = "solana-wallet";
function getPathParts(pathString) {
  return pathString.replace(/(^\/+|\/+$)/g, "").split("/");
}
function getIntentURL(methodPathname, intentUrlBase) {
  let baseUrl = null;
  if (intentUrlBase) {
    try {
      baseUrl = new URL(intentUrlBase);
    } catch (_a) {
    }
    if ((baseUrl === null || baseUrl === void 0 ? void 0 : baseUrl.protocol) !== "https:") {
      throw new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_FORBIDDEN_WALLET_BASE_URL, "Base URLs supplied by wallets must be valid `https` URLs");
    }
  }
  baseUrl || (baseUrl = new URL(`${INTENT_NAME}:/`));
  const pathname = methodPathname.startsWith("/") ? (
    // Method is an absolute path. Replace it wholesale.
    methodPathname
  ) : (
    // Method is a relative path. Merge it with the existing one.
    [...getPathParts(baseUrl.pathname), ...getPathParts(methodPathname)].join("/")
  );
  return new URL(pathname, baseUrl);
}
function getAssociateAndroidIntentURL(associationPublicKey, putativePort, associationURLBase, protocolVersions = ["v1"]) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const associationPort = assertAssociationPort(putativePort);
    const exportedKey = yield crypto.subtle.exportKey("raw", associationPublicKey);
    const encodedKey = arrayBufferToBase64String(exportedKey);
    const url = getIntentURL("v1/associate/local", associationURLBase);
    url.searchParams.set("association", getStringWithURLUnsafeCharactersReplaced(encodedKey));
    url.searchParams.set("port", `${associationPort}`);
    protocolVersions.forEach((version) => {
      url.searchParams.set("v", version);
    });
    return url;
  });
}
function encryptJsonRpcMessage(jsonRpcMessage, sharedSecret) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const plaintext = JSON.stringify(jsonRpcMessage);
    const sequenceNumber = jsonRpcMessage.id;
    return encryptMessage(plaintext, sequenceNumber, sharedSecret);
  });
}
function decryptJsonRpcMessage(message, sharedSecret) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const plaintext = yield decryptMessage(message, sharedSecret);
    const jsonRpcMessage = JSON.parse(plaintext);
    if (Object.hasOwnProperty.call(jsonRpcMessage, "error")) {
      throw new SolanaMobileWalletAdapterProtocolError(jsonRpcMessage.id, jsonRpcMessage.error.code, jsonRpcMessage.error.message);
    }
    return jsonRpcMessage;
  });
}
function parseHelloRsp(payloadBuffer, associationPublicKey, ecdhPrivateKey) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const [associationPublicKeyBuffer, walletPublicKey] = yield Promise.all([
      crypto.subtle.exportKey("raw", associationPublicKey),
      crypto.subtle.importKey(
        "raw",
        payloadBuffer.slice(0, ENCODED_PUBLIC_KEY_LENGTH_BYTES),
        { name: "ECDH", namedCurve: "P-256" },
        false,
        []
        /* keyUsages */
      )
    ]);
    const sharedSecret = yield crypto.subtle.deriveBits({ name: "ECDH", public: walletPublicKey }, ecdhPrivateKey, 256);
    const ecdhSecretKey = yield crypto.subtle.importKey(
      "raw",
      sharedSecret,
      "HKDF",
      false,
      ["deriveKey"]
      /* keyUsages */
    );
    const aesKeyMaterialVal = yield crypto.subtle.deriveKey({
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(associationPublicKeyBuffer),
      info: new Uint8Array()
    }, ecdhSecretKey, { name: "AES-GCM", length: 128 }, false, ["encrypt", "decrypt"]);
    return aesKeyMaterialVal;
  });
}
function parseSessionProps(message, sharedSecret) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const plaintext = yield decryptMessage(message, sharedSecret);
    const jsonProperties = JSON.parse(plaintext);
    let protocolVersion = "legacy";
    if (Object.hasOwnProperty.call(jsonProperties, "v")) {
      switch (jsonProperties.v) {
        case 1:
        case "1":
        case "v1":
          protocolVersion = "v1";
          break;
        case "legacy":
          protocolVersion = "legacy";
          break;
        default:
          throw new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_INVALID_PROTOCOL_VERSION, `Unknown/unsupported protocol version: ${jsonProperties.v}`);
      }
    }
    return {
      protocol_version: protocolVersion
    };
  });
}
const Browser = {
  Firefox: 0,
  Other: 1
};
function assertUnreachable(x) {
  return x;
}
function getBrowser() {
  return navigator.userAgent.indexOf("Firefox/") !== -1 ? Browser.Firefox : Browser.Other;
}
function getDetectionPromise() {
  return new Promise((resolve, reject) => {
    function cleanup() {
      clearTimeout(timeoutId);
      window.removeEventListener("blur", handleBlur);
    }
    function handleBlur() {
      cleanup();
      resolve();
    }
    window.addEventListener("blur", handleBlur);
    const timeoutId = setTimeout(() => {
      cleanup();
      reject();
    }, 3e3);
  });
}
let _frame = null;
function launchUrlThroughHiddenFrame(url) {
  if (_frame == null) {
    _frame = document.createElement("iframe");
    _frame.style.display = "none";
    document.body.appendChild(_frame);
  }
  _frame.contentWindow.location.href = url.toString();
}
function launchAssociation(associationUrl) {
  return __awaiter$2(this, void 0, void 0, function* () {
    if (associationUrl.protocol === "https:") {
      window.location.assign(associationUrl);
    } else {
      try {
        const browser = getBrowser();
        switch (browser) {
          case Browser.Firefox:
            launchUrlThroughHiddenFrame(associationUrl);
            break;
          case Browser.Other: {
            const detectionPromise = getDetectionPromise();
            window.location.assign(associationUrl);
            yield detectionPromise;
            break;
          }
          default:
            assertUnreachable(browser);
        }
      } catch (e) {
        throw new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_WALLET_NOT_FOUND, "Found no installed wallet that supports the mobile wallet protocol.");
      }
    }
  });
}
function startSession(associationPublicKey, associationURLBase) {
  return __awaiter$2(this, void 0, void 0, function* () {
    const randomAssociationPort = getRandomAssociationPort();
    const associationUrl = yield getAssociateAndroidIntentURL(associationPublicKey, randomAssociationPort, associationURLBase);
    yield launchAssociation(associationUrl);
    return randomAssociationPort;
  });
}
const WEBSOCKET_CONNECTION_CONFIG = {
  /**
   * 300 milliseconds is a generally accepted threshold for what someone
   * would consider an acceptable response time for a user interface
   * after having performed a low-attention tapping task. We set the initial
   * interval at which we wait for the wallet to set up the websocket at
   * half this, as per the Nyquist frequency, with a progressive backoff
   * sequence from there. The total wait time is 30s, which allows for the
   * user to be presented with a disambiguation dialog, select a wallet, and
   * for the wallet app to subsequently start.
   */
  retryDelayScheduleMs: [150, 150, 200, 500, 500, 750, 750, 1e3],
  timeoutMs: 3e4
};
const WEBSOCKET_PROTOCOL_BINARY = "com.solana.mobilewalletadapter.v1";
function assertSecureContext() {
  if (typeof window === "undefined" || window.isSecureContext !== true) {
    throw new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_SECURE_CONTEXT_REQUIRED, "The mobile wallet adapter protocol must be used in a secure context (`https`).");
  }
}
function assertSecureEndpointSpecificURI(walletUriBase) {
  let url;
  try {
    url = new URL(walletUriBase);
  } catch (_a) {
    throw new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_FORBIDDEN_WALLET_BASE_URL, "Invalid base URL supplied by wallet");
  }
  if (url.protocol !== "https:") {
    throw new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_FORBIDDEN_WALLET_BASE_URL, "Base URLs supplied by wallets must be valid `https` URLs");
  }
}
function getSequenceNumberFromByteArray(byteArray) {
  const view = new DataView(byteArray);
  return view.getUint32(
    0,
    /* littleEndian */
    false
  );
}
function transact(callback, config) {
  return __awaiter$2(this, void 0, void 0, function* () {
    assertSecureContext();
    const associationKeypair = yield generateAssociationKeypair();
    const sessionPort = yield startSession(associationKeypair.publicKey, config === null || config === void 0 ? void 0 : config.baseUri);
    const websocketURL = `ws://localhost:${sessionPort}/solana-wallet`;
    let connectionStartTime;
    const getNextRetryDelayMs = (() => {
      const schedule = [...WEBSOCKET_CONNECTION_CONFIG.retryDelayScheduleMs];
      return () => schedule.length > 1 ? schedule.shift() : schedule[0];
    })();
    let nextJsonRpcMessageId = 1;
    let lastKnownInboundSequenceNumber = 0;
    let state = { __type: "disconnected" };
    return new Promise((resolve, reject) => {
      let socket;
      const jsonRpcResponsePromises = {};
      const handleOpen = () => __awaiter$2(this, void 0, void 0, function* () {
        if (state.__type !== "connecting") {
          console.warn(`Expected adapter state to be \`connecting\` at the moment the websocket opens. Got \`${state.__type}\`.`);
          return;
        }
        socket.removeEventListener("open", handleOpen);
        const { associationKeypair: associationKeypair2 } = state;
        const ecdhKeypair = yield generateECDHKeypair();
        socket.send(yield createHelloReq(ecdhKeypair.publicKey, associationKeypair2.privateKey));
        state = {
          __type: "hello_req_sent",
          associationPublicKey: associationKeypair2.publicKey,
          ecdhPrivateKey: ecdhKeypair.privateKey
        };
      });
      const handleClose = (evt) => {
        if (evt.wasClean) {
          state = { __type: "disconnected" };
        } else {
          reject(new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_SESSION_CLOSED, `The wallet session dropped unexpectedly (${evt.code}: ${evt.reason}).`, { closeEvent: evt }));
        }
        disposeSocket();
      };
      const handleError = (_evt) => __awaiter$2(this, void 0, void 0, function* () {
        disposeSocket();
        if (Date.now() - connectionStartTime >= WEBSOCKET_CONNECTION_CONFIG.timeoutMs) {
          reject(new SolanaMobileWalletAdapterError(SolanaMobileWalletAdapterErrorCode.ERROR_SESSION_TIMEOUT, `Failed to connect to the wallet websocket at ${websocketURL}.`));
        } else {
          yield new Promise((resolve2) => {
            const retryDelayMs = getNextRetryDelayMs();
            retryWaitTimeoutId = window.setTimeout(resolve2, retryDelayMs);
          });
          attemptSocketConnection();
        }
      });
      const handleMessage = (evt) => __awaiter$2(this, void 0, void 0, function* () {
        const responseBuffer = yield evt.data.arrayBuffer();
        switch (state.__type) {
          case "connecting":
            if (responseBuffer.byteLength !== 0) {
              throw new Error("Encountered unexpected message while connecting");
            }
            const ecdhKeypair = yield generateECDHKeypair();
            socket.send(yield createHelloReq(ecdhKeypair.publicKey, associationKeypair.privateKey));
            state = {
              __type: "hello_req_sent",
              associationPublicKey: associationKeypair.publicKey,
              ecdhPrivateKey: ecdhKeypair.privateKey
            };
            break;
          case "connected":
            try {
              const sequenceNumberVector = responseBuffer.slice(0, SEQUENCE_NUMBER_BYTES);
              const sequenceNumber = getSequenceNumberFromByteArray(sequenceNumberVector);
              if (sequenceNumber !== lastKnownInboundSequenceNumber + 1) {
                throw new Error("Encrypted message has invalid sequence number");
              }
              lastKnownInboundSequenceNumber = sequenceNumber;
              const jsonRpcMessage = yield decryptJsonRpcMessage(responseBuffer, state.sharedSecret);
              const responsePromise = jsonRpcResponsePromises[jsonRpcMessage.id];
              delete jsonRpcResponsePromises[jsonRpcMessage.id];
              responsePromise.resolve(jsonRpcMessage.result);
            } catch (e) {
              if (e instanceof SolanaMobileWalletAdapterProtocolError) {
                const responsePromise = jsonRpcResponsePromises[e.jsonRpcMessageId];
                delete jsonRpcResponsePromises[e.jsonRpcMessageId];
                responsePromise.reject(e);
              } else {
                throw e;
              }
            }
            break;
          case "hello_req_sent": {
            if (responseBuffer.byteLength === 0) {
              const ecdhKeypair2 = yield generateECDHKeypair();
              socket.send(yield createHelloReq(ecdhKeypair2.publicKey, associationKeypair.privateKey));
              state = {
                __type: "hello_req_sent",
                associationPublicKey: associationKeypair.publicKey,
                ecdhPrivateKey: ecdhKeypair2.privateKey
              };
              break;
            }
            const sharedSecret = yield parseHelloRsp(responseBuffer, state.associationPublicKey, state.ecdhPrivateKey);
            const sessionPropertiesBuffer = responseBuffer.slice(ENCODED_PUBLIC_KEY_LENGTH_BYTES);
            const sessionProperties = sessionPropertiesBuffer.byteLength !== 0 ? yield (() => __awaiter$2(this, void 0, void 0, function* () {
              const sequenceNumberVector = sessionPropertiesBuffer.slice(0, SEQUENCE_NUMBER_BYTES);
              const sequenceNumber = getSequenceNumberFromByteArray(sequenceNumberVector);
              if (sequenceNumber !== lastKnownInboundSequenceNumber + 1) {
                throw new Error("Encrypted message has invalid sequence number");
              }
              lastKnownInboundSequenceNumber = sequenceNumber;
              return parseSessionProps(sessionPropertiesBuffer, sharedSecret);
            }))() : { protocol_version: "legacy" };
            state = { __type: "connected", sharedSecret, sessionProperties };
            const wallet = createMobileWalletProxy(sessionProperties.protocol_version, (method, params) => __awaiter$2(this, void 0, void 0, function* () {
              const id = nextJsonRpcMessageId++;
              socket.send(yield encryptJsonRpcMessage({
                id,
                jsonrpc: "2.0",
                method,
                params: params !== null && params !== void 0 ? params : {}
              }, sharedSecret));
              return new Promise((resolve2, reject2) => {
                jsonRpcResponsePromises[id] = {
                  resolve(result) {
                    switch (method) {
                      case "authorize":
                      case "reauthorize": {
                        const { wallet_uri_base } = result;
                        if (wallet_uri_base != null) {
                          try {
                            assertSecureEndpointSpecificURI(wallet_uri_base);
                          } catch (e) {
                            reject2(e);
                            return;
                          }
                        }
                        break;
                      }
                    }
                    resolve2(result);
                  },
                  reject: reject2
                };
              });
            }));
            try {
              resolve(yield callback(wallet));
            } catch (e) {
              reject(e);
            } finally {
              disposeSocket();
              socket.close();
            }
            break;
          }
        }
      });
      let disposeSocket;
      let retryWaitTimeoutId;
      const attemptSocketConnection = () => {
        if (disposeSocket) {
          disposeSocket();
        }
        state = { __type: "connecting", associationKeypair };
        if (connectionStartTime === void 0) {
          connectionStartTime = Date.now();
        }
        socket = new WebSocket(websocketURL, [WEBSOCKET_PROTOCOL_BINARY]);
        socket.addEventListener("open", handleOpen);
        socket.addEventListener("close", handleClose);
        socket.addEventListener("error", handleError);
        socket.addEventListener("message", handleMessage);
        disposeSocket = () => {
          window.clearTimeout(retryWaitTimeoutId);
          socket.removeEventListener("open", handleOpen);
          socket.removeEventListener("close", handleClose);
          socket.removeEventListener("error", handleError);
          socket.removeEventListener("message", handleMessage);
        };
      };
      attemptSocketConnection();
    });
  });
}
function base(ALPHABET2) {
  if (ALPHABET2.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET2.length; i++) {
    var x = ALPHABET2.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET2.length;
  var LEADER = ALPHABET2.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode2(source) {
    if (source instanceof Uint8Array) ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length = i2;
      pbegin++;
    }
    var it2 = size - length;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET2.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    var zeroes = 0;
    var length = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var charCode = source.charCodeAt(psz);
      if (charCode > 255) {
        return;
      }
      var carry = BASE_MAP[charCode];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length = i2;
      psz++;
    }
    var it4 = size - length;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode(string2) {
    var buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error("Non-base" + BASE + " character");
  }
  return {
    encode: encode2,
    decodeUnsafe,
    decode
  };
}
var src = base;
const basex$2 = src;
const ALPHABET$3 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bs58$5 = basex$2(ALPHABET$3);
const base58 = /* @__PURE__ */ getDefaultExportFromCjs$1(bs58$5);
function __awaiter$1(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
function __classPrivateFieldGet$1$1(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet$1$1(receiver, state, value, kind, f) {
  if (typeof state === "function" ? receiver !== state || true : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return state.set(receiver, value), value;
}
var _EmbeddedModal_instances, _EmbeddedModal_root, _EmbeddedModal_eventListeners, _EmbeddedModal_listenersAttached, _EmbeddedModal_injectHTML, _EmbeddedModal_attachEventListeners, _EmbeddedModal_removeEventListeners, _EmbeddedModal_handleKeyDown;
const modalHtml = `
<div class="mobile-wallet-adapter-embedded-modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div data-modal-close style="position: absolute; width: 100%; height: 100%;"></div>
	<div class="mobile-wallet-adapter-embedded-modal-card">
		<div>
			<button data-modal-close class="mobile-wallet-adapter-embedded-modal-close">
				<svg width="14" height="14">
					<path d="M 6.7125,8.3036995 1.9082,13.108199 c -0.2113,0.2112 -0.4765,0.3168 -0.7957,0.3168 -0.3192,0 -0.5844,-0.1056 -0.7958,-0.3168 C 0.1056,12.896899 0,12.631699 0,12.312499 c 0,-0.3192 0.1056,-0.5844 0.3167,-0.7958 L 5.1212,6.7124995 0.3167,1.9082 C 0.1056,1.6969 0,1.4317 0,1.1125 0,0.7933 0.1056,0.5281 0.3167,0.3167 0.5281,0.1056 0.7933,0 1.1125,0 1.4317,0 1.6969,0.1056 1.9082,0.3167 L 6.7125,5.1212 11.5167,0.3167 C 11.7281,0.1056 11.9933,0 12.3125,0 c 0.3192,0 0.5844,0.1056 0.7957,0.3167 0.2112,0.2114 0.3168,0.4766 0.3168,0.7958 0,0.3192 -0.1056,0.5844 -0.3168,0.7957 L 8.3037001,6.7124995 13.1082,11.516699 c 0.2112,0.2114 0.3168,0.4766 0.3168,0.7958 0,0.3192 -0.1056,0.5844 -0.3168,0.7957 -0.2113,0.2112 -0.4765,0.3168 -0.7957,0.3168 -0.3192,0 -0.5844,-0.1056 -0.7958,-0.3168 z" />
				</svg>
			</button>
		</div>
		<div class="mobile-wallet-adapter-embedded-modal-content"></div>
	</div>
</div>
`;
const css$2 = `
.mobile-wallet-adapter-embedded-modal-container {
    display: flex; /* Use flexbox to center content */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    overflow-y: auto; /* enable scrolling */
}

.mobile-wallet-adapter-embedded-modal-card {
    display: flex;
    flex-direction: column;
    margin: auto 20px;
    max-width: 780px;
    padding: 20px;
    border-radius: 24px;
    background: #ffffff;
    font-family: "Inter Tight", "PT Sans", Calibri, sans-serif;
    transform: translateY(-200%);
    animation: slide-in 0.5s forwards;
}

@keyframes slide-in {
    100% { transform: translateY(0%); }
}

.mobile-wallet-adapter-embedded-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    background: #e4e9e9;
    border: none;
    border-radius: 50%;
}

.mobile-wallet-adapter-embedded-modal-close:focus-visible {
    outline-color: red;
}

.mobile-wallet-adapter-embedded-modal-close svg {
    fill: #546266;
    transition: fill 200ms ease 0s;
}

.mobile-wallet-adapter-embedded-modal-close:hover svg {
    fill: #fff;
}
`;
const fonts = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
`;
class EmbeddedModal {
  constructor() {
    _EmbeddedModal_instances.add(this);
    _EmbeddedModal_root.set(this, null);
    _EmbeddedModal_eventListeners.set(this, {});
    _EmbeddedModal_listenersAttached.set(this, false);
    this.dom = null;
    this.open = () => {
      console.debug("Modal open");
      __classPrivateFieldGet$1$1(this, _EmbeddedModal_instances, "m", _EmbeddedModal_attachEventListeners).call(this);
      if (__classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f")) {
        __classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f").style.display = "flex";
      }
    };
    this.close = (event = void 0) => {
      var _a;
      console.debug("Modal close");
      __classPrivateFieldGet$1$1(this, _EmbeddedModal_instances, "m", _EmbeddedModal_removeEventListeners).call(this);
      if (__classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f")) {
        __classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f").style.display = "none";
      }
      (_a = __classPrivateFieldGet$1$1(this, _EmbeddedModal_eventListeners, "f")["close"]) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener(event));
    };
    _EmbeddedModal_handleKeyDown.set(this, (event) => {
      if (event.key === "Escape")
        this.close(event);
    });
    this.init = this.init.bind(this);
    __classPrivateFieldSet$1$1(this, _EmbeddedModal_root, document.getElementById("mobile-wallet-adapter-embedded-root-ui"));
  }
  init() {
    return __awaiter$1(this, void 0, void 0, function* () {
      console.log("Injecting modal");
      __classPrivateFieldGet$1$1(this, _EmbeddedModal_instances, "m", _EmbeddedModal_injectHTML).call(this);
    });
  }
  addEventListener(event, listener) {
    var _a;
    ((_a = __classPrivateFieldGet$1$1(this, _EmbeddedModal_eventListeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.push(listener)) || (__classPrivateFieldGet$1$1(this, _EmbeddedModal_eventListeners, "f")[event] = [listener]);
    return () => this.removeEventListener(event, listener);
  }
  removeEventListener(event, listener) {
    var _a;
    __classPrivateFieldGet$1$1(this, _EmbeddedModal_eventListeners, "f")[event] = (_a = __classPrivateFieldGet$1$1(this, _EmbeddedModal_eventListeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.filter((existingListener) => listener !== existingListener);
  }
}
_EmbeddedModal_root = /* @__PURE__ */ new WeakMap(), _EmbeddedModal_eventListeners = /* @__PURE__ */ new WeakMap(), _EmbeddedModal_listenersAttached = /* @__PURE__ */ new WeakMap(), _EmbeddedModal_handleKeyDown = /* @__PURE__ */ new WeakMap(), _EmbeddedModal_instances = /* @__PURE__ */ new WeakSet(), _EmbeddedModal_injectHTML = function _EmbeddedModal_injectHTML2() {
  if (document.getElementById("mobile-wallet-adapter-embedded-root-ui")) {
    if (!__classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f"))
      __classPrivateFieldSet$1$1(this, _EmbeddedModal_root, document.getElementById("mobile-wallet-adapter-embedded-root-ui"));
    return;
  }
  __classPrivateFieldSet$1$1(this, _EmbeddedModal_root, document.createElement("div"));
  __classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f").id = "mobile-wallet-adapter-embedded-root-ui";
  __classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f").innerHTML = modalHtml;
  __classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f").style.display = "none";
  const content = __classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f").querySelector(".mobile-wallet-adapter-embedded-modal-content");
  if (content)
    content.innerHTML = this.contentHtml;
  const styles = document.createElement("style");
  styles.id = "mobile-wallet-adapter-embedded-modal-styles";
  styles.textContent = css$2 + this.contentStyles;
  const host = document.createElement("div");
  host.innerHTML = fonts;
  this.dom = host.attachShadow({ mode: "closed" });
  this.dom.appendChild(styles);
  this.dom.appendChild(__classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f"));
  document.body.appendChild(host);
}, _EmbeddedModal_attachEventListeners = function _EmbeddedModal_attachEventListeners2() {
  if (!__classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f") || __classPrivateFieldGet$1$1(this, _EmbeddedModal_listenersAttached, "f"))
    return;
  const closers = [...__classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f").querySelectorAll("[data-modal-close]")];
  closers.forEach((closer) => closer === null || closer === void 0 ? void 0 : closer.addEventListener("click", this.close));
  window.addEventListener("load", this.close);
  document.addEventListener("keydown", __classPrivateFieldGet$1$1(this, _EmbeddedModal_handleKeyDown, "f"));
  __classPrivateFieldSet$1$1(this, _EmbeddedModal_listenersAttached, true);
}, _EmbeddedModal_removeEventListeners = function _EmbeddedModal_removeEventListeners2() {
  if (!__classPrivateFieldGet$1$1(this, _EmbeddedModal_listenersAttached, "f"))
    return;
  window.removeEventListener("load", this.close);
  document.removeEventListener("keydown", __classPrivateFieldGet$1$1(this, _EmbeddedModal_handleKeyDown, "f"));
  if (!__classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f"))
    return;
  const closers = [...__classPrivateFieldGet$1$1(this, _EmbeddedModal_root, "f").querySelectorAll("[data-modal-close]")];
  closers.forEach((closer) => closer === null || closer === void 0 ? void 0 : closer.removeEventListener("click", this.close));
  __classPrivateFieldSet$1$1(this, _EmbeddedModal_listenersAttached, false);
};
const icon$1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03IDIuNUgxN0MxNy44Mjg0IDIuNSAxOC41IDMuMTcxNTcgMTguNSA0VjIwQzE4LjUgMjAuODI4NCAxNy44Mjg0IDIxLjUgMTcgMjEuNUg3QzYuMTcxNTcgMjEuNSA1LjUgMjAuODI4NCA1LjUgMjBWNEM1LjUgMy4xNzE1NyA2LjE3MTU3IDIuNSA3IDIuNVpNMyA0QzMgMS43OTA4NiA0Ljc5MDg2IDAgNyAwSDE3QzE5LjIwOTEgMCAyMSAxLjc5MDg2IDIxIDRWMjBDMjEgMjIuMjA5MSAxOS4yMDkxIDI0IDE3IDI0SDdDNC43OTA4NiAyNCAzIDIyLjIwOTEgMyAyMFY0Wk0xMSA0LjYxNTM4QzEwLjQ0NzcgNC42MTUzOCAxMCA1LjA2MzEgMTAgNS42MTUzOFY2LjM4NDYyQzEwIDYuOTM2OSAxMC40NDc3IDcuMzg0NjIgMTEgNy4zODQ2MkgxM0MxMy41NTIzIDcuMzg0NjIgMTQgNi45MzY5IDE0IDYuMzg0NjJWNS42MTUzOEMxNCA1LjA2MzEgMTMuNTUyMyA0LjYxNTM4IDEzIDQuNjE1MzhIMTFaIiBmaWxsPSIjRENCOEZGIi8+Cjwvc3ZnPgo=";
function fromUint8Array$1(byteArray) {
  return window.btoa(String.fromCharCode.call(null, ...byteArray));
}
function toUint8Array(base64EncodedByteArray) {
  return new Uint8Array(window.atob(base64EncodedByteArray).split("").map((c) => c.charCodeAt(0)));
}
var _LocalSolanaMobileWalletAdapterWallet_instances, _LocalSolanaMobileWalletAdapterWallet_listeners, _LocalSolanaMobileWalletAdapterWallet_version, _LocalSolanaMobileWalletAdapterWallet_name, _LocalSolanaMobileWalletAdapterWallet_url, _LocalSolanaMobileWalletAdapterWallet_icon, _LocalSolanaMobileWalletAdapterWallet_appIdentity, _LocalSolanaMobileWalletAdapterWallet_authorization, _LocalSolanaMobileWalletAdapterWallet_authorizationCache, _LocalSolanaMobileWalletAdapterWallet_connecting, _LocalSolanaMobileWalletAdapterWallet_connectionGeneration, _LocalSolanaMobileWalletAdapterWallet_chains, _LocalSolanaMobileWalletAdapterWallet_chainSelector, _LocalSolanaMobileWalletAdapterWallet_optionalFeatures, _LocalSolanaMobileWalletAdapterWallet_onWalletNotFound, _LocalSolanaMobileWalletAdapterWallet_on, _LocalSolanaMobileWalletAdapterWallet_emit, _LocalSolanaMobileWalletAdapterWallet_off, _LocalSolanaMobileWalletAdapterWallet_connect, _LocalSolanaMobileWalletAdapterWallet_performAuthorization, _LocalSolanaMobileWalletAdapterWallet_handleAuthorizationResult, _LocalSolanaMobileWalletAdapterWallet_handleWalletCapabilitiesResult, _LocalSolanaMobileWalletAdapterWallet_performReauthorization, _LocalSolanaMobileWalletAdapterWallet_disconnect, _LocalSolanaMobileWalletAdapterWallet_transact, _LocalSolanaMobileWalletAdapterWallet_assertIsAuthorized, _LocalSolanaMobileWalletAdapterWallet_accountsToWalletStandardAccounts, _LocalSolanaMobileWalletAdapterWallet_performSignTransactions, _LocalSolanaMobileWalletAdapterWallet_performSignAndSendTransaction, _LocalSolanaMobileWalletAdapterWallet_signAndSendTransaction, _LocalSolanaMobileWalletAdapterWallet_signTransaction, _LocalSolanaMobileWalletAdapterWallet_signMessage, _LocalSolanaMobileWalletAdapterWallet_signIn, _LocalSolanaMobileWalletAdapterWallet_performSignIn;
const SolanaMobileWalletAdapterWalletName$1 = "Mobile Wallet Adapter";
const SIGNATURE_LENGTH_IN_BYTES$1 = 64;
const DEFAULT_FEATURES = [SolanaSignAndSendTransaction, SolanaSignTransaction, SolanaSignMessage, SolanaSignIn];
class LocalSolanaMobileWalletAdapterWallet {
  constructor(config) {
    _LocalSolanaMobileWalletAdapterWallet_instances.add(this);
    _LocalSolanaMobileWalletAdapterWallet_listeners.set(this, {});
    _LocalSolanaMobileWalletAdapterWallet_version.set(this, "1.0.0");
    _LocalSolanaMobileWalletAdapterWallet_name.set(this, SolanaMobileWalletAdapterWalletName$1);
    _LocalSolanaMobileWalletAdapterWallet_url.set(this, "https://solanamobile.com/wallets");
    _LocalSolanaMobileWalletAdapterWallet_icon.set(this, icon$1);
    _LocalSolanaMobileWalletAdapterWallet_appIdentity.set(this, void 0);
    _LocalSolanaMobileWalletAdapterWallet_authorization.set(this, void 0);
    _LocalSolanaMobileWalletAdapterWallet_authorizationCache.set(this, void 0);
    _LocalSolanaMobileWalletAdapterWallet_connecting.set(this, false);
    _LocalSolanaMobileWalletAdapterWallet_connectionGeneration.set(this, 0);
    _LocalSolanaMobileWalletAdapterWallet_chains.set(this, []);
    _LocalSolanaMobileWalletAdapterWallet_chainSelector.set(this, void 0);
    _LocalSolanaMobileWalletAdapterWallet_optionalFeatures.set(this, void 0);
    _LocalSolanaMobileWalletAdapterWallet_onWalletNotFound.set(this, void 0);
    _LocalSolanaMobileWalletAdapterWallet_on.set(this, (event, listener) => {
      var _a;
      ((_a = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.push(listener)) || (__classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_listeners, "f")[event] = [listener]);
      return () => __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_instances, "m", _LocalSolanaMobileWalletAdapterWallet_off).call(this, event, listener);
    });
    _LocalSolanaMobileWalletAdapterWallet_connect.set(this, ({ silent } = {}) => __awaiter$1(this, void 0, void 0, function* () {
      if (__classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connecting, "f") || this.connected) {
        return { accounts: this.accounts };
      }
      __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connecting, true);
      try {
        if (silent) {
          const cachedAuthorization = yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorizationCache, "f").get();
          if (cachedAuthorization) {
            yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_handleWalletCapabilitiesResult, "f").call(this, cachedAuthorization.capabilities);
            yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_handleAuthorizationResult, "f").call(this, cachedAuthorization);
          } else {
            return { accounts: this.accounts };
          }
        } else {
          yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performAuthorization, "f").call(this);
        }
      } catch (e) {
        throw new Error(e instanceof Error && e.message || "Unknown error");
      } finally {
        __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connecting, false);
      }
      return { accounts: this.accounts };
    }));
    _LocalSolanaMobileWalletAdapterWallet_performAuthorization.set(this, (signInPayload) => __awaiter$1(this, void 0, void 0, function* () {
      try {
        const cachedAuthorizationResult = yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorizationCache, "f").get();
        if (cachedAuthorizationResult) {
          __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_handleAuthorizationResult, "f").call(this, cachedAuthorizationResult);
          return cachedAuthorizationResult;
        }
        const selectedChain = yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_chainSelector, "f").select(__classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_chains, "f"));
        return yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_transact, "f").call(this, (wallet) => __awaiter$1(this, void 0, void 0, function* () {
          const [capabilities, mwaAuthorizationResult] = yield Promise.all([
            wallet.getCapabilities(),
            wallet.authorize({
              chain: selectedChain,
              identity: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_appIdentity, "f"),
              sign_in_payload: signInPayload
            })
          ]);
          const accounts = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_accountsToWalletStandardAccounts, "f").call(this, mwaAuthorizationResult.accounts);
          const authorization = Object.assign(Object.assign({}, mwaAuthorizationResult), { accounts, chain: selectedChain, capabilities });
          Promise.all([
            __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_handleWalletCapabilitiesResult, "f").call(this, capabilities),
            __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorizationCache, "f").set(authorization),
            __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_handleAuthorizationResult, "f").call(this, authorization)
          ]);
          return authorization;
        }));
      } catch (e) {
        throw new Error(e instanceof Error && e.message || "Unknown error");
      }
    }));
    _LocalSolanaMobileWalletAdapterWallet_handleAuthorizationResult.set(this, (authorization) => __awaiter$1(this, void 0, void 0, function* () {
      var _a;
      const didPublicKeysChange = (
        // Case 1: We started from having no authorization.
        __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f") == null || // Case 2: The number of authorized accounts changed.
        ((_a = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f")) === null || _a === void 0 ? void 0 : _a.accounts.length) !== authorization.accounts.length || // Case 3: The new list of addresses isn't exactly the same as the old list, in the same order.
        __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f").accounts.some((account, ii) => account.address !== authorization.accounts[ii].address)
      );
      __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, authorization);
      if (didPublicKeysChange) {
        __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_instances, "m", _LocalSolanaMobileWalletAdapterWallet_emit).call(this, "change", { accounts: this.accounts });
      }
    }));
    _LocalSolanaMobileWalletAdapterWallet_handleWalletCapabilitiesResult.set(this, (capabilities) => __awaiter$1(this, void 0, void 0, function* () {
      const supportsSignTransaction = capabilities.features.includes("solana:signTransactions");
      const supportsSignAndSendTransaction = capabilities.supports_sign_and_send_transactions;
      const didCapabilitiesChange = SolanaSignAndSendTransaction in this.features !== supportsSignAndSendTransaction || SolanaSignTransaction in this.features !== supportsSignTransaction;
      __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_optionalFeatures, Object.assign(Object.assign({}, (supportsSignAndSendTransaction || !supportsSignAndSendTransaction && !supportsSignTransaction) && {
        [SolanaSignAndSendTransaction]: {
          version: "1.0.0",
          supportedTransactionVersions: ["legacy", 0],
          signAndSendTransaction: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_signAndSendTransaction, "f")
        }
      }), supportsSignTransaction && {
        [SolanaSignTransaction]: {
          version: "1.0.0",
          supportedTransactionVersions: ["legacy", 0],
          signTransaction: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_signTransaction, "f")
        }
      }));
      if (didCapabilitiesChange) {
        __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_instances, "m", _LocalSolanaMobileWalletAdapterWallet_emit).call(this, "change", { features: this.features });
      }
    }));
    _LocalSolanaMobileWalletAdapterWallet_performReauthorization.set(this, (wallet, authToken, chain) => __awaiter$1(this, void 0, void 0, function* () {
      var _b, _c;
      try {
        const [capabilities, mwaAuthorizationResult] = yield Promise.all([
          (_c = (_b = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f")) === null || _b === void 0 ? void 0 : _b.capabilities) !== null && _c !== void 0 ? _c : yield wallet.getCapabilities(),
          wallet.authorize({
            auth_token: authToken,
            identity: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_appIdentity, "f"),
            chain
          })
        ]);
        const accounts = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_accountsToWalletStandardAccounts, "f").call(this, mwaAuthorizationResult.accounts);
        const authorization = Object.assign(Object.assign({}, mwaAuthorizationResult), { accounts, chain, capabilities });
        Promise.all([
          __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorizationCache, "f").set(authorization),
          __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_handleAuthorizationResult, "f").call(this, authorization)
        ]);
      } catch (e) {
        __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_disconnect, "f").call(this);
        throw new Error(e instanceof Error && e.message || "Unknown error");
      }
    }));
    _LocalSolanaMobileWalletAdapterWallet_disconnect.set(this, () => __awaiter$1(this, void 0, void 0, function* () {
      var _d;
      __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorizationCache, "f").clear();
      __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connecting, false);
      __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connectionGeneration, (_d = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connectionGeneration, "f"), _d++, _d));
      __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, void 0);
      __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_instances, "m", _LocalSolanaMobileWalletAdapterWallet_emit).call(this, "change", { accounts: this.accounts });
    }));
    _LocalSolanaMobileWalletAdapterWallet_transact.set(this, (callback) => __awaiter$1(this, void 0, void 0, function* () {
      var _e;
      const walletUriBase = (_e = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f")) === null || _e === void 0 ? void 0 : _e.wallet_uri_base;
      const config2 = walletUriBase ? { baseUri: walletUriBase } : void 0;
      const currentConnectionGeneration = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connectionGeneration, "f");
      try {
        return yield transact(callback, config2);
      } catch (e) {
        if (__classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connectionGeneration, "f") !== currentConnectionGeneration) {
          yield new Promise(() => {
          });
        }
        if (e instanceof Error && e.name === "SolanaMobileWalletAdapterError" && e.code === "ERROR_WALLET_NOT_FOUND") {
          yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_onWalletNotFound, "f").call(this, this);
        }
        throw e;
      }
    }));
    _LocalSolanaMobileWalletAdapterWallet_assertIsAuthorized.set(this, () => {
      if (!__classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f"))
        throw new Error("Wallet not connected");
      return { authToken: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f").auth_token, chain: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f").chain };
    });
    _LocalSolanaMobileWalletAdapterWallet_accountsToWalletStandardAccounts.set(this, (accounts) => {
      return accounts.map((account) => {
        var _a, _b;
        const publicKey2 = toUint8Array(account.address);
        return {
          address: base58.encode(publicKey2),
          publicKey: publicKey2,
          label: account.label,
          icon: account.icon,
          chains: (_a = account.chains) !== null && _a !== void 0 ? _a : __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_chains, "f"),
          // TODO: get supported features from getCapabilities API 
          features: (_b = account.features) !== null && _b !== void 0 ? _b : DEFAULT_FEATURES
        };
      });
    });
    _LocalSolanaMobileWalletAdapterWallet_performSignTransactions.set(this, (transactions) => __awaiter$1(this, void 0, void 0, function* () {
      const { authToken, chain } = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_assertIsAuthorized, "f").call(this);
      try {
        const base64Transactions = transactions.map((tx) => {
          return fromUint8Array$1(tx);
        });
        return yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_transact, "f").call(this, (wallet) => __awaiter$1(this, void 0, void 0, function* () {
          yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performReauthorization, "f").call(this, wallet, authToken, chain);
          const signedTransactions = (yield wallet.signTransactions({
            payloads: base64Transactions
          })).signed_payloads.map(toUint8Array);
          return signedTransactions;
        }));
      } catch (e) {
        throw new Error(e instanceof Error && e.message || "Unknown error");
      }
    }));
    _LocalSolanaMobileWalletAdapterWallet_performSignAndSendTransaction.set(this, (transaction, options) => __awaiter$1(this, void 0, void 0, function* () {
      const { authToken, chain } = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_assertIsAuthorized, "f").call(this);
      try {
        return yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_transact, "f").call(this, (wallet) => __awaiter$1(this, void 0, void 0, function* () {
          const [capabilities, _1] = yield Promise.all([
            wallet.getCapabilities(),
            __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performReauthorization, "f").call(this, wallet, authToken, chain)
          ]);
          if (capabilities.supports_sign_and_send_transactions) {
            const base64Transaction = fromUint8Array$1(transaction);
            const signatures = (yield wallet.signAndSendTransactions(Object.assign(Object.assign({}, options), { payloads: [base64Transaction] }))).signatures.map(toUint8Array);
            return signatures[0];
          } else {
            throw new Error("connected wallet does not support signAndSendTransaction");
          }
        }));
      } catch (e) {
        throw new Error(e instanceof Error && e.message || "Unknown error");
      }
    }));
    _LocalSolanaMobileWalletAdapterWallet_signAndSendTransaction.set(this, (...inputs) => __awaiter$1(this, void 0, void 0, function* () {
      const outputs = [];
      for (const input of inputs) {
        const signature2 = yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performSignAndSendTransaction, "f").call(this, input.transaction, input.options);
        outputs.push({ signature: signature2 });
      }
      return outputs;
    }));
    _LocalSolanaMobileWalletAdapterWallet_signTransaction.set(this, (...inputs) => __awaiter$1(this, void 0, void 0, function* () {
      return (yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performSignTransactions, "f").call(this, inputs.map(({ transaction }) => transaction))).map((signedTransaction) => {
        return { signedTransaction };
      });
    }));
    _LocalSolanaMobileWalletAdapterWallet_signMessage.set(this, (...inputs) => __awaiter$1(this, void 0, void 0, function* () {
      const { authToken, chain } = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_assertIsAuthorized, "f").call(this);
      const addresses = inputs.map(({ account }) => fromUint8Array$1(account.publicKey));
      const messages = inputs.map(({ message }) => fromUint8Array$1(message));
      try {
        return yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_transact, "f").call(this, (wallet) => __awaiter$1(this, void 0, void 0, function* () {
          yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performReauthorization, "f").call(this, wallet, authToken, chain);
          const signedMessages = (yield wallet.signMessages({
            addresses,
            payloads: messages
          })).signed_payloads.map(toUint8Array);
          return signedMessages.map((signedMessage) => {
            return { signedMessage, signature: signedMessage.slice(-SIGNATURE_LENGTH_IN_BYTES$1) };
          });
        }));
      } catch (e) {
        throw new Error(e instanceof Error && e.message || "Unknown error");
      }
    }));
    _LocalSolanaMobileWalletAdapterWallet_signIn.set(this, (...inputs) => __awaiter$1(this, void 0, void 0, function* () {
      const outputs = [];
      if (inputs.length > 1) {
        for (const input of inputs) {
          outputs.push(yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performSignIn, "f").call(this, input));
        }
      } else {
        return [yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performSignIn, "f").call(this, inputs[0])];
      }
      return outputs;
    }));
    _LocalSolanaMobileWalletAdapterWallet_performSignIn.set(this, (input) => __awaiter$1(this, void 0, void 0, function* () {
      var _f, _g, _h;
      __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connecting, true);
      try {
        const authorizationResult = yield __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_performAuthorization, "f").call(this, Object.assign(Object.assign({}, input), { domain: (_f = input === null || input === void 0 ? void 0 : input.domain) !== null && _f !== void 0 ? _f : window.location.host }));
        if (!authorizationResult.sign_in_result) {
          throw new Error("Sign in failed, no sign in result returned by wallet");
        }
        const signedInAddress = authorizationResult.sign_in_result.address;
        const signedInAccount = authorizationResult.accounts.find((acc) => acc.address == signedInAddress);
        return {
          account: Object.assign(Object.assign({}, signedInAccount !== null && signedInAccount !== void 0 ? signedInAccount : {
            address: base58.encode(toUint8Array(signedInAddress))
          }), { publicKey: toUint8Array(signedInAddress), chains: (_g = signedInAccount === null || signedInAccount === void 0 ? void 0 : signedInAccount.chains) !== null && _g !== void 0 ? _g : __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_chains, "f"), features: (_h = signedInAccount === null || signedInAccount === void 0 ? void 0 : signedInAccount.features) !== null && _h !== void 0 ? _h : authorizationResult.capabilities.features }),
          signedMessage: toUint8Array(authorizationResult.sign_in_result.signed_message),
          signature: toUint8Array(authorizationResult.sign_in_result.signature)
        };
      } catch (e) {
        throw new Error(e instanceof Error && e.message || "Unknown error");
      } finally {
        __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connecting, false);
      }
    }));
    __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorizationCache, config.authorizationCache);
    __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_appIdentity, config.appIdentity);
    __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_chains, config.chains);
    __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_chainSelector, config.chainSelector);
    __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_onWalletNotFound, config.onWalletNotFound);
    __classPrivateFieldSet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_optionalFeatures, {
      // In MWA 1.0, signAndSend is optional and signTransaction is mandatory. Whereas in MWA 2.0+,
      // signAndSend is mandatory and signTransaction is optional (and soft deprecated). As of mid
      // 2025, all MWA wallets support both signAndSendTransaction and signTransaction so its safe
      // assume both are supported here. The features will be updated based on the actual connected 
      // wallets capabilities during connection regardless, so this is safe. 
      [SolanaSignAndSendTransaction]: {
        version: "1.0.0",
        supportedTransactionVersions: ["legacy", 0],
        signAndSendTransaction: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_signAndSendTransaction, "f")
      },
      [SolanaSignTransaction]: {
        version: "1.0.0",
        supportedTransactionVersions: ["legacy", 0],
        signTransaction: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_signTransaction, "f")
      }
    });
  }
  get version() {
    return __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_version, "f");
  }
  get name() {
    return __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_name, "f");
  }
  get url() {
    return __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_url, "f");
  }
  get icon() {
    return __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_icon, "f");
  }
  get chains() {
    return __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_chains, "f");
  }
  get features() {
    return Object.assign({ [StandardConnect$1]: {
      version: "1.0.0",
      connect: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_connect, "f")
    }, [StandardDisconnect$1]: {
      version: "1.0.0",
      disconnect: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_disconnect, "f")
    }, [StandardEvents$1]: {
      version: "1.0.0",
      on: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_on, "f")
    }, [SolanaSignMessage]: {
      version: "1.0.0",
      signMessage: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_signMessage, "f")
    }, [SolanaSignIn]: {
      version: "1.0.0",
      signIn: __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_signIn, "f")
    } }, __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_optionalFeatures, "f"));
  }
  get accounts() {
    var _a, _b;
    return (_b = (_a = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f")) === null || _a === void 0 ? void 0 : _a.accounts) !== null && _b !== void 0 ? _b : [];
  }
  get connected() {
    return !!__classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f");
  }
  get isAuthorized() {
    return !!__classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f");
  }
  get currentAuthorization() {
    return __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorization, "f");
  }
  get cachedAuthorizationResult() {
    return __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_authorizationCache, "f").get();
  }
}
_LocalSolanaMobileWalletAdapterWallet_listeners = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_version = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_name = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_url = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_icon = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_appIdentity = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_authorization = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_authorizationCache = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_connecting = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_connectionGeneration = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_chains = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_chainSelector = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_optionalFeatures = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_onWalletNotFound = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_on = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_connect = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_performAuthorization = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_handleAuthorizationResult = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_handleWalletCapabilitiesResult = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_performReauthorization = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_disconnect = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_transact = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_assertIsAuthorized = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_accountsToWalletStandardAccounts = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_performSignTransactions = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_performSignAndSendTransaction = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_signAndSendTransaction = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_signTransaction = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_signMessage = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_signIn = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_performSignIn = /* @__PURE__ */ new WeakMap(), _LocalSolanaMobileWalletAdapterWallet_instances = /* @__PURE__ */ new WeakSet(), _LocalSolanaMobileWalletAdapterWallet_emit = function _LocalSolanaMobileWalletAdapterWallet_emit2(event, ...args) {
  var _a;
  (_a = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener.apply(null, args));
}, _LocalSolanaMobileWalletAdapterWallet_off = function _LocalSolanaMobileWalletAdapterWallet_off2(event, listener) {
  var _a;
  __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_listeners, "f")[event] = (_a = __classPrivateFieldGet$1$1(this, _LocalSolanaMobileWalletAdapterWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.filter((existingListener) => listener !== existingListener);
};
const WALLET_NOT_FOUND_ERROR_MESSAGE = "To use mobile wallet adapter, you must have a compatible mobile wallet application installed on your device.";
const BROWSER_NOT_SUPPORTED_ERROR_MESSAGE = "This browser appears to be incompatible with mobile wallet adapter. Open this page in a compatible mobile browser app and try again.";
class ErrorModal extends EmbeddedModal {
  constructor() {
    super(...arguments);
    this.contentStyles = css;
    this.contentHtml = ErrorDialogHtml;
  }
  initWithError(error) {
    super.init();
    this.populateError(error);
  }
  populateError(error) {
    var _a, _b;
    const errorMessageElement = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.getElementById("mobile-wallet-adapter-error-message");
    const actionBtn = (_b = this.dom) === null || _b === void 0 ? void 0 : _b.getElementById("mobile-wallet-adapter-error-action");
    if (errorMessageElement) {
      if (error.name === "SolanaMobileWalletAdapterError") {
        switch (error.code) {
          case "ERROR_WALLET_NOT_FOUND":
            errorMessageElement.innerHTML = WALLET_NOT_FOUND_ERROR_MESSAGE;
            if (actionBtn)
              actionBtn.addEventListener("click", () => {
                window.location.href = "https://solanamobile.com/wallets";
              });
            return;
          case "ERROR_BROWSER_NOT_SUPPORTED":
            errorMessageElement.innerHTML = BROWSER_NOT_SUPPORTED_ERROR_MESSAGE;
            if (actionBtn)
              actionBtn.style.display = "none";
            return;
        }
      }
      errorMessageElement.innerHTML = `An unexpected error occurred: ${error.message}`;
    } else {
      console.log("Failed to locate error dialog element");
    }
  }
}
const ErrorDialogHtml = `
<svg class="mobile-wallet-adapter-embedded-modal-error-icon" xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="M 280,-80 Q 197,-80 138.5,-138.5 80,-197 80,-280 80,-363 138.5,-421.5 197,-480 280,-480 q 83,0 141.5,58.5 58.5,58.5 58.5,141.5 0,83 -58.5,141.5 Q 363,-80 280,-80 Z M 824,-120 568,-376 Q 556,-389 542.5,-402.5 529,-416 516,-428 q 38,-24 61,-64 23,-40 23,-88 0,-75 -52.5,-127.5 Q 495,-760 420,-760 345,-760 292.5,-707.5 240,-655 240,-580 q 0,6 0.5,11.5 0.5,5.5 1.5,11.5 -18,2 -39.5,8 -21.5,6 -38.5,14 -2,-11 -3,-22 -1,-11 -1,-23 0,-109 75.5,-184.5 Q 311,-840 420,-840 q 109,0 184.5,75.5 75.5,75.5 75.5,184.5 0,43 -13.5,81.5 Q 653,-460 629,-428 l 251,252 z m -615,-61 71,-71 70,71 29,-28 -71,-71 71,-71 -28,-28 -71,71 -71,-71 -28,28 71,71 -71,71 z"/></svg>
<div class="mobile-wallet-adapter-embedded-modal-title">We can't find a wallet.</div>
<div id="mobile-wallet-adapter-error-message" class="mobile-wallet-adapter-embedded-modal-subtitle"></div>
<div>
    <button data-error-action id="mobile-wallet-adapter-error-action" class="mobile-wallet-adapter-embedded-modal-error-action">
        Find a wallet
    </button>
</div>
`;
const css = `
.mobile-wallet-adapter-embedded-modal-content {
    text-align: center;
}

.mobile-wallet-adapter-embedded-modal-error-icon {
    margin-top: 24px;
}

.mobile-wallet-adapter-embedded-modal-title {
    margin: 18px 100px auto 100px;
    color: #000000;
    font-size: 2.75em;
    font-weight: 600;
}

.mobile-wallet-adapter-embedded-modal-subtitle {
    margin: 30px 60px 40px 60px;
    color: #000000;
    font-size: 1.25em;
    font-weight: 400;
}

.mobile-wallet-adapter-embedded-modal-error-action {
    display: block;
    width: 100%;
    height: 56px;
    /*margin-top: 40px;*/
    font-size: 1.25em;
    /*line-height: 24px;*/
    /*letter-spacing: -1%;*/
    background: #000000;
    color: #FFFFFF;
    border-radius: 18px;
}

/* Smaller screens */
@media all and (max-width: 600px) {
    .mobile-wallet-adapter-embedded-modal-title {
        font-size: 1.5em;
        margin-right: 12px;
        margin-left: 12px;
    }
    .mobile-wallet-adapter-embedded-modal-subtitle {
        margin-right: 12px;
        margin-left: 12px;
    }
}
`;
function defaultErrorModalWalletNotFoundHandler() {
  return __awaiter$1(this, void 0, void 0, function* () {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const errorDialog = new ErrorModal();
      if (userAgent.includes("wv")) {
        errorDialog.initWithError({
          name: "SolanaMobileWalletAdapterError",
          code: "ERROR_BROWSER_NOT_SUPPORTED",
          message: ""
        });
      } else {
        errorDialog.initWithError({
          name: "SolanaMobileWalletAdapterError",
          code: "ERROR_WALLET_NOT_FOUND",
          message: ""
        });
      }
      errorDialog.open();
    }
  });
}
const CACHE_KEY = "SolanaMobileWalletAdapterDefaultAuthorizationCache";
function createDefaultAuthorizationCache() {
  let storage;
  try {
    storage = window.localStorage;
  } catch (_a) {
  }
  return {
    clear() {
      return __awaiter$1(this, void 0, void 0, function* () {
        if (!storage) {
          return;
        }
        try {
          storage.removeItem(CACHE_KEY);
        } catch (_a) {
        }
      });
    },
    get() {
      return __awaiter$1(this, void 0, void 0, function* () {
        if (!storage) {
          return;
        }
        try {
          const parsed = JSON.parse(storage.getItem(CACHE_KEY));
          if (parsed && parsed.accounts) {
            const parsedAccounts = parsed.accounts.map((account) => {
              return Object.assign(Object.assign({}, account), { publicKey: "publicKey" in account ? new Uint8Array(Object.values(account.publicKey)) : base58.decode(account.address) });
            });
            return Object.assign(Object.assign({}, parsed), { accounts: parsedAccounts });
          } else
            return parsed || void 0;
        } catch (_a) {
        }
      });
    },
    set(authorization) {
      return __awaiter$1(this, void 0, void 0, function* () {
        if (!storage) {
          return;
        }
        try {
          storage.setItem(CACHE_KEY, JSON.stringify(authorization));
        } catch (_a) {
        }
      });
    }
  };
}
function createDefaultChainSelector() {
  return {
    select(chains) {
      return __awaiter$1(this, void 0, void 0, function* () {
        if (chains.length === 1) {
          return chains[0];
        } else if (chains.includes(SOLANA_MAINNET_CHAIN)) {
          return SOLANA_MAINNET_CHAIN;
        } else
          return chains[0];
      });
    }
  };
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
function __classPrivateFieldGet$1(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet$1(receiver, state, value, kind, f) {
  if (typeof state === "function" ? receiver !== state || true : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return state.set(receiver, value), value;
}
const StandardConnect = "standard:connect";
const StandardDisconnect = "standard:disconnect";
const StandardEvents = "standard:events";
function fromUint8Array(byteArray) {
  return window.btoa(String.fromCharCode.call(null, ...byteArray));
}
function getIsSupported() {
  return typeof window !== "undefined" && window.isSecureContext && typeof document !== "undefined" && /android/i.test(navigator.userAgent);
}
var _BaseSolanaMobileWalletAdapter_instances, _BaseSolanaMobileWalletAdapter_wallet, _BaseSolanaMobileWalletAdapter_connecting, _BaseSolanaMobileWalletAdapter_readyState, _BaseSolanaMobileWalletAdapter_accountSelector, _BaseSolanaMobileWalletAdapter_selectedAccount, _BaseSolanaMobileWalletAdapter_publicKey, _BaseSolanaMobileWalletAdapter_handleChangeEvent, _BaseSolanaMobileWalletAdapter_connect, _BaseSolanaMobileWalletAdapter_declareWalletAsInstalled, _BaseSolanaMobileWalletAdapter_assertIsAuthorized, _BaseSolanaMobileWalletAdapter_performSignTransactions, _BaseSolanaMobileWalletAdapter_runWithGuard;
const SolanaMobileWalletAdapterWalletName = SolanaMobileWalletAdapterWalletName$1;
const SIGNATURE_LENGTH_IN_BYTES = 64;
function isVersionedTransaction(transaction) {
  return "version" in transaction;
}
function chainOrClusterToChainId(chain) {
  switch (chain) {
    case "mainnet-beta":
      return "solana:mainnet";
    case "testnet":
      return "solana:testnet";
    case "devnet":
      return "solana:devnet";
    default:
      return chain;
  }
}
class BaseSolanaMobileWalletAdapter extends BaseSignInMessageSignerWalletAdapter {
  constructor(wallet, config) {
    super();
    _BaseSolanaMobileWalletAdapter_instances.add(this);
    this.supportedTransactionVersions = /* @__PURE__ */ new Set(
      // FIXME(#244): We can't actually know what versions are supported until we know which wallet we're talking to.
      ["legacy", 0]
    );
    _BaseSolanaMobileWalletAdapter_wallet.set(this, void 0);
    _BaseSolanaMobileWalletAdapter_connecting.set(this, false);
    _BaseSolanaMobileWalletAdapter_readyState.set(this, getIsSupported() ? WalletReadyState.Loadable : WalletReadyState.Unsupported);
    _BaseSolanaMobileWalletAdapter_accountSelector.set(this, void 0);
    _BaseSolanaMobileWalletAdapter_selectedAccount.set(this, void 0);
    _BaseSolanaMobileWalletAdapter_publicKey.set(this, void 0);
    _BaseSolanaMobileWalletAdapter_handleChangeEvent.set(this, (properties) => __awaiter(this, void 0, void 0, function* () {
      if (properties.accounts && properties.accounts.length > 0) {
        __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_declareWalletAsInstalled).call(this);
        const nextSelectedAccount = yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_accountSelector, "f").call(this, properties.accounts);
        if (nextSelectedAccount !== __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_selectedAccount, "f")) {
          __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_selectedAccount, nextSelectedAccount);
          __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_publicKey, void 0);
          this.emit(
            "connect",
            // Having just set `this.#selectedAccount`, `this.publicKey` is definitely non-null
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.publicKey
          );
        }
      }
    }));
    __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_accountSelector, (accounts) => __awaiter(this, void 0, void 0, function* () {
      var _a;
      const selectedBase64EncodedAddress = yield config.addressSelector.select(accounts.map(({ publicKey: publicKey2 }) => fromUint8Array(publicKey2)));
      return (_a = accounts.find(({ publicKey: publicKey2 }) => fromUint8Array(publicKey2) === selectedBase64EncodedAddress)) !== null && _a !== void 0 ? _a : accounts[0];
    }));
    __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_wallet, wallet);
    __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[StandardEvents].on("change", __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_handleChangeEvent, "f"));
    this.name = __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").name;
    this.icon = __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").icon;
    this.url = __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").url;
  }
  get publicKey() {
    var _a;
    if (!__classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_publicKey, "f") && __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_selectedAccount, "f")) {
      try {
        __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_publicKey, new PublicKey(__classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_selectedAccount, "f").publicKey), "f");
      } catch (e) {
        throw new WalletPublicKeyError(e instanceof Error && (e === null || e === void 0 ? void 0 : e.message) || "Unknown error", e);
      }
    }
    return (_a = __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_publicKey, "f")) !== null && _a !== void 0 ? _a : null;
  }
  get connected() {
    return __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").connected;
  }
  get connecting() {
    return __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_connecting, "f");
  }
  get readyState() {
    return __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_readyState, "f");
  }
  /** @deprecated Use `autoConnect()` instead. */
  autoConnect_DO_NOT_USE_OR_YOU_WILL_BE_FIRED() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.autoConnect();
    });
  }
  autoConnect() {
    return __awaiter(this, void 0, void 0, function* () {
      __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_connect).call(this, true);
    });
  }
  connect() {
    return __awaiter(this, void 0, void 0, function* () {
      __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_connect).call(this);
    });
  }
  /** @deprecated Use `connect()` or `autoConnect()` instead. */
  performAuthorization(signInPayload) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const cachedAuthorizationResult = yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").cachedAuthorizationResult;
        if (cachedAuthorizationResult) {
          yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[StandardConnect].connect({ silent: true });
          return cachedAuthorizationResult;
        }
        if (signInPayload) {
          yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[SolanaSignIn].signIn(signInPayload);
        } else
          yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[StandardConnect].connect();
        const authorizationResult = yield yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").cachedAuthorizationResult;
        return authorizationResult;
      } catch (e) {
        throw new WalletConnectionError(e instanceof Error && e.message || "Unknown error", e);
      }
    });
  }
  disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_runWithGuard).call(this, () => __awaiter(this, void 0, void 0, function* () {
        __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_connecting, false);
        __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_publicKey, void 0);
        __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_selectedAccount, void 0);
        yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[StandardDisconnect].disconnect();
        this.emit("disconnect");
      }));
    });
  }
  signIn(input) {
    return __awaiter(this, void 0, void 0, function* () {
      return __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_runWithGuard).call(this, () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (__classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_readyState, "f") !== WalletReadyState.Installed && __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_readyState, "f") !== WalletReadyState.Loadable) {
          throw new WalletNotReadyError();
        }
        __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_connecting, true);
        try {
          const outputs = yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[SolanaSignIn].signIn(Object.assign(Object.assign({}, input), { domain: (_a = input === null || input === void 0 ? void 0 : input.domain) !== null && _a !== void 0 ? _a : window.location.host }));
          if (outputs.length > 0) {
            return outputs[0];
          } else {
            throw new Error("Sign in failed, no sign in result returned by wallet");
          }
        } catch (e) {
          throw new WalletConnectionError(e instanceof Error && e.message || "Unknown error", e);
        } finally {
          __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_connecting, false);
        }
      }));
    });
  }
  signMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_runWithGuard).call(this, () => __awaiter(this, void 0, void 0, function* () {
        const account = __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_assertIsAuthorized).call(this);
        try {
          const outputs = yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[SolanaSignMessage].signMessage({
            account,
            message
          });
          return outputs[0].signature;
        } catch (error) {
          throw new WalletSignMessageError(error === null || error === void 0 ? void 0 : error.message, error);
        }
      }));
    });
  }
  sendTransaction(transaction, connection, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_runWithGuard).call(this, () => __awaiter(this, void 0, void 0, function* () {
        const account = __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_assertIsAuthorized).call(this);
        try {
          let getTargetCommitment = function() {
            let targetCommitment;
            switch (connection.commitment) {
              case "confirmed":
              case "finalized":
              case "processed":
                targetCommitment = connection.commitment;
                break;
              default:
                targetCommitment = "finalized";
            }
            let targetPreflightCommitment;
            switch (options === null || options === void 0 ? void 0 : options.preflightCommitment) {
              case "confirmed":
              case "finalized":
              case "processed":
                targetPreflightCommitment = options.preflightCommitment;
                break;
              case void 0:
                targetPreflightCommitment = targetCommitment;
                break;
              default:
                targetPreflightCommitment = "finalized";
            }
            const preflightCommitmentScore = targetPreflightCommitment === "finalized" ? 2 : targetPreflightCommitment === "confirmed" ? 1 : 0;
            const targetCommitmentScore = targetCommitment === "finalized" ? 2 : targetCommitment === "confirmed" ? 1 : 0;
            return preflightCommitmentScore < targetCommitmentScore ? targetPreflightCommitment : targetCommitment;
          };
          if (SolanaSignAndSendTransaction in __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features) {
            const chain = chainOrClusterToChainId(__classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").currentAuthorization.chain);
            const [signature2] = (yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[SolanaSignAndSendTransaction].signAndSendTransaction({
              account,
              transaction: transaction.serialize(),
              chain,
              options: options ? {
                skipPreflight: options.skipPreflight,
                maxRetries: options.maxRetries
              } : void 0
            })).map((output) => {
              return fromUint8Array(output.signature);
            });
            return signature2;
          } else {
            const [signedTransaction] = yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_performSignTransactions).call(this, [transaction]);
            if (isVersionedTransaction(signedTransaction)) {
              return yield connection.sendTransaction(signedTransaction);
            } else {
              const serializedTransaction = signedTransaction.serialize();
              return yield connection.sendRawTransaction(serializedTransaction, Object.assign(Object.assign({}, options), { preflightCommitment: getTargetCommitment() }));
            }
          }
        } catch (error) {
          throw new WalletSendTransactionError(error === null || error === void 0 ? void 0 : error.message, error);
        }
      }));
    });
  }
  signTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_runWithGuard).call(this, () => __awaiter(this, void 0, void 0, function* () {
        const [signedTransaction] = yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_performSignTransactions).call(this, [transaction]);
        return signedTransaction;
      }));
    });
  }
  signAllTransactions(transactions) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_runWithGuard).call(this, () => __awaiter(this, void 0, void 0, function* () {
        const signedTransactions = yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_performSignTransactions).call(this, transactions);
        return signedTransactions;
      }));
    });
  }
}
_BaseSolanaMobileWalletAdapter_wallet = /* @__PURE__ */ new WeakMap(), _BaseSolanaMobileWalletAdapter_connecting = /* @__PURE__ */ new WeakMap(), _BaseSolanaMobileWalletAdapter_readyState = /* @__PURE__ */ new WeakMap(), _BaseSolanaMobileWalletAdapter_accountSelector = /* @__PURE__ */ new WeakMap(), _BaseSolanaMobileWalletAdapter_selectedAccount = /* @__PURE__ */ new WeakMap(), _BaseSolanaMobileWalletAdapter_publicKey = /* @__PURE__ */ new WeakMap(), _BaseSolanaMobileWalletAdapter_handleChangeEvent = /* @__PURE__ */ new WeakMap(), _BaseSolanaMobileWalletAdapter_instances = /* @__PURE__ */ new WeakSet(), _BaseSolanaMobileWalletAdapter_connect = function _BaseSolanaMobileWalletAdapter_connect2(autoConnect = false) {
  return __awaiter(this, void 0, void 0, function* () {
    if (this.connecting || this.connected) {
      return;
    }
    return yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_runWithGuard).call(this, () => __awaiter(this, void 0, void 0, function* () {
      if (__classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_readyState, "f") !== WalletReadyState.Installed && __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_readyState, "f") !== WalletReadyState.Loadable) {
        throw new WalletNotReadyError();
      }
      __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_connecting, true);
      try {
        yield __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[StandardConnect].connect({ silent: autoConnect });
      } catch (e) {
        throw new WalletConnectionError(e instanceof Error && e.message || "Unknown error", e);
      } finally {
        __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_connecting, false);
      }
    }));
  });
}, _BaseSolanaMobileWalletAdapter_declareWalletAsInstalled = function _BaseSolanaMobileWalletAdapter_declareWalletAsInstalled2() {
  if (__classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_readyState, "f") !== WalletReadyState.Installed) {
    this.emit("readyStateChange", __classPrivateFieldSet$1(this, _BaseSolanaMobileWalletAdapter_readyState, WalletReadyState.Installed));
  }
}, _BaseSolanaMobileWalletAdapter_assertIsAuthorized = function _BaseSolanaMobileWalletAdapter_assertIsAuthorized2() {
  if (!__classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").isAuthorized || !__classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_selectedAccount, "f"))
    throw new WalletNotConnectedError();
  return __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_selectedAccount, "f");
}, _BaseSolanaMobileWalletAdapter_performSignTransactions = function _BaseSolanaMobileWalletAdapter_performSignTransactions2(transactions) {
  return __awaiter(this, void 0, void 0, function* () {
    const account = __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_instances, "m", _BaseSolanaMobileWalletAdapter_assertIsAuthorized).call(this);
    try {
      if (SolanaSignTransaction in __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features) {
        return __classPrivateFieldGet$1(this, _BaseSolanaMobileWalletAdapter_wallet, "f").features[SolanaSignTransaction].signTransaction(...transactions.map((value) => {
          return { account, transaction: value.serialize() };
        })).then((outputs) => {
          return outputs.map((output) => {
            const byteArray = output.signedTransaction;
            const numSignatures = byteArray[0];
            const messageOffset = numSignatures * SIGNATURE_LENGTH_IN_BYTES + 1;
            const version = VersionedMessage.deserializeMessageVersion(byteArray.slice(messageOffset, byteArray.length));
            if (version === "legacy") {
              return Transaction.from(byteArray);
            } else {
              return VersionedTransaction.deserialize(byteArray);
            }
          });
        });
      } else {
        throw new Error("Connected wallet does not support signing transactions");
      }
    } catch (error) {
      throw new WalletSignTransactionError(error === null || error === void 0 ? void 0 : error.message, error);
    }
  });
}, _BaseSolanaMobileWalletAdapter_runWithGuard = function _BaseSolanaMobileWalletAdapter_runWithGuard2(callback) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      return yield callback();
    } catch (e) {
      this.emit("error", e);
      throw e;
    }
  });
};
class LocalSolanaMobileWalletAdapter extends BaseSolanaMobileWalletAdapter {
  constructor(config) {
    var _a;
    const chain = chainOrClusterToChainId((_a = config.chain) !== null && _a !== void 0 ? _a : config.cluster);
    super(new LocalSolanaMobileWalletAdapterWallet({
      appIdentity: config.appIdentity,
      authorizationCache: {
        set: config.authorizationResultCache.set,
        get: () => __awaiter(this, void 0, void 0, function* () {
          return yield config.authorizationResultCache.get();
        }),
        clear: config.authorizationResultCache.clear
      },
      chains: [chain],
      chainSelector: createDefaultChainSelector(),
      onWalletNotFound: () => __awaiter(this, void 0, void 0, function* () {
        config.onWalletNotFound(this);
      })
    }), {
      addressSelector: config.addressSelector,
      chain
    });
  }
}
class SolanaMobileWalletAdapter extends LocalSolanaMobileWalletAdapter {
}
function createDefaultAddressSelector() {
  return {
    select(addresses) {
      return __awaiter(this, void 0, void 0, function* () {
        return addresses[0];
      });
    }
  };
}
function createDefaultAuthorizationResultCache() {
  return createDefaultAuthorizationCache();
}
function defaultWalletNotFoundHandler(mobileWalletAdapter) {
  return __awaiter(this, void 0, void 0, function* () {
    return defaultErrorModalWalletNotFoundHandler();
  });
}
function createDefaultWalletNotFoundHandler() {
  return defaultWalletNotFoundHandler;
}
var ALPHABET$2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const bs58$4 = base$2(ALPHABET$2);
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var naclFast = { exports: {} };
(function(module) {
  (function(nacl2) {
    var gf = function(init) {
      var i, r = new Float64Array(16);
      if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
      return r;
    };
    var randombytes = function() {
      throw new Error("no PRNG");
    };
    var _0 = new Uint8Array(16);
    var _9 = new Uint8Array(32);
    _9[0] = 9;
    var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
    function ts64(x, i, h, l) {
      x[i] = h >> 24 & 255;
      x[i + 1] = h >> 16 & 255;
      x[i + 2] = h >> 8 & 255;
      x[i + 3] = h & 255;
      x[i + 4] = l >> 24 & 255;
      x[i + 5] = l >> 16 & 255;
      x[i + 6] = l >> 8 & 255;
      x[i + 7] = l & 255;
    }
    function vn(x, xi, y, yi, n) {
      var i, d = 0;
      for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
      return (1 & d - 1 >>> 8) - 1;
    }
    function crypto_verify_16(x, xi, y, yi) {
      return vn(x, xi, y, yi, 16);
    }
    function crypto_verify_32(x, xi, y, yi) {
      return vn(x, xi, y, yi, 32);
    }
    function core_salsa20(o, p, k, c) {
      var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
      var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
      for (var i = 0; i < 20; i += 2) {
        u = x0 + x12 | 0;
        x4 ^= u << 7 | u >>> 32 - 7;
        u = x4 + x0 | 0;
        x8 ^= u << 9 | u >>> 32 - 9;
        u = x8 + x4 | 0;
        x12 ^= u << 13 | u >>> 32 - 13;
        u = x12 + x8 | 0;
        x0 ^= u << 18 | u >>> 32 - 18;
        u = x5 + x1 | 0;
        x9 ^= u << 7 | u >>> 32 - 7;
        u = x9 + x5 | 0;
        x13 ^= u << 9 | u >>> 32 - 9;
        u = x13 + x9 | 0;
        x1 ^= u << 13 | u >>> 32 - 13;
        u = x1 + x13 | 0;
        x5 ^= u << 18 | u >>> 32 - 18;
        u = x10 + x6 | 0;
        x14 ^= u << 7 | u >>> 32 - 7;
        u = x14 + x10 | 0;
        x2 ^= u << 9 | u >>> 32 - 9;
        u = x2 + x14 | 0;
        x6 ^= u << 13 | u >>> 32 - 13;
        u = x6 + x2 | 0;
        x10 ^= u << 18 | u >>> 32 - 18;
        u = x15 + x11 | 0;
        x3 ^= u << 7 | u >>> 32 - 7;
        u = x3 + x15 | 0;
        x7 ^= u << 9 | u >>> 32 - 9;
        u = x7 + x3 | 0;
        x11 ^= u << 13 | u >>> 32 - 13;
        u = x11 + x7 | 0;
        x15 ^= u << 18 | u >>> 32 - 18;
        u = x0 + x3 | 0;
        x1 ^= u << 7 | u >>> 32 - 7;
        u = x1 + x0 | 0;
        x2 ^= u << 9 | u >>> 32 - 9;
        u = x2 + x1 | 0;
        x3 ^= u << 13 | u >>> 32 - 13;
        u = x3 + x2 | 0;
        x0 ^= u << 18 | u >>> 32 - 18;
        u = x5 + x4 | 0;
        x6 ^= u << 7 | u >>> 32 - 7;
        u = x6 + x5 | 0;
        x7 ^= u << 9 | u >>> 32 - 9;
        u = x7 + x6 | 0;
        x4 ^= u << 13 | u >>> 32 - 13;
        u = x4 + x7 | 0;
        x5 ^= u << 18 | u >>> 32 - 18;
        u = x10 + x9 | 0;
        x11 ^= u << 7 | u >>> 32 - 7;
        u = x11 + x10 | 0;
        x8 ^= u << 9 | u >>> 32 - 9;
        u = x8 + x11 | 0;
        x9 ^= u << 13 | u >>> 32 - 13;
        u = x9 + x8 | 0;
        x10 ^= u << 18 | u >>> 32 - 18;
        u = x15 + x14 | 0;
        x12 ^= u << 7 | u >>> 32 - 7;
        u = x12 + x15 | 0;
        x13 ^= u << 9 | u >>> 32 - 9;
        u = x13 + x12 | 0;
        x14 ^= u << 13 | u >>> 32 - 13;
        u = x14 + x13 | 0;
        x15 ^= u << 18 | u >>> 32 - 18;
      }
      x0 = x0 + j0 | 0;
      x1 = x1 + j1 | 0;
      x2 = x2 + j2 | 0;
      x3 = x3 + j3 | 0;
      x4 = x4 + j4 | 0;
      x5 = x5 + j5 | 0;
      x6 = x6 + j6 | 0;
      x7 = x7 + j7 | 0;
      x8 = x8 + j8 | 0;
      x9 = x9 + j9 | 0;
      x10 = x10 + j10 | 0;
      x11 = x11 + j11 | 0;
      x12 = x12 + j12 | 0;
      x13 = x13 + j13 | 0;
      x14 = x14 + j14 | 0;
      x15 = x15 + j15 | 0;
      o[0] = x0 >>> 0 & 255;
      o[1] = x0 >>> 8 & 255;
      o[2] = x0 >>> 16 & 255;
      o[3] = x0 >>> 24 & 255;
      o[4] = x1 >>> 0 & 255;
      o[5] = x1 >>> 8 & 255;
      o[6] = x1 >>> 16 & 255;
      o[7] = x1 >>> 24 & 255;
      o[8] = x2 >>> 0 & 255;
      o[9] = x2 >>> 8 & 255;
      o[10] = x2 >>> 16 & 255;
      o[11] = x2 >>> 24 & 255;
      o[12] = x3 >>> 0 & 255;
      o[13] = x3 >>> 8 & 255;
      o[14] = x3 >>> 16 & 255;
      o[15] = x3 >>> 24 & 255;
      o[16] = x4 >>> 0 & 255;
      o[17] = x4 >>> 8 & 255;
      o[18] = x4 >>> 16 & 255;
      o[19] = x4 >>> 24 & 255;
      o[20] = x5 >>> 0 & 255;
      o[21] = x5 >>> 8 & 255;
      o[22] = x5 >>> 16 & 255;
      o[23] = x5 >>> 24 & 255;
      o[24] = x6 >>> 0 & 255;
      o[25] = x6 >>> 8 & 255;
      o[26] = x6 >>> 16 & 255;
      o[27] = x6 >>> 24 & 255;
      o[28] = x7 >>> 0 & 255;
      o[29] = x7 >>> 8 & 255;
      o[30] = x7 >>> 16 & 255;
      o[31] = x7 >>> 24 & 255;
      o[32] = x8 >>> 0 & 255;
      o[33] = x8 >>> 8 & 255;
      o[34] = x8 >>> 16 & 255;
      o[35] = x8 >>> 24 & 255;
      o[36] = x9 >>> 0 & 255;
      o[37] = x9 >>> 8 & 255;
      o[38] = x9 >>> 16 & 255;
      o[39] = x9 >>> 24 & 255;
      o[40] = x10 >>> 0 & 255;
      o[41] = x10 >>> 8 & 255;
      o[42] = x10 >>> 16 & 255;
      o[43] = x10 >>> 24 & 255;
      o[44] = x11 >>> 0 & 255;
      o[45] = x11 >>> 8 & 255;
      o[46] = x11 >>> 16 & 255;
      o[47] = x11 >>> 24 & 255;
      o[48] = x12 >>> 0 & 255;
      o[49] = x12 >>> 8 & 255;
      o[50] = x12 >>> 16 & 255;
      o[51] = x12 >>> 24 & 255;
      o[52] = x13 >>> 0 & 255;
      o[53] = x13 >>> 8 & 255;
      o[54] = x13 >>> 16 & 255;
      o[55] = x13 >>> 24 & 255;
      o[56] = x14 >>> 0 & 255;
      o[57] = x14 >>> 8 & 255;
      o[58] = x14 >>> 16 & 255;
      o[59] = x14 >>> 24 & 255;
      o[60] = x15 >>> 0 & 255;
      o[61] = x15 >>> 8 & 255;
      o[62] = x15 >>> 16 & 255;
      o[63] = x15 >>> 24 & 255;
    }
    function core_hsalsa20(o, p, k, c) {
      var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
      var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
      for (var i = 0; i < 20; i += 2) {
        u = x0 + x12 | 0;
        x4 ^= u << 7 | u >>> 32 - 7;
        u = x4 + x0 | 0;
        x8 ^= u << 9 | u >>> 32 - 9;
        u = x8 + x4 | 0;
        x12 ^= u << 13 | u >>> 32 - 13;
        u = x12 + x8 | 0;
        x0 ^= u << 18 | u >>> 32 - 18;
        u = x5 + x1 | 0;
        x9 ^= u << 7 | u >>> 32 - 7;
        u = x9 + x5 | 0;
        x13 ^= u << 9 | u >>> 32 - 9;
        u = x13 + x9 | 0;
        x1 ^= u << 13 | u >>> 32 - 13;
        u = x1 + x13 | 0;
        x5 ^= u << 18 | u >>> 32 - 18;
        u = x10 + x6 | 0;
        x14 ^= u << 7 | u >>> 32 - 7;
        u = x14 + x10 | 0;
        x2 ^= u << 9 | u >>> 32 - 9;
        u = x2 + x14 | 0;
        x6 ^= u << 13 | u >>> 32 - 13;
        u = x6 + x2 | 0;
        x10 ^= u << 18 | u >>> 32 - 18;
        u = x15 + x11 | 0;
        x3 ^= u << 7 | u >>> 32 - 7;
        u = x3 + x15 | 0;
        x7 ^= u << 9 | u >>> 32 - 9;
        u = x7 + x3 | 0;
        x11 ^= u << 13 | u >>> 32 - 13;
        u = x11 + x7 | 0;
        x15 ^= u << 18 | u >>> 32 - 18;
        u = x0 + x3 | 0;
        x1 ^= u << 7 | u >>> 32 - 7;
        u = x1 + x0 | 0;
        x2 ^= u << 9 | u >>> 32 - 9;
        u = x2 + x1 | 0;
        x3 ^= u << 13 | u >>> 32 - 13;
        u = x3 + x2 | 0;
        x0 ^= u << 18 | u >>> 32 - 18;
        u = x5 + x4 | 0;
        x6 ^= u << 7 | u >>> 32 - 7;
        u = x6 + x5 | 0;
        x7 ^= u << 9 | u >>> 32 - 9;
        u = x7 + x6 | 0;
        x4 ^= u << 13 | u >>> 32 - 13;
        u = x4 + x7 | 0;
        x5 ^= u << 18 | u >>> 32 - 18;
        u = x10 + x9 | 0;
        x11 ^= u << 7 | u >>> 32 - 7;
        u = x11 + x10 | 0;
        x8 ^= u << 9 | u >>> 32 - 9;
        u = x8 + x11 | 0;
        x9 ^= u << 13 | u >>> 32 - 13;
        u = x9 + x8 | 0;
        x10 ^= u << 18 | u >>> 32 - 18;
        u = x15 + x14 | 0;
        x12 ^= u << 7 | u >>> 32 - 7;
        u = x12 + x15 | 0;
        x13 ^= u << 9 | u >>> 32 - 9;
        u = x13 + x12 | 0;
        x14 ^= u << 13 | u >>> 32 - 13;
        u = x14 + x13 | 0;
        x15 ^= u << 18 | u >>> 32 - 18;
      }
      o[0] = x0 >>> 0 & 255;
      o[1] = x0 >>> 8 & 255;
      o[2] = x0 >>> 16 & 255;
      o[3] = x0 >>> 24 & 255;
      o[4] = x5 >>> 0 & 255;
      o[5] = x5 >>> 8 & 255;
      o[6] = x5 >>> 16 & 255;
      o[7] = x5 >>> 24 & 255;
      o[8] = x10 >>> 0 & 255;
      o[9] = x10 >>> 8 & 255;
      o[10] = x10 >>> 16 & 255;
      o[11] = x10 >>> 24 & 255;
      o[12] = x15 >>> 0 & 255;
      o[13] = x15 >>> 8 & 255;
      o[14] = x15 >>> 16 & 255;
      o[15] = x15 >>> 24 & 255;
      o[16] = x6 >>> 0 & 255;
      o[17] = x6 >>> 8 & 255;
      o[18] = x6 >>> 16 & 255;
      o[19] = x6 >>> 24 & 255;
      o[20] = x7 >>> 0 & 255;
      o[21] = x7 >>> 8 & 255;
      o[22] = x7 >>> 16 & 255;
      o[23] = x7 >>> 24 & 255;
      o[24] = x8 >>> 0 & 255;
      o[25] = x8 >>> 8 & 255;
      o[26] = x8 >>> 16 & 255;
      o[27] = x8 >>> 24 & 255;
      o[28] = x9 >>> 0 & 255;
      o[29] = x9 >>> 8 & 255;
      o[30] = x9 >>> 16 & 255;
      o[31] = x9 >>> 24 & 255;
    }
    function crypto_core_salsa20(out, inp, k, c) {
      core_salsa20(out, inp, k, c);
    }
    function crypto_core_hsalsa20(out, inp, k, c) {
      core_hsalsa20(out, inp, k, c);
    }
    var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
    function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
      var z = new Uint8Array(16), x = new Uint8Array(64);
      var u, i;
      for (i = 0; i < 16; i++) z[i] = 0;
      for (i = 0; i < 8; i++) z[i] = n[i];
      while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
          u = u + (z[i] & 255) | 0;
          z[i] = u & 255;
          u >>>= 8;
        }
        b -= 64;
        cpos += 64;
        mpos += 64;
      }
      if (b > 0) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
      }
      return 0;
    }
    function crypto_stream_salsa20(c, cpos, b, n, k) {
      var z = new Uint8Array(16), x = new Uint8Array(64);
      var u, i;
      for (i = 0; i < 16; i++) z[i] = 0;
      for (i = 0; i < 8; i++) z[i] = n[i];
      while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < 64; i++) c[cpos + i] = x[i];
        u = 1;
        for (i = 8; i < 16; i++) {
          u = u + (z[i] & 255) | 0;
          z[i] = u & 255;
          u >>>= 8;
        }
        b -= 64;
        cpos += 64;
      }
      if (b > 0) {
        crypto_core_salsa20(x, z, k, sigma);
        for (i = 0; i < b; i++) c[cpos + i] = x[i];
      }
      return 0;
    }
    function crypto_stream(c, cpos, d, n, k) {
      var s = new Uint8Array(32);
      crypto_core_hsalsa20(s, n, k, sigma);
      var sn = new Uint8Array(8);
      for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
      return crypto_stream_salsa20(c, cpos, d, sn, s);
    }
    function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
      var s = new Uint8Array(32);
      crypto_core_hsalsa20(s, n, k, sigma);
      var sn = new Uint8Array(8);
      for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
      return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
    }
    var poly1305 = function(key) {
      this.buffer = new Uint8Array(16);
      this.r = new Uint16Array(10);
      this.h = new Uint16Array(10);
      this.pad = new Uint16Array(8);
      this.leftover = 0;
      this.fin = 0;
      var t0, t1, t2, t3, t4, t5, t6, t7;
      t0 = key[0] & 255 | (key[1] & 255) << 8;
      this.r[0] = t0 & 8191;
      t1 = key[2] & 255 | (key[3] & 255) << 8;
      this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
      t2 = key[4] & 255 | (key[5] & 255) << 8;
      this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
      t3 = key[6] & 255 | (key[7] & 255) << 8;
      this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
      t4 = key[8] & 255 | (key[9] & 255) << 8;
      this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
      this.r[5] = t4 >>> 1 & 8190;
      t5 = key[10] & 255 | (key[11] & 255) << 8;
      this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
      t6 = key[12] & 255 | (key[13] & 255) << 8;
      this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
      t7 = key[14] & 255 | (key[15] & 255) << 8;
      this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
      this.r[9] = t7 >>> 5 & 127;
      this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
      this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
      this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
      this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
      this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
      this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
      this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
      this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
    };
    poly1305.prototype.blocks = function(m, mpos, bytes) {
      var hibit = this.fin ? 0 : 1 << 11;
      var t0, t1, t2, t3, t4, t5, t6, t7, c;
      var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
      var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
      var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
      while (bytes >= 16) {
        t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
        h0 += t0 & 8191;
        t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
        h1 += (t0 >>> 13 | t1 << 3) & 8191;
        t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
        h2 += (t1 >>> 10 | t2 << 6) & 8191;
        t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
        h3 += (t2 >>> 7 | t3 << 9) & 8191;
        t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
        h4 += (t3 >>> 4 | t4 << 12) & 8191;
        h5 += t4 >>> 1 & 8191;
        t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
        h6 += (t4 >>> 14 | t5 << 2) & 8191;
        t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
        h7 += (t5 >>> 11 | t6 << 5) & 8191;
        t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
        h8 += (t6 >>> 8 | t7 << 8) & 8191;
        h9 += t7 >>> 5 | hibit;
        c = 0;
        d0 = c;
        d0 += h0 * r0;
        d0 += h1 * (5 * r9);
        d0 += h2 * (5 * r8);
        d0 += h3 * (5 * r7);
        d0 += h4 * (5 * r6);
        c = d0 >>> 13;
        d0 &= 8191;
        d0 += h5 * (5 * r5);
        d0 += h6 * (5 * r4);
        d0 += h7 * (5 * r3);
        d0 += h8 * (5 * r2);
        d0 += h9 * (5 * r1);
        c += d0 >>> 13;
        d0 &= 8191;
        d1 = c;
        d1 += h0 * r1;
        d1 += h1 * r0;
        d1 += h2 * (5 * r9);
        d1 += h3 * (5 * r8);
        d1 += h4 * (5 * r7);
        c = d1 >>> 13;
        d1 &= 8191;
        d1 += h5 * (5 * r6);
        d1 += h6 * (5 * r5);
        d1 += h7 * (5 * r4);
        d1 += h8 * (5 * r3);
        d1 += h9 * (5 * r2);
        c += d1 >>> 13;
        d1 &= 8191;
        d2 = c;
        d2 += h0 * r2;
        d2 += h1 * r1;
        d2 += h2 * r0;
        d2 += h3 * (5 * r9);
        d2 += h4 * (5 * r8);
        c = d2 >>> 13;
        d2 &= 8191;
        d2 += h5 * (5 * r7);
        d2 += h6 * (5 * r6);
        d2 += h7 * (5 * r5);
        d2 += h8 * (5 * r4);
        d2 += h9 * (5 * r3);
        c += d2 >>> 13;
        d2 &= 8191;
        d3 = c;
        d3 += h0 * r3;
        d3 += h1 * r2;
        d3 += h2 * r1;
        d3 += h3 * r0;
        d3 += h4 * (5 * r9);
        c = d3 >>> 13;
        d3 &= 8191;
        d3 += h5 * (5 * r8);
        d3 += h6 * (5 * r7);
        d3 += h7 * (5 * r6);
        d3 += h8 * (5 * r5);
        d3 += h9 * (5 * r4);
        c += d3 >>> 13;
        d3 &= 8191;
        d4 = c;
        d4 += h0 * r4;
        d4 += h1 * r3;
        d4 += h2 * r2;
        d4 += h3 * r1;
        d4 += h4 * r0;
        c = d4 >>> 13;
        d4 &= 8191;
        d4 += h5 * (5 * r9);
        d4 += h6 * (5 * r8);
        d4 += h7 * (5 * r7);
        d4 += h8 * (5 * r6);
        d4 += h9 * (5 * r5);
        c += d4 >>> 13;
        d4 &= 8191;
        d5 = c;
        d5 += h0 * r5;
        d5 += h1 * r4;
        d5 += h2 * r3;
        d5 += h3 * r2;
        d5 += h4 * r1;
        c = d5 >>> 13;
        d5 &= 8191;
        d5 += h5 * r0;
        d5 += h6 * (5 * r9);
        d5 += h7 * (5 * r8);
        d5 += h8 * (5 * r7);
        d5 += h9 * (5 * r6);
        c += d5 >>> 13;
        d5 &= 8191;
        d6 = c;
        d6 += h0 * r6;
        d6 += h1 * r5;
        d6 += h2 * r4;
        d6 += h3 * r3;
        d6 += h4 * r2;
        c = d6 >>> 13;
        d6 &= 8191;
        d6 += h5 * r1;
        d6 += h6 * r0;
        d6 += h7 * (5 * r9);
        d6 += h8 * (5 * r8);
        d6 += h9 * (5 * r7);
        c += d6 >>> 13;
        d6 &= 8191;
        d7 = c;
        d7 += h0 * r7;
        d7 += h1 * r6;
        d7 += h2 * r5;
        d7 += h3 * r4;
        d7 += h4 * r3;
        c = d7 >>> 13;
        d7 &= 8191;
        d7 += h5 * r2;
        d7 += h6 * r1;
        d7 += h7 * r0;
        d7 += h8 * (5 * r9);
        d7 += h9 * (5 * r8);
        c += d7 >>> 13;
        d7 &= 8191;
        d8 = c;
        d8 += h0 * r8;
        d8 += h1 * r7;
        d8 += h2 * r6;
        d8 += h3 * r5;
        d8 += h4 * r4;
        c = d8 >>> 13;
        d8 &= 8191;
        d8 += h5 * r3;
        d8 += h6 * r2;
        d8 += h7 * r1;
        d8 += h8 * r0;
        d8 += h9 * (5 * r9);
        c += d8 >>> 13;
        d8 &= 8191;
        d9 = c;
        d9 += h0 * r9;
        d9 += h1 * r8;
        d9 += h2 * r7;
        d9 += h3 * r6;
        d9 += h4 * r5;
        c = d9 >>> 13;
        d9 &= 8191;
        d9 += h5 * r4;
        d9 += h6 * r3;
        d9 += h7 * r2;
        d9 += h8 * r1;
        d9 += h9 * r0;
        c += d9 >>> 13;
        d9 &= 8191;
        c = (c << 2) + c | 0;
        c = c + d0 | 0;
        d0 = c & 8191;
        c = c >>> 13;
        d1 += c;
        h0 = d0;
        h1 = d1;
        h2 = d2;
        h3 = d3;
        h4 = d4;
        h5 = d5;
        h6 = d6;
        h7 = d7;
        h8 = d8;
        h9 = d9;
        mpos += 16;
        bytes -= 16;
      }
      this.h[0] = h0;
      this.h[1] = h1;
      this.h[2] = h2;
      this.h[3] = h3;
      this.h[4] = h4;
      this.h[5] = h5;
      this.h[6] = h6;
      this.h[7] = h7;
      this.h[8] = h8;
      this.h[9] = h9;
    };
    poly1305.prototype.finish = function(mac, macpos) {
      var g = new Uint16Array(10);
      var c, mask, f, i;
      if (this.leftover) {
        i = this.leftover;
        this.buffer[i++] = 1;
        for (; i < 16; i++) this.buffer[i] = 0;
        this.fin = 1;
        this.blocks(this.buffer, 0, 16);
      }
      c = this.h[1] >>> 13;
      this.h[1] &= 8191;
      for (i = 2; i < 10; i++) {
        this.h[i] += c;
        c = this.h[i] >>> 13;
        this.h[i] &= 8191;
      }
      this.h[0] += c * 5;
      c = this.h[0] >>> 13;
      this.h[0] &= 8191;
      this.h[1] += c;
      c = this.h[1] >>> 13;
      this.h[1] &= 8191;
      this.h[2] += c;
      g[0] = this.h[0] + 5;
      c = g[0] >>> 13;
      g[0] &= 8191;
      for (i = 1; i < 10; i++) {
        g[i] = this.h[i] + c;
        c = g[i] >>> 13;
        g[i] &= 8191;
      }
      g[9] -= 1 << 13;
      mask = (c ^ 1) - 1;
      for (i = 0; i < 10; i++) g[i] &= mask;
      mask = ~mask;
      for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
      this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
      this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
      this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
      this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
      this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
      this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
      this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
      this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
      f = this.h[0] + this.pad[0];
      this.h[0] = f & 65535;
      for (i = 1; i < 8; i++) {
        f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
        this.h[i] = f & 65535;
      }
      mac[macpos + 0] = this.h[0] >>> 0 & 255;
      mac[macpos + 1] = this.h[0] >>> 8 & 255;
      mac[macpos + 2] = this.h[1] >>> 0 & 255;
      mac[macpos + 3] = this.h[1] >>> 8 & 255;
      mac[macpos + 4] = this.h[2] >>> 0 & 255;
      mac[macpos + 5] = this.h[2] >>> 8 & 255;
      mac[macpos + 6] = this.h[3] >>> 0 & 255;
      mac[macpos + 7] = this.h[3] >>> 8 & 255;
      mac[macpos + 8] = this.h[4] >>> 0 & 255;
      mac[macpos + 9] = this.h[4] >>> 8 & 255;
      mac[macpos + 10] = this.h[5] >>> 0 & 255;
      mac[macpos + 11] = this.h[5] >>> 8 & 255;
      mac[macpos + 12] = this.h[6] >>> 0 & 255;
      mac[macpos + 13] = this.h[6] >>> 8 & 255;
      mac[macpos + 14] = this.h[7] >>> 0 & 255;
      mac[macpos + 15] = this.h[7] >>> 8 & 255;
    };
    poly1305.prototype.update = function(m, mpos, bytes) {
      var i, want;
      if (this.leftover) {
        want = 16 - this.leftover;
        if (want > bytes)
          want = bytes;
        for (i = 0; i < want; i++)
          this.buffer[this.leftover + i] = m[mpos + i];
        bytes -= want;
        mpos += want;
        this.leftover += want;
        if (this.leftover < 16)
          return;
        this.blocks(this.buffer, 0, 16);
        this.leftover = 0;
      }
      if (bytes >= 16) {
        want = bytes - bytes % 16;
        this.blocks(m, mpos, want);
        mpos += want;
        bytes -= want;
      }
      if (bytes) {
        for (i = 0; i < bytes; i++)
          this.buffer[this.leftover + i] = m[mpos + i];
        this.leftover += bytes;
      }
    };
    function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
      var s = new poly1305(k);
      s.update(m, mpos, n);
      s.finish(out, outpos);
      return 0;
    }
    function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
      var x = new Uint8Array(16);
      crypto_onetimeauth(x, 0, m, mpos, n, k);
      return crypto_verify_16(h, hpos, x, 0);
    }
    function crypto_secretbox(c, m, d, n, k) {
      var i;
      if (d < 32) return -1;
      crypto_stream_xor(c, 0, m, 0, d, n, k);
      crypto_onetimeauth(c, 16, c, 32, d - 32, c);
      for (i = 0; i < 16; i++) c[i] = 0;
      return 0;
    }
    function crypto_secretbox_open(m, c, d, n, k) {
      var i;
      var x = new Uint8Array(32);
      if (d < 32) return -1;
      crypto_stream(x, 0, 32, n, k);
      if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
      crypto_stream_xor(m, 0, c, 0, d, n, k);
      for (i = 0; i < 32; i++) m[i] = 0;
      return 0;
    }
    function set25519(r, a) {
      var i;
      for (i = 0; i < 16; i++) r[i] = a[i] | 0;
    }
    function car25519(o) {
      var i, v, c = 1;
      for (i = 0; i < 16; i++) {
        v = o[i] + c + 65535;
        c = Math.floor(v / 65536);
        o[i] = v - c * 65536;
      }
      o[0] += c - 1 + 37 * (c - 1);
    }
    function sel25519(p, q, b) {
      var t, c = ~(b - 1);
      for (var i = 0; i < 16; i++) {
        t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
      }
    }
    function pack25519(o, n) {
      var i, j, b;
      var m = gf(), t = gf();
      for (i = 0; i < 16; i++) t[i] = n[i];
      car25519(t);
      car25519(t);
      car25519(t);
      for (j = 0; j < 2; j++) {
        m[0] = t[0] - 65517;
        for (i = 1; i < 15; i++) {
          m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
          m[i - 1] &= 65535;
        }
        m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
        b = m[15] >> 16 & 1;
        m[14] &= 65535;
        sel25519(t, m, 1 - b);
      }
      for (i = 0; i < 16; i++) {
        o[2 * i] = t[i] & 255;
        o[2 * i + 1] = t[i] >> 8;
      }
    }
    function neq25519(a, b) {
      var c = new Uint8Array(32), d = new Uint8Array(32);
      pack25519(c, a);
      pack25519(d, b);
      return crypto_verify_32(c, 0, d, 0);
    }
    function par25519(a) {
      var d = new Uint8Array(32);
      pack25519(d, a);
      return d[0] & 1;
    }
    function unpack25519(o, n) {
      var i;
      for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
      o[15] &= 32767;
    }
    function A(o, a, b) {
      for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
    }
    function Z(o, a, b) {
      for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
    }
    function M(o, a, b) {
      var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
      v = a[0];
      t0 += v * b0;
      t1 += v * b1;
      t2 += v * b2;
      t3 += v * b3;
      t4 += v * b4;
      t5 += v * b5;
      t6 += v * b6;
      t7 += v * b7;
      t8 += v * b8;
      t9 += v * b9;
      t10 += v * b10;
      t11 += v * b11;
      t12 += v * b12;
      t13 += v * b13;
      t14 += v * b14;
      t15 += v * b15;
      v = a[1];
      t1 += v * b0;
      t2 += v * b1;
      t3 += v * b2;
      t4 += v * b3;
      t5 += v * b4;
      t6 += v * b5;
      t7 += v * b6;
      t8 += v * b7;
      t9 += v * b8;
      t10 += v * b9;
      t11 += v * b10;
      t12 += v * b11;
      t13 += v * b12;
      t14 += v * b13;
      t15 += v * b14;
      t16 += v * b15;
      v = a[2];
      t2 += v * b0;
      t3 += v * b1;
      t4 += v * b2;
      t5 += v * b3;
      t6 += v * b4;
      t7 += v * b5;
      t8 += v * b6;
      t9 += v * b7;
      t10 += v * b8;
      t11 += v * b9;
      t12 += v * b10;
      t13 += v * b11;
      t14 += v * b12;
      t15 += v * b13;
      t16 += v * b14;
      t17 += v * b15;
      v = a[3];
      t3 += v * b0;
      t4 += v * b1;
      t5 += v * b2;
      t6 += v * b3;
      t7 += v * b4;
      t8 += v * b5;
      t9 += v * b6;
      t10 += v * b7;
      t11 += v * b8;
      t12 += v * b9;
      t13 += v * b10;
      t14 += v * b11;
      t15 += v * b12;
      t16 += v * b13;
      t17 += v * b14;
      t18 += v * b15;
      v = a[4];
      t4 += v * b0;
      t5 += v * b1;
      t6 += v * b2;
      t7 += v * b3;
      t8 += v * b4;
      t9 += v * b5;
      t10 += v * b6;
      t11 += v * b7;
      t12 += v * b8;
      t13 += v * b9;
      t14 += v * b10;
      t15 += v * b11;
      t16 += v * b12;
      t17 += v * b13;
      t18 += v * b14;
      t19 += v * b15;
      v = a[5];
      t5 += v * b0;
      t6 += v * b1;
      t7 += v * b2;
      t8 += v * b3;
      t9 += v * b4;
      t10 += v * b5;
      t11 += v * b6;
      t12 += v * b7;
      t13 += v * b8;
      t14 += v * b9;
      t15 += v * b10;
      t16 += v * b11;
      t17 += v * b12;
      t18 += v * b13;
      t19 += v * b14;
      t20 += v * b15;
      v = a[6];
      t6 += v * b0;
      t7 += v * b1;
      t8 += v * b2;
      t9 += v * b3;
      t10 += v * b4;
      t11 += v * b5;
      t12 += v * b6;
      t13 += v * b7;
      t14 += v * b8;
      t15 += v * b9;
      t16 += v * b10;
      t17 += v * b11;
      t18 += v * b12;
      t19 += v * b13;
      t20 += v * b14;
      t21 += v * b15;
      v = a[7];
      t7 += v * b0;
      t8 += v * b1;
      t9 += v * b2;
      t10 += v * b3;
      t11 += v * b4;
      t12 += v * b5;
      t13 += v * b6;
      t14 += v * b7;
      t15 += v * b8;
      t16 += v * b9;
      t17 += v * b10;
      t18 += v * b11;
      t19 += v * b12;
      t20 += v * b13;
      t21 += v * b14;
      t22 += v * b15;
      v = a[8];
      t8 += v * b0;
      t9 += v * b1;
      t10 += v * b2;
      t11 += v * b3;
      t12 += v * b4;
      t13 += v * b5;
      t14 += v * b6;
      t15 += v * b7;
      t16 += v * b8;
      t17 += v * b9;
      t18 += v * b10;
      t19 += v * b11;
      t20 += v * b12;
      t21 += v * b13;
      t22 += v * b14;
      t23 += v * b15;
      v = a[9];
      t9 += v * b0;
      t10 += v * b1;
      t11 += v * b2;
      t12 += v * b3;
      t13 += v * b4;
      t14 += v * b5;
      t15 += v * b6;
      t16 += v * b7;
      t17 += v * b8;
      t18 += v * b9;
      t19 += v * b10;
      t20 += v * b11;
      t21 += v * b12;
      t22 += v * b13;
      t23 += v * b14;
      t24 += v * b15;
      v = a[10];
      t10 += v * b0;
      t11 += v * b1;
      t12 += v * b2;
      t13 += v * b3;
      t14 += v * b4;
      t15 += v * b5;
      t16 += v * b6;
      t17 += v * b7;
      t18 += v * b8;
      t19 += v * b9;
      t20 += v * b10;
      t21 += v * b11;
      t22 += v * b12;
      t23 += v * b13;
      t24 += v * b14;
      t25 += v * b15;
      v = a[11];
      t11 += v * b0;
      t12 += v * b1;
      t13 += v * b2;
      t14 += v * b3;
      t15 += v * b4;
      t16 += v * b5;
      t17 += v * b6;
      t18 += v * b7;
      t19 += v * b8;
      t20 += v * b9;
      t21 += v * b10;
      t22 += v * b11;
      t23 += v * b12;
      t24 += v * b13;
      t25 += v * b14;
      t26 += v * b15;
      v = a[12];
      t12 += v * b0;
      t13 += v * b1;
      t14 += v * b2;
      t15 += v * b3;
      t16 += v * b4;
      t17 += v * b5;
      t18 += v * b6;
      t19 += v * b7;
      t20 += v * b8;
      t21 += v * b9;
      t22 += v * b10;
      t23 += v * b11;
      t24 += v * b12;
      t25 += v * b13;
      t26 += v * b14;
      t27 += v * b15;
      v = a[13];
      t13 += v * b0;
      t14 += v * b1;
      t15 += v * b2;
      t16 += v * b3;
      t17 += v * b4;
      t18 += v * b5;
      t19 += v * b6;
      t20 += v * b7;
      t21 += v * b8;
      t22 += v * b9;
      t23 += v * b10;
      t24 += v * b11;
      t25 += v * b12;
      t26 += v * b13;
      t27 += v * b14;
      t28 += v * b15;
      v = a[14];
      t14 += v * b0;
      t15 += v * b1;
      t16 += v * b2;
      t17 += v * b3;
      t18 += v * b4;
      t19 += v * b5;
      t20 += v * b6;
      t21 += v * b7;
      t22 += v * b8;
      t23 += v * b9;
      t24 += v * b10;
      t25 += v * b11;
      t26 += v * b12;
      t27 += v * b13;
      t28 += v * b14;
      t29 += v * b15;
      v = a[15];
      t15 += v * b0;
      t16 += v * b1;
      t17 += v * b2;
      t18 += v * b3;
      t19 += v * b4;
      t20 += v * b5;
      t21 += v * b6;
      t22 += v * b7;
      t23 += v * b8;
      t24 += v * b9;
      t25 += v * b10;
      t26 += v * b11;
      t27 += v * b12;
      t28 += v * b13;
      t29 += v * b14;
      t30 += v * b15;
      t0 += 38 * t16;
      t1 += 38 * t17;
      t2 += 38 * t18;
      t3 += 38 * t19;
      t4 += 38 * t20;
      t5 += 38 * t21;
      t6 += 38 * t22;
      t7 += 38 * t23;
      t8 += 38 * t24;
      t9 += 38 * t25;
      t10 += 38 * t26;
      t11 += 38 * t27;
      t12 += 38 * t28;
      t13 += 38 * t29;
      t14 += 38 * t30;
      c = 1;
      v = t0 + c + 65535;
      c = Math.floor(v / 65536);
      t0 = v - c * 65536;
      v = t1 + c + 65535;
      c = Math.floor(v / 65536);
      t1 = v - c * 65536;
      v = t2 + c + 65535;
      c = Math.floor(v / 65536);
      t2 = v - c * 65536;
      v = t3 + c + 65535;
      c = Math.floor(v / 65536);
      t3 = v - c * 65536;
      v = t4 + c + 65535;
      c = Math.floor(v / 65536);
      t4 = v - c * 65536;
      v = t5 + c + 65535;
      c = Math.floor(v / 65536);
      t5 = v - c * 65536;
      v = t6 + c + 65535;
      c = Math.floor(v / 65536);
      t6 = v - c * 65536;
      v = t7 + c + 65535;
      c = Math.floor(v / 65536);
      t7 = v - c * 65536;
      v = t8 + c + 65535;
      c = Math.floor(v / 65536);
      t8 = v - c * 65536;
      v = t9 + c + 65535;
      c = Math.floor(v / 65536);
      t9 = v - c * 65536;
      v = t10 + c + 65535;
      c = Math.floor(v / 65536);
      t10 = v - c * 65536;
      v = t11 + c + 65535;
      c = Math.floor(v / 65536);
      t11 = v - c * 65536;
      v = t12 + c + 65535;
      c = Math.floor(v / 65536);
      t12 = v - c * 65536;
      v = t13 + c + 65535;
      c = Math.floor(v / 65536);
      t13 = v - c * 65536;
      v = t14 + c + 65535;
      c = Math.floor(v / 65536);
      t14 = v - c * 65536;
      v = t15 + c + 65535;
      c = Math.floor(v / 65536);
      t15 = v - c * 65536;
      t0 += c - 1 + 37 * (c - 1);
      c = 1;
      v = t0 + c + 65535;
      c = Math.floor(v / 65536);
      t0 = v - c * 65536;
      v = t1 + c + 65535;
      c = Math.floor(v / 65536);
      t1 = v - c * 65536;
      v = t2 + c + 65535;
      c = Math.floor(v / 65536);
      t2 = v - c * 65536;
      v = t3 + c + 65535;
      c = Math.floor(v / 65536);
      t3 = v - c * 65536;
      v = t4 + c + 65535;
      c = Math.floor(v / 65536);
      t4 = v - c * 65536;
      v = t5 + c + 65535;
      c = Math.floor(v / 65536);
      t5 = v - c * 65536;
      v = t6 + c + 65535;
      c = Math.floor(v / 65536);
      t6 = v - c * 65536;
      v = t7 + c + 65535;
      c = Math.floor(v / 65536);
      t7 = v - c * 65536;
      v = t8 + c + 65535;
      c = Math.floor(v / 65536);
      t8 = v - c * 65536;
      v = t9 + c + 65535;
      c = Math.floor(v / 65536);
      t9 = v - c * 65536;
      v = t10 + c + 65535;
      c = Math.floor(v / 65536);
      t10 = v - c * 65536;
      v = t11 + c + 65535;
      c = Math.floor(v / 65536);
      t11 = v - c * 65536;
      v = t12 + c + 65535;
      c = Math.floor(v / 65536);
      t12 = v - c * 65536;
      v = t13 + c + 65535;
      c = Math.floor(v / 65536);
      t13 = v - c * 65536;
      v = t14 + c + 65535;
      c = Math.floor(v / 65536);
      t14 = v - c * 65536;
      v = t15 + c + 65535;
      c = Math.floor(v / 65536);
      t15 = v - c * 65536;
      t0 += c - 1 + 37 * (c - 1);
      o[0] = t0;
      o[1] = t1;
      o[2] = t2;
      o[3] = t3;
      o[4] = t4;
      o[5] = t5;
      o[6] = t6;
      o[7] = t7;
      o[8] = t8;
      o[9] = t9;
      o[10] = t10;
      o[11] = t11;
      o[12] = t12;
      o[13] = t13;
      o[14] = t14;
      o[15] = t15;
    }
    function S(o, a) {
      M(o, a, a);
    }
    function inv25519(o, i) {
      var c = gf();
      var a;
      for (a = 0; a < 16; a++) c[a] = i[a];
      for (a = 253; a >= 0; a--) {
        S(c, c);
        if (a !== 2 && a !== 4) M(c, c, i);
      }
      for (a = 0; a < 16; a++) o[a] = c[a];
    }
    function pow2523(o, i) {
      var c = gf();
      var a;
      for (a = 0; a < 16; a++) c[a] = i[a];
      for (a = 250; a >= 0; a--) {
        S(c, c);
        if (a !== 1) M(c, c, i);
      }
      for (a = 0; a < 16; a++) o[a] = c[a];
    }
    function crypto_scalarmult(q, n, p) {
      var z = new Uint8Array(32);
      var x = new Float64Array(80), r, i;
      var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
      for (i = 0; i < 31; i++) z[i] = n[i];
      z[31] = n[31] & 127 | 64;
      z[0] &= 248;
      unpack25519(x, p);
      for (i = 0; i < 16; i++) {
        b[i] = x[i];
        d[i] = a[i] = c[i] = 0;
      }
      a[0] = d[0] = 1;
      for (i = 254; i >= 0; --i) {
        r = z[i >>> 3] >>> (i & 7) & 1;
        sel25519(a, b, r);
        sel25519(c, d, r);
        A(e, a, c);
        Z(a, a, c);
        A(c, b, d);
        Z(b, b, d);
        S(d, e);
        S(f, a);
        M(a, c, a);
        M(c, b, e);
        A(e, a, c);
        Z(a, a, c);
        S(b, a);
        Z(c, d, f);
        M(a, c, _121665);
        A(a, a, d);
        M(c, c, a);
        M(a, d, f);
        M(d, b, x);
        S(b, e);
        sel25519(a, b, r);
        sel25519(c, d, r);
      }
      for (i = 0; i < 16; i++) {
        x[i + 16] = a[i];
        x[i + 32] = c[i];
        x[i + 48] = b[i];
        x[i + 64] = d[i];
      }
      var x32 = x.subarray(32);
      var x16 = x.subarray(16);
      inv25519(x32, x32);
      M(x16, x16, x32);
      pack25519(q, x16);
      return 0;
    }
    function crypto_scalarmult_base(q, n) {
      return crypto_scalarmult(q, n, _9);
    }
    function crypto_box_keypair(y, x) {
      randombytes(x, 32);
      return crypto_scalarmult_base(y, x);
    }
    function crypto_box_beforenm(k, y, x) {
      var s = new Uint8Array(32);
      crypto_scalarmult(s, x, y);
      return crypto_core_hsalsa20(k, _0, s, sigma);
    }
    var crypto_box_afternm = crypto_secretbox;
    var crypto_box_open_afternm = crypto_secretbox_open;
    function crypto_box(c, m, d, n, y, x) {
      var k = new Uint8Array(32);
      crypto_box_beforenm(k, y, x);
      return crypto_box_afternm(c, m, d, n, k);
    }
    function crypto_box_open(m, c, d, n, y, x) {
      var k = new Uint8Array(32);
      crypto_box_beforenm(k, y, x);
      return crypto_box_open_afternm(m, c, d, n, k);
    }
    var K = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    function crypto_hashblocks_hl(hh, hl, m, n) {
      var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
      var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
      var pos = 0;
      while (n >= 128) {
        for (i = 0; i < 16; i++) {
          j = 8 * i + pos;
          wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
          wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
        }
        for (i = 0; i < 80; i++) {
          bh0 = ah0;
          bh1 = ah1;
          bh2 = ah2;
          bh3 = ah3;
          bh4 = ah4;
          bh5 = ah5;
          bh6 = ah6;
          bh7 = ah7;
          bl0 = al0;
          bl1 = al1;
          bl2 = al2;
          bl3 = al3;
          bl4 = al4;
          bl5 = al5;
          bl6 = al6;
          bl7 = al7;
          h = ah7;
          l = al7;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
          l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          h = ah4 & ah5 ^ ~ah4 & ah6;
          l = al4 & al5 ^ ~al4 & al6;
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          h = K[i * 2];
          l = K[i * 2 + 1];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          h = wh[i % 16];
          l = wl[i % 16];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          th = c & 65535 | d << 16;
          tl = a & 65535 | b << 16;
          h = th;
          l = tl;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
          l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
          l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          bh7 = c & 65535 | d << 16;
          bl7 = a & 65535 | b << 16;
          h = bh3;
          l = bl3;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = th;
          l = tl;
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          bh3 = c & 65535 | d << 16;
          bl3 = a & 65535 | b << 16;
          ah1 = bh0;
          ah2 = bh1;
          ah3 = bh2;
          ah4 = bh3;
          ah5 = bh4;
          ah6 = bh5;
          ah7 = bh6;
          ah0 = bh7;
          al1 = bl0;
          al2 = bl1;
          al3 = bl2;
          al4 = bl3;
          al5 = bl4;
          al6 = bl5;
          al7 = bl6;
          al0 = bl7;
          if (i % 16 === 15) {
            for (j = 0; j < 16; j++) {
              h = wh[j];
              l = wl[j];
              a = l & 65535;
              b = l >>> 16;
              c = h & 65535;
              d = h >>> 16;
              h = wh[(j + 9) % 16];
              l = wl[(j + 9) % 16];
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              th = wh[(j + 1) % 16];
              tl = wl[(j + 1) % 16];
              h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
              l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              th = wh[(j + 14) % 16];
              tl = wl[(j + 14) % 16];
              h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
              l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
              a += l & 65535;
              b += l >>> 16;
              c += h & 65535;
              d += h >>> 16;
              b += a >>> 16;
              c += b >>> 16;
              d += c >>> 16;
              wh[j] = c & 65535 | d << 16;
              wl[j] = a & 65535 | b << 16;
            }
          }
        }
        h = ah0;
        l = al0;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[0];
        l = hl[0];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[0] = ah0 = c & 65535 | d << 16;
        hl[0] = al0 = a & 65535 | b << 16;
        h = ah1;
        l = al1;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[1];
        l = hl[1];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[1] = ah1 = c & 65535 | d << 16;
        hl[1] = al1 = a & 65535 | b << 16;
        h = ah2;
        l = al2;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[2];
        l = hl[2];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[2] = ah2 = c & 65535 | d << 16;
        hl[2] = al2 = a & 65535 | b << 16;
        h = ah3;
        l = al3;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[3];
        l = hl[3];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[3] = ah3 = c & 65535 | d << 16;
        hl[3] = al3 = a & 65535 | b << 16;
        h = ah4;
        l = al4;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[4];
        l = hl[4];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[4] = ah4 = c & 65535 | d << 16;
        hl[4] = al4 = a & 65535 | b << 16;
        h = ah5;
        l = al5;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[5];
        l = hl[5];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[5] = ah5 = c & 65535 | d << 16;
        hl[5] = al5 = a & 65535 | b << 16;
        h = ah6;
        l = al6;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[6];
        l = hl[6];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[6] = ah6 = c & 65535 | d << 16;
        hl[6] = al6 = a & 65535 | b << 16;
        h = ah7;
        l = al7;
        a = l & 65535;
        b = l >>> 16;
        c = h & 65535;
        d = h >>> 16;
        h = hh[7];
        l = hl[7];
        a += l & 65535;
        b += l >>> 16;
        c += h & 65535;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[7] = ah7 = c & 65535 | d << 16;
        hl[7] = al7 = a & 65535 | b << 16;
        pos += 128;
        n -= 128;
      }
      return n;
    }
    function crypto_hash(out, m, n) {
      var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
      hh[0] = 1779033703;
      hh[1] = 3144134277;
      hh[2] = 1013904242;
      hh[3] = 2773480762;
      hh[4] = 1359893119;
      hh[5] = 2600822924;
      hh[6] = 528734635;
      hh[7] = 1541459225;
      hl[0] = 4089235720;
      hl[1] = 2227873595;
      hl[2] = 4271175723;
      hl[3] = 1595750129;
      hl[4] = 2917565137;
      hl[5] = 725511199;
      hl[6] = 4215389547;
      hl[7] = 327033209;
      crypto_hashblocks_hl(hh, hl, m, n);
      n %= 128;
      for (i = 0; i < n; i++) x[i] = m[b - n + i];
      x[n] = 128;
      n = 256 - 128 * (n < 112 ? 1 : 0);
      x[n - 9] = 0;
      ts64(x, n - 8, b / 536870912 | 0, b << 3);
      crypto_hashblocks_hl(hh, hl, x, n);
      for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
      return 0;
    }
    function add(p, q) {
      var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
      Z(a, p[1], p[0]);
      Z(t, q[1], q[0]);
      M(a, a, t);
      A(b, p[0], p[1]);
      A(t, q[0], q[1]);
      M(b, b, t);
      M(c, p[3], q[3]);
      M(c, c, D2);
      M(d, p[2], q[2]);
      A(d, d, d);
      Z(e, b, a);
      Z(f, d, c);
      A(g, d, c);
      A(h, b, a);
      M(p[0], e, f);
      M(p[1], h, g);
      M(p[2], g, f);
      M(p[3], e, h);
    }
    function cswap(p, q, b) {
      var i;
      for (i = 0; i < 4; i++) {
        sel25519(p[i], q[i], b);
      }
    }
    function pack(r, p) {
      var tx = gf(), ty = gf(), zi = gf();
      inv25519(zi, p[2]);
      M(tx, p[0], zi);
      M(ty, p[1], zi);
      pack25519(r, ty);
      r[31] ^= par25519(tx) << 7;
    }
    function scalarmult(p, q, s) {
      var b, i;
      set25519(p[0], gf0);
      set25519(p[1], gf1);
      set25519(p[2], gf1);
      set25519(p[3], gf0);
      for (i = 255; i >= 0; --i) {
        b = s[i / 8 | 0] >> (i & 7) & 1;
        cswap(p, q, b);
        add(q, p);
        add(p, p);
        cswap(p, q, b);
      }
    }
    function scalarbase(p, s) {
      var q = [gf(), gf(), gf(), gf()];
      set25519(q[0], X);
      set25519(q[1], Y);
      set25519(q[2], gf1);
      M(q[3], X, Y);
      scalarmult(p, q, s);
    }
    function crypto_sign_keypair(pk, sk, seeded) {
      var d = new Uint8Array(64);
      var p = [gf(), gf(), gf(), gf()];
      var i;
      if (!seeded) randombytes(sk, 32);
      crypto_hash(d, sk, 32);
      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;
      scalarbase(p, d);
      pack(pk, p);
      for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
      return 0;
    }
    var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
    function modL(r, x) {
      var carry, i, j, k;
      for (i = 63; i >= 32; --i) {
        carry = 0;
        for (j = i - 32, k = i - 12; j < k; ++j) {
          x[j] += carry - 16 * x[i] * L[j - (i - 32)];
          carry = Math.floor((x[j] + 128) / 256);
          x[j] -= carry * 256;
        }
        x[j] += carry;
        x[i] = 0;
      }
      carry = 0;
      for (j = 0; j < 32; j++) {
        x[j] += carry - (x[31] >> 4) * L[j];
        carry = x[j] >> 8;
        x[j] &= 255;
      }
      for (j = 0; j < 32; j++) x[j] -= carry * L[j];
      for (i = 0; i < 32; i++) {
        x[i + 1] += x[i] >> 8;
        r[i] = x[i] & 255;
      }
    }
    function reduce(r) {
      var x = new Float64Array(64), i;
      for (i = 0; i < 64; i++) x[i] = r[i];
      for (i = 0; i < 64; i++) r[i] = 0;
      modL(r, x);
    }
    function crypto_sign(sm, m, n, sk) {
      var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
      var i, j, x = new Float64Array(64);
      var p = [gf(), gf(), gf(), gf()];
      crypto_hash(d, sk, 32);
      d[0] &= 248;
      d[31] &= 127;
      d[31] |= 64;
      var smlen = n + 64;
      for (i = 0; i < n; i++) sm[64 + i] = m[i];
      for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
      crypto_hash(r, sm.subarray(32), n + 32);
      reduce(r);
      scalarbase(p, r);
      pack(sm, p);
      for (i = 32; i < 64; i++) sm[i] = sk[i];
      crypto_hash(h, sm, n + 64);
      reduce(h);
      for (i = 0; i < 64; i++) x[i] = 0;
      for (i = 0; i < 32; i++) x[i] = r[i];
      for (i = 0; i < 32; i++) {
        for (j = 0; j < 32; j++) {
          x[i + j] += h[i] * d[j];
        }
      }
      modL(sm.subarray(32), x);
      return smlen;
    }
    function unpackneg(r, p) {
      var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
      set25519(r[2], gf1);
      unpack25519(r[1], p);
      S(num, r[1]);
      M(den, num, D);
      Z(num, num, r[2]);
      A(den, r[2], den);
      S(den2, den);
      S(den4, den2);
      M(den6, den4, den2);
      M(t, den6, num);
      M(t, t, den);
      pow2523(t, t);
      M(t, t, num);
      M(t, t, den);
      M(t, t, den);
      M(r[0], t, den);
      S(chk, r[0]);
      M(chk, chk, den);
      if (neq25519(chk, num)) M(r[0], r[0], I);
      S(chk, r[0]);
      M(chk, chk, den);
      if (neq25519(chk, num)) return -1;
      if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
      M(r[3], r[0], r[1]);
      return 0;
    }
    function crypto_sign_open(m, sm, n, pk) {
      var i;
      var t = new Uint8Array(32), h = new Uint8Array(64);
      var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
      if (n < 64) return -1;
      if (unpackneg(q, pk)) return -1;
      for (i = 0; i < n; i++) m[i] = sm[i];
      for (i = 0; i < 32; i++) m[i + 32] = pk[i];
      crypto_hash(h, m, n);
      reduce(h);
      scalarmult(p, q, h);
      scalarbase(q, sm.subarray(32));
      add(p, q);
      pack(t, p);
      n -= 64;
      if (crypto_verify_32(sm, 0, t, 0)) {
        for (i = 0; i < n; i++) m[i] = 0;
        return -1;
      }
      for (i = 0; i < n; i++) m[i] = sm[i + 64];
      return n;
    }
    var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
    nacl2.lowlevel = {
      crypto_core_hsalsa20,
      crypto_stream_xor,
      crypto_stream,
      crypto_stream_salsa20_xor,
      crypto_stream_salsa20,
      crypto_onetimeauth,
      crypto_onetimeauth_verify,
      crypto_verify_16,
      crypto_verify_32,
      crypto_secretbox,
      crypto_secretbox_open,
      crypto_scalarmult,
      crypto_scalarmult_base,
      crypto_box_beforenm,
      crypto_box_afternm,
      crypto_box,
      crypto_box_open,
      crypto_box_keypair,
      crypto_hash,
      crypto_sign,
      crypto_sign_keypair,
      crypto_sign_open,
      crypto_secretbox_KEYBYTES,
      crypto_secretbox_NONCEBYTES,
      crypto_secretbox_ZEROBYTES,
      crypto_secretbox_BOXZEROBYTES,
      crypto_scalarmult_BYTES,
      crypto_scalarmult_SCALARBYTES,
      crypto_box_PUBLICKEYBYTES,
      crypto_box_SECRETKEYBYTES,
      crypto_box_BEFORENMBYTES,
      crypto_box_NONCEBYTES,
      crypto_box_ZEROBYTES,
      crypto_box_BOXZEROBYTES,
      crypto_sign_BYTES,
      crypto_sign_PUBLICKEYBYTES,
      crypto_sign_SECRETKEYBYTES,
      crypto_sign_SEEDBYTES,
      crypto_hash_BYTES,
      gf,
      D,
      L,
      pack25519,
      unpack25519,
      M,
      A,
      S,
      Z,
      pow2523,
      add,
      set25519,
      modL,
      scalarmult,
      scalarbase
    };
    function checkLengths(k, n) {
      if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
      if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
    }
    function checkBoxLengths(pk, sk) {
      if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
      if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
    }
    function checkArrayTypes() {
      for (var i = 0; i < arguments.length; i++) {
        if (!(arguments[i] instanceof Uint8Array))
          throw new TypeError("unexpected type, use Uint8Array");
      }
    }
    function cleanup(arr) {
      for (var i = 0; i < arr.length; i++) arr[i] = 0;
    }
    nacl2.randomBytes = function(n) {
      var b = new Uint8Array(n);
      randombytes(b, n);
      return b;
    };
    nacl2.secretbox = function(msg, nonce, key) {
      checkArrayTypes(msg, nonce, key);
      checkLengths(key, nonce);
      var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
      var c = new Uint8Array(m.length);
      for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
      crypto_secretbox(c, m, m.length, nonce, key);
      return c.subarray(crypto_secretbox_BOXZEROBYTES);
    };
    nacl2.secretbox.open = function(box, nonce, key) {
      checkArrayTypes(box, nonce, key);
      checkLengths(key, nonce);
      var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
      var m = new Uint8Array(c.length);
      for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
      if (c.length < 32) return null;
      if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
      return m.subarray(crypto_secretbox_ZEROBYTES);
    };
    nacl2.secretbox.keyLength = crypto_secretbox_KEYBYTES;
    nacl2.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
    nacl2.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
    nacl2.scalarMult = function(n, p) {
      checkArrayTypes(n, p);
      if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
      if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
      var q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult(q, n, p);
      return q;
    };
    nacl2.scalarMult.base = function(n) {
      checkArrayTypes(n);
      if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
      var q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult_base(q, n);
      return q;
    };
    nacl2.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
    nacl2.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
    nacl2.box = function(msg, nonce, publicKey2, secretKey) {
      var k = nacl2.box.before(publicKey2, secretKey);
      return nacl2.secretbox(msg, nonce, k);
    };
    nacl2.box.before = function(publicKey2, secretKey) {
      checkArrayTypes(publicKey2, secretKey);
      checkBoxLengths(publicKey2, secretKey);
      var k = new Uint8Array(crypto_box_BEFORENMBYTES);
      crypto_box_beforenm(k, publicKey2, secretKey);
      return k;
    };
    nacl2.box.after = nacl2.secretbox;
    nacl2.box.open = function(msg, nonce, publicKey2, secretKey) {
      var k = nacl2.box.before(publicKey2, secretKey);
      return nacl2.secretbox.open(msg, nonce, k);
    };
    nacl2.box.open.after = nacl2.secretbox.open;
    nacl2.box.keyPair = function() {
      var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
      crypto_box_keypair(pk, sk);
      return { publicKey: pk, secretKey: sk };
    };
    nacl2.box.keyPair.fromSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      if (secretKey.length !== crypto_box_SECRETKEYBYTES)
        throw new Error("bad secret key size");
      var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
      crypto_scalarmult_base(pk, secretKey);
      return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
    };
    nacl2.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
    nacl2.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
    nacl2.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
    nacl2.box.nonceLength = crypto_box_NONCEBYTES;
    nacl2.box.overheadLength = nacl2.secretbox.overheadLength;
    nacl2.sign = function(msg, secretKey) {
      checkArrayTypes(msg, secretKey);
      if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error("bad secret key size");
      var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
      crypto_sign(signedMsg, msg, msg.length, secretKey);
      return signedMsg;
    };
    nacl2.sign.open = function(signedMsg, publicKey2) {
      checkArrayTypes(signedMsg, publicKey2);
      if (publicKey2.length !== crypto_sign_PUBLICKEYBYTES)
        throw new Error("bad public key size");
      var tmp = new Uint8Array(signedMsg.length);
      var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey2);
      if (mlen < 0) return null;
      var m = new Uint8Array(mlen);
      for (var i = 0; i < m.length; i++) m[i] = tmp[i];
      return m;
    };
    nacl2.sign.detached = function(msg, secretKey) {
      var signedMsg = nacl2.sign(msg, secretKey);
      var sig = new Uint8Array(crypto_sign_BYTES);
      for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
      return sig;
    };
    nacl2.sign.detached.verify = function(msg, sig, publicKey2) {
      checkArrayTypes(msg, sig, publicKey2);
      if (sig.length !== crypto_sign_BYTES)
        throw new Error("bad signature size");
      if (publicKey2.length !== crypto_sign_PUBLICKEYBYTES)
        throw new Error("bad public key size");
      var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
      var m = new Uint8Array(crypto_sign_BYTES + msg.length);
      var i;
      for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
      for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
      return crypto_sign_open(m, sm, sm.length, publicKey2) >= 0;
    };
    nacl2.sign.keyPair = function() {
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
      crypto_sign_keypair(pk, sk);
      return { publicKey: pk, secretKey: sk };
    };
    nacl2.sign.keyPair.fromSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
        throw new Error("bad secret key size");
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
      return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
    };
    nacl2.sign.keyPair.fromSeed = function(seed) {
      checkArrayTypes(seed);
      if (seed.length !== crypto_sign_SEEDBYTES)
        throw new Error("bad seed size");
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
      for (var i = 0; i < 32; i++) sk[i] = seed[i];
      crypto_sign_keypair(pk, sk, true);
      return { publicKey: pk, secretKey: sk };
    };
    nacl2.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
    nacl2.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
    nacl2.sign.seedLength = crypto_sign_SEEDBYTES;
    nacl2.sign.signatureLength = crypto_sign_BYTES;
    nacl2.hash = function(msg) {
      checkArrayTypes(msg);
      var h = new Uint8Array(crypto_hash_BYTES);
      crypto_hash(h, msg, msg.length);
      return h;
    };
    nacl2.hash.hashLength = crypto_hash_BYTES;
    nacl2.verify = function(x, y) {
      checkArrayTypes(x, y);
      if (x.length === 0 || y.length === 0) return false;
      if (x.length !== y.length) return false;
      return vn(x, 0, y, 0, x.length) === 0 ? true : false;
    };
    nacl2.setPRNG = function(fn) {
      randombytes = fn;
    };
    (function() {
      var crypto2 = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
      if (crypto2 && crypto2.getRandomValues) {
        var QUOTA = 65536;
        nacl2.setPRNG(function(x, n) {
          var i, v = new Uint8Array(n);
          for (i = 0; i < n; i += QUOTA) {
            crypto2.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
          }
          for (i = 0; i < n; i++) x[i] = v[i];
          cleanup(v);
        });
      } else if (typeof commonjsRequire !== "undefined") {
        crypto2 = requireCryptoBrowserify();
        if (crypto2 && crypto2.randomBytes) {
          nacl2.setPRNG(function(x, n) {
            var i, v = crypto2.randomBytes(n);
            for (i = 0; i < n; i++) x[i] = v[i];
            cleanup(v);
          });
        }
      }
    })();
  })(module.exports ? module.exports : self.nacl = self.nacl || {});
})(naclFast);
var naclFastExports = naclFast.exports;
const nacl = /* @__PURE__ */ getDefaultExportFromCjs$1(naclFastExports);
const icon = "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjMxIiB2aWV3Qm94PSIwIDAgMzEgMzEiIHdpZHRoPSIzMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjIwLjI1IiB4Mj0iMjYuNTcxIiB5MT0iMjcuMTczIiB5Mj0iMTkuODU4Ij48c3RvcCBvZmZzZXQ9Ii4wOCIgc3RvcC1jb2xvcj0iIzk5NDVmZiIvPjxzdG9wIG9mZnNldD0iLjMiIHN0b3AtY29sb3I9IiM4NzUyZjMiLz48c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjNTQ5N2Q1Ii8+PHN0b3Agb2Zmc2V0PSIuNiIgc3RvcC1jb2xvcj0iIzQzYjRjYSIvPjxzdG9wIG9mZnNldD0iLjcyIiBzdG9wLWNvbG9yPSIjMjhlMGI5Ii8+PHN0b3Agb2Zmc2V0PSIuOTciIHN0b3AtY29sb3I9IiMxOWZiOWIiLz48L2xpbmVhckdyYWRpZW50PjxnIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iLjA5NCI+PHBhdGggZD0ibTI2LjEwOSAzLjY0My05LjM2OSA2Ljk1OSAxLjczMy00LjEwNSA3LjYzNy0yLjg1M3oiIGZpbGw9IiNlMjc2MWIiIHN0cm9rZT0iI2UyNzYxYiIvPjxnIGZpbGw9IiNlNDc2MWIiIHN0cm9rZT0iI2U0NzYxYiI+PHBhdGggZD0ibTQuNDgxIDMuNjQzIDkuMjk0IDcuMDI0LTEuNjQ4LTQuMTcxem0xOC4yNTggMTYuMTMtMi40OTUgMy44MjMgNS4zMzkgMS40NjkgMS41MzUtNS4yMDctNC4zNzgtLjA4NXptLTE5LjI0Ny4wODUgMS41MjUgNS4yMDcgNS4zMzktMS40NjktMi40OTUtMy44MjN6Ii8+PHBhdGggZD0ibTEwLjA1NSAxMy4zMTMtMS40ODggMi4yNTEgNS4zMDEuMjM1LS4xODgtNS42OTd6bTEwLjQ4IDAtMy42NzItMy4yNzctLjEyMiA1Ljc2MyA1LjI5Mi0uMjM1LTEuNDk3LTIuMjUxem0tMTAuMTc4IDEwLjI4MyAzLjE4My0xLjU1NC0yLjc0OS0yLjE0Ny0uNDMzIDMuNzAxem02LjY5NS0xLjU1NCAzLjE5MiAxLjU1NC0uNDQzLTMuNzAxeiIvPjwvZz48cGF0aCBkPSJtMjAuMjQ0IDIzLjU5Ni0zLjE5Mi0xLjU1NC4yNTQgMi4wODEtLjAyOC44NzZ6bS05Ljg4NyAwIDIuOTY2IDEuNDAzLS4wMTktLjg3Ni4yMzUtMi4wODEtMy4xODMgMS41NTR6IiBmaWxsPSIjZDdjMWIzIiBzdHJva2U9IiNkN2MxYjMiLz48cGF0aCBkPSJtMTMuMzY5IDE4LjUyMS0yLjY1NS0uNzgxIDEuODc0LS44NTd6bTMuODUxIDAgLjc4MS0xLjYzOCAxLjg4My44NTctMi42NjUuNzgxeiIgZmlsbD0iIzIzMzQ0NyIgc3Ryb2tlPSIjMjMzNDQ3Ii8+PHBhdGggZD0ibTEwLjM1NyAyMy41OTYuNDUyLTMuODIzLTIuOTQ3LjA4NXptOS40MzUtMy44MjMuNDUyIDMuODIzIDIuNDk1LTMuNzM4em0yLjI0MS00LjIwOS01LjI5Mi4yMzUuNDkgMi43MjEuNzgyLTEuNjM4IDEuODgzLjg1N3ptLTExLjMxOCAyLjE3NSAxLjg4My0uODU3Ljc3MiAxLjYzOC40OTktMi43MjEtNS4zMDEtLjIzNXoiIGZpbGw9IiNjZDYxMTYiIHN0cm9rZT0iI2NkNjExNiIvPjxwYXRoIGQ9Im04LjU2NyAxNS41NjQgMi4yMjIgNC4zMzEtLjA3NS0yLjE1NnptMTEuMzI4IDIuMTc1LS4wOTQgMi4xNTYgMi4yMzItNC4zMzEtMi4xMzcgMi4xNzV6bS02LjAyNi0xLjk0LS40OTkgMi43MjEuNjIxIDMuMjExLjE0MS00LjIyOC0uMjY0LTEuNzA0em0yLjg3MiAwLS4yNTQgMS42OTUuMTEzIDQuMjM3LjYzMS0zLjIxMXoiIGZpbGw9IiNlNDc1MWYiIHN0cm9rZT0iI2U0NzUxZiIvPjxwYXRoIGQ9Im0xNy4yMyAxOC41Mi0uNjMxIDMuMjExLjQ1Mi4zMTEgMi43NS0yLjE0Ny4wOTQtMi4xNTZ6bS02LjUxNi0uNzgxLjA3NSAyLjE1NiAyLjc1IDIuMTQ3LjQ1Mi0uMzExLS42MjItMy4yMTF6IiBmaWxsPSIjZjY4NTFiIiBzdHJva2U9IiNmNjg1MWIiLz48cGF0aCBkPSJtMTcuMjc3IDI0Ljk5OS4wMjgtLjg3Ni0uMjM1LS4yMDdoLTMuNTVsLS4yMTcuMjA3LjAxOS44NzYtMi45NjYtMS40MDMgMS4wMzYuODQ4IDIuMSAxLjQ1OWgzLjYwNmwyLjEwOS0xLjQ1OSAxLjAzNi0uODQ4eiIgZmlsbD0iI2MwYWQ5ZSIgc3Ryb2tlPSIjYzBhZDllIi8+PHBhdGggZD0ibTE3LjA1MSAyMi4wNDItLjQ1Mi0uMzExaC0yLjYwOGwtLjQ1Mi4zMTEtLjIzNSAyLjA4MS4yMTctLjIwN2gzLjU1bC4yMzUuMjA3LS4yNTQtMi4wODF6IiBmaWxsPSIjMTYxNjE2IiBzdHJva2U9IiMxNjE2MTYiLz48cGF0aCBkPSJtMjYuNTA1IDExLjA1My44LTMuODQyLTEuMTk2LTMuNTY5LTkuMDU4IDYuNzIzIDMuNDg0IDIuOTQ3IDQuOTI1IDEuNDQxIDEuMDkyLTEuMjcxLS40NzEtLjMzOS43NTMtLjY4Ny0uNTg0LS40NTIuNzUzLS41NzQtLjQ5OS0uMzc3em0tMjMuMjExLTMuODQxLjggMy44NDItLjUwOC4zNzcuNzUzLjU3NC0uNTc0LjQ1Mi43NTMuNjg3LS40NzEuMzM5IDEuMDgzIDEuMjcxIDQuOTI1LTEuNDQxIDMuNDg0LTIuOTQ3LTkuMDU5LTYuNzIzeiIgZmlsbD0iIzc2M2QxNiIgc3Ryb2tlPSIjNzYzZDE2Ii8+PHBhdGggZD0ibTI1LjQ2IDE0Ljc1NC00LjkyNS0xLjQ0MSAxLjQ5NyAyLjI1MS0yLjIzMiA0LjMzMSAyLjkzOC0uMDM4aDQuMzc4bC0xLjY1Ny01LjEwNHptLTE1LjQwNS0xLjQ0MS00LjkyNSAxLjQ0MS0xLjYzOCA1LjEwNGg0LjM2OWwyLjkyOC4wMzgtMi4yMjItNC4zMzEgMS40ODgtMi4yNTF6bTYuNjg1IDIuNDg2LjMxMS01LjQzMyAxLjQzMS0zLjg3aC02LjM1NmwxLjQxMyAzLjg3LjMyOSA1LjQzMy4xMTMgMS43MTQuMDA5IDQuMjE5aDIuNjFsLjAxOS00LjIxOS4xMjItMS43MTR6IiBmaWxsPSIjZjY4NTFiIiBzdHJva2U9IiNmNjg1MWIiLz48L2c+PGNpcmNsZSBjeD0iMjMuNSIgY3k9IjIzLjUiIGZpbGw9IiMwMDAiIHI9IjYuNSIvPjxwYXRoIGQ9Im0yNy40NzMgMjUuNTQ1LTEuMzEgMS4zNjhjLS4wMjkuMDMtLjA2My4wNTMtLjEwMS4wN2EuMzEuMzEgMCAwIDEgLS4xMjEuMDI0aC02LjIwOWMtLjAzIDAtLjA1OS0uMDA4LS4wODMtLjAyNGEuMTUuMTUgMCAwIDEgLS4wNTYtLjA2NWMtLjAxMi0uMDI2LS4wMTUtLjA1Ni0uMDEtLjA4NHMuMDE4LS4wNTUuMDM5LS4wNzZsMS4zMTEtMS4zNjhjLjAyOC0uMDMuMDYzLS4wNTMuMTAxLS4wNjlhLjMxLjMxIDAgMCAxIC4xMjEtLjAyNWg2LjIwOGMuMDMgMCAuMDU5LjAwOC4wODMuMDI0YS4xNS4xNSAwIDAgMSAuMDU2LjA2NWMuMDEyLjAyNi4wMTUuMDU2LjAxLjA4NHMtLjAxOC4wNTUtLjAzOS4wNzZ6bS0xLjMxLTIuNzU2Yy0uMDI5LS4wMy0uMDYzLS4wNTMtLjEwMS0uMDdhLjMxLjMxIDAgMCAwIC0uMTIxLS4wMjRoLTYuMjA5Yy0uMDMgMC0uMDU5LjAwOC0uMDgzLjAyNHMtLjA0NC4wMzgtLjA1Ni4wNjUtLjAxNS4wNTYtLjAxLjA4NC4wMTguMDU1LjAzOS4wNzZsMS4zMTEgMS4zNjhjLjAyOC4wMy4wNjMuMDUzLjEwMS4wNjlhLjMxLjMxIDAgMCAwIC4xMjEuMDI1aDYuMjA4Yy4wMyAwIC4wNTktLjAwOC4wODMtLjAyNGEuMTUuMTUgMCAwIDAgLjA1Ni0uMDY1Yy4wMTItLjAyNi4wMTUtLjA1Ni4wMS0uMDg0cy0uMDE4LS4wNTUtLjAzOS0uMDc2em0tNi40MzEtLjk4M2g2LjIwOWEuMzEuMzEgMCAwIDAgLjEyMS0uMDI0Yy4wMzgtLjAxNi4wNzMtLjA0LjEwMS0uMDdsMS4zMS0xLjM2OGMuMDItLjAyMS4wMzQtLjA0Ny4wMzktLjA3NnMuMDAxLS4wNTgtLjAxLS4wODRhLjE1LjE1IDAgMCAwIC0uMDU2LS4wNjVjLS4wMjUtLjAxNi0uMDU0LS4wMjQtLjA4My0uMDI0aC02LjIwOGEuMzEuMzEgMCAwIDAgLS4xMjEuMDI1Yy0uMDM4LjAxNi0uMDcyLjA0LS4xMDEuMDY5bC0xLjMxIDEuMzY4Yy0uMDIuMDIxLS4wMzQuMDQ3LS4wMzkuMDc2cy0uMDAxLjA1OC4wMS4wODQuMDMxLjA0OS4wNTYuMDY1LjA1NC4wMjQuMDgzLjAyNHoiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=";
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _SolflareMetaMaskWallet_instances, _SolflareMetaMaskWallet_listeners, _SolflareMetaMaskWallet_version, _SolflareMetaMaskWallet_name, _SolflareMetaMaskWallet_icon, _SolflareMetaMaskWallet_solflareMetaMask, _SolflareMetaMaskWallet_on, _SolflareMetaMaskWallet_emit, _SolflareMetaMaskWallet_off, _SolflareMetaMaskWallet_connect, _SolflareMetaMaskWallet_disconnect, _SolflareMetaMaskWallet_signAndSendTransaction, _SolflareMetaMaskWallet_signTransaction, _SolflareMetaMaskWallet_signMessage;
class SolflareMetaMaskWallet {
  constructor() {
    _SolflareMetaMaskWallet_instances.add(this);
    _SolflareMetaMaskWallet_listeners.set(this, {});
    _SolflareMetaMaskWallet_version.set(this, "1.0.0");
    _SolflareMetaMaskWallet_name.set(this, "MetaMask");
    _SolflareMetaMaskWallet_icon.set(this, icon);
    _SolflareMetaMaskWallet_solflareMetaMask.set(this, null);
    _SolflareMetaMaskWallet_on.set(this, (event, listener) => {
      var _a;
      ((_a = __classPrivateFieldGet(this, _SolflareMetaMaskWallet_listeners, "f")[event]) == null ? void 0 : _a.push(listener)) || (__classPrivateFieldGet(this, _SolflareMetaMaskWallet_listeners, "f")[event] = [listener]);
      return () => __classPrivateFieldGet(this, _SolflareMetaMaskWallet_instances, "m", _SolflareMetaMaskWallet_off).call(this, event, listener);
    });
    _SolflareMetaMaskWallet_connect.set(this, async () => {
      if (!__classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f")) {
        let SolflareMetaMaskClass;
        try {
          SolflareMetaMaskClass = (await __vitePreload(async () => {
            const { default: __vite_default__ } = await import("./vendor-libs.js").then((n) => n.Q);
            return { default: __vite_default__ };
          }, true ? __vite__mapDeps([0,1,2]) : void 0)).default;
        } catch (error) {
          throw new Error("Unable to load Solflare MetaMask SDK");
        }
        __classPrivateFieldSet(this, _SolflareMetaMaskWallet_solflareMetaMask, new SolflareMetaMaskClass(), "f");
        __classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f").on("standard_change", (properties) => __classPrivateFieldGet(this, _SolflareMetaMaskWallet_instances, "m", _SolflareMetaMaskWallet_emit).call(this, "change", properties));
      }
      if (!this.accounts.length) {
        await __classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f").connect();
      }
      return { accounts: this.accounts };
    });
    _SolflareMetaMaskWallet_disconnect.set(this, async () => {
      if (!__classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f"))
        return;
      await __classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f").disconnect();
    });
    _SolflareMetaMaskWallet_signAndSendTransaction.set(this, async (...inputs) => {
      if (!__classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f"))
        throw new WalletNotConnectedError();
      return await __classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f").standardSignAndSendTransaction(...inputs);
    });
    _SolflareMetaMaskWallet_signTransaction.set(this, async (...inputs) => {
      if (!__classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f"))
        throw new WalletNotConnectedError();
      return await __classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f").standardSignTransaction(...inputs);
    });
    _SolflareMetaMaskWallet_signMessage.set(this, async (...inputs) => {
      if (!__classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f"))
        throw new WalletNotConnectedError();
      return await __classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f").standardSignMessage(...inputs);
    });
  }
  get version() {
    return __classPrivateFieldGet(this, _SolflareMetaMaskWallet_version, "f");
  }
  get name() {
    return __classPrivateFieldGet(this, _SolflareMetaMaskWallet_name, "f");
  }
  get icon() {
    return __classPrivateFieldGet(this, _SolflareMetaMaskWallet_icon, "f");
  }
  get chains() {
    return [SOLANA_MAINNET_CHAIN, SOLANA_DEVNET_CHAIN, SOLANA_TESTNET_CHAIN];
  }
  get features() {
    return {
      [StandardConnect$1]: {
        version: "1.0.0",
        connect: __classPrivateFieldGet(this, _SolflareMetaMaskWallet_connect, "f")
      },
      [StandardDisconnect$1]: {
        version: "1.0.0",
        disconnect: __classPrivateFieldGet(this, _SolflareMetaMaskWallet_disconnect, "f")
      },
      [StandardEvents$1]: {
        version: "1.0.0",
        on: __classPrivateFieldGet(this, _SolflareMetaMaskWallet_on, "f")
      },
      [SolanaSignAndSendTransaction]: {
        version: "1.0.0",
        supportedTransactionVersions: ["legacy", 0],
        signAndSendTransaction: __classPrivateFieldGet(this, _SolflareMetaMaskWallet_signAndSendTransaction, "f")
      },
      [SolanaSignTransaction]: {
        version: "1.0.0",
        supportedTransactionVersions: ["legacy", 0],
        signTransaction: __classPrivateFieldGet(this, _SolflareMetaMaskWallet_signTransaction, "f")
      },
      [SolanaSignMessage]: {
        version: "1.0.0",
        signMessage: __classPrivateFieldGet(this, _SolflareMetaMaskWallet_signMessage, "f")
      }
    };
  }
  get accounts() {
    return __classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f") ? __classPrivateFieldGet(this, _SolflareMetaMaskWallet_solflareMetaMask, "f").standardAccounts : [];
  }
}
_SolflareMetaMaskWallet_listeners = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_version = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_name = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_icon = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_solflareMetaMask = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_on = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_connect = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_disconnect = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_signAndSendTransaction = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_signTransaction = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_signMessage = /* @__PURE__ */ new WeakMap(), _SolflareMetaMaskWallet_instances = /* @__PURE__ */ new WeakSet(), _SolflareMetaMaskWallet_emit = function _SolflareMetaMaskWallet_emit2(event, ...args) {
  var _a;
  (_a = __classPrivateFieldGet(this, _SolflareMetaMaskWallet_listeners, "f")[event]) == null ? void 0 : _a.forEach((listener) => listener.apply(null, args));
}, _SolflareMetaMaskWallet_off = function _SolflareMetaMaskWallet_off2(event, listener) {
  var _a;
  __classPrivateFieldGet(this, _SolflareMetaMaskWallet_listeners, "f")[event] = (_a = __classPrivateFieldGet(this, _SolflareMetaMaskWallet_listeners, "f")[event]) == null ? void 0 : _a.filter((existingListener) => listener !== existingListener);
};
let registered = false;
function register() {
  if (registered)
    return;
  registerWallet(new SolflareMetaMaskWallet());
  registered = true;
}
async function detectAndRegisterSolflareMetaMaskWallet() {
  const id = "solflare-detect-metamask";
  function postMessage() {
    window.postMessage({
      target: "metamask-contentscript",
      data: {
        name: "metamask-provider",
        data: {
          id,
          jsonrpc: "2.0",
          method: "wallet_getSnaps"
        }
      }
    }, window.location.origin);
  }
  function onMessage(event) {
    var _a, _b;
    const message = event.data;
    if ((message == null ? void 0 : message.target) === "metamask-inpage" && ((_a = message.data) == null ? void 0 : _a.name) === "metamask-provider") {
      if (((_b = message.data.data) == null ? void 0 : _b.id) === id) {
        window.removeEventListener("message", onMessage);
        if (!message.data.data.error) {
          register();
        }
      } else {
        postMessage();
      }
    }
  }
  window.addEventListener("message", onMessage);
  window.setTimeout(() => window.removeEventListener("message", onMessage), 5e3);
  postMessage();
}
const SolflareWalletName = "Solflare";
class SolflareWalletAdapter extends BaseMessageSignerWalletAdapter {
  constructor(config = {}) {
    super();
    this.name = SolflareWalletName;
    this.url = "https://solflare.com";
    this.icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJTIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMwMjA1MGE7c3Ryb2tlOiNmZmVmNDY7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOi41cHg7fS5jbHMtMntmaWxsOiNmZmVmNDY7fTwvc3R5bGU+PC9kZWZzPjxyZWN0IGNsYXNzPSJjbHMtMiIgeD0iMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTIiIHJ5PSIxMiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI0LjIzLDI2LjQybDIuNDYtMi4zOCw0LjU5LDEuNWMzLjAxLDEsNC41MSwyLjg0LDQuNTEsNS40MywwLDEuOTYtLjc1LDMuMjYtMi4yNSw0LjkzbC0uNDYuNS4xNy0xLjE3Yy42Ny00LjI2LS41OC02LjA5LTQuNzItNy40M2wtNC4zLTEuMzhoMFpNMTguMDUsMTEuODVsMTIuNTIsNC4xNy0yLjcxLDIuNTktNi41MS0yLjE3Yy0yLjI1LS43NS0zLjAxLTEuOTYtMy4zLTQuNTF2LS4wOGgwWk0xNy4zLDMzLjA2bDIuODQtMi43MSw1LjM0LDEuNzVjMi44LjkyLDMuNzYsMi4xMywzLjQ2LDUuMThsLTExLjY1LTQuMjJoMFpNMTMuNzEsMjAuOTVjMC0uNzkuNDItMS41NCwxLjEzLTIuMTcuNzUsMS4wOSwyLjA1LDIuMDUsNC4wOSwyLjcxbDQuNDIsMS40Ni0yLjQ2LDIuMzgtNC4zNC0xLjQyYy0yLS42Ny0yLjg0LTEuNjctMi44NC0yLjk2TTI2LjgyLDQyLjg3YzkuMTgtNi4wOSwxNC4xMS0xMC4yMywxNC4xMS0xNS4zMiwwLTMuMzgtMi01LjI2LTYuNDMtNi43MmwtMy4zNC0xLjEzLDkuMTQtOC43Ny0xLjg0LTEuOTYtMi43MSwyLjM4LTEyLjgxLTQuMjJjLTMuOTcsMS4yOS04Ljk3LDUuMDktOC45Nyw4Ljg5LDAsLjQyLjA0LjgzLjE3LDEuMjktMy4zLDEuODgtNC42MywzLjYzLTQuNjMsNS44LDAsMi4wNSwxLjA5LDQuMDksNC41NSw1LjIybDIuNzUuOTItOS41Miw5LjE0LDEuODQsMS45NiwyLjk2LTIuNzEsMTQuNzMsNS4yMmgwWiIvPjwvc3ZnPg==";
    this.supportedTransactionVersions = /* @__PURE__ */ new Set(["legacy", 0]);
    this._readyState = typeof window === "undefined" || typeof document === "undefined" ? WalletReadyState.Unsupported : WalletReadyState.Loadable;
    this._disconnected = () => {
      const wallet = this._wallet;
      if (wallet) {
        wallet.off("disconnect", this._disconnected);
        this._wallet = null;
        this._publicKey = null;
        this.emit("error", new WalletDisconnectedError());
        this.emit("disconnect");
      }
    };
    this._accountChanged = (newPublicKey) => {
      if (!newPublicKey)
        return;
      const publicKey2 = this._publicKey;
      if (!publicKey2)
        return;
      try {
        newPublicKey = new PublicKey(newPublicKey.toBytes());
      } catch (error) {
        this.emit("error", new WalletPublicKeyError(error == null ? void 0 : error.message, error));
        return;
      }
      if (publicKey2.equals(newPublicKey))
        return;
      this._publicKey = newPublicKey;
      this.emit("connect", newPublicKey);
    };
    this._connecting = false;
    this._publicKey = null;
    this._wallet = null;
    this._config = config;
    if (this._readyState !== WalletReadyState.Unsupported) {
      scopePollingDetectionStrategy(() => {
        var _a;
        if (((_a = window.solflare) == null ? void 0 : _a.isSolflare) || window.SolflareApp) {
          this._readyState = WalletReadyState.Installed;
          this.emit("readyStateChange", this._readyState);
          return true;
        }
        return false;
      });
      detectAndRegisterSolflareMetaMaskWallet();
    }
  }
  get publicKey() {
    return this._publicKey;
  }
  get connecting() {
    return this._connecting;
  }
  get connected() {
    var _a;
    return !!((_a = this._wallet) == null ? void 0 : _a.connected);
  }
  get readyState() {
    return this._readyState;
  }
  async autoConnect() {
    if (!(this.readyState === WalletReadyState.Loadable && isIosAndRedirectable())) {
      await this.connect();
    }
  }
  async connect() {
    try {
      if (this.connected || this.connecting)
        return;
      if (this._readyState !== WalletReadyState.Loadable && this._readyState !== WalletReadyState.Installed)
        throw new WalletNotReadyError();
      if (this.readyState === WalletReadyState.Loadable && isIosAndRedirectable()) {
        const url = encodeURIComponent(window.location.href);
        const ref = encodeURIComponent(window.location.origin);
        window.location.href = `https://solflare.com/ul/v1/browse/${url}?ref=${ref}`;
        return;
      }
      let SolflareClass;
      try {
        SolflareClass = (await __vitePreload(async () => {
          const { default: __vite_default__ } = await import("./vendor-libs.js").then((n) => n.T);
          return { default: __vite_default__ };
        }, true ? __vite__mapDeps([0,1,2]) : void 0)).default;
      } catch (error) {
        throw new WalletLoadError(error == null ? void 0 : error.message, error);
      }
      let wallet;
      try {
        wallet = new SolflareClass({ network: this._config.network });
      } catch (error) {
        throw new WalletConfigError(error == null ? void 0 : error.message, error);
      }
      this._connecting = true;
      if (!wallet.connected) {
        try {
          await wallet.connect();
        } catch (error) {
          throw new WalletConnectionError(error == null ? void 0 : error.message, error);
        }
      }
      if (!wallet.publicKey)
        throw new WalletConnectionError();
      let publicKey2;
      try {
        publicKey2 = new PublicKey(wallet.publicKey.toBytes());
      } catch (error) {
        throw new WalletPublicKeyError(error == null ? void 0 : error.message, error);
      }
      wallet.on("disconnect", this._disconnected);
      wallet.on("accountChanged", this._accountChanged);
      this._wallet = wallet;
      this._publicKey = publicKey2;
      this.emit("connect", publicKey2);
    } catch (error) {
      this.emit("error", error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }
  async disconnect() {
    const wallet = this._wallet;
    if (wallet) {
      wallet.off("disconnect", this._disconnected);
      wallet.off("accountChanged", this._accountChanged);
      this._wallet = null;
      this._publicKey = null;
      try {
        await wallet.disconnect();
      } catch (error) {
        this.emit("error", new WalletDisconnectionError(error == null ? void 0 : error.message, error));
      }
    }
    this.emit("disconnect");
  }
  async sendTransaction(transaction, connection, options = {}) {
    try {
      const wallet = this._wallet;
      if (!wallet)
        throw new WalletNotConnectedError();
      try {
        const { signers, ...sendOptions } = options;
        if (isVersionedTransaction$1(transaction)) {
          (signers == null ? void 0 : signers.length) && transaction.sign(signers);
        } else {
          transaction = await this.prepareTransaction(transaction, connection, sendOptions);
          (signers == null ? void 0 : signers.length) && transaction.partialSign(...signers);
        }
        sendOptions.preflightCommitment = sendOptions.preflightCommitment || connection.commitment;
        return await wallet.signAndSendTransaction(transaction, sendOptions);
      } catch (error) {
        if (error instanceof WalletError)
          throw error;
        throw new WalletSendTransactionError(error == null ? void 0 : error.message, error);
      }
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }
  async signTransaction(transaction) {
    try {
      const wallet = this._wallet;
      if (!wallet)
        throw new WalletNotConnectedError();
      try {
        return await wallet.signTransaction(transaction) || transaction;
      } catch (error) {
        throw new WalletSignTransactionError(error == null ? void 0 : error.message, error);
      }
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }
  async signAllTransactions(transactions) {
    try {
      const wallet = this._wallet;
      if (!wallet)
        throw new WalletNotConnectedError();
      try {
        return await wallet.signAllTransactions(transactions) || transactions;
      } catch (error) {
        throw new WalletSignTransactionError(error == null ? void 0 : error.message, error);
      }
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }
  async signMessage(message) {
    try {
      const wallet = this._wallet;
      if (!wallet)
        throw new WalletNotConnectedError();
      try {
        return await wallet.signMessage(message, "utf8");
      } catch (error) {
        throw new WalletSignMessageError(error == null ? void 0 : error.message, error);
      }
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }
}
const basex$1 = src$3;
const ALPHABET$1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bs58$2 = basex$1(ALPHABET$1);
const bs58$3 = /* @__PURE__ */ getDefaultExportFromCjs$1(bs58$2);
const basex = src$4;
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bs58 = basex(ALPHABET);
const bs58$1 = /* @__PURE__ */ getDefaultExportFromCjs$1(bs58);
export {
  bs58$6 as A,
  BaseWalletAdapter as B,
  Connection as C,
  bs58$3 as D,
  bs58$1 as E,
  nacl as F,
  SystemProgram as G,
  WalletAdapterNetwork as H,
  SolflareWalletAdapter as I,
  PublicKey as P,
  SolanaSignAndSendTransaction as S,
  Transaction as T,
  VersionedTransaction as V,
  WalletError as W,
  WalletReadyState as a,
  WalletDisconnectedError as b,
  WalletDisconnectionError as c,
  WalletNotConnectedError as d,
  SolanaSignTransaction as e,
  WalletAccountError as f,
  WalletConfigError as g,
  getChainForEndpoint as h,
  WalletSendTransactionError as i,
  isVersionedTransaction$1 as j,
  getCommitment as k,
  bs58$4 as l,
  WalletNotReadyError as m,
  WalletConnectionError as n,
  WalletPublicKeyError as o,
  SolanaSignMessage as p,
  SolanaSignIn as q,
  WalletSignTransactionError as r,
  WalletSignMessageError as s,
  WalletSignInError as t,
  isWalletAdapterCompatibleStandardWallet as u,
  SolanaMobileWalletAdapterWalletName as v,
  SolanaMobileWalletAdapter as w,
  createDefaultWalletNotFoundHandler as x,
  createDefaultAuthorizationResultCache as y,
  createDefaultAddressSelector as z
};
