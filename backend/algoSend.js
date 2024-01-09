import { promisify } from "util";
import { exec } from "child_process";
import { DataOrderingOptions } from './utils/constants.js'
const execPromisfy = promisify(exec);

export const FailType = {
    stderr: 0,
    exec: 1
}

const algoSend = async (input, successFunc, failFunc) => {

    // Command string to use for C++ parser executable
    let cmd = ``;

    // Goes through each input user submitted and builds the command string
    input.forEach((element) => {
        console.log(element);
        cmd += `-a ${element.name} 
      -l ${element.inputSize} 
      -${DataOrderingOptions.get(element.dataOrdering)} `;
    });

    // json option
    cmd += ` -j`;

    // get rid of newlines, carriage returns, and tabs
    cmd = cmd.replace(/\n|\r|\t/g, "");

    // Code responsible for handling different environments
    try {
        if (process.env.REACT_APP_DEPLOYMENT_ENV === "production") {
            // production environment
            cmd += ' -p';
            const { stdout, stderr } = await execPromisfy(`sudo AlgoGauge ${cmd}`, {
                timeout: 30000,
            });
            handleResponse(stdout, stderr, successFunc, failFunc);
        } else if (process.env.REACT_APP_DEPLOYMENT_ENV === "unixdev") {
            // development environment for unix based systems
            cmd += ' -p';
            const { stdout, stderr } = await execPromisfy(`./programs/AlgoGauge/cmake-build-debug/AlgoGauge ${cmd}`, {
                timeout: 30000,
            });
            handleResponse(stdout, stderr, successFunc, failFunc);
        } else {
            // development environment
            cmd += ' --perf=sample';
            const { stdout, stderr } = await execPromisfy(`AlgoGauge.exe ${cmd}`, {
                cwd: "./programs/AlgoGauge/cmake-build-debug/Debug",
                timeout: 30000,
            });
            handleResponse(stdout, stderr, successFunc, failFunc);
        }

    }
    // Execute fail function with the executable fail type error
    catch (error) {
        console.log(error);
        failFunc(FailType.exec, error);
    }
}

// If any errors, execute fail function passed in with stderr. Otherwise, pass the results to the successful function
const handleResponse = (stdout, stderr, successFunc, failFunc) => {
    console.log(stderr);
    console.log(stdout);

    if (stderr) {
        console.log(stderr);
        failFunc(FailType.stderr, stderr);
    } else {
        successFunc(stdout);
    }
}

export default algoSend;
