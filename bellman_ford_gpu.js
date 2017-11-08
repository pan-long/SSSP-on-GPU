"use strict";

const mode = "gpu"; // "gpu" or "cpu"
const gpu = new GPU({mode: mode});
const bellmanFordGpu = function (vertexNum) {
    let dist = new Array(vertexNum).fill(1e9);

    // Set the initial source distance to 0.
    dist[0] = 0;

    // Parse the edges to adj matrix.
    let adjMatrix = gpu.createKernel(function () {
        if (this.thread.y === this.thread.x) {
            return 0;
        } else {
            return 1e9;
        }
    }).setOutput([vertexNum, vertexNum])();

    let edges = getGraph(vertexNum);
    edges.forEach(function (edge) {
        adjMatrix[edge[0]][edge[1]] = edge[2];
        adjMatrix[edge[1]][edge[0]] = edge[2];
    });

    const toTextureKernel = gpu.createKernel(function (mat) {
        return mat[this.thread.y][this.thread.x];
    }, {
        output: [vertexNum, vertexNum],
        outputToTexture: mode === "gpu",
    });
    adjMatrix = toTextureKernel(adjMatrix);

    const bellmanFordKernel = gpu.createKernel(function (dist, mat) {
        let minDist = dist[this.thread.x];
        for (let i = 0; i < this.constants.size; i++) {
            minDist = Math.min(minDist, dist[i] + mat[i][this.thread.x]);
        }

        return minDist;
    }, {
        constants: {
            size: vertexNum
        },
        output: [vertexNum],
        outputToTexture: mode === "gpu",
    });

    let t0 = performance.now();
    for (let i = 0; i < vertexNum; i++) {
        dist = bellmanFordKernel(dist, adjMatrix);
    }
    let t1 = performance.now();

    console.log("Execution time: " + (t1 - t0) + "milliseconds");

    if (mode === "gpu") {
        console.log(dist.toArray(gpu));
    } else {
        console.log(dist);
    }
};
