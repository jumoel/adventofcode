"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var test_1 = require("../util/test");
var int_1 = require("../util/int");
var array_1 = require("../util/array");
var POSITION_MODE = 0;
var IMMEDIATE_MODE = 1;
function get(mem, mode, value) {
    return Number(mode === IMMEDIATE_MODE ? value : mem[value]);
}
exports.get = get;
function set(mem, position, value) {
    mem[position] = Number(value);
}
exports.set = set;
function getOpcode(value) {
    var parts = int_1.intSplit(value);
    // [ opcode, rawmodes ]
    return [int_1.intCombine(parts.slice(-2)), parts.slice(0, -2).reverse()];
}
function getInstruction(mem, pc, ops) {
    var _a = getOpcode(mem[pc]), opcode = _a[0], rawModes = _a[1];
    test_1.ASSERT(ops.has(opcode), "FATAL: Invalid opcode found at " + pc + ": '" + opcode + "'");
    var op = ops.get(opcode);
    var _b = mem.slice(pc, pc + op.len), params = _b.slice(1);
    var modes = array_1.arrayPad(rawModes, op.numargs, 0);
    return { opcode: opcode, modes: modes, params: params };
}
exports.getInstruction = getInstruction;
function OPMAP(oplist) {
    return oplist.reduce(function (acc, op) {
        acc.set(op.opcode, __assign(__assign({}, op), { len: op.numargs + op.numouts + 1 }));
        return acc;
    }, new Map());
}
exports.OPMAP = OPMAP;
function runProgram(mem, ops, inputs) {
    if (inputs === void 0) { inputs = []; }
    var vmState = {
        inputs: inputs,
        shouldExit: false
    };
    var pc = 0;
    while (!vmState.shouldExit) {
        var _a = getInstruction(mem, pc, ops), opcode = _a.opcode, modes = _a.modes, params = _a.params;
        test_1.DEBUG("OP[" + pc + "]: " + opcode + " " + modes + " " + params + " ");
        test_1.ASSERT(ops.has(opcode), "Invalid opcode found: '" + opcode + " at pc:" + pc + "'");
        var jump = ops.get(opcode).fn(modes, params, mem, vmState);
        if (Number.isInteger(jump)) {
            pc = jump;
        }
        else {
            pc += ops.get(opcode).len;
        }
    }
    return mem;
}
exports.runProgram = runProgram;
