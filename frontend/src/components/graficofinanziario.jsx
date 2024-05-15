import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

async function getDati() {
    const response = await fetch("/api/partita/visualizza", {
        credentials: "include"
    });
    return await response.json();
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
            beginAtZero: false
        }
    }
};

export default function GraficoFinanziario() {
    const [rows, setRows] = useState([]);
    const [totale, setTotale] = useState([]);
    const [incassato, setIncassato] = useState(0);

    React.useEffect(() => {
        getDati().then((data) => {
            const filteredData = data.filter((row) => row.rimborso !== null);
            setRows(filteredData);
            let totaleCalcolato = 0;
            let totaleArray = []; // Create an array to store the totals
            for (let i = 0; i < filteredData.length; i++) {
                filteredData[i].incasso == true ? totaleCalcolato += filteredData[i].rimborso : null;
                setIncassato(totaleCalcolato);
                // Calculate total up to i and push to totaleArray
                let totaleParziale = 0;
                for (let j = 0; j <= i; j++) {
                    totaleParziale += filteredData[j].rimborso;
                }
                totaleArray.push(totaleParziale);
            }
            // After calculating all totals, update totale state once
            setTotale(totaleArray);
        });
    }, []);



    const data = {
        labels: rows.map((row) => row.gara),
        datasets: [
            {
                label: '# RIMBORSI',
                data: rows.map((row) => row.rimborso),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: '# TOTALE',
                data: totale,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: '# TOTALE INCASSATO',
                data: Array(Object.keys(rows).length).fill(incassato),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
        ],
    };

    return <Line options={options} data={data} />;
}
