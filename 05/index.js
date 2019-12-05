"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var test_1 = require("../util/test");
var vm_1 = require("./vm");
var ops = vm_1.OPMAP([
    {
        name: "ADD",
        opcode: 1,
        numargs: 2,
        numouts: 1,
        fn: function (modes, params, mem) {
            var in1 = vm_1.get(mem, modes[0], params[0]);
            var in2 = vm_1.get(mem, modes[1], params[1]);
            test_1.DEBUG("ADD: " + in1 + " " + in2 + " " + params[2]);
            vm_1.set(mem, params[2], in1 + in2);
        }
    },
    {
        name: "MULT",
        opcode: 2,
        numargs: 2,
        numouts: 1,
        fn: function (modes, params, mem) {
            var in1 = vm_1.get(mem, modes[0], params[0]);
            var in2 = vm_1.get(mem, modes[1], params[1]);
            test_1.DEBUG("MULT: " + in1 + " " + in2 + " " + params[2]);
            vm_1.set(mem, params[2], in1 * in2);
        }
    },
    {
        name: "INPUT",
        opcode: 3,
        numargs: 0,
        numouts: 1,
        fn: function (modes, params, mem, vmState) {
            var input = vmState.inputs.shift();
            test_1.DEBUG("INPUT: " + input + " " + params[0]);
            vm_1.set(mem, params[0], input);
        }
    },
    {
        name: "OUTPUT",
        opcode: 4,
        numargs: 1,
        numouts: 0,
        fn: function (modes, params, mem) {
            console.log("OUTPUT:", vm_1.get(mem, modes[0], params[0]));
        }
    },
    {
        name: "JNZ",
        opcode: 5,
        numargs: 2,
        numouts: 0,
        fn: function (modes, params, mem) {
            var in1 = vm_1.get(mem, modes[0], params[0]);
            var in2 = vm_1.get(mem, modes[1], params[1]);
            test_1.DEBUG("JNZ: " + in1 + " " + in2);
            if (in1 !== 0) {
                test_1.DEBUG("JUMPING TO " + in2);
                return in2;
            }
        }
    },
    {
        name: "JZ",
        opcode: 6,
        numargs: 2,
        numouts: 0,
        fn: function (modes, params, mem) {
            var in1 = vm_1.get(mem, modes[0], params[0]);
            var in2 = vm_1.get(mem, modes[1], params[1]);
            test_1.DEBUG("JZ: " + in1 + " " + in2);
            if (in1 === 0) {
                test_1.DEBUG("JUMPING TO " + in2);
                return in2;
            }
        }
    },
    {
        name: "LT",
        opcode: 7,
        numargs: 2,
        numouts: 1,
        fn: function (modes, params, mem) {
            var in1 = vm_1.get(mem, modes[0], params[0]);
            var in2 = vm_1.get(mem, modes[1], params[1]);
            var value = in1 < in2 ? 1 : 0;
            test_1.DEBUG("LT: " + in1 + " " + in2 + " " + value + " " + params[2]);
            vm_1.set(mem, params[2], value);
        }
    },
    {
        name: "EQ",
        opcode: 8,
        numargs: 2,
        numouts: 1,
        fn: function (modes, params, mem) {
            var in1 = vm_1.get(mem, modes[0], params[0]);
            var in2 = vm_1.get(mem, modes[1], params[1]);
            var value = in1 === in2 ? 1 : 0;
            test_1.DEBUG("EQ: " + in1 + " " + in2 + " " + value);
            vm_1.set(mem, params[2], value);
        }
    },
    {
        name: "EXIT",
        opcode: 99,
        numargs: 0,
        numouts: 0,
        fn: function (modes, params, mem, vmState) {
            console.log("HALT");
            vmState.shouldExit = true;
        }
    },
]);
function runProgramWithArgs(program, noun, verb) {
    program[1] = noun;
    program[2] = verb;
    return vm_1.runProgram(program, ops)[0];
}
if (require.main === module) {
    var readInput = require("../util/readInput").readInput;
    var program = readInput(__dirname)
        .trim()
        .split(",")
        .map(Number);
    console.log("PART 1:");
    vm_1.runProgram(__spreadArrays(program), ops, [1]);
    console.log();
    console.log("PART 2:");
    vm_1.runProgram(__spreadArrays(program), ops, [5]);
}
