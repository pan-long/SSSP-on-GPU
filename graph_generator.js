"use strict";

let graph = {};

const generateGraph = function (vertexNum) {
    let edges = [];
    for (let u = 0; u < vertexNum; u++) {
        for (let v = u + 1; v < vertexNum; v++) {
            if (Math.random() < 0.5) {
                edges.push([u, v, Math.floor((Math.random() * 100) + 1)]);
            }
        }
    }

    graph[vertexNum] = edges;
};

const getGraph = function (vertexNum) {
    if (graph[vertexNum] === undefined) {
        generateGraph(vertexNum);
    }

    return graph[vertexNum];
};
