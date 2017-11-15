"use strict";

const dijkstra = function (vertexNum) {
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

    let t0 = performance.now();
    const shortestPaths = shortestPath(adjMatrix, vertexNum, 0);
    let t1 = performance.now();

    console.log("Execution time: " + (t1 - t0) + "milliseconds");
    console.log(shortestPaths);
};

/*
 * dijkstra.js
 *
 * Dijkstra's single source shortest path algorithm in JavaScript.
 *
 * Cameron McCormack <cam (at) mcc.id.au>
 *
 * Permission is hereby granted to use, copy, modify and distribute this
 * code for any purpose, without fee.
 *
 * Initial version: October 21, 2004
 */

function shortestPath(edges, numVertices, startVertex) {
    var done = new Array(numVertices);
    done[startVertex] = true;
    var pathLengths = new Array(numVertices);
    var predecessors = new Array(numVertices);
    for (var i = 0; i < numVertices; i++) {
        pathLengths[i] = edges[startVertex][i];
        if (edges[startVertex][i] != Infinity) {
            predecessors[i] = startVertex;
        }
    }
    pathLengths[startVertex] = 0;
    for (var i = 0; i < numVertices - 1; i++) {
        var closest = -1;
        var closestDistance = Infinity;
        for (var j = 0; j < numVertices; j++) {
            if (!done[j] && pathLengths[j] < closestDistance) {
                closestDistance = pathLengths[j];
                closest = j;
            }
        }
        done[closest] = true;
        for (var j = 0; j < numVertices; j++) {
            if (!done[j]) {
                var possiblyCloserDistance = pathLengths[closest] + edges[closest][j];
                if (possiblyCloserDistance < pathLengths[j]) {
                    pathLengths[j] = possiblyCloserDistance;
                    predecessors[j] = closest;
                }
            }
        }
    }
    return {
        "startVertex": startVertex,
        "pathLengths": pathLengths,
        "predecessors": predecessors
    };
}

function constructPath(shortestPathInfo, endVertex) {
    var path = [];
    while (endVertex != shortestPathInfo.startVertex) {
        path.unshift(endVertex);
        endVertex = shortestPathInfo.predecessors[endVertex];
    }
    return path;
}

// Example //////////////////////////////////////////////////////////////////

// The adjacency matrix defining the graph.
var _ = Infinity;
var e = [
    [_, _, _, _, _, _, _, _, 4, 2, 3],
    [_, _, 5, 2, 2, _, _, _, _, _, _],
    [_, 5, _, _, _, 1, 4, _, _, _, _],
    [_, 2, _, _, 3, 6, _, 3, _, _, _],
    [_, 2, _, 3, _, _, _, 4, 3, _, _],
    [_, _, 1, 6, _, _, 2, 5, _, _, _],
    [_, _, 4, _, _, 2, _, 5, _, _, 3],
    [_, _, _, 3, 4, 5, 5, _, 3, 2, 4],
    [4, _, _, _, 3, _, _, 3, _, 3, _],
    [2, _, _, _, _, _, _, 2, 3, _, 3],
    [3, _, _, _, _, _, 3, 4, _, 3, _]
];

// Compute the shortest paths from vertex number 1 to each other vertex
// in the graph.
var shortestPathInfo = shortestPath(e, 11, 1);

// Get the shortest path from vertex 1 to vertex 6.
var path1to6 = constructPath(shortestPathInfo, 6);
