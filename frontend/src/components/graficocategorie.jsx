import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


async function getDati() {
    if (window.location.pathname === "/categorie") {
        const response = await fetch("/api/partita/visualizza", {
            credentials: "include"
        });
        return await response.json();
    }
}

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
    scales: {
        x: {
            ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
            }
        },
        y: {
            beginAtZero: true
        }
    }
};



export default function GraficoCategorie() {
    const [rows, setRows] = useState([]);

    React.useEffect(() => {
        getDati().then((data) => {
            const filteredData = data.filter((row) => row.categoria.nome !== null);
            setRows(filteredData);
            let occorrenze = [];
            for (let i = 1; i < filteredData.length; i++) {
                occorrenze.push(filteredData[i].categoria.nome);
            }

            occorrenze = occorrenze.reduce((acc, curr) => {
                if (acc[curr]) {
                    acc[curr]++;
                } else {
                    acc[curr] = 1;
                }
                return acc;
            }, {});
            const sortedEntries = Object.entries(occorrenze).sort((a, b) => a[1] - b[1]);
            const sortedObject = Object.fromEntries(sortedEntries);
            occorrenze = sortedObject;
            setRows(occorrenze)
        });
    }, []);



    const data = {
        datasets: [
            {
                label: '# NUMERO DI PARTITE PER CATEGORIA',
                data: rows,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return <Bar options={options} data={data} />;
}
