'use strict';

const fileName = 'http://localhost:63342/cs5234-miniproject/data/netscience.out';
const parseGraph = function () {
    let edges = [];
    return fetch(fileName).then(response => response.text()).then(text => {
        let lines = text.split('\n');
        lines.forEach(line => {
            let data = line.split(' ');
            let u = parseInt(data[0]);
            let v = parseInt(data[1]);
            let weight = parseFloat(data[2]);

            if (u < 4000 && v < 4000) {
                edges.push([u, v, weight]);
            }
        });

        console.log(edges.length);
        return edges;
    });
};
